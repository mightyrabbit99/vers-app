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

import { Forecast, ForecastData } from "src/kernel";

interface IForecastListWidgetProps {
  lst: { [id: number]: Forecast };
}

const ForecastListWidget: React.FunctionComponent<IForecastListWidgetProps> = (
  props
) => {
  const { lst } = props;

  const genForecastRow = (x: Forecast) => {
    const genActiveProps = (y: ForecastData) => {
      return {
        value: y.val,
        onChange: (e: React.ChangeEvent<any>) => {
          let { value } = e.target;
          y.val = value;
        }
      }
    }
    return (
      <TableRow>
        {x.vals.map((y) => (
          <TableCell>
            <TextField
              variant="outlined" 
              {...genActiveProps(y)} 
            />
          </TableCell>
        ))}
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
          <TableBody>{Object.values(lst).map(genForecastRow)}</TableBody>
          <TableFooter></TableFooter>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
};

export default ForecastListWidget;
