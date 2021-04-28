import * as React from "react";
import clsx from "clsx";
import { FixedSizeList, ListChildComponentProps } from "react-window";

import { makeStyles, Theme } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";

import { toRegExp } from "src/utils/tools";


interface IItemSelectorDispStyle {
  height: any;
  width: any;
  itemSize?: number;
}

const SEARCH_BAR_HEIGHT = 50;
const IS = 46;

const useStyles = makeStyles<Theme, IItemSelectorDispStyle>((theme) => ({
  root: {
    height: (props) => props.height,
    width: "100%",
    overflow: "scroll",
  },
  leftPanel: {
    height: (props) => props.height,
    width: (props) => props.width,
  },
  rightPanel: {
    height: (props) => props.height,
  },
}));

type Item = any;
interface Item2 {
  item: Item;
  id: number;
}

interface IItemSelectorDispProps {
  className?: any;
  lst: Item[];
  labelExtractor: (item: Item) => string;
  handleListItemClick?: (item: Item) => void;
  children: ((item?: Item) => React.ReactNode);
  style: IItemSelectorDispStyle;
}

const ItemSelectorDisp: React.FunctionComponent<IItemSelectorDispProps> = (
  props
) => {
  const {
    className,
    lst: l,
    labelExtractor,
    handleListItemClick,
    style,
    children,
  } = props;
  const { height, width, itemSize = IS } = style;
  const classes = useStyles(style);

  const [lst, setLst] = React.useState<Item2[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  React.useEffect(() => {
    if (searchTerm === "") {
      setLst(l.map((x, idx) => ({ id: idx, item: x })));
    } else {
      const reg = toRegExp(searchTerm);
      setLst(
        l
          .map((x, idx) => ({ id: idx, item: x }))
          .filter((x) => reg.test(labelExtractor(x.item)))
      );
    }
  }, [l, searchTerm]);

  const [sel, setSel] = React.useState<number>();
  React.useEffect(() => {
    setSel(undefined);
  }, [l]);

  const handleSearch = (e: React.ChangeEvent<any>) => {
    const { value } = e.target;
    setSearchTerm(value);
  };

  const handleSelect = (i: number) => {
    setSel(i);
    handleListItemClick && handleListItemClick(l[i].item);
  };

  const renderRow = (props: ListChildComponentProps) => {
    const { index, style } = props;
    return (
      <ListItem
        button
        style={style}
        selected={sel === lst[index].id}
        onClick={(event: any) => handleSelect(lst[index].id)}
      >
        <ListItemText primary={labelExtractor(lst[index].item)} />
      </ListItem>
    );
  };

  return (
    <div className={clsx(classes.root, className)}>
      <div className={classes.leftPanel}>
        <TextField
          fullWidth
          label="Search"
          type="search"
          style={{
            height: SEARCH_BAR_HEIGHT,
          }}
          onChange={handleSearch}
        />
        <FixedSizeList
          height={height - SEARCH_BAR_HEIGHT}
          width={width}
          itemSize={itemSize}
          itemCount={lst.length}
        >
          {renderRow}
        </FixedSizeList>
      </div>
      <div className={classes.rightPanel}>
        {typeof children === "function"
          ? sel
            ? children(l[sel])
            : children()
          : children}
      </div>
    </div>
  );
};

export default ItemSelectorDisp;
