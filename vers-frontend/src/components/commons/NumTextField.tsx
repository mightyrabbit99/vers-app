import * as React from "react";

enum Mode {
  EDIT,
  VIEW,
}

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
    if (value === val) return;
    setVal(value);
    onEdit && onEdit();
  };

  const [mod, setMod] = React.useState<Mode>(Mode.VIEW);
  const txtRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (mod === Mode.EDIT) txtRef.current?.focus();
  }, [mod]);

  const handleClick = () => {
    setMod(Mode.EDIT);
  };

  const handleBlur = (e: React.ChangeEvent<any>) => {
    setMod(Mode.VIEW);
    let val2 = parseInt(val, 10);
    if (val2 === value) return;
    if (isNaN(val2)) val2 = 0;
    setVal(`${val2}`);
    onChange && onChange(val2);
  };

  return (
    <div className={className}>
      {mod === Mode.VIEW ? (
        <p onClick={handleClick}>{val}</p>
      ) : (
        <input
          ref={txtRef}
          value={val}
          style={{
            width: "100%",
            height: "100%",
            fontSize: 9,
          }}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      )}
    </div>
  );
};

export default NumTextField;
