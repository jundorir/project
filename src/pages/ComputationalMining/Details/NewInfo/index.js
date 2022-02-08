import React from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import classNames from "classnames";
import { quiteAddress } from "@utils/common";
import { Toast } from "antd-mobile";
import { useHistory } from "react-router-dom";
const languageContext = {
  English: {
    copy: "copy",
    copySuccess: "copy success",
    copyFail: "copy fail",
    name: "name",
    mining: "computational mining",
    period: "period",
    query: "nodes in the query",
    check: "check",
    total: "total circulation",
    marketPrice: "market price",
    price: "Price",
    buy: "buy",
    address: "contract address",
    progress: "sales progress",
    pledgePercent: "pledge percentage",
    product: "Daily output per T",
    totalProduct: "Total output per T",
    productDay: 'mining days',
    day: 'day'
  },
  TraditionalChinese: {
    copy: "copy",
    copySuccess: "復製成功",
    copyFail: "復製失敗",
    name: "名稱",
    mining: "算力挖礦",
    period: "期",
    query: "節點查詢",
    check: "算力節點查看",
    total: "發行總量",
    marketPrice: "市場單價",
    price: "價格",
    buy: "購買",
    address: "合約地址",
    progress: "銷售進度",
    pledgePercent: "質押率",
    product: "每T每天產量",
    totalProduct: "每T歷史總產量",
    productDay: '已挖礦天數',
    day: '天'

  },
  SimplifiedChinese: {
    copy: "copy",
    copySuccess: "复制成功",
    copyFail: "复制失败",
    name: "名称",
    mining: "算力挖矿",
    period: "期",
    query: "节点查询",
    check: "算力节点查看",
    total: "发行总量",
    marketPrice: "市场单价",
    price: "价格",
    buy: "购买",
    address: "合约地址",
    progress: "销售进度",
    pledgePercent: "质押率",
    product: "每T每天产量",
    totalProduct: "每T历史总产量",
    productDay: '已挖矿天数',
    day: '天'

  },
};
function NewInfo(props) {
  const {
    round,
    computationalPower,
    chain,
    server,
    lang: { selectedLang },
  } = props;
  const history = useHistory();
  const language = languageContext[selectedLang.key];
  const {
    totalSales = 0,
    TPublishPrice = 0,
    marketPrice,
    TBalanceInShop = 0,
    pledgeTotalPower = 0,
  } = computationalPower.round.get(round) || {};
  const {
    product_hashrate = 0,
    blockProductEth = 0,
    basic_production,
    product_day = 0,
  } = server.productInfo?.get(round) || {};

  let salePercent = 0;
  let pledgeTotalPercent = 0;
  if (totalSales !== 0) {
    salePercent = Math.floor((1 - TBalanceInShop / totalSales) * 100);
    pledgeTotalPercent = ((pledgeTotalPower * 100) / totalSales).toFixed(2);
  }

  let PPR_NUMBER = 0;
  if (marketPrice !== 0) {
    PPR_NUMBER = (((basic_production * 540) / marketPrice) * 100).toFixed(2);
  }

  function copy() {
    if (chain.address !== "") {
      var tag = document.createElement("input");
      tag.setAttribute("id", "cp_hgz_input");
      tag.value = chain.contractAddress[`T${round}Address`];
      document.getElementsByTagName("body")[0].appendChild(tag);
      document.getElementById("cp_hgz_input").select();
      document.execCommand("copy");
      document.getElementById("cp_hgz_input").remove();
      Toast.success(language.copySuccess);
    } else {
      Toast.fail(language.copyFail);
    }
  }
  return (
    <div className={css.newInfo}>
      <div className={css.list}>
        <div className={classNames(css.item, css.first)}>
          <div className={css.left}>{language.name}</div>
          <div className={css.right}>
            {/* {languageContext[selectedLang.key].mining}
            {round.toString().padStart(3, 0)} */}
            {selectedLang.key === "English"
              ? "Phase " + round.toString().padStart(3, 0)
              : round.toString().padStart(3, 0) + language.period}
          </div>
        </div>
        <div className={css.item}>
          <div className={css.left}>{language.query}</div>
          <div
            className={css.right}
            onClick={() => {
              window.open("https://filfox.info/zh/address/f021479", "_blank");
            }}
          >
            {language.check}
          </div>
        </div>
        {/* <div className={css.item}>
          <div className={css.left}>开始挖矿时间</div>
          <div className={css.right}>2021-12-24 14:00</div>
        </div> */}
        <div className={css.item}>
          <div className={css.left}>{language.total}</div>
          <div className={css.right}>{totalSales}T</div>
        </div>
        <div className={css.item}>
          <div className={css.left}>{language.marketPrice}</div>
          <div className={css.right}>{marketPrice} WFIL/T</div>
        </div>

        <div className={css.item}>
          <div className={css.left}>PPR</div>
          <div className={css.right}>{PPR_NUMBER}%</div>
        </div>
        <div className={css.item}>
          <div className={css.left}>{language.productDay}</div>
          <div className={css.right}>
            {product_day}
            {language.day}
          </div>
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
      <div className={css.price}>
        <div className={css.top}>
          <div className={css.tips}>T {language.price}（WFIL）</div>
          <div className={css.number}>{marketPrice}</div>
          <div
            className={css.button}
            onClick={() => {
              history.push(`/forceMining/${round}`);
            }}
          >
            {language.buy}
          </div>
          <div className={css.saleProgress}>
            <div className={css.bar}>
              <div
                className={css.cover}
                style={{ width: `${salePercent}%` }}
              ></div>
            </div>
            <div className={css.percent}>
              {language.progress}: {salePercent}%
            </div>

            {/* {product_day}
        {language[1]} */}
          </div>
        </div>
        <div className={css.bottom}>
          <div>
            {language.address}:{" "}
            {quiteAddress(chain.contractAddress[`T${round}Address`])}
          </div>
          <div className={css.copy} onClick={copy}></div>
        </div>
      </div>
    </div>
  );
}

export default inject(
  "lang",
  "server",
  "chain",
  "computationalPower"
)(observer(NewInfo));
