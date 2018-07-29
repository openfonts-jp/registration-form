declare namespace GoogleAppsScript {
  export namespace Forms {
    export type AnyItem =
      | GoogleAppsScript.Forms.TextItem
      | GoogleAppsScript.Forms.ParagraphTextItem
      | GoogleAppsScript.Forms.ListItem
      | GoogleAppsScript.Forms.SectionHeaderItem;
    export type ValidationBuilder =
      | GoogleAppsScript.Forms.TextValidationBuilder
      | GoogleAppsScript.Forms.ParagraphTextValidationBuilder;

    export interface TextValidationBuilder {
      setHelpText(help: string): TextValidationBuilder;
      build(): TextValidation;
    }
    export interface ParagraphTextValidationBuilder {
      setHelpText(help: string): ParagraphTextValidationBuilder;
      build(): ParagraphTextValidation;
    }
  }
}
