import classNames from "classnames";
import { inject, observer } from "mobx-react";
import css from "./index.module.less";
import React from "react";

function CheckIsWin(props) {
  const {
    lottery,
    lang: { selectedLang },
  } = props;
  const [language, setLanguage] = React.useState({});

  React.useEffect(() => {
    const g_language = {
      English: {
        isWin: "check is win",
        quicklyView: "view",
        collectableBonus: "collectable bonus",
        viewDetail: "View Details",
        noBouns: "No bonus",
        gookLuckNext: "Good luck next time!",
      },
      TraditionalChinese: {
        isWin: "我中獎了嗎",
        quicklyView: "立即查看",
        collectableBonus: "可收集的獎金",
        viewDetail: "查看詳情!",
        noBouns: "沒有可收集的獎金",
        gookLuckNext: "祝你下次好運!",
      },
      SimplifiedChinese: {
        isWin: "我中奖了吗",
        quicklyView: "立即查看",
        collectableBonus: "可收集的奖金",
        viewDetail: "查看详情!",
        noBouns: "没有可收集的奖金",
        gookLuckNext: "祝你下次好运!",
      },
    };

    setLanguage(g_language[selectedLang.key]);
  }, [selectedLang.key]);

  if (lottery.lastPeriodIsWinInfo.isWin === 0) {
    return (
      <div className={css.isWin}>
        <div className={classNames(css.isWinBox, css.unKnow)}>
          <div className={css.tips}>{language.isWin}</div>
          <div
            className={css.check}
            onClick={() => {
              lottery.checkIsWinFromMap(lottery.lastOpenLotteryPeroid);
            }}
          >
            {language.quicklyView}
          </div>
        </div>
      </div>
    );
  }
  if (lottery.lastPeriodIsWinInfo.isWin === 1) {
    console.log(
      "lottery.lastPeriodIsWinInfo.isReceive ===>",
      lottery.lastPeriodIsWinInfo.isReceive
    );
    return (
      <div className={css.isWin}>
        <div className={classNames(css.isWinBox, css.win)}>
          <div className={css.tips}>{language.collectableBonus}</div>
          <div className={css.amount}>
            {lottery.lastPeriodIsWinInfo.isReceive
              ? 0
              : lottery.lastPeriodIsWinInfo.totalWinRewardsMMR}
            MMR
          </div>
          <div
            className={css.detail}
            onClick={() => {
              props.showHistoryModalRecord(lottery.lastOpenLotteryPeroid);
            }}
          >
            {language.viewDetail}
          </div>
        </div>
      </div>
    );
  }
  if (lottery.lastPeriodIsWinInfo.isWin === 2) {
    return (
      <div className={css.isWin}>
        <div className={classNames(css.isWinBox, css.noWin)}>
          <div className={css.icon} />
          <div className={css.tips}>{language.noBouns}</div>
          <div className={css.tips}>{language.gookLuckNext}</div>
        </div>
      </div>
    );
  }
  return null;
}

export default inject("lottery", "lang")(observer(CheckIsWin));
