import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Employee } from "src/kernel";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { FixedSizeList, ListChildComponentProps } from "react-window";

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

const EmpSimpleList: React.FunctionComponent<IEmpSimpleListProps> = (props) => {
  const { lst: l, sel, handleListItemClick, height, width, itemSize } = props;

  const [lst, setLst] = React.useState<Employee[]>([]);
  React.useEffect(() => {
    setLst(Object.values(l));
  }, [l]);

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
    <FixedSizeList
      height={height}
      width={width}
      itemSize={itemSize}
      itemCount={lst.length}
    >
      {renderRow}
    </FixedSizeList>
  );
};

export default EmpSimpleList;
