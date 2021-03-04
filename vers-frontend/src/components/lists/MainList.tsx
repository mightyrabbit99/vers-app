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
} from "@material-ui/core";

type Item = any;

interface Col {
  title?: string;
  extractor: (item: Item) => string | React.ReactNode;
}

interface IMainListProps {
  title?: string;
  lst: Item[];
  cols: Col[];
  selected?: number[];
  selectedOnChange?: (ids: number[]) => void;
}

const useStyles = makeStyles((themes) => ({
  content: {
    height: "100%",
    width: "100%",
  },
}));

const ItemMainList: React.FC<IMainListProps> = (props) => {
  const classes = useStyles();
  const { lst, cols, selected, selectedOnChange = (lst) => {} } = props;

  const [selectedIds, setSelectedIds] = React.useState<number[]>(
    selected ?? []
  );
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
    <TableContainer className={classes.content}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {selected ? (
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
            ) : null}
            {cols.map((x, idx) => {
              return x.title ? (
                <TableCell key={idx}>
                  <b>{x.title}</b>
                </TableCell>
              ) : (
                <TableCell padding="checkbox" key={idx}></TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {lst.map((item, idx) => (
            <TableRow hover key={idx} selected={selectedIds.includes(item.id)}>
              {selected ? (
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.includes(item.id)}
                    onChange={(event) => handleSelectOne(event, item.id)}
                    value="true"
                  />
                </TableCell>
              ) : null}
              {cols.map((x, idx) => {
                return x.title ? (
                  <TableCell key={idx}>{x.extractor(item)}</TableCell>
                ) : (
                  <TableCell
                    padding="checkbox"
                    align={idx === cols.length - 1 ? "right" : "left"}
                  >
                    {x.extractor(item)}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export type { Col };
export default ItemMainList;
