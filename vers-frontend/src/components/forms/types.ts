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

export const commonFormFieldStyles = (theme: any) => ({
  root: {
    width: "inherit",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  form: {
    width: "inherit",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
});
