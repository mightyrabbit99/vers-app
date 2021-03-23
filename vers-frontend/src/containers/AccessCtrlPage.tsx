import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import UserAccessCtrlWidget from "src/components/UserAccessControlWidget";
import { getData, getSession } from "src/selectors";
import { logout } from "src/slices/session";
import { User } from "src/kernel";
import { saveData, selPlant } from "src/slices/data";
import SchneiderLogo from "src/components/commons/SchneiderLogo";

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
    width: 150,
    height: 50,
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  settings: {
    marginLeft: "auto",
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  addCircleIcon: {
    width: "40%",
    height: "40%",
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

interface IBasePageProps {}

const BasePage: React.FunctionComponent<IBasePageProps> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { users } = useSelector(getData);
  const { user } = useSelector(getSession);
  const history = useHistory();

  const handleSubmit = (data: User) => {
    dispatch(saveData(data));
  };

  const toPlant = () => {
    dispatch(selPlant());
  };

  const [mainAnchorEl, setMainAnchorEl] = React.useState<null | HTMLElement>(
    null
  );

  const handlePageSelClose = () => {
    setMainAnchorEl(null);
  };

  const [
    settingsAnchorEl,
    setSettingsAnchorEl,
  ] = React.useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchorEl(null);
  };
  const handleLogout = () => {
    dispatch(logout());
  };

  const handleViewProfile = () => {
    history.push("/user");
  };

  const handleViewAccessCtrl = () => {
    history.push("/access_ctrl");
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <svg className={classes.icon}>{SchneiderLogo}</svg>
          <Typography variant="h6" color="inherit" noWrap>
            Access Controls
          </Typography>
          <div className={classes.settings}>
            <Typography variant="caption">
              {user ? user.username : "Guest"}
            </Typography>
            <IconButton color="inherit" onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <main>
        <UserAccessCtrlWidget
          lst={users}
          onSubmit={handleSubmit}
          editSuper={user?.is_superuser}
        />
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          Schneider Electric
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          component="p"
        >
          Life is On!
        </Typography>
      </footer>
      {/* End footer */}
      <Menu
        id="simple-menu"
        anchorEl={settingsAnchorEl}
        keepMounted
        open={Boolean(settingsAnchorEl)}
        onClose={handleSettingsClose}
      >
        <MenuItem onClick={handleViewProfile}>Profile</MenuItem>
        {user?.is_superuser ? (
          <MenuItem onClick={handleViewAccessCtrl}>Access Control</MenuItem>
        ) : null}
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
      <Menu
        id="simple-menu"
        anchorEl={mainAnchorEl}
        keepMounted
        open={Boolean(mainAnchorEl)}
        onClose={handlePageSelClose}
      >
        <MenuItem onClick={handlePageSelClose}>Access Control</MenuItem>
        <MenuItem onClick={toPlant}>Plants</MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default BasePage;
