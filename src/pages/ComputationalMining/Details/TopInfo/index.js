import React from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import { useHistory } from "react-router-dom";

function TopInfo(props) {
  const { lang, computationalPower, round, server } = props;
  const history = useHistory();

  const { selectedLang } = lang;
  const [language, setLanguage] = React.useState([]);
  const {
    product_day = 0,
    product_hashrate = 0,
    blockProductEth = 0,
    basic_production,
  } = server.productInfo?.get(round) || {};
  const {
    totalSales = 0,
    TPublishPrice = 0,
    marketPrice,
  } = computationalPower.round.get(round) || {};

  let PPR_NUMBER = 0;
  if (marketPrice !== 0) {
    PPR_NUMBER = (((basic_production * 540) / marketPrice) * 100).toFixed(2);
  }

  const { release_lock = 0 } = server.OrdinaryT[round] || {};
  React.useEffect(() => {
    const g_language = {
      English: {
        productImage: "Product Picture",
        total: "Total Issuance",
        unitPrice: "Issue Unit Price",
        day: "Output Days",
        product: "Daily output per T",
        totalProduct: "Total output per T",
        more: "more",
        market: "market price",
        lock: "Linear lock per T",
        pledge: "pledge ",
        price: "price",
        buy: "Buy ",
        unitday: " day",
      },
      TraditionalChinese: {
        productImage: "產品圖片",
        total: "發行總量",
        unitPrice: "發行單價",
        day: "已挖礦天數",
        product: "每T每天產量",
        totalProduct: "每T歷史總產量",
        more: "更多詳情",
        lock: "每T線性鎖倉",
        market: "市場價格",
        pledge: "質押",
        price: "價格",
        buy: "購買",
        unitday: "天",
      },
      SimplifiedChinese: {
        productImage: "产品图片",
        total: "发行总量",
        unitPrice: "发行单价",
        day: "已挖矿天数",
        product: "每T每天产量",
        totalProduct: "每T历史总产量",
        lock: "每T线性锁仓",
        more: "更多详情",
        market: "市场价格",
        pledge: "质押",
        price: "价格",
        buy: "购买",
        unitday: "天",
      },
    };

    setLanguage(g_language[selectedLang.key]);
  }, [selectedLang.key]);
  React.useEffect(() => {
    if (totalSales === 0) {
      computationalPower.queryTotalSalesByRound(round);
    }
    if (TPublishPrice === 0) {
      computationalPower.queryTPriceByRound(round);
    }
  }, []);

  return (
    <div className={css.topInfo}>
      <div className={css.phase}>
        {/* <div className={css.machine}>
          <div className={css.alt}>{language.productImage}</div>
          <div className={css.englishAlt}>PRODUCT</div>
        </div> */}
        <div className={css.title}>
          <div>{language.pledge}TOKEN</div>
          <div className={css.right}>T/WFIL</div>
        </div>

        <div className={css.list}>
          <div className={css.item}>
            <div className={css.left}>{language.total}</div>
            <div className={css.right}>{totalSales}T</div>
          </div>
          <div className={css.item}>
            <div className={css.left}>{language.day}</div>
            <div className={css.right}>
              {product_day}
              {language.unitday}
            </div>
          </div>
          {/* <div className={css.item}>
            <div className={css.left}>{language.unitPrice}</div>
            <div className={css.right}>{TPublishPrice}WFIL/T</div>
          </div> */}
          {/* <div className={css.item}>
            <div className={css.left}>{language.market}</div>
            <div className={css.right}>{`${marketPrice} WFIL`}</div>
          </div> */}
          <div className={css.item}>
            <div className={css.left}>{language.lock}</div>
            <div className={css.right}>{release_lock} WFIL</div>
          </div>
          <div className={css.item}>
            <div className={css.left}>PPR</div>
            <div className={css.right}>{PPR_NUMBER}%</div>
          </div>
          <div className={css.item}>
            <div className={css.left}>{language.product}</div>
            <div className={css.right}>{product_hashrate} WFIL</div>
          </div>

          <div className={css.item}>
            <div className={css.left}>{language.totalProduct}</div>
            <div className={css.right}>{blockProductEth} WFIL</div>
          </div>
        </div>
        <div className={css.buy}>
          <div className={css.left}>
            <div className={css.tips}>{language.price}(T)</div>
            <div className={css.number}>{marketPrice} WFIL</div>
          </div>
          <div
            className={css.right}
            onClick={() => {
              history.push(`/forceMining/${round}`);
            }}
          >
            {language.buy}T
          </div>
        </div>
      </div>
    </div>
  );
}

export default inject(
  "lang",
  "server",
  "computationalPower"
)(observer(TopInfo));
