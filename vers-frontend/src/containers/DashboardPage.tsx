import React from "react";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import NotificationsIcon from "@material-ui/icons/Notifications";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import PeopleIcon from "@material-ui/icons/People";
import BarChartIcon from "@material-ui/icons/BarChart";
import LayersIcon from "@material-ui/icons/Layers";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { green, purple } from "@material-ui/core/colors";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import PlantView from "./PlantView";
import SectorView from "./SectorView";
import SubsectorView from "./SubsectorView";
import DepartmentView from "./DepartmentView";
import SkillView from "./SkillView";
import EmployeeView from "./EmployeeView";
import JobView from "./JobView";

import { fetchData, clearFeedback } from "src/slices/sync";
import { logout } from "src/slices/session";
import { getSession } from "src/selectors";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Schneider Electric
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  fixedHeight: {
    height: 240,
  },
}));

const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: purple,
  },
});

enum DashboardView {
  Plant,
  Sector,
  Subsector,
  Skill,
  Department,
  Employee,
  Job,
}

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { authenticated: auth, user } = useSelector(getSession);

  React.useEffect(() => {
    dispatch(fetchData());
  }, []);

  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  let lastI = localStorage.getItem("lastDashboardView");
  const [currView, setCurrView] = React.useState(lastI ? parseInt(lastI) : 0);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleListClick = (i: number) => () => {
    localStorage.setItem("lastDashboardView", `${i}`);
    setCurrView(i);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(clearFeedback());
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleViewProfile = () => {
    history.push("/user");
  };

  const cannotView = (i: number) => {
    if (user?.is_superuser) return false;
    switch (i) {
      case DashboardView.Plant:
        return user?.vers_user.plant_group === 3;
      case DashboardView.Sector:
        return user?.vers_user.sector_group === 3;
      case DashboardView.Subsector:
        return user?.vers_user.subsector_group === 3;
      case DashboardView.Skill:
        return user?.vers_user.skill_group === 3;
      case DashboardView.Department:
        return user?.vers_user.department_group === 3;
      case DashboardView.Employee:
        return user?.vers_user.employee_group === 3;
      case DashboardView.Job:
        return user?.vers_user.job_group === 3;
      default:
        return false;
    }
  };

  const mainListItems = (
    <div>
      <ListItem
        button
        disabled={cannotView(DashboardView.Plant)}
        selected={currView === DashboardView.Plant}
        onClick={handleListClick(DashboardView.Plant)}
      >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Plants" />
      </ListItem>
      <ListItem
        button
        disabled={cannotView(DashboardView.Sector)}
        selected={currView === DashboardView.Sector}
        onClick={handleListClick(DashboardView.Sector)}
      >
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Sectors" />
      </ListItem>
      <ListItem
        button
        disabled={cannotView(DashboardView.Subsector)}
        selected={currView === DashboardView.Subsector}
        onClick={handleListClick(DashboardView.Subsector)}
      >
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Subsectors" />
      </ListItem>
      <ListItem
        button
        disabled={cannotView(DashboardView.Skill)}
        selected={currView === DashboardView.Skill}
        onClick={handleListClick(DashboardView.Skill)}
      >
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Skills" />
      </ListItem>
      <ListItem
        button
        disabled={cannotView(DashboardView.Department)}
        selected={currView === DashboardView.Department}
        onClick={handleListClick(DashboardView.Department)}
      >
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Departments" />
      </ListItem>
      <ListItem
        button
        disabled={cannotView(DashboardView.Employee)}
        selected={currView === DashboardView.Employee}
        onClick={handleListClick(DashboardView.Employee)}
      >
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Employees" />
      </ListItem>
      <ListItem
        button
        disabled={cannotView(DashboardView.Job)}
        selected={currView === DashboardView.Job}
        onClick={handleListClick(DashboardView.Job)}
      >
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Jobs" />
      </ListItem>
    </div>
  );

  const secondaryListItems = (
    <div>
      <ListSubheader inset>Saved reports</ListSubheader>
      <ListItem button>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Current month" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Last quarter" />
      </ListItem>
    </div>
  );

  const genView = () => {
    switch (currView) {
      case DashboardView.Plant:
        return <PlantView />;
      case DashboardView.Sector:
        return <SectorView />;
      case DashboardView.Subsector:
        return <SubsectorView />;
      case DashboardView.Skill:
        return <SkillView />;
      case DashboardView.Department:
        return <DepartmentView />;
      case DashboardView.Employee:
        return <EmployeeView />;
      case DashboardView.Job:
        return <JobView />;
      default:
        return <PlantView />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="absolute"
          className={clsx(classes.appBar, open && classes.appBarShift)}
        >
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={clsx(
                classes.menuButton,
                open && classes.menuButtonHidden
              )}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              Dashboard
            </Typography>
            <div>
              <Typography variant="caption">
                {user ? user.username : "Guest"}
              </Typography>
              <IconButton color="inherit" onClick={handleMenuClick}>
                <Badge badgeContent={4} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>{mainListItems}</List>
          <Divider />
          <List>{secondaryListItems}</List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <div>{genView()}</div>
            <Box pt={4}>
              <Copyright />
            </Box>
          </Container>
        </main>
      </div>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleViewProfile}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </ThemeProvider>
  );
};

export default Dashboard;
