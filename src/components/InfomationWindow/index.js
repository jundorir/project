import React from "react";
import css from "./index.module.less";
import close from "@assets/images/icon/close.png";
import { inject, observer } from "mobx-react";

const languageContext = {
  English: {
    title: "prompt",
    tipOne:
      "1. When the accumulative reward value of MMRS reaches 5 times of the invested capital, MMRS calculation power returns to zero.",
    tipTwo:
      "2. No new dynamic rewards will be generated when the personal MMRS is less than 100",
    know: "ensure",
  },
  TraditionalChinese: {
    title: "提示",
    tipOne: "1.MMRS累計獎勵價值達到投入資金的5倍後，MMRS算力歸零。",
    tipTwo: "2.當個人MMRS算力不足100，將不會產生新的動態獎勵",
    know: "確定",
  },
  SimplifiedChinese: {
    title: "提示",
    tipOne: `1.MMRS累计奖励价值达到投入资金的5倍后，MMRS算力归零。`,
    tipTwo: `2.当个人MMRS算力不足100，将不会产生新的动态奖励`,
    know: "确定",
  },
};
function InfomationWindow(props) {
  const {
    lang: { selectedLang },
  } = props;
  const language = languageContext[selectedLang.key];
  return (
    <div
      className={css.gainWindow}
      onClick={() => {
        props.closeShowInfomation();
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
          <div className={css.title}>{language.title}</div>
          <img
            onClick={(e) => {
              e.stopPropagation();
              props.closeShowInfomation();
            }}
            className={css.closeImg}
            src={close}
            alt=" "
          />
        </div>
        {/* 内容 */}
        <div className={css.inner}>
          <div className={css.tipOne}>{props.data}</div>
          {/* <div className={css.tipTwo}>{language.tipTwo}</div> */}
          <div
            className={css.button}
            onClick={() => {
              props.toGet();
            }}
          >
            {language.know}
          </div>
        </div>
      </div>
    </div>
  );
}

export default inject("lang")(observer(InfomationWindow));
