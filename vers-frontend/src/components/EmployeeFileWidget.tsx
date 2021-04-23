import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { Employee } from "src/kernel";
import EmployeeSimpleList from "./lists/EmployeeSimpleList";
import MyDialog from "src/components/commons/Dialog";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  item: {
    height: "100%",
  },
  ctrlButtons: {
    display: "flex",
    flexDirection: "row-reverse",
    marginLeft: "auto",
    height: "15%",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  buttonIcon: {
    width: 23,
    heiht: 23,
  },
  title: {},
  content: {
    height: "85%",
  },
  list: {
    height: "100%",
    overflowY: "scroll",
  },
  skillLst: {
    height: "85%",
  },
  form: {
    height: "65vh",
    minHeight: 500,
  },
  formTitle: {
    height: "15%",
  },
  formContent: {
    height: "85%",
  },
}));

interface IEmpFileWidgetProps {
  lst: { [id: number]: Employee };
}

const EmpFileWidget: React.FunctionComponent<IEmpFileWidgetProps> = (props) => {
  const classes = useStyles();
  const { lst } = props;

  const [sel, setSel] = React.useState<Employee>();
  const [selectedLst, setSelectedLst] = React.useState<number[]>([]);
  React.useEffect(() => {
    setSel((sel) => (sel && sel.id in lst ? lst[sel.id] : undefined));
  }, [lst]);
  const handleListItemClick = (i: number) => {
    setSel(lst[i]);
    setSelectedLst([]);
  };

  const handleDeleteOnClick = () => {};

  const [addLstOpen, setAddLstOpen] = React.useState(false);
  const uploadFileOnClick = (e: React.ChangeEvent<any>) => {
    setAddLstOpen(true);
  };

  const uploadFileOnClose = () => {
    setAddLstOpen(false);
  };

  const handleFileUpload = () => {};

  const handleFileSubmit = () => {
    uploadFileOnClose();
  };

  return (
    <React.Fragment>
      <Grid container spacing={1} className={classes.root}>
        <Grid item xs={4} className={classes.item}>
          <EmployeeSimpleList
            height={380}
            width={300}
            itemSize={46}
            lst={lst}
            sel={sel}
            handleListItemClick={handleListItemClick}
          />
        </Grid>
        <Grid item xs={8} className={classes.item}>
          <div className={classes.ctrlButtons}>
            <Button
              variant="contained"
              color="primary"
              disabled={!sel}
              onClick={uploadFileOnClick}
            >
              Add
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!sel}
              onClick={handleDeleteOnClick}
            >
              Delete
            </Button>
          </div>
          <div className={classes.skillLst}></div>
        </Grid>
      </Grid>
      <MyDialog open={addLstOpen} onClose={uploadFileOnClose}>
        <div className={classes.form}>
          <div className={classes.formTitle}>
            <Typography
              className={classes.title}
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              Upload Files
            </Typography>
          </div>
          <div className={classes.formContent}>
            {sel?.files?.map((x) => (
              <p>{x.file}</p>
            ))}
            "
            <form noValidate autoComplete="off">
              <input
                type="file"
                name="file"
                onChange={handleFileUpload}
                hidden
              />
            </form>
            <div className={classes.ctrlButtons}>
              <Button onClick={handleFileSubmit}>Submit</Button>
              <Button onClick={uploadFileOnClose}>Cancel</Button>
            </div>
          </div>
        </div>
      </MyDialog>
    </React.Fragment>
  );
};

export default EmpFileWidget;
