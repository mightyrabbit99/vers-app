import * as React from "react";

import {
  Checkbox,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  makeStyles,
  IconButton,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

type Item = any;

interface Col {
  title: string;
  extractor: (item: Item) => string;
}

interface IMainListProps {
  title?: string;
  lst: Item[];
  cols: Col[];
  selected?: number[];
  selectedOnChange?: (ids: number[]) => void;
  onEdit?: (id: number) => void;
}

const useStyles = makeStyles((themes) => ({
  content: {
    height: "100%",
    width: "100%",
  },
}));

const ItemMainList: React.FC<IMainListProps> = (props) => {
  const classes = useStyles();
  const {
    lst,
    cols,
    selected,
    onEdit = (i) => {},
    selectedOnChange = (lst) => {},
  } = props;

  const [limit, setLimit] = React.useState(10);
  const [selectedIds, setSelectedIds] = React.useState<number[]>(selected ?? []);
  React.useEffect(() => {
    setSelectedIds(selected ?? []);
  }, [selected]);

  const handleSelectAll = (e: React.ChangeEvent<any>) => {
    let newSelectedIds: number[];

    if (e.target.checked) {
      newSelectedIds = lst.map((emp) => emp.id);
    } else {
      newSelectedIds = [];
    }
    setSelectedIds(newSelectedIds);
    selectedOnChange(newSelectedIds);
  };

  const handleSelectOne = (e: React.ChangeEvent<any>, id: number) => {
    let newSelectedIds: number[] = [...selectedIds];
    if (newSelectedIds.indexOf(id) === -1) {
      newSelectedIds.push(id);
    } else {
      newSelectedIds.splice(newSelectedIds.indexOf(id), 1);
    }

    setSelectedIds(newSelectedIds);
    selectedOnChange(newSelectedIds);
  };

  return (
    <React.Fragment>
      <TableContainer className={classes.content}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedIds.length === lst.length}
                  color="primary"
                  indeterminate={
                    selectedIds.length > 0 && selectedIds.length < lst.length
                  }
                  disabled={lst.length === 0}
                  onChange={handleSelectAll}
                />
              </TableCell>
              {cols.map((x, idx) => (
                <TableCell key={idx}>
                  <b>{x.title}</b>
                </TableCell>
              ))}
              <TableCell padding="checkbox"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lst.slice(0, limit).map((plant, idx) => (
              <TableRow
                hover
                key={idx}
                selected={selectedIds.indexOf(plant.id) !== -1}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.indexOf(plant.id) !== -1}
                    onChange={(event) => handleSelectOne(event, plant.id)}
                    value="true"
                  />
                </TableCell>
                {cols.map((x, idx) => (
                  <TableCell key={idx}>{x.extractor(plant)}</TableCell>
                ))}
                <TableCell padding="checkbox" align="right">
                  <IconButton
                    onClick={() => onEdit(plant.id)}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
};

export default ItemMainList;
