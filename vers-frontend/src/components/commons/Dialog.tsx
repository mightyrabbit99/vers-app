import * as React from "react";
import clsx from "clsx";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";
import { TransitionProps } from "@material-ui/core/transitions";


const useStyles = makeStyles({
  content: {
    margin: "auto",
    height: "100%",
    overflowY: "hidden",
  },
});

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface AlertDialogSlideProps {
  open: boolean;
  className?: any;
  onClose: () => void;
  children: React.ReactNode;
}

const AlertDialogSlide: React.FC<AlertDialogSlideProps> = (props) => {
  const classes = useStyles();
  const { className, children, open, onClose } = props;

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
      <DialogContent className={clsx(className, classes.content)}>{children}</DialogContent>
    </Dialog>
  );
};

export default AlertDialogSlide;
