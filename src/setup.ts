import formStructure from './form.yml';

function initialize(form: GoogleAppsScript.Forms.Form) {
  const items = form.getItems();
  for (const item of items) {
    form.deleteItem(item);
  }
  form.deleteAllResponses();
}

function createPage(form: GoogleAppsScript.Forms.Form, pageInfo: FormPage, isFirst: boolean = false) {
  let page: GoogleAppsScript.Forms.PageBreakItem | null = null;
  if (isFirst) {
    form.setTitle(pageInfo.title);
    form.setDescription(pageInfo.description || '');
  } else {
    page = form.addPageBreakItem();
    page.setTitle(pageInfo.title);
    page.setHelpText(pageInfo.description || '');
  }

  return {
    page,
    info: pageInfo,
    items: (pageInfo.items || []).map(info => createItem(form, info)),
  };
}

function createItem(form: GoogleAppsScript.Forms.Form, itemInfo: FormItem) {
  let item: GoogleAppsScript.Forms.AnyItem = null!;
  switch (itemInfo.type) {
    case 'text': {
      item = form.addTextItem();
      break;
    }
    case 'paragraph': {
      item = form.addParagraphTextItem();
      break;
    }
    case 'list': {
      item = form.addListItem();
      break;
    }
    case 'header': {
      item = form.addSectionHeaderItem();
      break;
    }
    default: {
      throw new Error(`${(itemInfo as any).type} is invalid type.`);
    }
  }

  item.setTitle(itemInfo.title);
  item.setHelpText(itemInfo.description || '');
  if ('setRequired' in item) {
    item.setRequired(itemInfo.required || false);
  }
  if ('validation' in itemInfo && itemInfo.validation) {
    const { type, pattern, help } = itemInfo.validation;
    let validation: GoogleAppsScript.Forms.ValidationBuilder = null!;

    if (itemInfo.type === 'paragraph') {
      validation = FormApp.createParagraphTextValidation();
    } else {
      validation = FormApp.createTextValidation();
    }

    validation.setHelpText(help || '');
    if ('requireTextIsUrl' in validation && type === 'url') {
      validation.requireTextIsUrl();
    } else if (type === 'regexp') {
      validation.requireTextContainsPattern(pattern!.slice(1, -1));
    }

    if ('setValidation' in item) {
      item.setValidation(validation.build());
    }
  }

  return { item, info: itemInfo };
}

function setup() {
  const form = FormApp.getActiveForm();
  const structure = formStructure as FormStructure;

  initialize(form);

  const pageRecord: Record<string, GoogleAppsScript.Forms.PageBreakItem> = {};
  const pageWithGoToStore: Array<[string, GoogleAppsScript.Forms.PageBreakItem]> = [];
  const listStore: Array<[Array<FormListChoise>, GoogleAppsScript.Forms.ListItem]> = [];

  for (let idx = 0; idx < structure.length; idx++) {
    const pageInfo = structure[idx];
    const prevPageInfo = structure[idx - 1];
    const { page, items } = createPage(form, pageInfo, idx === 0);

    if (page) {
      if (pageInfo.id) {
        pageRecord[pageInfo.id] = page;
      }
      if (prevPageInfo && prevPageInfo.goto) {
        pageWithGoToStore.push([prevPageInfo.goto, page]);
      }
    }

    for (const { item, info } of items) {
      if (info.type === 'list' && item.getType() === FormApp.ItemType.LIST) {
        listStore.push([info.choices, item as any]);
      }
    }
  }

  for (const [goto, page] of pageWithGoToStore) {
    page.setGoToPage(pageRecord[goto]);
  }

  for (const [choices, listItem] of listStore) {
    const choiceList = choices.map(({ text, goto }) => {
      const choice = goto ? listItem.createChoice(text, pageRecord[goto]) : listItem.createChoice(text);
      return choice;
    });
    listItem.setChoices(choiceList);
  }

  ScriptApp.getUserTriggers(form).forEach(trigger => ScriptApp.deleteTrigger(trigger));
  ScriptApp.newTrigger('onFormSubmit')
    .forForm(form)
    .onFormSubmit()
    .create();
}

export default setup;
