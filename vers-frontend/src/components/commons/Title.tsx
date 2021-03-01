import * as React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";

interface ITitleProps {
  children: React.ReactNode;
}

const Title: React.FC<ITitleProps> = (props) => {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {props.children}
    </Typography>
  );
};

Title.propTypes = {
  children: PropTypes.node,
};

export default Title;
