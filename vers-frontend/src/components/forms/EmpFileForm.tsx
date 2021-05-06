import * as React from "react";

import { Grid, Button } from "@material-ui/core";
import { EmpFile, ItemType } from "src/kernel";

interface IPlantFormProps {
  data?: EmpFile;
  feedback?: any;
  key?: React.Key;
  onSubmit?: (p: EmpFile) => void;
  onCancel?: () => void;
}

const PlantForm: React.FC<IPlantFormProps> = (props) => {
  const { data: d, feedback, onSubmit, onCancel, key } = props;

  const [data, setData] = React.useState<EmpFile>(
    d ?? { _type: ItemType.EmpFile, id: -1, name: "", file: "", emp: -1 }
  );
  const handleFileUpload = (e: React.ChangeEvent<any>) => {
    let { files } = e.target;
    setData({ ...data, file: files[0] });
  };

  const handleSubmit = () => {
    onSubmit && onSubmit(data);
  };

  return (
    <Grid container spacing={1} key={key}>
      <Grid item xs={12}>
        <form noValidate autoComplete="off">
          <input type="file" name="file" onChange={handleFileUpload} />
        </form>
      </Grid>
      <Grid item xs={12}>
        {onCancel ? <Button onClick={onCancel}>Cancel</Button> : null}
        {onSubmit ? <Button onClick={handleSubmit}>Submit</Button> : null}
      </Grid>
    </Grid>
  );
};

export default PlantForm;
