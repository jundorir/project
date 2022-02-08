import React from "react";
import css from "./index.module.less";
import close from "@assets/images/icon/close.png";
import question from "@assets/images/home/question.png";
import { inject, observer } from "mobx-react";

function HomeWindowOne(props) {
  // console.log("props", props);
  if (props?.tips === null) return null;

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
        {/* 关闭按钮 */}
        <div className={css.closeImgBox}>
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
        {/* 图 */}
        <div className={css.logImg}>
          <img src={question} alt="" className={css.img} />
        </div>
        {/* 标题 */}
        <div className={css.title}>{props.tips}</div>
      </div>
    </div>
  );
}

export default HomeWindowOne;
