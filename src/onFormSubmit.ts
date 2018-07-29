interface SubmitEvent {
  authMode: GoogleAppsScript.Script.AuthMode;
  response: GoogleAppsScript.Forms.FormResponse;
  source: GoogleAppsScript.Forms.Form;
  triggerUid: string;
}

function onFormSubmit(_ev: SubmitEvent) {}

export default onFormSubmit;
