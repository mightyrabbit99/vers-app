import * as React from "react";
import TextField from "@material-ui/core/TextField";

interface INumTextFieldProps {
  className?: any;
  value?: number | "";
  onEdit?: () => void;
  onChange?: (val: number) => void;
}

const NumTextField: React.FunctionComponent<INumTextFieldProps> = (props) => {
  const { value = 0, onChange, onEdit, className } = props;
  const [val, setVal] = React.useState<string>(value === "" ? "0" : `${value}`);
  React.useEffect(() => {
    setVal(value === "" ? "0" : `${value}`);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<any>) => {
    let { value } = e.target;
    if (value !== "" && !/^([0-9]*[.])?[0-9]*$/.test(value)) return;
    setVal(value);
    onEdit && onEdit();
  };

  const handleRealChange = (e: React.ChangeEvent<any>) => {
    let value = parseInt(val, 10);
    if (isNaN(value)) value = 0;
    setVal(`${value}`);
    onChange && onChange(value);
  };

  return (
    <TextField
      className={className}
      value={val}
      onChange={handleChange}
      onBlur={handleRealChange}
    />
  );
};

export default NumTextField;
