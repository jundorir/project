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
        props.closeShowWindow();
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
              props.closeShowWindow();
            }}
            className={css.closeImg}
            src={close}
            alt=" "
          />
        </div>
        <div>
          <div className={css.title}>MMRS算力生效规则</div>
          <div className={css.line}>
            1. 在2021-11-12 23:59:59之前购买获得的算力于2021-11-23
            00:00:00生效；
          </div>
          <div className={css.line}>
            2. 在2021-11-13 00:00:00至2021-11-16
            23:59:59之间购买获得的算力于2021-11-24 00:00:00生效；
          </div>
          <div className={css.line}>
            3. 在2021-11-17 00:00:00至2021-11-22 23:59:59
            之间购买获得的算力于2021-11-25 00:00:00生效；
          </div>
          <div className={css.line}>
            4. 在2021-11-23 00:00:00之后购买获得的算力48小时内生效。
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeWindowOne;
