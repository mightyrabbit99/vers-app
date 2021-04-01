import * as React from "react";

import { makeStyles, Theme } from "@material-ui/core/styles";
import Table, { Size, Padding } from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Checkbox from "@material-ui/core/Checkbox";

type Item = any;

enum SortDirection {
  ASC = "asc",
  DES = "desc",
}

interface Col {
  title?: string;
  extractor: (item: Item) => string | React.ReactNode;
  comparator?: (i1: Item, i2: Item) => number;
}

interface IMainListStyles {
  minWidth?: any;
  width?: any;
  height?: any;
}

interface IMainListProps extends IMainListStyles {
  title?: string;
  lst: Item[];
  cols: Col[];
  selected?: number[];
  selectedOnChange?: (ids: number[]) => void;
  size?: Size;
  padding?: Padding;
}

const useStyles = makeStyles<Theme, IMainListStyles>((themes) => ({
  content: {
    height: (props) => props.height ?? "inherit",
    width: (props) => props.width ?? "inherit",
    minWidth: (props) => props.minWidth,
  },
}));

const ItemMainList: React.FC<IMainListProps> = (props) => {
  const {
    lst: l,
    cols,
    selected,
    selectedOnChange = (lst) => {},
    size,
    padding,
    ...styles
  } = props;
  const classes = useStyles(styles);

  const [lst, setLst] = React.useState<Item[]>([]);

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

  const [sortCol, setSortCol] = React.useState<number>();
  const [sortDire, setSortDire] = React.useState<SortDirection>(
    SortDirection.ASC
  );
  const createSortHandler = (colIdx: number) => (
    e: React.MouseEvent<unknown>
  ) => {
    if (sortCol !== colIdx) {
      setSortCol(colIdx);
      setSortDire(SortDirection.ASC);
    } else {
      setSortDire((d) => (d === SortDirection.ASC ? SortDirection.DES : SortDirection.ASC));
    }
  };

  const stableSort = React.useCallback(
    (lst: Item[]) => {
      if (sortCol === undefined) return lst;
      const comp = cols[sortCol].comparator;
      if (!comp) return lst;
      return lst.sort(
        sortDire === SortDirection.DES
          ? comp
          : (i1: Item, i2: Item) => comp(i2, i1)
      );
    },
    [sortCol, sortDire, cols]
  );
  React.useEffect(() => {
    setLst(stableSort([...l]));
  }, [stableSort, l]);

  return (
    <TableContainer className={classes.content}>
      <Table stickyHeader size={size} padding={padding}>
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
                <TableCell key={idx} sortDirection={false}>
                  {x.comparator ? (
                    <TableSortLabel
                      active={sortCol === idx}
                      direction={
                        sortCol === undefined || sortCol !== idx
                          ? SortDirection.ASC
                          : sortDire
                      }
                      onClick={createSortHandler(idx)}
                    >
                      <b>{x.title}</b>
                    </TableSortLabel>
                  ) : (
                    <b>{x.title}</b>
                  )}
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
                    onChange={(e) => handleSelectOne(e, item.id)}
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
                    key={idx}
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
