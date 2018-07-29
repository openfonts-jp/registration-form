import dot from 'dot-object';
import formStructure from './form.yml';

interface SubmitEvent {
  authMode: GoogleAppsScript.Script.AuthMode;
  response: GoogleAppsScript.Forms.FormResponse;
  source: GoogleAppsScript.Forms.Form;
  triggerUid: string;
}

const GITHUB_URL_REGEXP = /^https:\/\/github\.com\/([0-9a-zA-Z_-]+)$/;

function onFormSubmit(ev: SubmitEvent) {
  const responseList = ev.response.getItemResponses();
  const structure = formStructure as FormStructure;

  const props = PropertiesService.getScriptProperties();
  const GITHUB_TOKEN = props.getProperty('GITHUB_TOKEN');
  const jsonPathToItemId: Array<{ jsonPath: string; itemId: number }> = JSON.parse(
    props.getProperty('JSON_PATH_TO_ITEM_ID'),
  );
  const raw: any = {};

  for (const { jsonPath, itemId } of jsonPathToItemId) {
    const propName = jsonPath.replace(/^\$\./, '');
    const item = responseList.find(r => r.getItem().getId() === itemId);
    if (!item) {
      continue;
    }

    let response = item.getResponse();

    if (item.getItem().getType() === FormApp.ItemType.LIST) {
      const choices = (() => {
        for (const page of structure) {
          if (!page.items) {
            continue;
          }
          const item = page.items.find(item => item.json_path === jsonPath);
          if (item && 'choices' in item) {
            return item.choices;
          }
        }
        return undefined;
      })();

      if (choices) {
        const selected = choices.find(c => c.text === response.toString());
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

  let githubId = misc.contact;

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

\`\`\`json
${JSON.stringify(info, null, 2)}
\`\`\`
  `;

  UrlFetchApp.fetch(`https://api.github.com/repos/Japont/openfonts-registry/issues?access_token=${GITHUB_TOKEN}`, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      title: `Add ${info.name}`,
      body: markdown,
    }),
  });
}

export default onFormSubmit;
