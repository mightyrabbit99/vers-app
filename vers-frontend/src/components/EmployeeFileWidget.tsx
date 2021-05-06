import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { Employee, EmpFile, Feedback, ItemType } from "src/kernel";
import EmployeeSimpleList from "./lists/EmployeeSimpleList";
import MyDialog from "src/components/commons/Dialog";
import EmpFileList from "./lists/EmpFileList";
import EmpFileForm from "./forms/EmpFileForm";

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
  fileLst: {
    height: "85%",
  },
  form: {},
  formTitle: {
    height: "15%",
  },
  formContent: {
    height: "85%",
  },
}));

interface IEmpFileWidgetProps {
  lst: { [id: number]: Employee };
  feedback?: Feedback<EmpFile>;
  onSubmit?: (p: EmpFile) => void;
  onDelete?: (...p: EmpFile[]) => void;
}

const EmpFileWidget: React.FC<IEmpFileWidgetProps> = (props) => {
  const classes = useStyles();
  const { lst, feedback, onSubmit, onDelete } = props;

  const [sel, setSel] = React.useState<Employee>();
  const [selectedLst, setSelectedLst] = React.useState<number[]>([]);
  React.useEffect(() => {
    setSel((sel) => (sel && sel.id in lst ? lst[sel.id] : undefined));
  }, [lst]);
  const handleListItemClick = (i: number) => {
    setSel(lst[i]);
    setSelectedLst([]);
  };

  const handleDeleteOnClick = () => {
    onDelete &&
      onDelete(
        ...selectedLst.map((x) => {
          let e: EmpFile = {
            id: x,
            emp: sel?.id ?? -1,
            _type: ItemType.EmpFile,
            name: "",
            file: "",
          };
          return e;
        })
      );
    setSelectedLst([]);
  };

  const [addLstOpen, setAddLstOpen] = React.useState(false);
  React.useEffect(() => {
    setAddLstOpen(!!feedback && feedback._type === ItemType.EmpFile);
  }, [feedback]);

  const uploadFileOnClose = () => {
    setAddLstOpen(false);
  };

  const handleFileSubmit = (p: EmpFile) => {
    p.emp = sel?.id ?? -1;
    onSubmit && onSubmit(p);
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
              onClick={() => setAddLstOpen(true)}
            >
              Add
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!sel || selectedLst.length === 0 || !onSubmit}
              onClick={handleDeleteOnClick}
            >
              Delete
            </Button>
          </div>
          <div className={classes.fileLst}>
            {sel ? (
              <EmpFileList
                item={sel}
                selected={selectedLst}
                selectedOnChange={setSelectedLst}
              />
            ) : null}
          </div>
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
            <EmpFileForm onSubmit={handleFileSubmit} feedback={feedback} />
          </div>
        </div>
      </MyDialog>
    </React.Fragment>
  );
};

export default EmpFileWidget;
