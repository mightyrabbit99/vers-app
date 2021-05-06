import * as React from "react";

import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import { EmpFile, ItemType, Feedback } from "src/kernel";

interface IEmpFileFormProps {
  data?: EmpFile;
  feedback?: Feedback<EmpFile>;
  key?: React.Key;
  onSubmit?: (p: EmpFile) => void;
  onCancel?: () => void;
}

const EmpFileForm: React.FC<IEmpFileFormProps> = (props) => {
  const { data, feedback: fb, onSubmit, onCancel, key } = props;

  const [state, setState] = React.useState<EmpFile>(
    data ?? { _type: ItemType.EmpFile, id: -1, name: "", file: "", emp: -1 }
  );
  const [feedback, setFeedback] = React.useState<Feedback<EmpFile>>();
  React.useEffect(() => {
    setFeedback(fb);
  }, [fb]);

  const handleFileUpload = (e: React.ChangeEvent<any>) => {
    let { files } = e.target;
    setState({ ...state, file: files[0] });
  };

  const handleSubmit = () => {
    onSubmit && onSubmit(state);
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    state[name as keyof EmpFile] = value as never;
    setFeedback(feedback ? {...feedback, [name]: undefined} : undefined);
    setState({...state, [name]: value});
  };

  const getFeedback = (name: keyof EmpFile) => {
    return (feedback && name in feedback) ? feedback[name] : "";
  };

  const genActiveProps = (name: keyof EmpFile) => ({
    name,
    value: state[name],
    onChange: handleChange,
    error: getFeedback(name) !== "",
    helperText: getFeedback(name),
  });

  return (
    <Grid container spacing={1} key={key}>
      <Grid item xs={12}>
        <form noValidate autoComplete="off">
          <input type="file" name="file" onChange={handleFileUpload} />
        </form>
        <TextField label="Name" variant="outlined" {...genActiveProps("name")} />
      </Grid>
      <Grid item xs={12}>
        {onCancel ? <Button onClick={onCancel}>Cancel</Button> : null}
        {onSubmit ? <Button onClick={handleSubmit}>Submit</Button> : null}
      </Grid>
    </Grid>
  );
};

export default EmpFileForm;
