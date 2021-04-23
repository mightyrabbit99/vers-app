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
  handleListItemClick: (i: number) => void;
}

const SEARCH_BAR_HEIGHT = 50;

const EmpSimpleList: React.FunctionComponent<IEmpSimpleListProps> = (props) => {
  const { lst: l, sel, handleListItemClick, height, width, itemSize } = props;

  const [lst, setLst] = React.useState<Employee[]>([]);
  React.useEffect(() => {
    setLst(Object.values(l));
  }, [l]);

  const handleSearch = (e: React.ChangeEvent<any>) => {
    const { value } = e.target;
    const reg = toRegExp(value);
    setLst(
      Object.values(l).filter(
        (x) => reg.test(x.firstName) || reg.test(x.lastName)
      )
    );
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
