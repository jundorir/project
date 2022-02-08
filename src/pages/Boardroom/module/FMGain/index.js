import css from "./index.module.less";
import React, { Fragment } from "react";
import { inject, observer } from "mobx-react";
import { Toast } from "antd-mobile";
import { quiteAddress } from "@utils/common";
import InfomationWindow from "@components/InfomationWindow"; //弹窗
function FMGain(props) {
  // FM领取
  const {
    server,
    chain,
    computationalPower,
    lang: { selectedLang },
  } = props;

  const [language, setLanguage] = React.useState({});
  const [showInfomation, setShowInfomation] = React.useState(false);
  const [infomation, setInfomation] = React.useState("");

  React.useEffect(() => {
    if (selectedLang.key === "English") {
      setLanguage({
        receive: "receive",
        canGet: "Can receive FM",
        success: "success",
        fail: "failed",
        copySuccess: "copy success",
        copyFail: "copy fail",
        address: "contract address",
      });
    } else if (selectedLang.key === "TraditionalChinese") {
      setLanguage({
        receive: "領取",
        canGet: "可領取FM",
        success: "領取成功",
        fail: "領取失敗",
        copySuccess: "復製成功",
        copyFail: "復製失敗",
        address: "合約地址",
      });
    } else if (selectedLang.key === "SimplifiedChinese") {
      setLanguage({
        receive: "领取",
        canGet: "可领取FM",
        success: "领取成功",
        fail: "领取失败",
        copySuccess: "复制成功",
        copyFail: "复制失败",
        address: "合约地址",
      });
    }
  }, [selectedLang.key]);

  React.useEffect(() => {
    if (chain.address) {
      server.getFMData(chain.address);
    }
  }, [chain.address]);

  // FM领取
  async function handleGet() {
    const result = await server.getFMAward(chain.address);
    if (result) {
      console.log("result", result);
      const { userAddress, usdtHex, mmrsHex, idx, sign, isRepeat } = result;
      if (isRepeat - 0 === 1) {
        setShowInfomation(true);
        setInfomation(result);
      } else if (isRepeat - 0 === 0) {
        const rewardResult = await computationalPower.rewardFM(
          userAddress,
          usdtHex,
          mmrsHex,
          idx,
          sign
        );
        if (rewardResult) {
          Toast.success(language.success);
          server.getFMData(chain.address);
        } else {
          Toast.fail(language.fail);
        }
      }
    }
  }

  function copy() {
    if (chain.address !== "") {
      var tag = document.createElement("input");
      tag.setAttribute("id", "cp_hgz_input");
      tag.value = chain.contractAddress?.fmttoken;
      document.getElementsByTagName("body")[0].appendChild(tag);
      document.getElementById("cp_hgz_input").select();
      document.execCommand("copy");
      document.getElementById("cp_hgz_input").remove();
      Toast.success(language.copySuccess);
    } else {
      Toast.fail(language.copyFail);
    }
  }
  async function toGet() {
    console.log(infomation);
    if (infomation) {
      try {
        const rewardResult = await computationalPower.rewardFM(
          infomation.userAddress,
          infomation.usdtHex,
          infomation.mmrsHex,
          infomation.idx,
          infomation.sign
        );
        if (rewardResult) {
          Toast.success(language.success);
          server.getFMData(chain.address);
          return;
        }
      } catch {}
      Toast.info(language.fail);
      return;
    }
  }
  function renderModal() {
    if (showInfomation === true) {
      return (
        <div>
          <InfomationWindow
            data={infomation.repeatTis}
            closeShowInfomation={() => {
              setShowInfomation(false);
            }}
            toGet={() => {
              setShowInfomation(false);
              toGet();
            }}
          />
        </div>
      );
    }
    return null;
  }
  return (
    <Fragment>
      <div className={css.fm}>
        <div className={css.tip}>{language.canGet}</div>
        <div className={css.number}>
          {server.FM_wait}
          <span className={css.symbol}>FM</span>
        </div>
        <div className={css.contractAddress}>
          {language.address}: {quiteAddress(chain.contractAddress?.fmttoken)}
          <div className={css.copy} onClick={copy}></div>
        </div>
        <div className={css.button} onClick={handleGet}>
          {language.receive}
        </div>
      </div>
      {renderModal()}
    </Fragment>
  );
}

export default inject(
  "chain",
  "server",
  "lang",
  "computationalPower"
)(observer(FMGain));
