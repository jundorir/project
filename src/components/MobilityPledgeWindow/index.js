import React from "react";
import css from "./index.module.less";
import close from "@assets/images/icon/close.png";
import { inject, observer } from "mobx-react";
import classNames from "classnames";
import { Toast } from "antd-mobile";
import { checkFloatNumber } from "@utils/common";
let approveInfo = {
  U: {
    type: "LpMintPool",
    symbol: "LP",
  },
  T: {
    type: "TLpPool",
    symbol: "TLP",
  },
};
function MobilityPledgeWindow(props) {
  const { lang, chain, mobility, type } = props;
  const { selectedLang } = lang;
  const [language, setLanguage] = React.useState({});
  const [inputNum, setInputNum] = React.useState("");
  const [LP_APPROVE_AMOUNT, setApprove] = React.useState(0);

  let balance = mobility[type].quiteLPAmount;
  const hasInput = inputNum - 0 > 0;
  const isApprove = LP_APPROVE_AMOUNT - inputNum >= 0;
  React.useEffect(
    (props) => {
      const globalLanguage = {
        English: {
          add: "Adding the Number of LP",
          balance: "balance",
          approve: "approve",
          ensure: "ensure",
          pledgeSuccess: "pledge success",
          pledgeFail: "pledge fail",
          approveSuccess: "approve success",
          approveFail: "approve fail",

        },
        TraditionalChinese: {
          add: "添加LP數量",
          balance: "余額",
          approve: "授權",
          ensure: "確定",
          pledgeSuccess: "質押成功",
          pledgeFail: "質押失敗",
          approveSuccess: "授權成功",
          approveFail: "授權失敗",

        },
        SimplifiedChinese: {
          add: "添加LP数量",
          balance: "余额",
          approve: "授权",
          ensure: "确定",
          pledgeSuccess: "质押成功",
          pledgeFail: "质押失败",
           approveSuccess: "授权成功",
          approveFail: "授权失败",
        },
      };
      setLanguage(globalLanguage[selectedLang.key]);
    },
    [selectedLang.key]
  );

  React.useEffect(() => {
    if (chain.address) {
      mobility.queryAllInfoAsync(type);
      queryAllowanceAll();
    }
  }, [chain.address, mobility, type]);

  const closeWindow = React.useCallback(() => {
    props.closeMobilityPledgeWindow();
  }, [props]);
  // 确定取回

  // 取消按钮

  async function queryAllowanceAll() {
    const LPAllowance = await chain.queryAllowanceAsync(approveInfo[type]);
    // console.log("LPAllowance ====> ", LPAllowance);
    setApprove(LPAllowance);
  }

  async function pledgeLiquidity() {
    let result = false;
    try {
      result = await mobility.pledgeLiquidity(inputNum, type);
      if (result) {
        Toast.success(language.pledgeSuccess);
      } else {
        Toast.fail(language.pledgeFail);
      }
    } catch {
      Toast.fail(language.pledgeFail);
    }

    if (result) {
      queryAllowanceAll(type);
      setInputNum(0);
    }
  }

  async function toApprove() {
    try {
      let { status, approveAmount } = await chain.toApprove(approveInfo[type]);
      setApprove(approveAmount);
      if (status) {
        Toast.success(language.approveSuccess);
      } else {
        Toast.fail(language.approveFail);
      }
    } catch (e) {
      Toast.fail(language.approveFail);
    }
  }
  return (
    <div
      className={css.getbackWindow}
      onClick={() => {
        closeWindow();
      }}
    >
      <div
        className={css.getbackBox}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* 关闭按钮 */}
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
        {/* 标题 */}
        <div className={css.title}>{language.add}</div>
        {/* 中间部分 */}
        <div className={css.center}>
          <div className={css.inputbox}>
            <input
              className={css.input}
              value={inputNum}
              type="number"
              onWheel={(e) => e.target.blur()}
              onChange={(e) => {
                if (e.target.value === "") {
                  setInputNum("");
                } else {
                  if (checkFloatNumber(e.target.value)) {
                    let number = e.target.value;
                    if (number - balance > 0) {
                      number = balance;
                    }
                    if (number.length > 1 && number.startsWith("0")) {
                      number = number.replace(/^[0]+/, "");
                      if (number === "") number = "0";
                      if (number.startsWith(".")) number = "0" + number;
                    }
                    setInputNum(number);
                  }
                }
              }}
            />
            {/* <div className={css.percent}>%</div> */}
            <div
              className={css.max}
              onClick={() => {
                setInputNum(balance);
              }}
            >
              MAX
            </div>
          </div>
          <div className={css.balance}>
            {type === "U" ? "MMR/USDT" : "T/WFIL"} LP {language.balance}：
            {balance}
          </div>
        </div>
        {/* 按钮行 */}
        <div className={css.button}>
          <div
            className={classNames(
              css.cancleButton,
              (!hasInput || isApprove) && css.disabled
            )}
            onClick={() => {
              if (!hasInput || isApprove) return;
              toApprove();
            }}
          >
            {language.approve}
          </div>
          <div
            className={classNames(
              css.ensureButton,
              (!hasInput || !isApprove) && css.disabled
            )}
            onClick={() => {
              if (!hasInput || !isApprove) return;
              pledgeLiquidity();
            }}
          >
            {language.ensure}
          </div>
        </div>
      </div>
    </div>
  );
}

export default inject(
  "lang",
  "chain",
  "mobility"
)(observer(MobilityPledgeWindow));
