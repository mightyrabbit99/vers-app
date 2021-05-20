import * as React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const r = (x: number | undefined, n: number, d: number) => x ? x * n / d : x;

const useStyles = makeStyles((theme) => ({
  tabs: {
    height: "10%",
    minHeight: (props: any) => r(props.minHeight, 10, 100) ?? 45,
    width: "100%",
  },
  tabContent: {
    height: "90%",
    minHeight: (props: any) => r(props.minHeight, 90, 100) ?? 240,
    width: "100%",
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
  className?: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, className, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

interface TabPage {
  name: string;
  node: React.ReactNode;
}

interface FullWidthTabsProps {
  tabsClass?: string;
  pages: TabPage[];
  [style: string]: any;
}

const FullWidthTabs: React.FC<FullWidthTabsProps> = (props) => {
  const { tabsClass, pages, ...styles } = props;
  const classes = useStyles(styles);
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <React.Fragment>
      <Paper square className={clsx(classes.tabs, tabsClass)}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          {pages.map((x, idx) => (
            <Tab key={idx} label={x.name} {...a11yProps(idx)} />
          ))}
        </Tabs>
      </Paper>
      {pages.map((x, idx) => (
        <TabPanel
          key={idx}
          value={value}
          index={idx}
        >
          {x.node}
        </TabPanel>
      ))}
    </React.Fragment>
  );
};

export type { TabPage };
export default FullWidthTabs;
