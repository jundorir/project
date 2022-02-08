import React from "react";
import css from "./index.module.less";
import close from "@assets/images/icon/close.png";
import question from "@assets/images/home/question.png";
import { inject, observer } from "mobx-react";
import classNames from "classnames";

function DetailWindow(props) {
  const { lang } = props;
  const { selectedLang } = lang;
  const [language, setLanguage] = React.useState({});
  React.useEffect(() => {
    if (selectedLang.key === "English") {
      setLanguage({
        lock_details: "Lock details",
        lock_quantity: "Lock quantity",
        unlock_time: "Unlock time",
        state: "State",
        unlocked: "Unlocked",
        lock: "Lock",
      });
    } else if (selectedLang.key === "TraditionalChinese") {
      setLanguage({
        lock_details: "鎖倉明細",
        lock_quantity: "鎖倉數量",
        unlock_time: "解鎖時間",
        state: "狀態",
        unlocked: "已解鎖",
        lock: "未解鎖",
      });
    } else if (selectedLang.key === "SimplifiedChinese") {
      setLanguage({
        lock_details: "锁仓明细",
        lock_quantity: "锁仓数量",
        unlock_time: "解锁时间",
        state: "状态",
        unlocked: "已解锁",
        lock: "未解锁",
      });
    }
  }, [selectedLang.key]);
  function renderItem() {
    return [1, 2, 3, 4, 5,6,7,8].map((item, index) => {
      return (
        <div className={css.item} key={index}>
          <div className={css.left}>5000 MMRS</div>
          <div className={css.middle}>2022/03/20</div>
          <div className={classNames(css.right, css.red)}>未解锁</div>
        </div>
      );
    });
  }
  return (
    <div
      className={css.gainWindow}
      onClick={() => {
        props.closeModal();
      }}
    >
      <div
        className={css.gainBox}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={css.top}>
          <div className={css.title}>{language.lock_details}</div>
          <img
            onClick={(e) => {
              e.stopPropagation();
              props.closeModal();
            }}
            className={css.closeImg}
            src={close}
            alt=" "
          />
        </div>
        <div className={css.bar}>
          <div className={css.barname}>{language.lock_quantity}</div>
          <div className={css.barname}>{language.unlock_time}</div>
          <div className={css.barname}>{language.state}</div>
        </div>
        <div className={css.bottom}>{renderItem()}</div>
      </div>
    </div>
  );
}

export default inject("lang")(observer(DetailWindow));
