import * as React from "react";
import moment from "moment";
import {
  Calendar,
  Event,
  ToolbarProps,
  momentLocalizer,
} from "react-big-calendar";

import { makeStyles, Theme } from "@material-ui/core/styles";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

const localizer = momentLocalizer(moment);

enum NavDir {
  PREV,
  TODAY,
  NEXT,
}

interface IMyCalendarProps {
  events: Event[];
  date?: Date;
  onSelectEvent?: (e: Event) => void;
  onSelectDate?: (d: Date) => void;
  style?: any;
}

const ARROW_ICON_WIDTH = 50;

const useStyles = makeStyles<Theme, IMyCalendarProps>((theme) => ({
  root: {
    display: "flex",
    height: props => props.style?.height ?? "inherit",
    width: props => props.style?.width ?? "inherit",
  },
  arrowIcon: {
    width: ARROW_ICON_WIDTH,
  },
}));

const toolbarUseStyles = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    width: "inherit",
  },
  title: {
    marginLeft: "auto",
    marginRight: "auto",
  },
}))

const CustomToolbar: React.FC<ToolbarProps> = (props) => {
  const { label } = props;
  const classes = toolbarUseStyles();

  return (
    <div className={classes.toolbar}>
      <Typography className={classes.title}>{label}</Typography>
    </div>
  );
};

const MyCalendar: React.FC<IMyCalendarProps> = (props) => {
  const { events, date, onSelectEvent, onSelectDate, style } = props;
  const classes = useStyles(props);

  const [d, setD] = React.useState(date ?? new Date());
  React.useEffect(() => {
    setD(date ?? new Date());
  }, [date]);

  const handleNav = (e: Date) => {
    let ee = new Date(e);
    ee.setDate(e.getDate() + 1);
    onSelectDate && onSelectDate(ee);
  };

  const monthNav = (n: NavDir) => {
    let dd = new Date(d);
    if (n === NavDir.PREV) {
      dd.setMonth(d.getMonth() - 1);
      setD(dd);
    } else {
      dd.setMonth(d.getMonth() + 1);
      setD(dd);
    }
  };

  const [calStyles, setCalStyles] = React.useState<React.CSSProperties>();
  React.useEffect(() => {
    setCalStyles({
      width: (style?.width ?? 980) - 2 * ARROW_ICON_WIDTH,
      height: style?.height
    });
  }, [style]);

  return (
    <div className={classes.root} >
      <ButtonBase onClick={monthNav.bind(null, NavDir.PREV)}>
        <ArrowBackIcon className={classes.arrowIcon} />
      </ButtonBase>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={calStyles}
        date={d}
        onSelectEvent={onSelectEvent}
        onNavigate={handleNav}
        views={{ month: true }}
        components={{ toolbar: CustomToolbar }}
      />
      <ButtonBase onClick={monthNav.bind(null, NavDir.NEXT)}>
        <ArrowForwardIcon className={classes.arrowIcon} />
      </ButtonBase>
    </div>
  );
};

export type { Event };
export default MyCalendar;
