import formStructure from './form.yml';

function setup() {
  const form = new Form(FormApp.getActiveForm());
  form.reset();
  const results = form.create(formStructure as FormStructure);

  const FORM_ITEM_LIST = results
    .map(({ items }) =>
      items.map(({ info, item }) => ({
        jsonPath: info.json_path,
        itemId: item.getId(),
      })),
    )
    .reduce((all, items) => all.concat(items), [])
    .filter(({ jsonPath }) => !!jsonPath);
  const props = PropertiesService.getScriptProperties();
  props.setProperty('FORM_ITEM_LIST', JSON.stringify(FORM_ITEM_LIST));

  form.setSubmitTrigger('onFormSubmit');
}

export default setup;
