import * as React from "react";
import Typography from "@material-ui/core/Typography";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";

interface IForecastListWidgetProps {}

const ForecastListWidget: React.FunctionComponent<IForecastListWidgetProps> = (
  props
) => {
  return (
    <React.Fragment>
      <Typography
        component="h2"
        variant="h6"
        color="primary"
        gutterBottom
      >
        Forecast
      </Typography>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>User</b>
              </TableCell>
              <TableCell>
                <b>Plant</b>
              </TableCell>
              <TableCell>
                <b>Sector</b>
              </TableCell>
              <TableCell>
                <b>Subsector</b>
              </TableCell>
              <TableCell>
                <b>Department</b>
              </TableCell>
              <TableCell>
                <b>Employee</b>
              </TableCell>
              <TableCell>
                <b>Skill</b>
              </TableCell>
              <TableCell>
                <b>Job</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{null}</TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
};

export default ForecastListWidget;
