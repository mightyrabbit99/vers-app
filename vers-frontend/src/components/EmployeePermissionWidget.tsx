import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Employee } from "src/kernel";
import { Typography } from '@material-ui/core';

function preventDefault(e: React.ChangeEvent<any>) {
  e.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

interface WidgetProps {
  lst: { [id: number]: Employee };
}

const EmployeePermissionWidget: React.FC<WidgetProps> = (props) => {
  const classes = useStyles();
  const { lst } = props;
  const rows = Object.values(lst);
  return (
    <React.Fragment>
      <Typography>Permissions</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Sesa Id</TableCell>
            <TableCell>Plant</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{`${row.firstName}, ${row.lastName}`}</TableCell>
              <TableCell>{row.sesaId}</TableCell>
              <TableCell>{row.shipTo}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          See more orders
        </Link>
      </div>
    </React.Fragment>
  );
}

export default EmployeePermissionWidget;
