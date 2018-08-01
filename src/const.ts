const props = PropertiesService.getScriptProperties();
const GITHUB_TOKEN = props.getProperty('GITHUB_TOKEN');
const GITHUB_REPO_OWNER = props.getProperty('GITHUB_REPO_OWNER');
const GITHUB_REPO_NAME = props.getProperty('GITHUB_REPO_NAME');
const FORM_ITEM_LIST: Array<{ jsonPath: string; itemId: number }> = JSON.parse(
  props.getProperty('FORM_ITEM_LIST') || '{}',
);

export { GITHUB_TOKEN, GITHUB_REPO_OWNER, GITHUB_REPO_NAME, FORM_ITEM_LIST };
