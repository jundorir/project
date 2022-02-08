import css from "./index.module.less";
import React from "react";
import classNames from "classnames";
import AFIL_ICON from "@assets/images/swap/MFIL.png";
import WFIL_ICON from "@assets/images/swap/HFIL.png";
import { checkFloatNumber } from "@utils/common";
import { inject, observer } from "mobx-react";
import LPBox from "../components/LPBox";
import MobilitySupplyWindow from "@components/MobilitySupplyWindow";
import { Toast } from "antd-mobile";
import AuthorizationModal from "@components/AuthorizationModal";
import DropDown from "@components/DropDown";

const languageContext = {
  English: {
    balance: "balance",
    addMobility: "Add liquidity",
    addMobilityTips: "Add liquidity to receive LP tokens",
    priceAndCapitalPool: "Price and capital pool share",
    capitalPool: "Share of bonus pool：",
    approve: "approve",
    supply: "supply",
    approveSuccess: "approve success",
    approveFail: "approve fail",
  },
  TraditionalChinese: {
    balance: "余額",
    addMobility: "添加流動性",
    addMobilityTips: "添加流動性以接收LP代幣",
    priceAndCapitalPool: "價格和資金池份額",
    capitalPool: "資金池份額：",
    approve: "授權",
    supply: "供應",
    approveSuccess: "授權成功",
    approveFail: "授權失敗",
  },
  SimplifiedChinese: {
    balance: "余额",
    addMobility: "添加流动性",
    addMobilityTips: "添加流动性以接收LP代币",
    priceAndCapitalPool: "价格和资金池份额",
    capitalPool: "资金池份额：",
    approve: "授权",
    supply: "供应",
    approveSuccess: "授权成功",
    approveFail: "授权失败",
  },
};
function AddMobility(props) {
  const {
    chain,
    mobility,
    lang: { selectedLang },
  } = props;
  const language = languageContext[selectedLang.key];
  const { AFILSelected, WFILSelected } = mobility;
  const [change, setChange] = React.useState(false);
  const [showModal, setShowModal] = React.useState("");

  const [{ AFILBalance, WFILBalance }, setBalace] = React.useState({
    AFILBalance: 0,
    WFILBalance: 0,
  });

  const [{ AFIL_APPROVE_AMOUNT, WFIL_APPROVE_AMOUNT }, setApprove] =
    React.useState({
      AFIL_APPROVE_AMOUNT: 0,
      WFIL_APPROVE_AMOUNT: 0,
    });

  const [{ AFILSwapNumber, WFILSwapNumber }, setSwapNumber] = React.useState({
    AFILSwapNumber: "0",
    WFILSwapNumber: "0",
  });
  const AFIL_isApprove = AFIL_APPROVE_AMOUNT >= AFILSwapNumber;
  const WFIL_isApprove = WFIL_APPROVE_AMOUNT >= WFILSwapNumber;
  const isApprove = AFIL_isApprove && WFIL_isApprove;
  const isAvailable =
    WFILBalance - WFILSwapNumber >= 0 && AFILBalance - AFILSwapNumber >= 0;

  React.useEffect(() => {
    if (chain.address) {
      mobility.init();
      queryBalanceAll();
      queryAllowanceAll();
      changeSwapNumber(0);
    }
  }, [chain.address, AFILSelected, WFILSelected]);

  // React.useEffect(() => {
  //   mobility.init();
  // }, [mobility]);

  async function toApprove(symbol = "USDT") {
    let customSymbols = {
      USDT: "AFIL",
      MMR: "WFIL",
      T: "AFIL",
      WFIL: "WFIL",
      MMRS: 'WFIL'
    };
    try {
      let { status, approveAmount } = await chain.toApprove({
        type: "Router1",
        symbol,
      });
      setApprove({
        AFIL_APPROVE_AMOUNT,
        WFIL_APPROVE_AMOUNT,
        [`${customSymbols[symbol]}_APPROVE_AMOUNT`]: approveAmount,
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
      type: "Router1",
      symbol: AFILSelected,
    });
    const WFILAllowance = await chain.queryAllowanceAsync({
      type: "Router1",
      symbol: WFILSelected,
    });

    setApprove({
      AFIL_APPROVE_AMOUNT: AFILAllowance,
      WFIL_APPROVE_AMOUNT: WFILAllowance,
    });
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
    if (0 - amount !== 0) {
      let map = {
        AFIL: AFILSelected,
        WFIL: WFILSelected,
      };
      const FROM_TO = await mobility.queryLiquidityValueByTokenAsync(
        map[NOW_FROM_TYPE],
        map[NOW_TO_TYPE],
        amount,
        "1000000000000000"
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

  function renderModal() {
    if (!showModal) return null;
    if (showModal === "approve")
      return (
        <AuthorizationModal
          toApprove={toApprove}
          closeModal={() => {
            setShowModal("");
          }}
          AFIL_isApprove={AFIL_isApprove}
          WFIL_isApprove={WFIL_isApprove}
          AFIL={AFILSelected}
          WFIL={WFILSelected}
        />
      );
    if (showModal === "supply")
      return (
        <MobilitySupplyWindow
          closeMobilitySupplyWindow={(value) => {
            setShowModal("");
            if (value) {
              changeSwapNumber(0);
              queryBalanceAll();
              queryAllowanceAll();
            }
          }}
        />
      );
  }

  return (
    <div className={css.content}>
      <div className={css.box}>
        <div className={css.title}>
          <div
            className={css.back}
            onClick={() => {
              mobility.backDisplayMobility();
            }}
          />
          <div className={css.text}>{language.addMobility}</div>
          {/* <div className={css.q} /> */}
        </div>
        <div className={css.tips}>{language.addMobilityTips}</div>
        <div className={classNames(css.exchangeBox, change && css.afterChange)}>
          <div className={css.from}>
            <div className={css.top}>
              <div className={css.left}>INPUT</div>
              <div className={css.right}>
                <DropDown
                  key="from"
                  // canDrop={!change}
                  canDrop={false}
                  // list={["USDT", "T"]}
                  list={["USDT"]}
                  selected={AFILSelected}
                  onSelected={(value) => {
                    const map = {
                      USDT: ["USDT", "MMR", "U"],
                      // T: ["T", "WFIL", "T"],
                    };
                    mobility.changeSelected(...map[value]);
                  }}
                />
              </div>
            </div>
            <div className={classNames(css.middle, change && css.full)}>
              <input
                className={css.input}
                value={AFILSwapNumber}
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
                        if (number - AFILBalance > 0) {
                          number = AFILBalance;
                        }
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
            // onClick={() => {
            //   setChange(!change);
            //   if (!change) {
            //     const amount =
            //       WFILSwapNumber - WFILBalance > 0
            //         ? WFILBalance
            //         : WFILSwapNumber;
            //     changeSwapNumber(amount, "WFIL", "AFIL");
            //   } else {
            //     const amount =
            //       AFILSwapNumber - AFILBalance > 0
            //         ? AFILBalance
            //         : AFILSwapNumber;
            //     changeSwapNumber(amount, "AFIL", "WFIL");
            //   }
            // }}
          >
            <div className={css.icon}></div>
          </div>
          <div className={css.to}>
            <div className={css.top}>
              <div className={css.left}>INPUT</div>
              <div className={css.right}>
                <DropDown
                  key="to"
                  canDrop={false}
                  // list={["MMR", "WFIL"]}
                  list={["MMR"]}
                  // list={["MMR", "MMRS"]}
                  selected={WFILSelected}
                  onSelected={(value) => {
                    // console.log("value ====>", value);
                    const map = {
                      MMR: ["USDT", "MMR", "U"],
                      // MMRS: ["USDT", "MMRS", "MMRS_TO_USDT"],
                    };
                    mobility.changeSelected(...map[value]);
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

                        if (number - WFILBalance > 0) {
                          number = WFILBalance;
                        }
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

        <div className={css.portionBox}>
          <div className={css.top}>{language.priceAndCapitalPool}</div>
          <div className={css.middle}>
            1{AFILSelected} ≈ {mobility.current.BTOA} {WFILSelected}
          </div>
          <div className={css.bottom}>
            <div className={css.left}>{language.capitalPool}</div>
            <div className={css.right}>{mobility.exceptPercent}%</div>
          </div>
        </div>
        <div className={css.buttons}>
          <div
            className={classNames(
              css.enableBtn,
              (AFILSwapNumber - 0 === 0 || isApprove || !isAvailable) &&
                css.disabled
            )}
            onClick={() => {
              if (AFILSwapNumber - 0 === 0 || isApprove || !isAvailable) return;
              setShowModal("approve");
            }}
          >
            {language.approve}
          </div>
          <div
            className={classNames(
              css.removeBtn,
              (AFILSwapNumber - 0 === 0 || !isApprove || !isAvailable) &&
                css.disabled
            )}
            onClick={() => {
              if (AFILSwapNumber - 0 === 0 || !isApprove || !isAvailable)
                return;
              setShowModal("supply");
            }}
          >
            {language.supply}
          </div>
        </div>
      </div>

      <LPBox />

      {renderModal()}
    </div>
  );
}

export default inject("chain", "lang", "mobility")(observer(AddMobility));
