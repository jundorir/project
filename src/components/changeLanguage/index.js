import React from "react";
import css from "./index.module.less";
import close from "@assets/images/icon/close.png";
import { inject, observer } from "mobx-react";
import classNames from "classnames";

function GainWindow(props) {
  const { lang } = props;
  const { tabs, selectedLang } = lang;
  function renderItem() {
    return tabs.map((item) => {
      return (
        <div
          key={item.key}
          className={classNames(
            css.lang,
            item.key === selectedLang.key && css.selected
          )}
          onClick={(e) => {
            e.stopPropagation();
            if (item.key === selectedLang.key) return;
            lang.changeLang(item.key, item[item.key]);
            lang.closeModal();
          }}
        >
          <span className={css.label}>{item[selectedLang.key]}</span>
        </div>
      );
    });
  }
  if (!lang.open) return null;

  return (
    <div
      className={css.langModal}
      onClick={() => {
        lang.closeModal();
      }}
    >
      <div
        className={css.langBox}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={css.list}>{renderItem()}</div>
      </div>
    </div>
  );
}

export default inject("lang")(observer(GainWindow));
