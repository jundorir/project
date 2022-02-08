import React from "react";
import css from "./index.module.less";
import { useHistory } from "react-router-dom";
import { inject, observer } from "mobx-react";
import Goback from "@assets/images/icon/goback.png";

function Header(props) {
  const history = useHistory();
  const { lang, title, type, computationalPower } = props;
  const { view } = computationalPower;
  const { selectedLang } = lang;

  function renderTitle() {
    if (type === "period") {
      if (view === 0) {
        history.push("/home");
        return null;
      } else {
        if (typeof title[selectedLang.key] === "function")
          return title[selectedLang.key](view);
      }
    }
    return title[selectedLang.key];
  }

  return (
    <div className={css.header}>
      <div
        className={css.left}
        onClick={() => {
          history.goBack();
        }}
      >
        <img className={css.goback} src={Goback} alt="⬅" />
      </div>
      <div className={css.right}>
        <div className={css.title}>{renderTitle()}</div>
      </div>
    </div>
  );
}

export default inject("lang", "computationalPower")(observer(Header));
