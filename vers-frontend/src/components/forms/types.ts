export interface FormChoice {
  name: string;
  value: any;
}

export interface FormChoiceField {
  choices: FormChoice[];
  init?: number;
}

export interface FormChoices {
  [field: string]: FormChoiceField;
}

export interface FormData {
  [field: string]: any;
}

export interface FormFeedback {
  [field: string]: any;
}
