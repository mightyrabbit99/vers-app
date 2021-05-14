import * as React from "react";
import { useSelector } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";

import HeadcountListWidget from "src/components/HeadcountListWidget";
import ViewTab, { TabPage } from "src/components/commons/ViewTab";
import { getData } from "src/selectors";
import { Forecast, Skill } from "src/kernel";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "80vh",
    minHeight: 430,
  },
  tabs: {
    height: "10%",
  },
}));

interface IHeadcountViewProps {}

type SecSkillDict = { [secId: number]: { [id: number]: Skill } };

const HeadcountView: React.FC<IHeadcountViewProps> = (props) => {
  const classes = useStyles();
  const { sectors, subsectors, calEvents, skills, employees } =
    useSelector(getData);

  const [secSkillPart, setSecSkillPart] = React.useState<SecSkillDict>({});
  React.useEffect(() => {
    setSecSkillPart(
      Object.values(skills).reduce((pr, cu) => {
        let secId = sectors[subsectors[cu.subsector].sector].id;
        if (!(secId in pr)) pr[secId] = {};
        pr[secId][cu.id] = cu;
        return pr;
      }, {} as SecSkillDict)
    );
  }, [sectors, subsectors, skills]);

  const [sectorTabs, setSectorTabs] = React.useState<number[]>([]);
  const genPages = React.useCallback(
    (): TabPage[] =>
      sectorTabs.map((x) => ({
        name: sectors[x].name,
        node: (
          <HeadcountListWidget
            skills={secSkillPart[x] ?? {}}
            subsectors={subsectors}
            forecasts={sectors[x].forecasts.reduce((pr, cu) => {
              pr[cu.id] = cu;
              return pr;
            }, {} as { [id: number]: Forecast })}
            calEvents={calEvents}
            employees={employees}
          />
        ),
      })),
    [sectorTabs, sectors, subsectors, secSkillPart, employees, calEvents]
  );
  React.useEffect(() => {
    setSectorTabs(
      Object.values(sectors)
        .slice(0, 2)
        .map((x) => x.id)
    );
  }, [sectors]);

  return (
    <div className={classes.root}>
      <ViewTab pages={genPages()} tabsClass={classes.tabs} />
    </div>
  );
};

export default HeadcountView;
