import React from "react";
import css from "./index.module.less";
import WFIL from "@assets/images/icon/backup.png";
import { inject, observer } from "mobx-react";
import { getCurPerUintReward } from "@utils/web3utils_future";

function TopInfo(props) {
  const { lang, server, chain } = props;
  const { selectedLang } = lang;
  const [language, setLanguage] = React.useState([]);
  const [reward, setReward] = React.useState(0);
  React.useEffect(() => {
    if (chain.address) {
      chain.requestChainData();
    }
  }, [chain.address]);


  React.useEffect(() => {
    if (selectedLang.key === "English") {
      setLanguage([
        "GAIN",
        "highest yield",
        "Total pledge",
        "Each block award",
      ]);
    } else if (selectedLang.key === "TraditionalChinese") {
      setLanguage(["收獲", "最高收益率", "全網質押量", "每塊區塊獎勵"]);
    } else if (selectedLang.key === "SimplifiedChinese") {
      setLanguage(["收获", "最高收益率", "全网质押量", "每块区块奖励"]);
    }
  }, [selectedLang.key]);
  React.useEffect(() => {
    async function requestCurPerUintReward() {
      if(chain.address){
        try {
          const result = await getCurPerUintReward();
          // console.log('result', result)
          setReward(result);
        } catch {}
      }
    }
    requestCurPerUintReward();
  }, []);
  return (
    <>
      <div className={css.one}>
        <div className={css.lefttitle}>
          <img src={WFIL} className={css.circle} alt="" />
          <span className={css.WFIL}>WFIL</span>
        </div>
        <div className={css.righttitle}>{language[0]}&nbsp;&nbsp;WFIL、MMR</div>
      </div>
      <div className={css.line}></div>
      <div className={css.bottom}>
        <div className={css.bottomInner}>
          <div className={css.two}>
            <div className={css.topleft}>{language[1]}（APR）</div>
            <div className={css.topright}>
              {(
                parseInt(
                  ((server.ratio_mmr - 0) * 3 + (server.ratio_fil - 0)) * 10000
                ) / 10000
              ).toFixed(4)}
              &nbsp;&nbsp;%
            </div>
          </div>
          <div className={css.line}></div>
          <div className={css.three}>
            <div className={css.topleft}>{language[2]}</div>
            <div className={css.topright}>{chain.totalDeposit} WFIL</div>
          </div>
          {/* <div className={css.four}>
            <div className={css.topleft}>{language[3]}</div>
            <div className={css.topright}>{reward ? reward : 0} WFIL</div>
          </div> */}
        </div>
      </div>
    </>
  );
}

export default inject("lang", "server", "chain")(observer(TopInfo));
