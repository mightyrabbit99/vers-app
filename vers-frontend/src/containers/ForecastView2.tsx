import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

import ForecastListWidget from "src/components/ForecastListWidget";
import ViewTab, { TabPage } from "src/components/commons/ViewTab";
import { getData, getSync } from "src/selectors";
import { delData, saveData, downloadExcel } from "src/slices/data";
import { clearFeedback, submitExcel } from "src/slices/sync";
import { Forecast, ItemType, Feedback } from "src/kernel";
import ExcelProcessor3 from "src/kernel/ExcelProcessor3";

const useStyles = makeStyles((theme) => ({
  widget: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    height: "79vh",
    minHeight: 400,
  },
  tabs: {
    height: "10%",
  },
  widget2: {
    height: "80%",
  },
}));

type ForecastState = { [sector: number]: { [id: number]: Forecast } };

interface IForecastViewProps {}

const ForecastView: React.FC<IForecastViewProps> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { sectors, newForecast } = useSelector(getData);
  const { feedback } = useSelector(getSync);

  const handleForecastSubmit = (...f: Forecast[]) => {
    dispatch(saveData(f));
  };

  const handleForecastDelete = (...f: Forecast[]) => {
    dispatch(delData(f));
  };
  const handleReset = () => {
    feedback && dispatch(clearFeedback());
  };

  const [sbOpen, setSbOpen] = React.useState(false);
  const [fb, setFb] = React.useState<Feedback<Forecast>>();
  React.useEffect(() => {
    setFb(feedback as Feedback<Forecast>);
  }, [feedback]);
  const handleUploadExcel = async (sectorId: number, file: File) => {
    try {
      let ans = await ExcelProcessor3.readForecastFile(file);
      dispatch(
        submitExcel({
          type: ItemType.Forecast,
          data: ans,
          options: { sector: sectorId },
        })
      );
    } catch (e) {
      setSbOpen(true);
    }
  };

  const handleFbClose = () => {
    setSbOpen(false);
  };

  const handleExcelDownloadClick = async (items: Forecast[]) => {
    dispatch(
      downloadExcel({
        type: ItemType.Forecast,
        items,
      })
    );
  };

  const [sectorTabs, setSectorTabs] = React.useState<number[]>([]);
  const genPages = React.useCallback(
    (): TabPage[] =>
      sectorTabs.map((x) => ({
        name: sectors[x].name,
        tabPanelClass: classes.widget2,
        node: (
          <ForecastListWidget
            title="Forecasts"
            lst={sectors[x].forecasts.reduce((pr, cu) => {
              pr[cu.id] = cu;
              return pr;
            }, {} as { [id: number]: Forecast })}
            newForecast={
              newForecast
                ? { ...newForecast, sector: sectors[x].id }
                : undefined
            }
            feedback={fb?.id === sectors[x].id ? fb : undefined}
            onSubmit={handleForecastSubmit}
            onDelete={handleForecastDelete}
            onReset={handleReset}
            uploadExcel={handleUploadExcel.bind(null, sectors[x].id)}
            downloadExcel={handleExcelDownloadClick.bind(
              null,
              sectors[x].forecasts
            )}
          />
        ),
      })),
    [sectors, sectorTabs]
  );
  React.useEffect(() => {
    setSectorTabs(
      Object.values(sectors)
        .slice(0, 2)
        .map((x) => x.id)
    );
  }, [sectors]);

  return (
    <React.Fragment>
      <div className={classes.widget}>
        <ViewTab pages={genPages()} tabsClass={classes.tabs} />
      </div>
      <Snackbar open={sbOpen} autoHideDuration={6000} onClose={handleFbClose}>
        <Alert onClose={handleFbClose} severity={"error"}>
          {"Upload failed"}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default ForecastView;
