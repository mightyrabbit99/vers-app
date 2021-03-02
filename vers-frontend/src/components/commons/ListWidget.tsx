import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloudUpload from "@material-ui/icons/CloudUpload";
import CloudDownload from "@material-ui/icons/CloudDownload";

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    flexDirection: "row",
  },
  ctrlButtons: {
    display: "flex",
    flexDirection: "row",
    marginLeft: "auto",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  title: {
    height: "15%",
  },
  content: {
    height: "85%",
  },
}));

interface IListWidgetProps {
  title: string;
  disableCreate: boolean;
  disableDelete: boolean;
  createOnClick: () => void;
  deleteOnClick: () => void;
  downloadOnClick: () => void;
  uploadOnClick: () => void;
  children: React.ReactNode;
}

const ListWidget: React.FunctionComponent<IListWidgetProps> = (
  props
) => {
  const classes = useStyles();
  const {
    title,
    disableCreate,
    disableDelete,
    deleteOnClick,
    createOnClick,
    downloadOnClick,
    uploadOnClick,
    children,
  } = props;

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
        <div className={classes.ctrlButtons}>
          <IconButton onClick={downloadOnClick}>
            <CloudDownload />
          </IconButton>
          <IconButton onClick={uploadOnClick}>
            <CloudUpload />
          </IconButton>
          <Button
            disabled={disableCreate}
            variant="contained"
            color="primary"
            onClick={createOnClick}
          >
            Create
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={disableDelete}
            onClick={deleteOnClick}
          >
            Delete
          </Button>
        </div>
      </div>
      <div className={classes.content}>
        {children}
      </div>
    </React.Fragment>
  );
};

export default ListWidget;
