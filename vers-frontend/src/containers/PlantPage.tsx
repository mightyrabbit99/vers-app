import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import CameraIcon from "@material-ui/icons/PhotoCamera";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { getData, getSession } from "src/selectors";
import { Plant } from "src/kernel";
import PlantCard from "src/components/cards/PlantCard";
import { selPlant, saveData, delData } from "src/slices/data";
import MyDialog from "src/components/commons/Dialog";
import PlantForm from "src/components/forms/PlantForm";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  title: {
    height: "15%",
  },
  form: {},
  formTitle: {
    height: "15%",
  },
  formContent: {
    height: "85%",
  },
}));

interface IPlantPageProps {}

const PlantPage: React.FunctionComponent<IPlantPageProps> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { plants: lst, newPlant } = useSelector(getData);
  const { feedback } = useSelector(getSession);
  
  const handlePlantSelect = (id: number) => {
    dispatch(selPlant(id));
    history.push("/dashboard");
  };

  const handleDeleteOnClick = (id: number) => {
    dispatch(delData(lst[id]));
  };

  const [formOpen, setFormOpen] = React.useState(false);
  const [formData, setFormData] = React.useState(newPlant);
  React.useEffect(() => {
    setFormData(newPlant);
  }, [newPlant]);
  React.useEffect(() => {
    setFormOpen(!!feedback);
  }, [feedback]);

  const handleSubmit = (data: Plant) => {
    dispatch(saveData(data));
    setFormOpen(false);
  };
  const handleEditOnClick = (id: number) => {
    setFormData(lst[id]);
    setFormOpen(true);
  };
  const handleFormClose = () => {
    setFormOpen(false);
    //onReset();
  };

  const handleCreateOnClick = () => {
    setFormData(newPlant);
    setFormOpen(true);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <CameraIcon className={classes.icon} />
          <Typography variant="h6" color="inherit" noWrap>
            Plants
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {Object.values(lst).map((p: Plant, idx: number) => (
              <Grid item key={idx} xs={12} sm={6} md={4}>
                <PlantCard
                  p={p}
                  onClick={() => handlePlantSelect(p.id)}
                  onDelete={() => handleDeleteOnClick(p.id)}
                  onEditClick={() => handleEditOnClick(p.id)}
                />
              </Grid>
            ))}
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <Button onClick={handleCreateOnClick}>Add</Button>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography>
      </footer>
      {/* End footer */}
      <MyDialog open={formOpen} onClose={handleFormClose}>
        <div className={classes.form}>
          <div className={classes.formTitle}>
            <Typography
              className={classes.title}
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              {formData && formData.id === -1
                ? "Create New Plant"
                : "Edit Plant"}
            </Typography>
          </div>
          <div className={classes.formContent}>
            {formData ? (
              <PlantForm
                data={formData}
                feedback={feedback}
                onSubmit={handleSubmit}
                onCancel={handleFormClose}
              />
            ) : null}
          </div>
        </div>
      </MyDialog>
    </React.Fragment>
  );
};

export default PlantPage;
