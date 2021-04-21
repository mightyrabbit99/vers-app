import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TableContainer from "@material-ui/core/TableContainer";
import Table, { Size, Padding } from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell, { TableCellProps } from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: "100%",
  },
  tableHead: {
    height: "15%",
    width: "100%",
  },
  tableBody: {
    height: "85%",
    width: "100%",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    boxSizing: "border-box",
    minWidth: "100%",
    width: "100%",
  },
  headerRow: {},
  cell: {
    //display: "block",
    flexGrow: 0,
    flexShrink: 0,
  },
  expandingCell: {},
  column: {},
}));

enum SortDirection {
  ASC = "asc",
  DES = "desc",
}

interface IMainListStyles {
  minWidth?: any;
  width?: any;
  height?: any;
}

type Item = any;
interface Col {
  title?: string;
  extractor: (item: Item) => string | React.ReactNode;
  comparator?: (i1: Item, i2: Item) => number;
  style?: any;
}

interface IMainListProps extends IMainListStyles {
  title?: string;
  lst: Item[];
  cols: Col[];
  selected?: number[];
  size?: Size;
  padding?: Padding;
  selectedOnChange?: (ids: number[]) => void;
}

const ROW_HEIGHT = 48;

const TableHCell: React.FC<TableCellProps & { style?: any }> = (props) => {
  const { style, ...restProps } = props;
  return <TableCell 
    component="div" 
    variant="head" 
    width={style?.width}
    style={{
      flexBasis: style?.width || false,
      height: ROW_HEIGHT
    }}
    {...restProps} 
  />;
};

const TableBCell: React.FC<TableCellProps & { style?: any }> = (props) => {
  const { style, ...restProps } = props;
  return <TableCell 
    component="div" 
    variant="body" 
    width={style?.width}
    style={{
      flexBasis: style?.width || false,
      height: ROW_HEIGHT
    }}
    {...restProps} 
  />;
};

const ItemMainList: React.FC<IMainListProps> = (props) => {
  const classes = useStyles();
  const { lst: l, cols, selected, size, padding, selectedOnChange } = props;
  const [selectedIds, setSelectedIds] = React.useState<number[]>(
    selected ?? []
  );

  const [lst, setLst] = React.useState<Item[]>([]);

  const handleSelectOne = (e: React.ChangeEvent<any>, id: number) => {
    let newSelectedIds: number[] = [...selectedIds];
    if (newSelectedIds.indexOf(id) === -1) {
      newSelectedIds.push(id);
    } else {
      newSelectedIds.splice(newSelectedIds.indexOf(id), 1);
    }

    setSelectedIds(newSelectedIds);
    selectedOnChange && selectedOnChange(newSelectedIds);
  };

  const handleSelectAll = (e: React.ChangeEvent<any>) => {
    let newSelectedIds: number[];

    if (e.target.checked) {
      newSelectedIds = lst.map((emp) => emp.id);
    } else {
      newSelectedIds = [];
    }
    setSelectedIds(newSelectedIds);
    selectedOnChange && selectedOnChange(newSelectedIds);
  };

  const [sortCol, setSortCol] = React.useState<number>();
  const [sortDire, setSortDire] = React.useState<SortDirection>(
    SortDirection.ASC
  );

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

  const createSortHandler = (colIdx: number) => (
    e: React.MouseEvent<unknown>
  ) => {
    if (sortCol !== colIdx) {
      setSortCol(colIdx);
      setSortDire(SortDirection.ASC);
    } else {
      setSortDire((d) =>
        d === SortDirection.ASC ? SortDirection.DES : SortDirection.ASC
      );
    }
  };

  const Row = React.useCallback(
    ({ index: idx, style }) => {
      const item = lst[idx];
      return (
        <TableRow
          hover
          component="div"
          key={idx}
          selected={selectedIds.includes(item.id)}
          style={style}
        >
          {selected ? (
            <TableBCell
              padding="checkbox"
              className={clsx(
                classes.cell,
                classes.column
              )}
            >
              <Checkbox
                checked={selectedIds.includes(item.id)}
                onChange={(e) => handleSelectOne(e, item.id)}
                value="true"
              />
            </TableBCell>
          ) : null}
          {cols.map((x, idx) => {
            return x.title ? (
              <TableBCell 
                key={idx}
                style={x.style}
                className={clsx(
                  classes.cell,
                  classes.column,
                  !x.style?.width && classes.expandingCell
                )}
              >
                {x.extractor(item)}
              </TableBCell>
            ) : (
              <TableBCell
                padding="checkbox"
                key={idx}
                align={idx === cols.length - 1 ? "right" : "left"}
                style={x.style}
                className={clsx(
                  classes.cell,
                  classes.column,
                  !x.style?.width && classes.expandingCell
                )}
              >
                {x.extractor(item)}
              </TableBCell>
            );
          })}
        </TableRow>
      );
    },
    [lst, selected, selectedIds, cols]
  );

  return (
    <Table component="div" className={classes.root}>
      <TableHead className={classes.tableHead}>
        <TableRow
          component="div"
          className={clsx(classes.row, classes.headerRow)}
        >
          {selected ? (
            <TableHCell padding="checkbox">
              <Checkbox
                checked={selectedIds.length === lst.length}
                color="primary"
                indeterminate={
                  selectedIds.length > 0 && selectedIds.length < lst.length
                }
                disabled={lst.length === 0}
                onChange={handleSelectAll}
              />
            </TableHCell>
          ) : null}
          {cols.map((x, idx) => {
            return x.title ? (
              <TableHCell
                key={idx}
                style={x.style}
                sortDirection={false}
                className={clsx(classes.cell, !x.style?.width && classes.expandingCell)}
              >
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
              </TableHCell>
            ) : (
              <TableHCell padding="checkbox" key={idx} />
            );
          })}
        </TableRow>
      </TableHead>
      <TableBody className={classes.tableBody}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              className="List"
              height={height}
              itemCount={l.length}
              itemSize={60}
              width={width}
            >
              {Row}
            </List>
          )}
        </AutoSizer>
      </TableBody>
    </Table>
  );
};

export type { Col };
export default ItemMainList;
