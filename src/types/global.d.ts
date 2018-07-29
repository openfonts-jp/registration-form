declare module '*.yml' {
  var _: any;
  export default _;
}

declare var global: any;

type FormStructure = Array<FormPage>;

interface FormPage {
  id?: string;
  goto?: string;
  title: string;
  description?: string;
  items?: Array<FormItem>;
}

type FormItem = FormTextItem | FormParagraphItem | FormListItem | FormHeaderItem;

interface FormItemBase {
  type: string;
  title: string;
  description?: string;
  required?: boolean;
  json_path?: string;
}

interface FormHeaderItem extends FormItemBase {
  type: 'header';
}

interface FormTextItem extends FormItemBase {
  type: 'text';
  validation?: FormValidation;
}

interface FormParagraphItem extends FormItemBase {
  type: 'paragraph';
  validation?: FormValidation;
}

interface FormListItem extends FormItemBase {
  type: 'list';
  choices: Array<FormListChoise>;
}

interface FormListChoise {
  text: string;
  value: string;
  goto?: string;
}

interface FormValidation {
  type: 'regexp' | 'url';
  pattern?: string;
  help?: string;
}
