import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import CloudUpload from "@material-ui/icons/CloudUpload";
import CloudDownload from "@material-ui/icons/CloudDownload";

import MyDialog from "./commons/Dialog";
import ExcelUploadForm from "./forms/ExcelUploadForm";

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    flexDirection: "row",
    height: "15%",
    maxHeight: 55,
  },
  searchBar: {
    maxWidth: 250,
    minWidth: 200,
    marginLeft: "auto",
  },
  ctrlButtons: {
    display: "flex",
    flexDirection: "row",
    marginLeft: "auto",
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
    minHeight: 150,
    width: "100%",
    overflowX: "hidden",
  },
  form: {
    maxWidth: "60vw",
    width: 500,
    minWidth: 300,
  },
  formTitle: {
    height: "15%",
  },
  formContent: {
    height: "85%",
  },
}));

interface IListWidgetProps {
  title?: string;
  disableCreate?: boolean;
  disableDelete?: boolean;
  createOnClick: () => void;
  deleteOnClick?: () => void;
  downloadExcel?: () => void;
  uploadExcel?: (file: File) => void;
  searchOnChange?: (term: string) => void;
  excelFeedback?: any;
  excelTemplateUrl?: string;
  children: React.ReactNode;
}

const ListWidget: React.FC<IListWidgetProps> = (props) => {
  const classes = useStyles();
  const {
    title = "",
    disableCreate = false,
    disableDelete = false,
    deleteOnClick,
    createOnClick,
    downloadExcel,
    uploadExcel,
    searchOnChange,
    excelFeedback,
    excelTemplateUrl,
    children,
  } = props;

  const handleSearchBarChange = (e: React.ChangeEvent<any>) => {
    let { value } = e.target;
    searchOnChange!(value);
  };

  const [excelFormOpen, setExcelFormOpen] = React.useState(false);
  const uploadOnClick = () => {
    setExcelFormOpen(true);
  };

  const handleExcelFormClose = () => {
    setExcelFormOpen(false);
  };

  const handleExcelFileUpload = (file: File) => {
    uploadExcel && uploadExcel(file);
    handleExcelFormClose();
  };

  return (
    <React.Fragment>
      <div className={classes.header}>
        <Typography
          className={classes.title}
          component="h2"
          variant="h6"
          color="primary"
          gutterBottom
        >
          {title}
        </Typography>
        {searchOnChange ? (
          <TextField
            className={classes.searchBar}
            label="Search"
            type="search"
            fullWidth
            onChange={handleSearchBarChange}
          />
        ) : null}
        <div className={classes.ctrlButtons}>
          {downloadExcel ? (
            <IconButton onClick={downloadExcel}>
              <CloudDownload className={classes.buttonIcon} />
            </IconButton>
          ) : null}
          {uploadExcel ? (
            <IconButton onClick={uploadOnClick}>
              <CloudUpload className={classes.buttonIcon} />
            </IconButton>
          ) : null}
          <Button
            disabled={disableCreate}
            variant="contained"
            color="primary"
            onClick={createOnClick}
          >
            Create
          </Button>
          {deleteOnClick ? (
            <Button
              variant="contained"
              color="primary"
              disabled={disableDelete}
              onClick={deleteOnClick}
            >
              Delete
            </Button>
          ) : null}
        </div>
      </div>
      <div className={classes.content}>{children}</div>
      {uploadExcel ? (
        <MyDialog open={excelFormOpen} onClose={handleExcelFormClose}>
          <div className={classes.form}>
            <div className={classes.formTitle}>
              <Typography
                className={classes.title}
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
              >
                Upload Excel Data
              </Typography>
            </div>
            <div className={classes.formContent}>
              <ExcelUploadForm
                feedback={excelFeedback}
                onSubmit={handleExcelFileUpload}
                onCancel={handleExcelFormClose}
                templateUrl={excelTemplateUrl}
              />
            </div>
          </div>
        </MyDialog>
      ) : null}
    </React.Fragment>
  );
};

export default ListWidget;
