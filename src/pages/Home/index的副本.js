import React, { Fragment, useCallback } from "react";
import classNames from "classnames";
import css from "./index.module.less";
import Activate from "@components/Activate";
import { getQueryString } from "@utils/common";
import { inject, observer } from "mobx-react";
const languageContext = {
  English: {
    recently24WFIL: "Profit In 24hr(WFIL)",
    recently24MMR: "Profit In 24hr(MMR)",

    totalWFILPowerWholeNetwork: "Total WFIL Power",
    totalMMRPowerWholeNetwork: "Total MMR Power",

    pledgeMining: "Pledge Mining Earnrate",
    headTips: "Make computing within reach",
    WFILPrice: "WFIL Price",
    totalPledgeWholeNetwork: "Total Pledge",
    totalPowerWholeNetwork: "Total Power",
    myPledge: "My Pledge WFIL",
    totalIncomeWholeNetwork: "Total Distribution Income",
    MMRPrice: "MMR Price",
    myReceiveMMR: "Received MMR",
    myReceiveWFIL: "Received WFIL",
    surplusMMR: "Pool Surplus MMR",
    grantMMR: "Total distribution MMR",
    grantWFIL: "Total distribution WFIL",
    none: "Not Open",
  },
  TraditionalChinese: {
    recently24WFIL: "近24h綜合收益(WFIL)",
    recently24MMR: "近24h綜合收益(MMR)",
    totalWFILPowerWholeNetwork: "全網WFIL總算力",
    totalMMRPowerWholeNetwork: "全網MMR總算力",

    pledgeMining: "質押挖礦綜合收益率",
    headTips: "讓算力觸手可及",
    WFILPrice: "WFIL價格",
    MMRPrice: "MMR價格",

    totalPledgeWholeNetwork: "全網總質押",
    totalPowerWholeNetwork: "全網總算力",
    myPledge: "我質押的WFIL",
    totalIncomeWholeNetwork: "全網總發放收益",

    myReceiveMMR: "我已領取MMR",
    myReceiveWFIL: "我已領取WFIL",
    surplusMMR: "礦池剩余MMR",
    grantMMR: "全網已發放MMR",
    grantWFIL: "全網已發放WFIL",
    none: "未開放",
  },
  SimplifiedChinese: {
    pledgeMining: "质押挖矿综合收益率",
    headTips: "让算力触手可及",
    WFILPrice: "WFIL价格",
    totalPledgeWholeNetwork: "全网总质押",
    totalPowerWholeNetwork: "全网总算力",
    totalIncomeWholeNetwork: "全网总发放收益",
    myReceiveMMR: "我已领取MMR",
    myReceiveWFIL: "我已领取WFIL",
    surplusMMR: "矿池剩余MMR",

    MMRPrice: "MMR价格",
    grantWFIL: "全网已发放WFIL",
    myPledge: "我质押的WFIL",
    recently24WFIL: "近24h综合收益(WFIL)",
    recently24MMR: "近24h综合收益(MMR)",
    totalWFILPowerWholeNetwork: "全网WFIL总算力",
    totalMMRPowerWholeNetwork: "全网MMR总算力",
    grantMMR: "全网已发放MMR",
    none: "未开放",
  },
};

function Home(props) {
  const [display, setDisplay] = React.useState("none");
  const {
    chain,
    server,
    lang: { selectedLang },
  } = props;
  const closeActivate = useCallback(() => {
    setDisplay("none");
  }, []);

  const language = languageContext[selectedLang.key];

  React.useEffect(() => {
    if (chain.address) {
      chain.queryMMRPageInfo();
      chain.queryAmountReceived();
      chain.queryMMRBalanceAsync();
    }
  }, [chain, chain.address]);

  React.useEffect(() => {
    setTimeout(() => {
      if (!chain.isActive && chain.address) {
        setDisplay("unset");
      } else {
        setDisplay("none");
      }
    }, 1000);
  }, [chain.isActive]);

  React.useEffect(() => {
    const sharer = getQueryString("sharer");
    if (!!sharer) chain.setSharer(sharer);
  }, []);

  function renderCardList(type) {
    const dataSource = {
      top: [
        {
          title: language.totalWFILPowerWholeNetwork,
          total: chain.totalDeposit,
          key: 0,
        },
        {
          title: language.grantWFIL,
          total: chain.totalRewards,
          key: 1,
        },
        {
          title: language.recently24WFIL,
          total: server.earnings_fil,
          key: 2,
        },
        {
          title: language.myPledge,
          total: chain.myDeposit,
          key: 3,
        },
      ],
      bottom: [
        {
          title: language.totalMMRPowerWholeNetwork,
          total: chain.MMRtotalDeposit,
          key: 0,
        },
        {
          title: language.grantMMR,
          total: chain.mmrTotalRewards,
          key: 1,
        },
        {
          title: language.recently24MMR,
          total: server.earnings_mmr,
          key: 2,
        },
        {
          title: language.none,
          total: "0.0000",
          key: 3,
        },
      ],
    };

    return dataSource[type].map((item) => {
      const showBottomLine = ~~(item.key / 2) === 0;
      const right = item.key % 2 === 1;
      return (
        <div
          className={classNames(
            css.item,
            showBottomLine && css.bottomLine,
            right ? css.right : css.rightLine
          )}
          key={item.key}
        >
          {/* <div
            className={css.icon}
            style={{ backgroundImage: `url(${item.icon})` }}
          ></div> */}
          <div className={css.title}>{item.title}</div>
          <div className={css.total}>{item.total}</div>
        </div>
      );
    });
  }
  return (
    <Fragment>
      <div style={{ display: display }}>
        <Activate closeActivate={closeActivate} />
      </div>
      <div
        className={css.home}
        // ref={ref}
        // onTouchEnd={() => {
        //   const { top } = ref.current.getBoundingClientRect();
        //   if (top > (120 / 75) * window.rem * 2.5) {
        //     refresh();
        //   }
        // }}
      >
        {/* <Refresh /> */}
        <div className={css.banner}>
          <div className={css.box}>
            <div className={css.logo}>MMR</div>
            <div className={css.explain}>(MAKE ME RICH)</div>
            <div className={css.tips}>{language.headTips}</div>
            <div className={css.icon}></div>
          </div>
        </div>

        <div className={css.content}>
          <div className={css.top}>
            <div className={css.wiflPrice}>
              <div className={css.icon}></div>
              <div className={css.item}>
                <div className={css.title}>{language.WFILPrice}</div>
                <div className={css.total}>
                  {server.fil_price} <span className={css.symbol}>$</span>
                </div>
              </div>
            </div>
            <div className={css.list}>{renderCardList("top")}</div>
          </div>

          <div className={css.middle}>
            <div className={css.rate}>
              <div className={css.icon}></div>
              <div className={css.item}>
                <div className={css.title}>{language.pledgeMining}</div>
                <div className={css.total}>
                  {server.ratio2} <span className={css.symbol}>%</span>
                </div>
              </div>
            </div>
          </div>
          <div className={css.bottom}>
            <div className={css.MMRPRice}>
              <div className={css.icon}></div>
              <div className={css.item}>
                <div className={css.title}>{language.MMRPrice}</div>
                <div className={css.total}>
                  {server.mmr_price} <span className={css.symbol}>$</span>
                </div>
              </div>
            </div>
            <div className={css.surplusMMR}>
              <div className={css.item}>
                <div className={css.title}>{language.surplusMMR}</div>
                <div className={css.total}>
                  {chain.MMRBalance} <span className={css.symbol}>MMR</span>
                </div>
              </div>
            </div>
            <div className={css.list}>{renderCardList("bottom")}</div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default inject("chain", "server", "lang")(observer(Home));
