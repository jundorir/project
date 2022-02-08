import css from "./index.module.less";
import { inject, observer } from "mobx-react";

const languageContext = {
  English: {
    yourLPTokens: "your LP Tokens",
    capitalPool: "Share of bonus pool:",
  },
  TraditionalChinese: {
    yourLPTokens: "您的LP代幣",
    capitalPool: "資金池中的份額:",
  },
  SimplifiedChinese: {
    yourLPTokens: "您的LP代币",
    capitalPool: "资金池中的份额:",
  },
};
function LPBox(props) {
  const {
    mobility,
    lang: { selectedLang },
  } = props;
  const language = languageContext[selectedLang.key];
  const { AFILSelected, WFILSelected } = mobility;

  return (
    <div className={css.lpBox}>
      <div className={css.title}>{language.yourLPTokens}</div>
      <div className={css.detail}>
        <div className={css.header}>
          <div className={css.title}>
            <div className={css.left}>
              {AFILSelected}/{WFILSelected} LP
            </div>
            <div className={css.right}>
              <div className={css[`icon_${WFILSelected}`]} />
              <div className={css[`icon_${AFILSelected}`]} />
            </div>
          </div>
          <div className={css.alreadyPledge}>
            {mobility.current.quiteLPAmount}
          </div>
        </div>
        <div className={css.line}>
          <div className={css.left}>{language.capitalPool}</div>
          <div className={css.right}>
            {" "}
            {mobility.current.quiteMyPercentInPool}%
          </div>
        </div>
        {/* <div className={css.line}>
          <div className={css.left}>已入池的USDT:</div>
          <div className={css.right}>{mobility.quiteUSDTAmount}</div>
        </div>
        <div className={css.line}>
          <div className={css.left}>已入池的MMR:</div>
          <div className={css.right}>{mobility.quiteMMRAmount}</div>
        </div> */}
      </div>
    </div>
  );
}

export default inject("mobility", "lang")(observer(LPBox));
