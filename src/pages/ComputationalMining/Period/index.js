import React from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import PeriodItem from "./PeriodItem";

function Period(props) {
  const {
    chain,
    lang: { selectedLang },
  } = props;
  const [language, setLanguage] = React.useState([]);

  React.useEffect(() => {
    const g_language = {
      English: {
        mining: "Computational Mining",
        round: "Periods",
        progress: "Sale Progress",
        unitPrice: "Price(WFIL/T)",
        product: "Daily Output",
        pledgePercent: "Pledge",
        operation: "operation",
        premiumRate: "Permium",
        day:'mining days'
      },
      TraditionalChinese: {
        mining: "算力挖礦",
        round: "期數",
        progress: "銷售進度",
        unitPrice: "價格(WFIL/T)",
        product: "每天產量",
        pledgePercent: "質押率",
        operation: "操作",
        premiumRate: "溢價率",
        day:'已挖礦天數'
      },
      SimplifiedChinese: {
        mining: "算力挖矿",
        round: "期数",
        progress: "销售进度",
        unitPrice: "价格(WFIL/T)",
        product: "每天产量",
        pledgePercent: "质押率",
        operation: "操作",
        premiumRate: "溢价率",
        day:'已挖矿天数'
      },
    };

    setLanguage(g_language[selectedLang.key]);
  }, [selectedLang.key]);
  function renderPeriodItem() {
    if (!!chain.currentPeriod) {
      return new Array(chain.currentPeriod).fill(0).map((item, index) => {
        const round = chain.currentPeriod - index;
        return <PeriodItem key={round} round={round} first={index === 0} />;
      });
    }
    return null;
  }
  return (
    <div className={css.period}>
      <div className={css.periodBox}>
        {/* <div className={css.title}>{language.mining}</div> */}
        <div className={css.header}>
          <div className={css.currentPeriod}>{language.round}</div>
          <div className={css.saleProgress}>{language.progress}</div>
          <div className={css.publishPrice}>{language.unitPrice}</div>
          <div className={css.productNumber}>{language.product}</div>
          <div className={css.pledgePercent}>{language.pledgePercent}</div>
          <div className={css.day}>{language.day}</div>
          <div className={css.PPR}>PPR</div>
          <div className={css.priceRange}>{language.premiumRate}</div>
          <div className={css.operation}></div>
        </div>
        <div className={css.list}>{renderPeriodItem()}</div>
      </div>
    </div>
  );
}

export default inject("chain", "lang")(observer(Period));
