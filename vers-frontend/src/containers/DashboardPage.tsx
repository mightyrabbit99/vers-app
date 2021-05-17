import * as React from "react";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ButtonBase from "@material-ui/core/ButtonBase";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

import DashboardIcon from "@material-ui/icons/Dashboard";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import PeopleIcon from "@material-ui/icons/People";
import BarChartIcon from "@material-ui/icons/BarChart";
import LayersIcon from "@material-ui/icons/Layers";
import AssignmentIcon from "@material-ui/icons/Assignment";
import MenuIcon from "@material-ui/icons/Menu";
import SchneiderLogo from "src/components/commons/SchneiderLogo";

import SectorView from "./SectorView";
import SubsectorView from "./SubsectorView";
import SkillView from "./SkillView";
import EmployeeView from "./EmployeeView";
import ForecastView from "./ForecastView";
import ChangeLogView from "./ChangeLogView";
import CalendarView from "./CalendarView";
import HeadcountView from "./HeadcountView";

import { clearFeedback, fetchData } from "src/slices/sync";
import { logout } from "src/slices/session";
import { selPlant } from "src/slices/data";
import { getData, getSync, getSession } from "src/selectors";
import { AccessLevel, ItemType } from "src/kernel";
import { initViewState, ViewContext } from "src/contexts";
import GraphView from "./GraphView";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://se.com/">
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
  icon: {
    marginRight: theme.spacing(2),
    width: 150,
    height: 50,
  },
  title: {},
  settings: {
    marginLeft: "auto",
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
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  appBarSpacer: theme.mixins.toolbar,
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    minHeight: "89vh",
  },
  innerContent: {
    height: "95%",
  },
  footer: {
    height: "5%",
  },
  fixedHeight: {
    height: 240,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  form: {},
  formTitle: {
    height: "15%",
  },
  formContent: {
    height: "85%",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

enum DashboardView {
  Plant,
  Sector,
  Subsector,
  Skill,
  Employee,
  Graph,
  Forecast,
  ChangeLog,
  Calendar,
  Headcount,
}

function getItemType(i: DashboardView) {
  switch (i) {
    case DashboardView.Plant:
      return ItemType.Plant;
    case DashboardView.Sector:
      return ItemType.Sector;
    case DashboardView.Subsector:
      return ItemType.Subsector;
    case DashboardView.Skill:
      return ItemType.Skill;
    case DashboardView.Employee:
      return ItemType.Employee;
    case DashboardView.Graph:
      return ItemType.Job;
    case DashboardView.Forecast:
      return ItemType.Forecast;
    case DashboardView.Calendar:
      return ItemType.CalEvent;
    case DashboardView.ChangeLog:
      return ItemType.Log;
  }
}

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { selectedPlantId: pId, plants, loading } = useSelector(getData);
  const { feedback } = useSelector(getSync);
  const { user } = useSelector(getSession);

  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  let lastI = localStorage.getItem("lastDashboardView");
  const [viewState, setViewState] = React.useState(initViewState);
  React.useEffect(() => {
    setViewState({
      viewWidth: open ? 980 : 1150,
    });
  }, [open]);
  const [currView, setCurrView] = React.useState(lastI ? parseInt(lastI) : 0);
  const [mainAnchorEl, setMainAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [settingsAnchorEl, setSettingsAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMainTitleClick = (e: React.ChangeEvent<any>) => {
    setMainAnchorEl(e.currentTarget);
  };

  const handleListClick = (i: DashboardView) => () => {
    if (currView === i) return;
    feedback && dispatch(clearFeedback());
    localStorage.setItem("lastDashboardView", `${i}`);
    if (getItemType(i) === ItemType.Log) dispatch(fetchData(ItemType.Log));
    setCurrView(i);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchorEl(null);
  };

  const handlePageSelClose = () => {
    setMainAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleViewProfile = () => {
    history.push("/user");
  };

  const toPlant = () => {
    dispatch(selPlant());
  };

  const handleViewAccessCtrl = () => {
    history.push("/access_ctrl");
  };

  const cannotView = (i: DashboardView) => {
    if (user?.is_superuser) return false;
    switch (i) {
      case DashboardView.Plant:
        return user?.vers_user.plant_group === AccessLevel.NONE;
      case DashboardView.Sector:
        return user?.vers_user.sector_group === AccessLevel.NONE;
      case DashboardView.Subsector:
        return user?.vers_user.subsector_group === AccessLevel.NONE;
      case DashboardView.Skill:
        return user?.vers_user.skill_group === AccessLevel.NONE;
      case DashboardView.Employee:
        return user?.vers_user.employee_group === AccessLevel.NONE;
      case DashboardView.Graph:
        return user?.vers_user.job_group === AccessLevel.NONE;
      case DashboardView.ChangeLog:
      case DashboardView.Calendar:
        return true;
      default:
        return false;
    }
  };

  const mainListItems = (
    <div>
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
        disabled={cannotView(DashboardView.Employee)}
        selected={currView === DashboardView.Employee}
        onClick={handleListClick(DashboardView.Employee)}
      >
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Employees" />
      </ListItem>
    </div>
  );

  const secondaryListItems = (
    <div>
      <ListItem
        button
        disabled={cannotView(DashboardView.Calendar)}
        selected={currView === DashboardView.Calendar}
        onClick={handleListClick(DashboardView.Calendar)}
      >
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Calendar" />
      </ListItem>
      <ListItem
        button
        disabled={cannotView(DashboardView.Forecast)}
        selected={currView === DashboardView.Forecast}
        onClick={handleListClick(DashboardView.Forecast)}
      >
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Forecasts" />
      </ListItem>
      <ListItem
        button
        disabled={cannotView(DashboardView.Graph)}
        selected={currView === DashboardView.Graph}
        onClick={handleListClick(DashboardView.Graph)}
      >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Graphs" />
      </ListItem>
      <ListItem
        button
        disabled={cannotView(DashboardView.Headcount)}
        selected={currView === DashboardView.Headcount}
        onClick={handleListClick(DashboardView.Headcount)}
      >
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Headcount" />
      </ListItem>
      <ListItem
        button
        disabled={cannotView(DashboardView.ChangeLog)}
        selected={currView === DashboardView.ChangeLog}
        onClick={handleListClick(DashboardView.ChangeLog)}
      >
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Change Log" />
      </ListItem>
    </div>
  );

  const genView = () => {
    switch (currView) {
      case DashboardView.Sector:
        return <SectorView />;
      case DashboardView.Subsector:
        return <SubsectorView />;
      case DashboardView.Skill:
        return <SkillView />;
      case DashboardView.Employee:
        return <EmployeeView />;
      case DashboardView.Graph:
        return <GraphView />;
      case DashboardView.Forecast:
        return <ForecastView />;
      case DashboardView.ChangeLog:
        return <ChangeLogView />;
      case DashboardView.Calendar:
        return <CalendarView />;
      case DashboardView.Headcount:
        return <HeadcountView />;
      default:
        return <SectorView />;
    }
  };

  return (
    <React.Fragment>
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
            <svg className={classes.icon}>{SchneiderLogo}</svg>
            <ButtonBase
              className={classes.title}
              onClick={handleMainTitleClick}
            >
              <Typography component="h1" variant="h6" color="inherit" noWrap>
                {pId ? plants[pId]?.name : null}: Dashboard
              </Typography>
            </ButtonBase>
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
            <div className={classes.innerContent}>
              <ViewContext.Provider value={viewState}>
                {genView()}
              </ViewContext.Provider>
            </div>
            <Box pt={1} className={classes.footer}>
              <Copyright />
            </Box>
          </Container>
        </main>
      </div>
      <Menu
        id="simple-menu"
        anchorEl={settingsAnchorEl}
        keepMounted
        open={!!settingsAnchorEl}
        onClose={handleSettingsClose}
      >
        <MenuItem onClick={handleViewProfile}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
      <Menu
        id="simple-menu"
        anchorEl={mainAnchorEl}
        keepMounted
        open={!!mainAnchorEl}
        onClose={handlePageSelClose}
      >
        <MenuItem onClick={toPlant}>Plants</MenuItem>
        {user?.is_superuser ? (
          <MenuItem onClick={handleViewAccessCtrl}>Access Control</MenuItem>
        ) : null}
      </Menu>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </React.Fragment>
  );
};

export default DashboardPage;
