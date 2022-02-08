import css from "./index.module.less";
import classNames from "classnames";
import React from "react";
import { inject, observer } from "mobx-react";
function RewardList(props) {
  const {
    lottery,
    period,
    server,
    lang: { selectedLang },
  } = props;
  const [showDetail, setShowDetail] = React.useState(false);
  const [language, setLanguage] = React.useState({});
  const {
    rewardsBreakdown = [0, 0, 0, 0, 0, 0],
    amountCollectedInCakeSymbol = 0,
    burnFee = 0,
  } = lottery.lotteryPeriod?.get(period) ?? {};
  const destroyMMR = ((burnFee * amountCollectedInCakeSymbol) / 10000).toFixed(
    6
  );
  const destroyMMRPrice = (destroyMMR * server.mmr_price).toFixed(6);

  React.useEffect(() => {
    const g_language = {
      English: {
        tips: "Hit the winning numbers in the same order to win the bonus share. Current winnable bonus:",
        destory: "destory",
        close: "close",
        open: "detail",
        hit: "hit first ",
        bits: " bits",
      },
      TraditionalChinese: {
        tips: "以相同的順序命中中獎號碼以贏取獎金份額。當前可贏取獎金：",
        destory: "焚毀",
        close: "收起",
        open: "詳情",
        hit: "命中前",
        bits: "位",
      },
      SimplifiedChinese: {
        tips: "以相同的顺序命中中奖号码以赢取奖金份额。当前可赢取奖金：",
        destory: "焚毁",
        close: "收起",
        open: "详情",
        hit: "命中前",
        bits: "位",
      },
    };

    setLanguage(g_language[selectedLang.key]);
  }, [selectedLang.key]);

  function renderList() {
    const rewardsBreakdownMMR = rewardsBreakdown.map((item) =>
      ((item * amountCollectedInCakeSymbol) / 10000).toFixed(6)
    );
    const rewardsBreakdownPrice = rewardsBreakdownMMR.map((item) =>
      (item * server.mmr_price).toFixed(6)
    );

    return rewardsBreakdownMMR.map((item, index) => (
      <div className={css.item} key={`${item}_${index}`}>
        <div className={css.condition}>
          {language.hit}
          {index + 1}
          {language.bits}
        </div>
        <div className={css.reward}>{item} MMR</div>
        <div className={css.price}>{`≈$${rewardsBreakdownPrice[index]}`}</div>
      </div>
    ));
  }

  return (
    <>
      <div className={classNames(css.detailBox, showDetail && css.show)}>
        <div className={css.list}>
          <div className={css.tips}>{language.tips}</div>
          {renderList()}
          <div className={css.destory}>
            <div className={css.condition}>{language.destory}</div>
            <div className={css.reward}>{destroyMMR} MMR</div>
            <div className={css.price}>{`≈$${destroyMMRPrice}`}</div>
          </div>
        </div>
      </div>
      <div
        className={classNames(css.detail, showDetail && css.show)}
        onClick={() => {
          setShowDetail(!showDetail);
        }}
      >
        {showDetail ? language.close : language.open}
        <div className={css.arrow}></div>
      </div>
    </>
  );
}

export default inject("lottery", "server", "lang")(observer(RewardList));
