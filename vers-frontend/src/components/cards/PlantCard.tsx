import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import CardActionArea from "@material-ui/core/CardActionArea";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Plant } from "src/kernel";
import SchneiderLogo from "../commons/SchneiderLogo";

const useStyles = makeStyles((theme) => ({
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "20%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
}));

interface IPlantCardProps {
  p: Plant;
  onClick: () => void;
  onDelete?: () => void;
  onEditClick?: () => void;
}

const PlantCard: React.FC<IPlantCardProps> = (props) => {
  const { p, onClick, onDelete, onEditClick } = props;
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CardActionArea onClick={onClick}>
        {/*<CardMedia
          className={classes.cardMedia}
          image="https://source.unsplash.com/random"
          title="Image title"
        />*/}
        <svg
          className={classes.cardMedia}
        >
          {SchneiderLogo}
        </svg>
        <CardContent className={classes.cardContent}>
          <Typography gutterBottom variant="h5" component="h2">
            {p.name}
          </Typography>
          <Typography>Hello!</Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        {onEditClick ? (
          <Button size="small" color="primary" onClick={onEditClick}>
            Edit
          </Button>
        ) : null}
        {onDelete ? (
          <Button size="small" color="primary" onClick={onDelete}>
            Delete
          </Button>
        ) : null}
      </CardActions>
    </Card>
  );
};

export default PlantCard;
