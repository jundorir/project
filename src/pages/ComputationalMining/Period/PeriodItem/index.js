import css from "./index.module.less";
import { useHistory } from "react-router-dom";
import { inject, observer } from "mobx-react";
import React from "react";
import classNames from "classnames";

function PeriodItem(props) {
  const {
    round,
    computationalPower,
    lang: { selectedLang },
    server,
    first,
    chain,
  } = props;
  const history = useHistory();
  const [language, setLanguage] = React.useState([]);
  const {
    totalSales = 0,
    TPublishPrice = 0,
    marketPrice,
    TBalanceInShop = 0,
    pledgeTotalPower = 0,
  } = computationalPower.round.get(round) || {};
  const {
    product_day = 0,
    product_hashrate = 0,
    basic_production = 0,
  } = server.productInfo?.get(round) || {};
  const pricePercent =
    TPublishPrice === 0 ? 0 : (marketPrice / TPublishPrice - 1) * 100;
  const pricePercnetSign = Math.sign(pricePercent);
  let PPR_NUMBER = 0;
  if (marketPrice !== 0) {
    PPR_NUMBER = (((basic_production * 540) / marketPrice) * 100).toFixed(2);
  }

  React.useEffect(() => {
    if (selectedLang.key === "English") {
      setLanguage([`Phase ${round}`, "days", "buy"]);
    } else if (selectedLang.key === "TraditionalChinese") {
      setLanguage([`第${round}期`, "天", "購買"]);
    } else if (selectedLang.key === "SimplifiedChinese") {
      setLanguage([`第${round}期`, "天", "购买"]);
    }
  }, [selectedLang.key]);

  React.useEffect(() => {
    if (round !== 0) {
      computationalPower.init(round);
    }
  }, [round]);

  React.useEffect(() => {
    if (!chain.address) return;
    if (totalSales === 0) {
      computationalPower.queryTotalSalesByRound(round);
    }
    if (TPublishPrice === 0) {
      computationalPower.queryTPriceByRound(round);
    }
    computationalPower.queryTBalanceInShop(round);
    computationalPower.queryPledgeTotalPower(round);
  }, [chain.address, computationalPower]);
  let salePercent = 0;
  let pledgeTotalPercent = 0;
  if (totalSales !== 0) {
    salePercent = Math.floor((1 - TBalanceInShop / totalSales) * 100);
    pledgeTotalPercent = ((pledgeTotalPower * 100) / totalSales).toFixed(2);
  }
  return (
    <div
      className={classNames(css.periodItem, first && css.first)}
      key={round}
      onClick={() => {
        computationalPower.viewDetail(round);
        document.getElementById("content").scrollTop = 0;
        history.push(`/miningDetail/${round}`);
      }}
    >
      <div className={css.currentPeriod}>{language[0]}</div>
      <div className={css.saleProgress}>
        <div className={css.bar}>
          <div className={css.cover} style={{ width: `${salePercent}%` }}></div>
        </div>
        <div className={css.number}>{salePercent}%</div>

        {/* {product_day}
        {language[1]} */}
      </div>
      <div className={css.publishPrice}>
        <div className={css.box}>{marketPrice}</div>
      </div>

      <div className={css.productNumber}>
        <div>{product_hashrate}</div>
        <div className={css.symbol}>WFIL/T</div>
      </div>

      <div className={css.pledgePercent}>{pledgeTotalPercent}%</div>
      <div className={css.day}>
        {product_day}
        {language[1]}
      </div>
      <div className={css.PPR}>{PPR_NUMBER}%</div>
      <div
        className={classNames(css.priceRange, {
          [css.up]: pricePercnetSign === 1,
          [css.down]: pricePercnetSign === -1,
        })}
      >
        {pricePercnetSign !== 0 && <div className={css.icon} />}
        <div className={css.percent}>
          {(pricePercent * pricePercnetSign).toFixed(2)}%
        </div>
      </div>
      <div
        className={css.operation}
        onClick={(e) => {
          e.stopPropagation();
          // if (first) {
          //   computationalPower.viewDetail(round);
          //   document.getElementById("content").scrollTop = 0;
          //   history.push(`/forceMining/${round}`);
          // } else {
            document.getElementById("content").scrollTop = 0;
            history.push(`/swap`);
          // }
        }}
      >
        {language[2]}
      </div>
    </div>
  );
}

export default inject(
  "lang",
  "computationalPower",
  "server",
  "chain"
)(observer(PeriodItem));
