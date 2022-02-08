import classNames from "classnames";
import { inject, observer } from "mobx-react";
import css from "./index.module.less";
import React from "react";
import langActive from "@assets/images/menu/lang_active.png";
import langIcon from "@assets/images/menu/lang.png";

function LangChange(props) {
  const { lang } = props;
  const { selectedLang } = lang;

  let label = {
    English: "language",
    TraditionalChinese: "語言",
    SimplifiedChinese: "语言",
  };

  return (
    <div
      className={classNames(css.lang)}
      onClick={(e) => {
        // setShow(!show);
        lang.openModal();
        e.stopPropagation();
      }}
    >
      <span className={css.right}>
        {`${label[selectedLang.key]}： ${selectedLang.value}`}
        <span className={css.arrow}></span>
      </span>
    </div>
  );
}

export default inject("lang")(observer(LangChange));
