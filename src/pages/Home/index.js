import React, { Fragment, useCallback } from "react";
import classNames from "classnames";
import css from "./index.module.less";
import Activate from "@components/Activate";
import { getQueryString } from "@utils/common";
import { inject, observer } from "mobx-react";
import HomeWindowOne from "@components/HomeWindowOne";
// import HomeWindowTwo from "@components/HomeWindowTwo";
import { useHistory } from "react-router-dom";
import arrowR from "@assets/images/icon/arrowR.png";
import { interception } from "@utils/common";

const languageContext = {
  English: {
    headTips: "Make computing within reach",
    networkWideTVL: "Network wide TVL",
    wfilZone: "WFIL zone",
    wfilZoneQuestion: "WFIL pledge allocates 70% of MMR production",
    wfilPledgeTVL: "pledge TVL",
    wfilNetworkWideMMRComputingPower: "MMR calculation force",
    highestYieldOfWfil: "Highest yield",
    dao: "boardroom",
    daoQuestion: "The board pledged to distribute 20% of MMR production",
    comingSoon: "Details",
    lpZone: "LP mining",
    lpZoneQuestion: "Provide MMR liquidity and allocate 10% of MMR production",
    machinery: "Computational Mining",
    comingSoonBig: "Immediately to",
    comingSoonOld: "Coming soon",
    newEcology: "MMR New Ecology",
    subscription: "MMRS mining IEO subscription",
    price: "unit price",
  },
  TraditionalChinese: {
    headTips: "讓算力觸手可及",
    networkWideTVL: "全網TVL",
    wfilZone: "WFIL專區",
    wfilZoneQuestion: "WFIL質押分配MMR產量的70%",
    wfilPledgeTVL: "質押TVL",
    wfilNetworkWideMMRComputingPower: "全網MMR算力",
    highestYieldOfWfil: "最高收益率",
    dao: "董事會",
    daoQuestion: "董事會質押分配MMR產量的20%",
    comingSoon: "查看詳情",
    lpZone: "LP挖礦",
    lpZoneQuestion: "提供MMR流動性分配MMR產量的10%",
    machinery: "算力挖礦",
    comingSoonBig: "立即前往",
    comingSoonOld: "即將上線",
    newEcology: "MMR全新生態",
    subscription: "MMRS挖礦IEO認購",
    price: "單價",
  },
  SimplifiedChinese: {
    headTips: "让算力触手可及",
    networkWideTVL: "全网TVL",
    wfilZone: "WFIL专区",
    wfilZoneQuestion: "WFIL质押分配MMR产量的70%",
    wfilPledgeTVL: "质押TVL",
    wfilNetworkWideMMRComputingPower: "全网MMR算力",
    highestYieldOfWfil: "最高收益率",
    dao: "董事会",
    daoQuestion: "董事会质押分配MMR产量的20%",
    comingSoon: "查看详情",
    lpZone: "LP挖矿",
    lpZoneQuestion: "提供MMR流动性分配MMR产量的10%",
    machinery: "算力挖矿",
    comingSoonBig: "立即前往",
    comingSoonOld: "即将上线",
    newEcology: "MMR全新生态",
    subscription: "MMRS挖矿IEO认购",
    price: "单价",
  },
};

function Home(props) {
  const [display, setDisplay] = React.useState("none");
  const [homeWindowOneDisplay, setHomeWindowOneDisplay] = React.useState(null);
  const history = useHistory();
  // const [homeWindowTwoDisplay, setHomeWindowTwoDisplay] = React.useState(false);
  // const [homeWindowTwoDisplay, setHomeWindowTwoDisplay] = React.useState(null);
  const {
    chain,
    server,
    lang: { selectedLang },
    mobility,
    mmrsGR,
  } = props;
  const closeActivate = useCallback(() => {
    setDisplay("none");
  }, []);

  const language = languageContext[selectedLang.key];

  const WFIL_TVL =
    interception(
      Math.floor(server.fil_price * chain.totalDeposit * 10000) / 10000,
      4
    ) || 0;
  let LP_TVL = 0;
  let LP_APR = 0;
  if (!!server.is_transfer) {
    LP_TVL = server.tvl_lp;
    LP_APR = server.apr_lp;
  }
  let DAO_TVL = server.tvl_director;
  let DAO_APR = server.apr_director;

  let TOTAL_TVL = WFIL_TVL * 1 + LP_TVL * 1 + DAO_TVL * 1;
  TOTAL_TVL = TOTAL_TVL.toFixed(4);

  React.useEffect(() => {
    if (chain.address) {
      chain.queryMMRPageInfo();
      chain.queryAmountReceived();
      chain.queryMMRBalanceAsync();
    }
  }, [chain, chain.address]);

  // React.useEffect(() => {
  //   if (chain.contractAddress?.lppoolAddress) {
  //     mobility.queryAllInfoAsync("U");
  //     mobility.queryTotalLpPower("U");
  //   }
  // }, [mobility, chain.address, chain.contractAddress?.lppoolAddress, server.is_transfer]);

  React.useEffect(() => {
    setTimeout(() => {
      if (
        chain.bindParnet === "0x0000000000000000000000000000000000000000" &&
        chain.address
      ) {
        setDisplay("unset");
      } else {
        setDisplay("none");
      }
    }, 1000);
  }, [chain.address, chain.bindParnet]);

  React.useEffect(() => {
    const sharer = getQueryString("sharer");
    if (!!sharer) chain.setSharer(sharer);
  }, []);

  // console.log("mmr_price------->", server.mmr_price);
  // console.log("mmrs_price------->", mmrsGR.mmrs_price);
  return (
    <Fragment>
      <div style={{ display: display }}>
        <Activate closeActivate={closeActivate} />
      </div>
      <HomeWindowOne
        tips={homeWindowOneDisplay}
        closeModal={() => {
          setHomeWindowOneDisplay(null);
        }}
      />
      {/* <HomeWindowTwo
        show={homeWindowTwoDisplay}
        closeModal={() => {
          setHomeWindowTwoDisplay(false);
        }}
      /> */}
      {/* <HomeWindowTwo
        tips={homeWindowTwoDisplay}
        closeModal={setHomeWindowOneDisplay(null)}
      /> */}
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
            <div className={css.logoRight}>
              <div className={css.explain}>
                <div>MAKE</div>
                <div>ME</div>
                <div>RICH</div>
              </div>
              <div className={css.tips}>{language.headTips}</div>
            </div>
            {/* <div className={css.icon}></div> */}
          </div>
        </div>

        <div className={css.content}>
          <div className={css.totalTVL}>
            <div className={css.title}>{language.networkWideTVL}</div>
            <div className={css.total}>
              <span className={css.symbol}>$ </span>
              {TOTAL_TVL}
            </div>
            {/* <div className={css.divice}></div> */}
            <div className={css.theBottom}>
              <div className={css.left}>
                <div className={css.thisTitle}>MMR{language.price}</div>
                <div className={css.thisData}>
                  <span className={css.unit}>$</span>
                  <span className={css.num}>{server.mmr_price}</span>
                </div>
              </div>
              {/* <div className={css.right}>
                <div className={css.thisTitle}>MMRS{language.price}</div>
                <div className={css.thisData}>
                  <span className={css.unit}>$</span>
                  <span className={css.num}>{mmrsGR.mmrs_price}</span>
                </div>
              </div> */}
            </div>
          </div>
          <div
            className={css.forceMining}
            onClick={() => {
              document.getElementById("content").scrollTop = 0;
              history.push("/computationalMining");
            }}
          >
            <div className={css.title}>
              <div className={css.head}>{language.machinery}</div>
            </div>
            <div className={css.go}>GO</div>
          </div>
          <div className={css.top}>
            <div className={classNames(css.line, css.one)}>
              <div className={css.icon}></div>
              <div className={css.item}>
                <div className={css.title}>
                  <div className={css.text}>{language.wfilZone}</div>
                  <div
                    className={css.q}
                    onClick={() => {
                      setHomeWindowOneDisplay(language.wfilZoneQuestion);
                    }}
                  />
                </div>
                <div className={css.special}>
                  <div className={css.hotContent}>
                    <div className={css.hotIcon}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className={css.line}>
              <div className={css.item}>
                <div className={css.title}>{language.wfilPledgeTVL}</div>
                <div className={css.total}>${WFIL_TVL}</div>
              </div>
            </div>
            <div className={css.line}>
              <div className={css.item}>
                <div className={css.title}>
                  {language.wfilNetworkWideMMRComputingPower}
                </div>
                <div className={css.total}>{chain.MMRtotalDeposit}</div>
              </div>
            </div>
            <div className={classNames(css.line, css.noBorderBottom)}>
              <div className={css.item}>
                <div className={css.title}>
                  {language.highestYieldOfWfil}(APR)
                </div>
                <div className={css.total}>
                  {/* <span
                    className={css.q}
                    onClick={() => {
                      setHomeWindowTwoDisplay(true);
                    }}
                  ></span> */}
                  {/* {server.ratio}% */}
                  {(
                    parseInt(
                      ((server.ratio_mmr - 0) * 3 + (server.ratio_fil - 0)) *
                        10000
                    ) / 10000
                  ).toFixed(4)}
                  &nbsp;&nbsp;%
                </div>
              </div>
            </div>
          </div>

          <div className={css.middle}>
            <div className={classNames(css.line, css.one)}>
              <div className={css.icon}></div>
              <div className={css.item}>
                <div className={css.title}>
                  <div className={css.text}>{language.dao}</div>
                  <div
                    className={css.q}
                    onClick={() => {
                      setHomeWindowOneDisplay(language.daoQuestion);
                    }}
                  ></div>
                </div>
                <div className={css.special}>
                  <div
                    className={css.comingSoon}
                    onClick={() => {
                      history.push("/boardroom");
                    }}
                  >
                    <div className={css.text}>{language.comingSoon}</div>
                    <div className={css.arrowIcon}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className={css.list}>{/* {renderCardList('middle')} */}</div>
            <div className={css.data}>
              <div>{language.dao}TVL </div>
              <div className={css.right}>${DAO_TVL}</div>
            </div>
            <div className={css.dataline}></div>
            <div className={css.data}>
              <div>{language.dao}APR </div>
              <div className={css.right}>{DAO_APR}%</div>
            </div>
          </div>
          <div className={css.bottom}>
            <div className={classNames(css.line, css.one)}>
              <div className={css.icon}></div>
              <div className={css.item}>
                <div className={css.title}>
                  <div className={css.text}>{language.lpZone}</div>
                  <div
                    className={css.q}
                    onClick={() => {
                      setHomeWindowOneDisplay(language.lpZoneQuestion);
                    }}
                  ></div>
                </div>
                <div className={css.special}>
                  <div
                    className={css.comingSoon}
                    onClick={() => {
                      if (!!server.is_transfer) {
                        history.push("/mobilityMining");
                      }
                    }}
                  >
                    <div className={css.text}>
                      {!!server.is_transfer
                        ? language.comingSoon
                        : language.comingSoonOld}
                    </div>
                    <div className={css.arrowIcon}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className={css.list}>{renderCardList('bottom')}</div> */}
            <div className={css.data}>
              <div>LP TVL </div>
              <div className={css.right}>${LP_TVL}</div>
            </div>
            <div className={css.dataline}></div>
            <div className={css.data}>
              <div>LP APR </div>
              <div className={css.right}>{LP_APR}%</div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default inject(
  "chain",
  "server",
  "lang",
  "mobility",
  "mmrsGR"
)(observer(Home));
