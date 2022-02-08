import React, { Fragment, useCallback } from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import GainWindow from "@components/GainWindow";
import { interception } from "@utils/common";
import { Toast } from "antd-mobile";
import { MMRSDAOReward } from "@utils/web3utils_future";

// let count = 0;
function DAOGain(props) {
  const { lang, chain, mmrsGR, server, blackMember } = props;
  const { mmr_price } = server;
  const { selectedLang } = lang;
  const { MMRIncome, MMRTotalIncome } = mmrsGR;
  const [language, setLanguage] = React.useState({});
  const [gainDisplay, setGainDisplay] = React.useState(false);

  React.useEffect(() => {
    let interval = setInterval(() => {
      chain.getCurrentBlock();
      // count++;
      // console.log('count', count);
      if (chain.address && chain.isActive) {
        mmrsGR.requestUpdateIncome();
        mmrsGR.queryUserPowerMMRSBoard();
        mmrsGR.queryMMRSPlanReplaceData();
        server.queryBlockNumber();
      }
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  React.useEffect(() => {
    if (selectedLang.key === "English") {
      setLanguage({
        income: "MMRS Board benefits",
        receive: "receive",
        total: "Accumulated MMR received:",
        fail: "Get the failure",
        none: "No profit",
        blockNumber: "Current Block Number",
        willGain: "Unclaimed",
      });
    } else if (selectedLang.key === "TraditionalChinese") {
      setLanguage({
        income: "MMRS董事會收益",
        receive: "領取",
        total: "累計已領取MMR：",
        fail: "領取失敗",
        none: "暫無收益",
        blockNumber: "當前區塊號",
        willGain: "待領取",
      });
    } else if (selectedLang.key === "SimplifiedChinese") {
      setLanguage({
        income: "MMRS董事会收益",
        receive: "领取",
        total: "累计已领取MMR：",
        fail: "领取失败",
        none: "暂无收益",
        blockNumber: "当前区块号",
        willGain: "待领取",
      });
    }
  }, [selectedLang.key]);
  async function handleGain() {
    if (chain.address) {
      try {
        const DAORewardResult = await MMRSDAOReward();
        if (DAORewardResult) {
          mmrsGR.requestUpdateIncome();
          setGainDisplay(true);
        }
      } catch (error) {
        Toast.fail(language.fail);
      }
    }
  }
  const closeGainWindow = useCallback(() => {
    setGainDisplay(false);
  }, []);
  //待领取MMR收益/累计已领取MMR
  React.useEffect(() => {
    chain.getCurrentBlock();
    if (chain.address && !blackMember) {
      mmrsGR.MMRSIncome();
      mmrsGR.MMRSTotalIncome();
    }
  }, [chain.address, blackMember]);

  function renderWindow() {
    if (gainDisplay) {
      return (
        <div>
          <GainWindow closeGainWindow={closeGainWindow} />
        </div>
      );
    }
  }
  return (
    <Fragment>
      <div className={css.contain}>
        <div className={css.inner}>
          <div className={css.top}>
            <div className={css.topL}>
              <div className={css.title}>{language.income}</div>
              <div className={css.mmrNum}>
                <span className={css.number}>
                  {!blackMember ? MMRIncome : 0}
                </span>
                <span>MMR </span>
              </div>
              <div className={css.dollar}>
                ≈$
                {MMRIncome > 0 ? (MMRIncome * mmr_price).toFixed(6) : 0}
              </div>
            </div>
          </div>
          <div className={css.line}></div>
          <div className={css.bottom}>
            {language.total}
            {MMRTotalIncome}
          </div>
        </div>
        <div
          className={css.button}
          onClick={() => {
            // handleGain();
            if (MMRIncome > 0 && !blackMember) {
              handleGain();
            } else {
              Toast.info(language.none);
            }
          }}
        >
          {language.receive}
        </div>
      </div>
      {renderWindow()}
    </Fragment>
  );
}

export default inject("lang", "chain", "mmrsGR", "server")(observer(DAOGain));
