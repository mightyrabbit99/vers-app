import * as React from "react";
import Typography from "@material-ui/core/Typography";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableFooter from "@material-ui/core/TableFooter";
import TextField from "@material-ui/core/TextField";

import { Forecast } from "src/kernel";

interface IForecastListWidgetProps {
  lst: { [id: number]: Forecast };
  onSubmit: (f: Forecast) => void;
}

const ForecastListWidget: React.FunctionComponent<IForecastListWidgetProps> = (
  props
) => {
  const { lst, onSubmit } = props;

  const genTableRow = (f: Forecast) => {
    const handleForecastChg = (idx: number) => (e: React.ChangeEvent<any>) => {
      let { value } = e.target;
      let newForecasts = [...f.forecasts];
      newForecasts[idx] = { ...newForecasts[idx], val: parseFloat(value) };
      onSubmit({ ...f, forecasts: newForecasts });
    };
    
    return (
      <TableRow>
        <TableCell>{f.on}</TableCell>
        {[1, 2, 3, 4, 5, 6].map((n) => {
          let ffIdx = f.forecasts.findIndex((y) => y.n === n);
          if (ffIdx === -1) return <TableCell></TableCell>;
          let y = f.forecasts[ffIdx];
          return (
            <TableCell>
              <TextField
                value={y.val}
                onBlur={handleForecastChg(ffIdx)}
                type="number"
              />
            </TableCell>
          );
        })}
      </TableRow>
    );
  };

  return (
    <React.Fragment>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Forecast
      </Typography>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Month</b>
              </TableCell>
              <TableCell>
                <b>n + 1</b>
              </TableCell>
              <TableCell>
                <b>n + 2</b>
              </TableCell>
              <TableCell>
                <b>n + 3</b>
              </TableCell>
              <TableCell>
                <b>n + 4</b>
              </TableCell>
              <TableCell>
                <b>n + 5</b>
              </TableCell>
              <TableCell>
                <b>n + 6</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{Object.values(lst).map(genTableRow)}</TableBody>
          <TableFooter></TableFooter>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
};

export default ForecastListWidget;
