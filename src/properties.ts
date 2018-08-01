class Properties {
  props = PropertiesService.getScriptProperties();

  get githubToken() {
    return this.props.getProperty('GITHUB_TOKEN');
  }

  get githubRepo() {
    return {
      owner: this.props.getProperty('GITHUB_REPO_OWNER'),
      name: this.props.getProperty('GITHUB_REPO_NAME'),
    };
  }

  get formItemList(): Array<{ jsonPath: string; itemId: number }> {
    return JSON.parse(this.props.getProperty('FORM_ITEM_LIST') || '{}');
  }

  set formItemList(list: Array<{ jsonPath: string; itemId: number }>) {
    this.props.setProperty('FORM_ITEM_LIST', JSON.stringify(list));
  }
}

const properties = new Properties();

export default properties;
