const props = PropertiesService.getScriptProperties();
const GITHUB_TOKEN = props.getProperty('GITHUB_TOKEN');
const GITHUB_REPO_OWNER = props.getProperty('GITHUB_REPO_OWNER');
const GITHUB_REPO_NAME = props.getProperty('GITHUB_REPO_NAME');
const JSON_PATH_TO_ITEM_ID: Array<{ jsonPath: string; itemId: number }> = JSON.parse(
  props.getProperty('JSON_PATH_TO_ITEM_ID') || '{}',
);

export { GITHUB_TOKEN, GITHUB_REPO_OWNER, GITHUB_REPO_NAME, JSON_PATH_TO_ITEM_ID };
