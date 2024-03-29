import * as React from "react";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";

import { Employee } from "src/kernel";
import { toRegExp } from "src/utils/tools";

interface IEmpSimpleListStyle {
  height: number;
  width: number;
  itemSize: number;
}

interface IEmpSimpleListProps extends IEmpSimpleListStyle {
  lst: { [id: number]: Employee };
  sel?: Employee;
  searchStr?: string;
  searchStrOnChange?: (str: string) => void;
  handleListItemClick: (i: number) => void;
}

const SEARCH_BAR_HEIGHT = 50;

const EmpSimpleList: React.FC<IEmpSimpleListProps> = (props) => {
  const {
    lst: l,
    sel,
    searchStr: sStr,
    searchStrOnChange,
    handleListItemClick,
    height,
    width,
    itemSize,
  } = props;

  const [searchStr, setSearchStr] = React.useState(sStr ?? "");
  React.useEffect(() => {
    setSearchStr(sStr ?? "");
  }, [sStr]);

  const [lst, setLst] = React.useState<Employee[]>([]);
  React.useEffect(() => {
    if (searchStr === "") {
      setLst(Object.values(l));
    } else {
      const reg = toRegExp(searchStr);
      setLst(Object.values(l).filter(
        (x) => reg.test(x.firstName) || reg.test(x.lastName)
      ));
    }
  }, [l, searchStr]);

  const handleSearch = (e: React.ChangeEvent<any>) => {
    const { value } = e.target;
    searchStrOnChange ? searchStrOnChange(value) : setSearchStr(value);
  };

  const renderRow = (props: ListChildComponentProps) => {
    const { index, style } = props;
    const e = lst[index];
    return (
      <ListItem
        button
        style={style}
        selected={sel && sel.id === e.id}
        onClick={(event: any) => handleListItemClick(e.id)}
      >
        <ListItemText primary={`${e.firstName} ${e.lastName}`} />
      </ListItem>
    );
  };

  return (
    <React.Fragment>
      <TextField
        fullWidth
        label="Search"
        type="search"
        style={{
          height: SEARCH_BAR_HEIGHT,
        }}
        value={searchStr}
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
    </React.Fragment>
  );
};

export default EmpSimpleList;
