import css from "./index.module.less";
import React from "react";
import classNames from "classnames";

function EditWrap(props) {
  const { value, canEdit, isWinNumber = false } = props;
  const [isEdit, setIsEdit] = React.useState(false);

  if (isEdit) {
    return (
      <div className={css.editWrap}>
        <input
          className={css.input}
          value={value}
          autoFocus={true}
          onBlur={() => {
            setIsEdit(false);
            props.checkTicket(value === "");
          }}
          onChange={(e) => {
            let value = "";
            if (e.target.value !== "") {
              value = e.target.value[e.target.value.length - 1].replace(
                /[^\d]/g,
                ""
              );
            }
            props.onChange(value);
          }}
        />
      </div>
    );
  }
  return (
    <div
      className={classNames(css.editWrap, isWinNumber && css.winNumber)}
      onClick={() => {
        if (canEdit) {
          setIsEdit(true);
        }
      }}
    >
      {value}
    </div>
  );
}

export default EditWrap;
