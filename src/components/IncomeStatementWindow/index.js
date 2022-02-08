import React from "react";
import css from "./index.module.less";
import close from "@assets/images/icon/close.png";
import { inject, observer } from "mobx-react";

const languageContext = {
  English: {
    title: "Income Statement",
    tipOne:
      "1. The system has replaced the remaining MMRS holding computing power for fil computing power according to each address, and settled the income MMR in real time.",
    tipTwo: "2. Revenue of the day before settlement every morning",
    tipThree:
      "The original board of directors of MMRS reserves the right to continue to enjoy the dividends of the board of directors",
    know: "got it",
  },
  TraditionalChinese: {
    title: "收益說明",
    tipOne: `1.系統已根據每個地址剩余MMRS持有算力置換為FIL算力並實時結算收益MMR`,
    tipTwo: `2.每日淩晨結算前一天收益`,
    tipThree: `3.原MMRS董事會算力保留繼續享有董事會分紅`,
    know: "我知道了",
  },
  SimplifiedChinese: {
    title: "收益说明",
    tipOne: `1.系统已根据每个地址剩余MMRS持有算力置换为FIL算力并实时结算收益MMR`,
    tipTwo: `2.每日凌晨结算前一天收益`,
    tipThree: `3.原MMRS董事会算力保留继续享有董事会分红`,
    know: "我知道了",
  },
};
function IncomeStatementWindow(props) {
  const {
    lang: { selectedLang },
  } = props;
  const language = languageContext[selectedLang.key];
  return (
    <div
      className={css.gainWindow}
      onClick={() => {
        props.closeIncomeStatementWindow();
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
              props.closeIncomeStatementWindow();
            }}
            className={css.closeImg}
            src={close}
            alt=" "
          />
        </div>
        {/* 内容 */}
        <div className={css.inner}>
          <div className={css.tipOne}>{language.tipOne}</div>
          <div className={css.tipTwo}>{language.tipTwo}</div>
          <div className={css.tipThree}>{language.tipThree}</div>
          <div
            className={css.button}
            onClick={() => {
              props.closeIncomeStatementWindow();
            }}
          >
            {language.know}
          </div>
        </div>
      </div>
    </div>
  );
}

export default inject("lang")(observer(IncomeStatementWindow));
