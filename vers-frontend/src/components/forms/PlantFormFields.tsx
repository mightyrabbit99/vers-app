import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

import { Plant, Feedback } from "src/kernel";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

interface IPlantFFProps {
  data: Plant;
  feedback?: Feedback<Plant>;
  onChange?: (data: Plant) => void;
}

const PlantFF: React.FC<IPlantFFProps> = (props) => {
  const classes = useStyles();
  const { data, feedback: fb, onChange } = props;
  const [state, setState] = React.useState(data);
  const [feedback, setFeedback] = React.useState<Feedback<Plant>>();
  React.useEffect(() => {
    setFeedback(fb);
  }, [fb]);
  React.useEffect(() => {
    setState(data);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    data[name as keyof Plant] = value as never;
    setFeedback(feedback ? {...feedback, [name]: undefined} : undefined);
    onChange ? onChange(data) : setState({...state, [name]: value});
  };

  const getFeedback = (name: keyof Plant) => {
    return (feedback && name in feedback) ? feedback[name] : "";
  };

  const genActiveProps = (name: keyof Plant) => ({
    name,
    value: state[name],
    onChange: handleChange,
    error: getFeedback(name) !== "",
    helperText: getFeedback(name),
  });

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <TextField label="Name" variant="outlined" {...genActiveProps("name")} />
    </form>
  );
};

export default PlantFF;
