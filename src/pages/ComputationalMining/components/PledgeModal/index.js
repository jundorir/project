/* eslint-disable no-undef */
import css from "./index.module.less";
import close from "@assets/images/icon/close.png";
import React from "react";
import { inject, observer } from "mobx-react";
import { Toast } from "antd-mobile";
import AuthorizationModal from "@components/AuthorizationModal";
import SetPointWindow from "@components/SetPointWindow";
import EnsurePledgeModal from "../EnsurePledgeModal";
import { checkFloatNumber } from "@utils/common";
import classNames from "classnames";

function PledgeModal(props) {
  const { lang, computationalPower, chain, round } = props;
  const { WFILBalance } = computationalPower;
  const {
    needWFILAmount = 0,
    needWFILAmountFull = 0,
    TBalance = 0,
  } = computationalPower.round.get(round) || {};
  const { selectedLang } = lang;
  const [language, setLanguage] = React.useState([]);
  const [inputNum, setInputNum] = React.useState(0);
  const [showModal, setShowModal] = React.useState("");
  const [{ AFIL_APPROVE_AMOUNT, WFIL_APPROVE_AMOUNT }, setApprove] =
    React.useState({
      AFIL_APPROVE_AMOUNT: 0,
      WFIL_APPROVE_AMOUNT: 0,
    });
  const AFIL_isApprove = AFIL_APPROVE_AMOUNT >= inputNum;
  const WFIL_isApprove = WFIL_APPROVE_AMOUNT >= needWFILAmount;
  const isValidInput =
    inputNum > 0 &&
    TBalance - inputNum >= 0 &&
    needWFILAmount - WFILBalance <= 0;

  const closeWindow = React.useCallback(() => {
    if (props.closeModal) props.closeModal();
  }, []);

  React.useEffect(() => {
    const g_language = {
      English: {
        TBalanceKey: `Phase${round} Calculation balance：`,
        gain: "gain",
        amount: "pledge amount (T)",
        balance: "balance",
        need: "need",
        pledge: "pledge",
        description: "Description: ",
        proportion: "Proportion of board pledge 80% of the MMR",
        proportion2: "20% of the MMR",
        error: "Please enter the amount of pledge",
        noBalance: "The WFIL balance is insufficient",
        approveSuccess: "approve success",
        approveFail: "approve fail",
        pledgeSuccess: "pledge success",
        pledgeFail: "pledge fail",
        config: "config",
        submit: "submit",
        explain: "pledge description",
        explain1:
          "1. 50% of the pledged computing power will directly become lossless computing power ",
        explain2:
          "2. 50% of the calculation power of the pledge will add liquidity to form LP ",
      },
      TraditionalChinese: {
        TBalanceKey: `第${round}期算力余額：`,
        gain: "收獲",
        amount: "質押量(T)",
        balance: "余額",
        need: "需要",
        pledge: "質押",
        description: "說明：",
        proportion: "董事會質押比例80%的MMR",
        proportion2: "20%的USDT",
        error: "請輸入質押數量",
        noBalance: "WFIL余額不足",
        approveSuccess: "授權成功",
        approveFail: "授權失敗",
        pledgeSuccess: "質押成功",
        pledgeFail: "質押失敗",
        config: "設置",
        submit: "確定",
        explain: "質押說明",
        explain1: "1.質押的算力50%直接變成無損算力",
        explain2: "2.質押的算力50%會添加流動性組成LP",
      },
      SimplifiedChinese: {
        TBalanceKey: `第${round}期算力余额：`,
        gain: "收获",
        amount: "质押量(T)",
        balance: "余额",
        need: "需要",
        pledge: "质押",
        description: "说明：",
        proportion: "董事会质押比例80%的MMR",
        proportion2: "20%的USDT",
        error: "请输入质押数量",
        noBalance: "WFIL余额不足",
        approveSuccess: "授权成功",
        approveFail: "授权失败",
        pledgeSuccess: "质押成功",
        pledgeFail: "质押失败",
        config: "设置",
        submit: "确定",
        explain: "质押说明",
        explain1: "1.质押的算力50%直接变成无损算力",
        explain2: "2.质押的算力50%会添加流动性组成LP",
      },
    };

    setLanguage(g_language[selectedLang.key]);
  }, [selectedLang.key]);

  async function queryAllowanceAll() {
    const AFILAllowance = await chain.queryAllowanceAsync({
      type: "TLpPool",
      symbol: `T${round}`,
      round: round,
    });
    console.log("AFILAllowance ==>", AFILAllowance);
    const WFILAllowance = await chain.queryAllowanceAsync({
      type: "TLpPool",
      symbol: "WFIL",
      round: round,
    });
    console.log("WFILAllowance ==>", WFILAllowance);

    setApprove({
      AFIL_APPROVE_AMOUNT: AFILAllowance,
      WFIL_APPROVE_AMOUNT: WFILAllowance,
    });
  }

  React.useEffect(() => {
    if (chain.address) {
      //   chain.queryTAddress();
      computationalPower.initPledge(round);
      //重新进入页面不需要再次授权
    }
  }, [chain.address]);

  React.useEffect(() => {
    if (chain.address && chain.contractAddress?.currencyMap?.[`T${round}`]) {
      queryAllowanceAll();
      computationalPower.queryTBalance(round);
    }
  }, [chain.address, chain.contractAddress?.currencyMap?.[`T${round}`]]);

  async function toApprove(symbol = "WFIL") {
    let AFIL_WFIL_Symbol = symbol === "WFIL" ? "WFIL" : "AFIL";
    try {
      let { status, approveAmount } = await chain.toApprove({
        type: "TLpPool",
        symbol,
        round: round,
      });
      setApprove({
        AFIL_APPROVE_AMOUNT,
        WFIL_APPROVE_AMOUNT,
        [`${AFIL_WFIL_Symbol}_APPROVE_AMOUNT`]: approveAmount,
      });
      if (status) {
        Toast.success(language.approveSuccess);
      } else {
        Toast.fail(language.approveFail);
      }
    } catch (e) {
      Toast.fail(language.approveFail);
    }
  }

  function changeTAmount(number) {
    setInputNum(number);
    computationalPower.getNeedUSDT(number, round);
  }

  function toPledge() {
    if (isValidInput) {
      queryAllowanceAll();
      if (
        AFIL_APPROVE_AMOUNT >= inputNum &&
        WFIL_APPROVE_AMOUNT >= needWFILAmount
      ) {
        setShowModal("pledge");
      } else {
        setShowModal("approve");
      }
    } else if (needWFILAmount - WFILBalance > 0) {
      Toast.info(language.noBalance);
    } else {
      Toast.info(language.error);
    }
  }

  function renderModal() {
    if (showModal === "pledge") {
      return (
        <EnsurePledgeModal
          closeModal={() => {
            setShowModal("");
          }}
          AFIL_Number={inputNum}
          WFIL_Number={needWFILAmount}
          AFIL="T"
          WFIL="WFIL"
          toPledge={async () => {
            try {
              const maxWFILIn =
                BigInt(needWFILAmountFull) +
                (BigInt(needWFILAmountFull) *
                  BigInt(chain.simpleUser.userComputationalSlippageTolerance)) /
                  10000n;

              const result = await computationalPower.toPledge(
                inputNum,
                maxWFILIn.toString(),
                round
              );
              if (result) {
                Toast.success(language.pledgeSuccess);
                setShowModal("");
                closeWindow();
                changeTAmount(0);
              } else {
                Toast.success(language.pledgeFail);
              }
            } catch (e) {
              Toast.success(language.pledgeFail);
            }
          }}
        />
      );
    }
    if (showModal === "approve") {
      return (
        <AuthorizationModal
          toApprove={toApprove}
          closeModal={() => {
            setShowModal("");
          }}
          AFIL_isApprove={AFIL_isApprove}
          WFIL_isApprove={WFIL_isApprove}
          AFIL={`T${round}`}
          WFIL={"WFIL"}
        />
      );
    }
    if (showModal === "setPoint") {
      return (
        <SetPointWindow
          view="Computational"
          closeSetPointWindow={() => {
            setShowModal("");
          }}
        />
      );
    }
    return null;
  }

  return (
    <div
      className={css.pledge}
      onClick={() => {
        closeWindow();
      }}
    >
      <div
        className={css.pledgeBox}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          className={css.configBox}
          onClick={() => {
            setShowModal("setPoint");
          }}
        >
          <div className={css.config} />
          <div>{language.config}</div>
        </div>
        <div className={css.title}>{language.pledge}</div>
        <div className={css.closeImgBox}>
          <img
            onClick={(e) => {
              e.stopPropagation();
              closeWindow();
            }}
            className={css.closeImg}
            src={close}
            alt=" "
          />
        </div>
        <div className={css.center}>
          <div className={css.TBox}>
            <div className={css.top}>
              <input
                className={css.input}
                value={inputNum}
                disabled={false}
                type="number"
                onWheel={(e) => e.target.blur()}
                onChange={(e) => {
                  if (e.target.value === "") {
                    changeTAmount("");
                  } else {
                    if (checkFloatNumber(e.target.value)) {
                      let number = e.target.value;
                      if (number.length > 1 && number.startsWith("0")) {
                        number = number.replace(/^[0]+/, "");
                        if (number === "") number = "0";
                        if (number.startsWith(".")) number = "0" + number;
                      }
                      changeTAmount(number);
                    }
                  }
                }}
              />
              <div className={css.symbol}>T</div>
              <div
                className={css.max}
                onClick={() => {
                  changeTAmount(TBalance);
                }}
              >
                MAX
              </div>
            </div>
            <div className={css.bottom}>
              <div className={css.left}>{language.TBalanceKey}</div>
              <div className={css.right}>{TBalance}</div>
            </div>
          </div>
          <div className={css.add}>
            <div className={css.icon}></div>
          </div>
          <div className={css.WFILBox}>
            <div className={css.top}>
              <div className={css.balance}>{needWFILAmount}</div>
              <div className={css.symbol}>WFIL</div>
            </div>
            <div className={css.bottom}>
              <div className={css.left}>WFIL：</div>
              <div className={css.right}>{WFILBalance}</div>
            </div>
          </div>
        </div>
        <div
          className={classNames(css.button, !isValidInput && css.disabled)}
          onClick={toPledge}
        >
          {language.submit}
        </div>
        {round > 4 && (
          <div className={css.explain}>
            <div className={css.head}>{language.explain}:</div>
            <div className={css.tip}>{language.explain1}</div>
            <div className={css.tip}>{language.explain2}</div>
          </div>
        )}
        {renderModal()}
      </div>
    </div>
  );
}

export default inject(
  "lang",
  "computationalPower",
  "chain"
)(observer(PledgeModal));
