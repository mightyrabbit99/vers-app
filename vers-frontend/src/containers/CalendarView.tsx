import * as React from "react";
import { Calendar, Event, momentLocalizer } from "react-big-calendar";
import moment from "moment";

const localizer = momentLocalizer(moment);

interface ICalendarViewProps {}

const myEventsList: Event[] = [
  {
    title: "test",
    start: new Date(),
    end: new Date(),
    allDay: true,
  },
];

const CalendarView: React.FunctionComponent<ICalendarViewProps> = (props) => {
  return (
    <div>
      <Calendar
        localizer={localizer}
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
};

export default CalendarView;
