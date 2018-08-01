import dot from 'dot-object';
import formStructure from './form.yml';

import { GITHUB_TOKEN, GITHUB_REPO_OWNER, GITHUB_REPO_NAME, JSON_PATH_TO_ITEM_ID } from './const';
import GitHub from './github';

interface SubmitEvent {
  authMode: GoogleAppsScript.Script.AuthMode;
  response: GoogleAppsScript.Forms.FormResponse;
  source: GoogleAppsScript.Forms.Form;
  triggerUid: string;
}

const GITHUB_URL_REGEXP = /^https:\/\/github\.com\/([0-9a-zA-Z_-]+)$/;

function onFormSubmit(ev: SubmitEvent) {
  const responseList = ev.response.getItemResponses();
  const {
    info,
    misc: { contact: githubId },
  } = parseResponse(responseList);

  const markdown = `
|フォント名|${info.name}|
|:--:|:--|
|フォントID|${info.id}|
|バージョン|${info.version}|
|カテゴリ|${info.categories.join('<br/>')}|
|製作者|${info.owners.join('<br/>')}|
|Webサイト|${info.website}|
|フォントファイル URL|${info.files.map(({ from }) => from).join('<br/>')}|
|ライセンス|${info.license.id}|
|コピーライト|${info.copyrights.join('<br/>')}|
|登録状況の通知|${githubId}|

**CHECK LICENSE AND ADD FONT FILE'S NAME TO YAML BEFORE MERGE**
  `;

  createPullRequest(info, markdown);
  return;
}

function parseResponse(responseList: GoogleAppsScript.Forms.ItemResponse[]) {
  const structure = formStructure as FormStructure;
  const raw: any = {};

  for (const { jsonPath, itemId } of JSON_PATH_TO_ITEM_ID) {
    const propName = jsonPath.replace(/^\$\./, '');
    const item = responseList.find(r => r.getItem().getId() === itemId);
    if (!item) {
      continue;
    }

    let response = item.getResponse();

    if (item.getItem().getType() === FormApp.ItemType.LIST) {
      const items = structure.pages.map(page => page.items || []).reduce((all, items) => all.concat(items), []);
      const found = items.find(item => item.json_path === jsonPath);
      if (found && 'choices' in found) {
        const selected = found.choices.find(c => c.text === response.toString());
        response = selected ? selected.value : response;
      }
    }
    if (jsonPath === '$.copyrights') {
      response = response.toString().split('\n');
    }
    if (jsonPath === '$._.contact') {
      const contact = response.toString();
      if (GITHUB_URL_REGEXP.test(contact)) {
        response = `@${contact.match(GITHUB_URL_REGEXP)![1]}`;
      } else {
        response = '**MASKED**';
      }
    }

    raw[propName] = response;
  }

  dot.object(raw); // Breaking
  const info: PackageInfo = raw as PackageInfo;
  const misc: any = raw._ || {};
  delete raw._;

  return { info, misc };
}

function createPullRequest(info: PackageInfo, markdown: string) {
  const packageId = info.id;
  const github = new GitHub(GITHUB_TOKEN, {
    owner: GITHUB_REPO_OWNER,
    name: GITHUB_REPO_NAME,
  });
  const commitSha = github.getCommitSha('master');
  github.createBranch(commitSha, packageId);
  github.uploadFile(
    packageId,
    `files/${packageId}.json`,
    `[skip ci] Add ${packageId}`,
    Utilities.base64Encode(`${JSON.stringify(info, null, 2)}\n`, Utilities.Charset.UTF_8),
  );
  github.createPullRequest(packageId, 'master', {
    title: `Add ${packageId}`,
    body: markdown,
  });
}

export default onFormSubmit;
