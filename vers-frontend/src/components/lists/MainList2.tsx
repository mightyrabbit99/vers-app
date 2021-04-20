import React from "react";
import clsx from "clsx";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import {
  AutoSizer,
  Column,
  Table,
  TableCellRenderer,
  TableHeaderProps,
} from "react-virtualized";

declare module "@material-ui/core/styles/withStyles" {
  // Augment the BaseCSSProperties so that we can control jss-rtl
  interface BaseCSSProperties {
    /*
     * Used to control if the rule-set should be affected by rtl transformation
     */
    flip?: boolean;
  }
}

const styles = (theme: Theme) =>
  createStyles({
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
  });

enum SortDirection {
  ASC = "asc",
  DES = "desc",
}

interface ColumnData {
  dataKey: string;
  label?: any;
  numeric?: boolean;
  width: number;
}

interface Row {
  index: number;
}

interface MuiVirtualizedTableProps extends WithStyles<typeof styles> {
  columns: ColumnData[];
  headerHeight?: number;
  onRowClick?: () => void;
  rowCount: number;
  rowGetter: (row: Row) => any;
  rowHeight?: number;
}

class MuiVirtualizedTable extends React.PureComponent<MuiVirtualizedTableProps> {
  static defaultProps = {
    headerHeight: 48,
    rowHeight: 48,
  };

  getRowClassName = ({ index }: Row) => {
    const { classes, onRowClick } = this.props;

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    });
  };

  cellRenderer: TableCellRenderer = ({ cellData, columnIndex }) => {
    const { columns, classes, rowHeight, onRowClick } = this.props;
    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null,
        })}
        variant="body"
        style={{ height: rowHeight }}
        align={
          (columnIndex != null && columns[columnIndex].numeric) || false
            ? "right"
            : "left"
        }
      >
        {cellData}
      </TableCell>
    );
  };

  headerRenderer = ({
    label,
    columnIndex,
  }: TableHeaderProps & { columnIndex: number }) => {
    const { headerHeight, columns, classes } = this.props;

    return (
      <TableCell
        component="div"
        className={clsx(
          classes.tableCell,
          classes.flexContainer,
          classes.noClick
        )}
        variant="head"
        style={{ height: headerHeight }}
        align={columns[columnIndex].numeric || false ? "right" : "left"}
      >
        <span>{label}</span>
      </TableCell>
    );
  };

  render() {
    const {
      classes,
      columns,
      rowHeight,
      headerHeight,
      ...tableProps
    } = this.props;
    return (
      <AutoSizer>
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
            {...tableProps}
            rowClassName={this.getRowClassName}
            stickyHeader
          >
            {columns.map(({ dataKey, ...other }, index) => {
              return (
                <Column
                  key={dataKey}
                  headerRenderer={(headerProps) =>
                    this.headerRenderer({
                      ...headerProps,
                      columnIndex: index,
                    })
                  }
                  className={classes.flexContainer}
                  cellRenderer={this.cellRenderer}
                  dataKey={dataKey}
                  {...other}
                />
              );
            })}
          </Table>
        )}
      </AutoSizer>
    );
  }
}

const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);

// ---

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
}

interface IMainListProps extends IMainListStyles {
  title?: string;
  lst: Item[];
  cols: Col[];
  selected?: number[];
  selectedOnChange?: (ids: number[]) => void;
}

const ItemMainList: React.FC<IMainListProps> = (props) => {
  const { lst: l, cols, selected, selectedOnChange } = props;
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

  const getRow = (i: number) => {
    const item = lst[i];
    return cols.reduce(
      (prev, curr) => {
        if (curr.title) {
          prev[curr.title] = curr.extractor(item);
        }
        return prev;
      },
      {
        __check: (
          <Checkbox
            checked={selectedIds.includes(item.id)}
            onChange={(e) => handleSelectOne(e, item.id)}
            value="true"
          />
        ),
      } as { [title: string]: any }
    );
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

  const columns: ColumnData[] = cols.map((x, idx) => ({
    label: x.comparator ? (
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
    ),
    dataKey: x.title ?? "",
    width: 200,
  }));
  columns.unshift({
    dataKey: "__check",
    width: 200,
  });

  return (
    <Paper style={{ height: 400, width: "100%" }}>
      <VirtualizedTable
        rowCount={lst.length}
        rowGetter={({ index }) => getRow(index)}
        columns={columns}
      />
    </Paper>
  );
};

export type { Col };
export default ItemMainList;
