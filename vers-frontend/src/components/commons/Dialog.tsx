import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";
import { TransitionProps } from "@material-ui/core/transitions";
import React from "react";


const useStyles = makeStyles({
  root: {
    width: "fit-content",
    margin: "auto"
  },
  content: {
    width: "fit-content"
  }
});

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface AlertDialogSlideProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const AlertDialogSlide: React.FC<AlertDialogSlideProps> = (props) => {
  const classes = useStyles();
  const { children, open, onClose } = props;

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      maxWidth="xl"
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogContent className={classes.content}>{children}</DialogContent>
    </Dialog>
  );
};

export default AlertDialogSlide;
