import css from "./index.module.less";
import React from "react";
import classNames from "classnames";
import AFIL_ICON from "@assets/images/swap/MFIL.png";
import WFIL_ICON from "@assets/images/swap/HFIL.png";
import { inject, observer } from "mobx-react";
import { checkFloatNumber } from "@utils/common";

const languageContext = {
  English: {
    headTips: "Lower handling fee and higher convenience",
    exchangeRate: "Exchange Rate",
    approve: "approve",
    swap: "swap",
    balance: "balance",
    serviceCharge: "Service Charge",
  },
  TraditionalChinese: {
    headTips: "讓算力觸手可及",
    exchangeRate: "匯率",
    approve: "授權",
    swap: "兌換",
    balance: "余額",
    serviceCharge: "手續費",
  },
  SimplifiedChinese: {
    headTips: "更低手续费、更高便捷性",
    exchangeRate: "汇率",
    approve: "授权",
    swap: "兑换",
    balance: "余额",
    serviceCharge: "手续费",
  },
};

function Swap(props) {
  const {
    chain,
    lang: { selectedLang },
  } = props;
  const [change, setChange] = React.useState(false);
  const [{ AFILBalance, WFILBalance }, setBalace] = React.useState({
    AFILBalance: 0,
    WFILBalance: 0,
  });
  const [{ AFIL_APPROVE_STATUS, WFIL_APPROVE_STATUS }, setApprove] =
    React.useState({
      AFIL_APPROVE_STATUS: false,
      AFIL_APPROVE_AMOUNT: 0,
      WFIL_APPROVE_STATUS: false,
      WFIL_APPROVE_AMOUNT: 0,
    });

  const [{ AFILSwapNumber, WFILSwapNumber }, setSwapNumber] = React.useState({
    AFILSwapNumber: "",
    WFILSwapNumber: "",
  });
  const [language, setLanguage] = React.useState(
    languageContext[selectedLang.key]
  );

  React.useEffect(() => {
    setLanguage(languageContext[selectedLang.key]);
  }, [selectedLang.key]);

  const isApprove = change ? WFIL_APPROVE_STATUS : AFIL_APPROVE_STATUS;

  React.useEffect(() => {
    if (chain.address) {
      queryBalanceAll();
      setApprove({
        AFIL_APPROVE_STATUS: false,
        AFIL_APPROVE_AMOUNT: 0,
        WFIL_APPROVE_STATUS: false,
        WFIL_APPROVE_AMOUNT: 0,
      });
    }
  }, [chain.address]);

  async function queryBalanceAll() {
    const AFIL = await chain.queryBalance("AFIL");
    const WFIL = await chain.queryBalance("WFIL");
    setBalace({
      AFILBalance: AFIL,
      WFILBalance: WFIL,
    });
  }

  async function toApprove() {
    let symbol = "AFIL";
    if (change === true) {
      symbol = "WFIL";
    }
    let { status, approveAmount } = await chain.toApprove({
      type: "Pledge",
      symbol,
    });
    // console.log("status, approveAmount", status, approveAmount);
    setApprove({
      [`${symbol}_APPROVE_STATUS`]: status,
      [`${symbol}_APPROVE_AMOUNT`]: approveAmount,
    });
  }

  function max(type) {
    if (type === "AFIL") {
      setSwapNumber({
        AFILSwapNumber: AFILBalance,
        WFILSwapNumber: AFILBalance,
      });
    }
    if (type === "WFIL") {
      setSwapNumber({
        AFILSwapNumber: WFILBalance,
        WFILSwapNumber: WFILBalance,
      });
    }
  }

  async function swap() {
    let result = false;
    if (change) {
      result = await chain.withDrawInSwap(WFILSwapNumber);
    } else {
      result = await chain.depositInSwap(AFILSwapNumber);
    }

    if (result) {
      queryBalanceAll();
      chain.requestChainData();
    }
  }
  return (
    <div className={css.swap}>
      <div className={css.banner}>
        <div className={css.box}>
          <div className={css.logo}>WAMI SWAP</div>
          <div className={css.tips}>{language.headTips}</div>
          <div className={css.icon}></div>
        </div>
      </div>
      <div className={css.swapBox}>
        <div className={classNames(css.exchangeBox, change && css.afterChange)}>
          <div className={css.from}>
            <div className={css.top}>
              <div className={css.left}>{change ? "TO" : "FROM"}</div>
              <div className={css.right}>
                <img src={WFIL_ICON} alt="" className={css.icon} />
                AFIL
              </div>
            </div>
            <div className={classNames(css.middle, change && css.full)}>
              <input
                className={css.input}
                value={
                  change
                    ? AFILSwapNumber &&
                      (AFILSwapNumber * 1000000 * (1000 - chain.fee)) /
                        1000000000
                    : AFILSwapNumber
                }
                disabled={change}
                type="number"
                onWheel={(e) => e.target.blur()}
                onChange={(e) => {
                  if (!change) {
                    if (e.target.value === "") {
                      setSwapNumber({
                        AFILSwapNumber: "",
                        WFILSwapNumber: "",
                      });
                    } else {
                      if (checkFloatNumber(e.target.value)) {
                        let number = e.target.value;
                        if (number > AFILBalance) {
                          number = AFILBalance;
                        }
                        if (number.length > 1 && number.startsWith("0")) {
                          number = number.replace(/^[0]+/, "");
                          if (number === "") number = "0";
                          if (number.startsWith(".")) number = "0" + number;
                        }
                        setSwapNumber({
                          AFILSwapNumber: number,
                          WFILSwapNumber: number,
                        });
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
              <div className={css.left}>AFIL{language.balance}</div>
              <div className={css.right}>{AFILBalance}</div>
            </div>
          </div>
          <div
            className={css.exchange}
            onClick={() => {
              setChange(!change);
              if (!change && WFILSwapNumber > WFILBalance) {
                setSwapNumber({
                  AFILSwapNumber: WFILBalance,
                  WFILSwapNumber: WFILBalance,
                });
              }
              if (change && AFILSwapNumber > AFILBalance) {
                setSwapNumber({
                  AFILSwapNumber: AFILBalance,
                  WFILSwapNumber: AFILBalance,
                });
              }
            }}
          >
            <div className={css.icon}></div>
          </div>
          <div className={css.to}>
            <div className={css.top}>
              <div className={css.left}>{change ? "FROM" : "TO"}</div>
              <div className={css.right}>
                <img src={AFIL_ICON} alt="" className={css.icon} />
                WFIL
              </div>
            </div>
            <div className={classNames(css.middle, !change && css.full)}>
              <input
                value={WFILSwapNumber}
                className={css.input}
                type="number"
                disabled={!change}
                onWheel={(e) => e.target.blur()}
                onChange={(e) => {
                  if (change) {
                    if (e.target.value === "") {
                      setSwapNumber({
                        AFILSwapNumber: "",
                        WFILSwapNumber: "",
                      });
                    } else {
                      if (checkFloatNumber(e.target.value)) {
                        let number = e.target.value;

                        if (number > WFILBalance) {
                          number = WFILBalance;
                        }
                        if (number.length > 1 && number.startsWith("0")) {
                          number = number.replace(/^[0]+/, "");
                          if (number === "") number = "0";
                          if (number.startsWith(".")) number = "0" + number;
                        }
                        setSwapNumber({
                          AFILSwapNumber: number,
                          WFILSwapNumber: number,
                        });
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
              <div className={css.left}>WFIL{language.balance}</div>
              <div className={css.right}>{WFILBalance}</div>
            </div>
          </div>
        </div>
        <div className={css.tips}>
          <div className={css.left}>{language.exchangeRate}: 1AFIL=1WFIL</div>
          {change && (
            <div className={css.right}>{`${language.serviceCharge}: ${
              chain.fee / 10
            } %`}</div>
          )}
        </div>

        <div className={css.button}>
          <div
            className={classNames(
              css.approveBtn,
              (!chain.isActive || isApprove) && css.disabled
            )}
            onClick={() => {
              if (!isApprove) {
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
                !AFILSwapNumber ||
                !WFILSwapNumber) &&
                css.disabled
            )}
            onClick={() => {
              if (isApprove) {
                swap();
              }
            }}
          >
            {language.swap}
          </div>
        </div>
      </div>
    </div>
  );
}

export default inject("chain", "lang")(observer(Swap));
