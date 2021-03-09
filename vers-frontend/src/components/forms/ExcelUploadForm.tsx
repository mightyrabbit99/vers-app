import * as React from "react";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

interface IExcelUploadFormProps {
  feedback?: any;
  onSubmit: (p: File) => void;
  onCancel?: () => void;
  templateUrl?: string;
}

const ExcelUploadForm: React.FunctionComponent<IExcelUploadFormProps> = (
  props
) => {
  const { feedback, onSubmit, onCancel, templateUrl } = props;
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
      {templateUrl ? (
        <Typography variant="body2" color="textSecondary" align="center">
          {"Click "}
          <Link color="inherit" href={templateUrl}>
            here
          </Link>
          {" for template"}
        </Typography>
      ) : null}
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
