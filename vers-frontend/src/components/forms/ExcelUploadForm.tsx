import * as React from "react";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

interface IExcelUploadFormProps {
  feedback?: any;
  onSubmit: (p: File) => void;
  onCancel?: () => void;
}

const ExcelUploadForm: React.FunctionComponent<IExcelUploadFormProps> = (
  props
) => {
  const { feedback, onSubmit, onCancel } = props;
  const [f, setF] = React.useState<File>();
  const handleFileUpload = (e: React.ChangeEvent<any>) => {
    const { files } = e.target;
    setF(files[0]);
  };
  const handleSubmit = () => {
    f && onSubmit(f);
  };
  return (
    <Grid container spacing={1}>
      {feedback ? (
        <Grid item xs={12}>
          {feedback["non-field-errors"]?.map((x: any) => (
            <p>{x}</p>
          ))}
        </Grid>
      ) : null}
      <Grid item xs={12}>
        <input
          id="fileSelect"
          type="file"
          onChange={handleFileUpload}
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        />
      </Grid>
      <Grid item xs={12}>
        <div>
          {onCancel ? <Button onClick={onCancel}>Cancel</Button> : null}
          <Button onClick={handleSubmit} disabled={!f}>
            Submit
          </Button>
        </div>
      </Grid>
    </Grid>
  );
};

export default ExcelUploadForm;
