import css from "./index.module.less";
import React from "react";
import classNames from "classnames";
// import AFIL_ICON from "@assets/images/swap/MFIL.png";
// import WFIL_ICON from "@assets/images/swap/HFIL.png";
import { inject, observer } from "mobx-react";
import { checkFloatNumber } from "@utils/common";
import { Toast } from "antd-mobile";
import DropDown from "@components/DropDown";
import SetPointWindow from "@components/SetPointWindow";

const languageContext = {
  English: {
    headTips: "Lower handling fee and higher convenience",
    exchangeRate: "Exchange Rate",
    approve: "approve",
    swap: "swap",
    balance: "balance",
    serviceCharge: "Service Charge",
    approveSuccess: "Approve Success",
    approveFail: "Approve Fail",
    swapSuccess: "Swap Success",
    swapFail: "Swap Fail",
    set: "setting",
  },
  TraditionalChinese: {
    headTips: "讓算力觸手可及",
    exchangeRate: "匯率",
    approve: "授權",
    swap: "兌換",
    balance: "余額",
    serviceCharge: "手續費",
    approveSuccess: "授權成功",
    approveFail: "授權失敗",
    swapSuccess: "兌換成功",
    swapFail: "兌換失敗",
    set: "設置",
  },
  SimplifiedChinese: {
    headTips: "更低手续费、更高便捷性",
    exchangeRate: "汇率",
    approve: "授权",
    swap: "兑换",
    balance: "余额",
    serviceCharge: "手续费",
    approveSuccess: "授权成功",
    approveFail: "授权失败",
    swapSuccess: "兑换成功",
    swapFail: "兑换失败",
    set: "设置",
  },
};

function Swap(props) {
  const {
    chain,
    server,
    lang: { selectedLang },
  } = props;
  const [change, setChange] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [{ AFILBalance, WFILBalance }, setBalace] = React.useState({
    AFILBalance: 0,
    WFILBalance: 0,
  });
  const [{ AFIL_APPROVE_AMOUNT, WFIL_APPROVE_AMOUNT }, setApprove] =
    React.useState({
      AFIL_APPROVE_AMOUNT: 0,
      WFIL_APPROVE_AMOUNT: 0,
    });

  const [{ AFILSelected, WFILSelected, type }, setSelected] = React.useState({
    AFILSelected: "AFIL",
    WFILSelected: "WFIL",
    type: "Pledge",
  });

  const [{ AFILSwapNumber, WFILSwapNumber }, setSwapNumber] = React.useState({
    AFILSwapNumber: "0",
    WFILSwapNumber: "0",
  });
  const [language, setLanguage] = React.useState(
    languageContext[selectedLang.key]
  );

  const T_List = new Array(chain.currentPeriod)
    .fill(0)
    .map((item, index) => `T${chain.currentPeriod - index}`);

  const AFIL_TYPE_LIST =
    WFILSelected === "WFIL" && change
      ? ["AFIL", ...T_List]
      : ["AFIL", "USDT", ...T_List];

  // const WFIL_TYPE_LIST = ["WFIL"];
  const WFIL_TYPE_LIST =
    AFILSelected === "USDT" && !change ? ["MMR"] : ["WFIL", "MMR"];

  React.useEffect(() => {
    setLanguage(languageContext[selectedLang.key]);
  }, [selectedLang.key]);

  const isApprove = change
    ? WFIL_APPROVE_AMOUNT >= WFILSwapNumber
    : AFIL_APPROVE_AMOUNT >= AFILSwapNumber;

  React.useEffect(() => {
    if (chain.address) {
      queryBalanceAll();
      queryAllowanceAll();
      setSwapNumber({
        AFILSwapNumber: "0",
        WFILSwapNumber: "0",
      });
    }
  }, [chain.address, AFILSelected, WFILSelected]);

  async function queryBalanceAll() {
    const AFIL = await chain.queryBalance(AFILSelected);
    const WFIL = await chain.queryBalance(WFILSelected);
    setBalace({
      AFILBalance: AFIL,
      WFILBalance: WFIL,
    });
  }

  async function queryAllowanceAll() {
    const AFILAllowance = await chain.queryAllowanceAsync({
      type,
      symbol: AFILSelected,
    });
    const WFILAllowance = await chain.queryAllowanceAsync({
      type,
      symbol: WFILSelected,
    });

    // console.log("AFILAllowance  WFILAllowance", AFILAllowance, WFILAllowance);
    setApprove({
      AFIL_APPROVE_AMOUNT: AFILAllowance,
      WFIL_APPROVE_AMOUNT: WFILAllowance,
    });
  }

  async function toApprove() {
    let symbol = AFILSelected;
    if (change === true) {
      symbol = WFILSelected;
    }
    try {
      let { status, approveAmount } = await chain.toApprove({
        type,
        symbol,
      });

      setApprove({
        AFIL_APPROVE_AMOUNT,
        WFIL_APPROVE_AMOUNT,
        [`${change ? "WFIL" : "AFIL"}_APPROVE_AMOUNT`]: approveAmount,
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

  function max(v) {
    if (v === "AFIL") {
      changeSwapNumber(AFILBalance, "AFIL", "WFIL");
    }
    if (v === "WFIL") {
      changeSwapNumber(WFILBalance, "WFIL", "AFIL");
    }
  }

  async function changeSwapNumber(amount, NOW_FROM_TYPE, NOW_TO_TYPE) {
    if (type === "Router1" && 0 - amount !== 0) {
      let map = {
        // AFIL: "USDT",
        // WFIL: "MMR",
        AFIL: AFILSelected,
        WFIL: WFILSelected,
      };
      const FROM_TO = await chain.queryComputeAmountsInSwap(
        amount,
        map[NOW_FROM_TYPE],
        map[NOW_TO_TYPE]
      );
      console.log(`FROM_${NOW_FROM_TYPE}_TO_${NOW_TO_TYPE}::::`, FROM_TO);
      setSwapNumber({
        [`${NOW_FROM_TYPE}SwapNumber`]: amount,
        [`${NOW_TO_TYPE}SwapNumber`]: FROM_TO,
      });
    } else {
      setSwapNumber({
        AFILSwapNumber: amount,
        WFILSwapNumber: amount,
      });
    }
  }

  function computeMiddleValue() {
    if (type === "Pledge" && change && AFILSwapNumber) {
      return (AFILSwapNumber * 1000000 * (1000 - chain.fee)) / 1000000000;
    }
    return AFILSwapNumber;
  }

  async function swap() {
    let result = false;
    try {
      if (change) {
        let minOut =
          (AFILSwapNumber * 10000 -
            AFILSwapNumber * chain.simpleUser.userSlippageTolerance) /
          10000;
        result = await chain.withDrawInSwap(
          WFILSwapNumber,
          type,
          minOut,
          AFILSelected,
          WFILSelected
        );
      } else {
        let minOut =
          (WFILSwapNumber * 10000 -
            WFILSwapNumber * chain.simpleUser.userSlippageTolerance) /
          10000;
        result = await chain.depositInSwap(
          AFILSwapNumber,
          type,
          minOut,
          AFILSelected,
          WFILSelected
        );
      }
      if (result) {
        Toast.success(language.swapSuccess);
      } else {
        Toast.fail(language.swapFail);
      }
    } catch (e) {
      Toast.fail(language.swapFail);
    }

    if (result) {
      queryBalanceAll();
      queryAllowanceAll();
      // chain.requestChainData();
    }
  }

  function renderModal() {
    if (showModal) {
      return (
        <SetPointWindow
          closeSetPointWindow={() => {
            setShowModal(false);
          }}
        />
      );
    }
    return null;
  }
  return (
    <div className={css.swap}>
      <div className={css.banner}>
        <div className={css.box}>
          <div className={css.logo}>MMR SWAP</div>
          <div className={css.tips}>{language.headTips}</div>
          {/* <div className={css.icon} /> */}
          <div
            className={css.configBox}
            onClick={() => {
              setShowModal(true);
            }}
          >
            <div className={css.config} />
            <div className={css.configWord}>{language.set}</div>
          </div>
        </div>
      </div>
      <div className={css.swapBox}>
        <div className={classNames(css.exchangeBox, change && css.afterChange)}>
          <div className={css.from}>
            <div className={css.top}>
              <div className={css.left}>{change ? "TO" : "FROM"}</div>
              <div className={css.right}>
                {/* <img src={WFIL_ICON} alt="" className={css.icon} />
                FIL */}
                <DropDown
                  key="from"
                  canDrop={!change || WFILSelected === "WFIL"}
                  list={AFIL_TYPE_LIST}
                  selected={AFILSelected}
                  onSelected={(value) => {
                    const TParams = {
                      WFILSelected: "WFIL",
                      type: "Router1",
                    };
                    const map = {
                      AFIL: {
                        WFILSelected: "WFIL",
                        type: "Pledge",
                      },
                      USDT: {
                        WFILSelected: "MMR",
                        type: "Router1",
                      },
                      T1: TParams,
                      T2: TParams,
                      T3: TParams,
                      T4: TParams,
                      T5: TParams,
                      T6: TParams,
                      T7: TParams,
                      T8: TParams,
                      T9: TParams,
                      T10: TParams,
                    };

                    setSelected({
                      AFILSelected: value,
                      ...map[value],
                    });
                  }}
                />
              </div>
            </div>
            <div className={classNames(css.middle, change && css.full)}>
              <input
                className={css.input}
                value={computeMiddleValue()}
                disabled={change}
                type="number"
                onWheel={(e) => e.target.blur()}
                onChange={async (e) => {
                  console.log("e.target.value", e.target.value);
                  if (!change) {
                    if (e.target.value === "") {
                      setSwapNumber({
                        AFILSwapNumber: "",
                        WFILSwapNumber: "",
                      });
                    } else {
                      if (checkFloatNumber(e.target.value)) {
                        let number = e.target.value;
                        // if (number - AFILBalance > 0) {
                        //   number = AFILBalance;
                        // }
                        if (number.length > 1 && number.startsWith("0")) {
                          number = number.replace(/^[0]+/, "");
                          if (number === "") number = "0";
                          if (number.startsWith(".")) number = "0" + number;
                        }
                        changeSwapNumber(number, "AFIL", "WFIL");
                      }
                    }
                  }
                }}
              />
              {!change && (
                <div
                  className={css.max}
                  onClick={() => {
                    max("AFIL");
                  }}
                >
                  MAX
                </div>
              )}
            </div>
            <div className={css.bottom}>
              <div className={css.left}>
                {AFILSelected}
                {language.balance}
              </div>
              <div className={css.right}>{AFILBalance}</div>
            </div>
          </div>
          <div
            className={css.exchange}
            onClick={() => {
              setChange(!change);
              if (!change) {
                // console.log("change", change);
                const amount =
                  WFILSwapNumber - WFILBalance > 0
                    ? WFILBalance
                    : WFILSwapNumber;
                changeSwapNumber(amount, "WFIL", "AFIL");
              } else {
                const amount =
                  AFILSwapNumber - AFILBalance > 0
                    ? AFILBalance
                    : AFILSwapNumber;
                changeSwapNumber(amount, "AFIL", "WFIL");
              }
            }}
          >
            <div className={css.icon}></div>
          </div>
          <div className={css.to}>
            <div className={css.top}>
              <div className={css.left}>{change ? "FROM" : "TO"}</div>
              <div className={css.right}>
                {/* <img src={AFIL_ICON} alt="" className={css.icon} />
                WFIL */}
                <DropDown
                  key="to"
                  canDrop={change || AFILSelected === "USDT"}
                  // canDrop={false}
                  list={WFIL_TYPE_LIST}
                  selected={WFILSelected}
                  onSelected={(value) => {
                    const map = {
                      WFIL: {
                        AFILSelected: "AFIL",
                        type: "Pledge",
                      },
                      MMR: {
                        AFILSelected: "USDT",
                        type: "Router1",
                      },
                      // MMRS: {
                      //   AFILSelected: "USDT",
                      //   type: "Router1",
                      // },
                    };
                    setSelected({
                      WFILSelected: value,
                      ...map[value],
                    });
                  }}
                />
              </div>
            </div>
            <div className={classNames(css.middle, !change && css.full)}>
              <input
                value={WFILSwapNumber}
                className={css.input}
                type="number"
                disabled={!change}
                onWheel={(e) => e.target.blur()}
                onChange={async (e) => {
                  if (change) {
                    if (e.target.value === "") {
                      setSwapNumber({
                        AFILSwapNumber: "",
                        WFILSwapNumber: "",
                      });
                    } else {
                      if (checkFloatNumber(e.target.value)) {
                        let number = e.target.value;

                        // if (number - WFILBalance > 0) {
                        //   number = WFILBalance;
                        // }
                        if (number.length > 1 && number.startsWith("0")) {
                          number = number.replace(/^[0]+/, "");
                          if (number === "") number = "0";
                          if (number.startsWith(".")) number = "0" + number;
                        }

                        changeSwapNumber(number, "WFIL", "AFIL");
                      }
                    }
                  }
                }}
              />
              {change && (
                <div
                  className={css.max}
                  onClick={() => {
                    max("WFIL");
                  }}
                >
                  MAX
                </div>
              )}
            </div>
            <div className={css.bottom}>
              <div className={css.left}>
                {WFILSelected}
                {language.balance}
              </div>
              <div className={css.right}>{WFILBalance}</div>
            </div>
          </div>
        </div>
        <div className={css.tips}>
          {type === "Pledge" && (
            <div className={css.left}>
              {language.exchangeRate}: 1
              {AFILSelected === "AFIL" ? "FIL" : AFILSelected}=1{WFILSelected}
            </div>
          )}
          {change && AFILSelected === "AFIL" && (
            <div className={css.right}>{`${language.serviceCharge}: ${
              chain.fee / 10
            } %`}</div>
          )}
        </div>

        <div className={css.button}>
          <div
            className={classNames(
              css.approveBtn,
              (!chain.isActive ||
                isApprove ||
                AFILSwapNumber - 0 === 0 ||
                WFILSwapNumber - 0 === 0) &&
                css.disabled
            )}
            onClick={() => {
              if (
                !isApprove &&
                WFILSwapNumber > 0 &&
                AFILSwapNumber > 0 &&
                chain.isActive
              ) {
                toApprove();
              }
            }}
          >
            {language.approve}
          </div>
          <div
            className={classNames(
              css.swapBtn,
              (!chain.isActive ||
                !isApprove ||
                AFILSwapNumber - 0 === 0 ||
                WFILSwapNumber - 0 === 0) &&
                css.disabled
            )}
            onClick={() => {
              if (
                chain.isActive &&
                isApprove &&
                WFILSwapNumber > 0 &&
                AFILSwapNumber > 0 
              ) {
                swap();
              }
            }}
          >
            {language.swap}
          </div>
        </div>
      </div>

      {renderModal()}
    </div>
  );
}

export default inject("chain", "lang", "server")(observer(Swap));
