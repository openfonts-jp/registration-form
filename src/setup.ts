import Form from './form';
import properties from './properties';
import formStructure from './form.yml';

function setup() {
  const form = new Form(FormApp.getActiveForm());
  form.reset();
  const results = form.create(formStructure as FormStructure);
  form.setSubmitTrigger('onFormSubmit');

  properties.formItemList = results
    .map(({ items }) => items)
    .reduce((all, items) => all.concat(items), [])
    .filter(({ item }) => 'json_path' in item)
    .map(({ info, item }) => ({
      jsonPath: info.json_path!,
      itemId: item.getId(),
    }));
}

export default setup;
