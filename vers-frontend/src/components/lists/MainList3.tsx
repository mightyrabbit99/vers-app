import * as React from "react";

import { makeStyles, Theme } from "@material-ui/core/styles";
import {
  AutoSizer,
  Table,
  Column,
  TableCellRenderer,
  TableCellProps,
} from "react-virtualized";
import clsx from "clsx";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import TableSortLabel from "@material-ui/core/TableSortLabel";

type Item = any;

enum SortDirection {
  ASC = "asc",
  DES = "desc",
}

interface ColStyle {
  width: any;
  [prop: string]: any;
}

interface Col {
  title?: React.ReactNode;
  extractor: (item: Item) => string | React.ReactNode;
  comparator?: (i1: Item, i2: Item) => number;
  style: ColStyle;
  numeric?: boolean;
}

interface Row {
  index: number;
}

interface IMainListStyles {
  headerHeight?: number;
  rowHeight?: number;
}

interface IMainListProps extends IMainListStyles {
  title?: string;
  lst: Item[];
  cols: Col[];
  selected?: number[];
  selectedOnChange?: (ids: number[]) => void;
  onRowClick?: () => void;
  [k: string]: any;
}

const useStyles = makeStyles<Theme, IMainListStyles>((theme) => ({
  root: {
    width: "100%",
    height: "100%",
  },
  flexContainer: {
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
  },
  table: {
    // temporary right-to-left patch, waiting for
    // https://github.com/bvaughn/react-virtualized/issues/454
    "& .ReactVirtualized__Table__headerRow": {
      flip: false,
      paddingRight: theme.direction === "rtl" ? "0 !important" : undefined,
    },
  },
  tableRow: {
    cursor: "pointer",
  },
  tableRowHover: {
    "&:hover": {
      backgroundColor: theme.palette.grey[200],
    },
  },
  tableCell: {
    flex: 1,
  },
  noClick: {
    cursor: "initial",
  },
}));

const ItemMainList: React.FC<IMainListProps> = (props) => {
  const {
    lst: l,
    cols,
    selected,
    selectedOnChange = (lst) => {},
    onRowClick,
    ...styles
  } = props;
  const classes = useStyles(styles);
  const { headerHeight = 48, rowHeight = 48 } = styles;

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
      setSortDire((d) =>
        d === SortDirection.ASC ? SortDirection.DES : SortDirection.ASC
      );
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

  const allCheckerRenderer = () => {
    return (
      <TableCell
        padding="checkbox"
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null,
        })}
      >
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
    );
  };

  const headerRenderer = (col: Col, idx: number) => {
    if (!col.title) {
      return (
        <TableCell
          padding="checkbox"
          component="div"
          className={clsx(
            classes.tableCell,
            classes.flexContainer,
            classes.noClick
          )}
          variant="head"
          style={{ height: headerHeight }}
          align={col.numeric || false ? "right" : "left"}
        />
      );
    } else if (typeof col.title === "string") {
      return (
        <TableCell
          sortDirection={false}
          component="div"
          className={clsx(
            classes.tableCell,
            classes.flexContainer,
            classes.noClick
          )}
          variant="head"
          style={{ height: headerHeight }}
          align={col.numeric || false ? "right" : "left"}
        >
          {col.comparator ? (
            <TableSortLabel
              active={sortCol === idx}
              direction={
                sortCol === undefined || sortCol !== idx
                  ? SortDirection.ASC
                  : sortDire
              }
              onClick={createSortHandler(idx)}
            >
              <b>{col.title}</b>
            </TableSortLabel>
          ) : (
            <b>{col.title}</b>
          )}
        </TableCell>
      );
    } else {
      return (
        <TableCell
          padding="checkbox"
          component="div"
          className={clsx(
            classes.tableCell,
            classes.flexContainer,
            classes.noClick
          )}
          variant="head"
          style={{ height: headerHeight }}
          align={col.numeric || false ? "right" : "left"}
        >
          {col.title}
        </TableCell>
      );
    }
  };

  const checkerRenderer: TableCellRenderer = ({ rowIndex }) => {
    const item = lst[rowIndex];
    if (item === undefined) return null;
    return (
      <TableCell
        padding="checkbox"
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null,
        })}
        variant="body"
        style={{ height: rowHeight }}
        align={"right"}
      >
        <Checkbox
          checked={selectedIds.includes(item.id)}
          onChange={(e) => handleSelectOne(e, item.id)}
          value="true"
        />
      </TableCell>
    );
  };

  const cellRenderer = (col: Col, { rowIndex }: TableCellProps) => {
    const item = lst[rowIndex];
    if (item === undefined) return null;
    if (!col.title) {
      return (
        <TableCell
          padding="checkbox"
          component="div"
          className={clsx(classes.tableCell, classes.flexContainer, {
            [classes.noClick]: onRowClick == null,
          })}
          variant="body"
          style={{ height: rowHeight }}
          align={col.numeric || false ? "right" : "left"}
        >
          {col.extractor(item)}
        </TableCell>
      );
    } else {
      return (
        <TableCell
          component="div"
          className={clsx(classes.tableCell, classes.flexContainer, {
            [classes.noClick]: onRowClick == null,
          })}
          variant="body"
          style={{ height: rowHeight }}
          align={col.numeric || false ? "right" : "left"}
        >
          {col.extractor(item)}
        </TableCell>
      );
    }
  };

  const getRowClassName = ({ index }: Row) => {
    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    });
  };

  return (
    <AutoSizer className={classes.root}>
      {({ height, width }) => (
        <Table
          height={height}
          width={width}
          rowHeight={rowHeight!}
          gridStyle={{
            direction: "inherit",
          }}
          headerHeight={headerHeight!}
          className={classes.table}
          rowCount={l.length}
          rowGetter={({ index }) => lst[index] ?? {}}
          rowClassName={getRowClassName}
        >
          {selected ? (
            <Column
              headerRenderer={(headerProps) => allCheckerRenderer()}
              className={classes.flexContainer}
              cellRenderer={checkerRenderer}
              width={50}
              dataKey={""}
              key={""}
            />
          ) : null}
          {cols.map((x, idx) => {
            return (
              <Column
                headerRenderer={(headerProps) => headerRenderer(x, idx)}
                className={classes.flexContainer}
                cellRenderer={(props) => cellRenderer(x, props)}
                {...x.style}
                dataKey={""}
                key={""}
              />
            );
          })}
        </Table>
      )}
    </AutoSizer>
  );
};

export type { Col };
export default ItemMainList;
