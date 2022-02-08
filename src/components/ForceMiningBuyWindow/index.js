import React, { Fragment } from "react";
import css from "./index.module.less";
import close from "@assets/images/icon/close.png";
import { inject, observer } from "mobx-react";
import classNames from "classnames";
import { Toast } from "antd-mobile";
import { checkFloatNumber, interception } from "@utils/common";
import WFILAuthorizationWindow from "@components/WFILAuthorizationWindow";

function BuyLotteryWindow(props) {
  const { lang, chain, forceMining, nowCanBuy, round } = props;
  const { WFILBalance } = forceMining;
  const { selectedLang } = lang;
  const [language, setLanguage] = React.useState({});
  const [inputNum, setInputNum] = React.useState(0);
  const [WFIL_APPROVE_AMOUNT, setWFILApprove] = React.useState(0);
  const [WFILAuthorizationDisplay, setWFILAuthorizationDisplay] =
    React.useState("none");

  React.useEffect(
    (props) => {
      const globalLanguage = {
        English: {
          title: "Buy a lottery ticket",
          most: "Maximum subscription capacity",
          balance: "balance",
          price: "price",
          need: "need to pay",
          buy: "buy",
          empty: "Please enter the quantity",
          fail: "Transaction failure",
          success: "Buy success",
        },
        TraditionalChinese: {
          title: "購買算力",
          most: "最大認購算力",
          balance: "余額",
          price: "單價",
          need: "預計所得",
          buy: "購買",
          empty: "請輸入數量",
          fail: "交易失敗",
          success: "交易成功",
        },
        SimplifiedChinese: {
          title: "购买算力",
          most: "最大认购算力",
          balance: "余额",
          price: "单价",
          need: "所需支付",
          buy: "购买",
          empty: "请输入数量",
          fail: "交易失败",
          success: "交易成功",
        },
      };
      setLanguage(globalLanguage[selectedLang.key]);
    },
    [selectedLang.key]
  );

  /**
   *授权
   */
  async function queryAllowanceAll() {
    const WFILAllowance = await chain.queryAllowanceAsync({
      type: "Shop",
      symbol: "WFIL",
    });
    setWFILApprove(WFILAllowance);
  }
  //重新进入页面不需要再次授权
  React.useEffect(() => {
    if (chain.address) {
      queryAllowanceAll();
    }
  }, [chain.address]);
  // 关闭授权弹窗
  const closeWFILAuthorizationWindow = React.useCallback(() => {
    setWFILAuthorizationDisplay("none");
  }, []);
  // 更新数据
  function updateData() {
    queryAllowanceAll();
  }
  /**
   * 点击购买
   */
  async function handleClick() {
    // console.log('地址地址------------》', forceMining.minerTokenrAddr)
    queryAllowanceAll();
    if (WFIL_APPROVE_AMOUNT >= props.TTruePrice * inputNum) {
      try {
        const toBuyTResult = await forceMining.toBuyTByRound(inputNum, round);
        if (toBuyTResult) {
          closeWindow();
          Toast.success(language.success);
        }
      } catch (error) {
        Toast.fail(language.fail);
      }
    } else {
      setWFILAuthorizationDisplay("unset");
    }
  }
  /**
   *关闭弹窗
   */
  const closeWindow = React.useCallback(() => {
    props.closeForceMiningBuyWindow();
    setInputNum(0);
  }, [props]);
  return (
    <Fragment>
      <div style={{ display: WFILAuthorizationDisplay }}>
        <WFILAuthorizationWindow
          closeWFILAuthorizationWindow={closeWFILAuthorizationWindow}
          updateData={updateData}
        />
      </div>
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
          <div className={css.title}>{language.title}</div>
          {/* 中间部分 */}
          <div className={css.center}>
            {/* 输入框 */}
            <div className={css.inputbox}>
              <div className={css.inputboxInner}>
                <div className={css.inputboxInnerT}>
                  <input
                    className={css.input}
                    value={inputNum}
                    type="number"
                    onChange={(e) => {
                      if (e.target.value === "") {
                        setInputNum("");
                      } else {
                        if (checkFloatNumber(e.target.value)) {
                          let number = e.target.value;
                          if (number - nowCanBuy > 0) {
                            number = nowCanBuy;
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
                  <div>T</div>
                </div>
                <div className={css.divider}></div>
                <div className={css.inputboxInnerB}>
                  <div className={css.balance}>
                    {language.most}：{nowCanBuy}
                  </div>
                  <div
                    className={css.max}
                    onClick={() => {
                      if (WFILBalance / props.TTruePrice - nowCanBuy < 0) {
                        setInputNum(
                          interception(WFILBalance / props.TTruePrice, 4)
                        );
                      } else {
                        setInputNum(interception(nowCanBuy, 4));
                      }
                    }}
                  >
                    MAX
                  </div>
                </div>
              </div>
            </div>
            {/* 价格 */}
            <div className={css.price}>
              <div className={css.left}>{language.price}</div>
              <div className={css.priceRight}>{props.TPrice} WFIL/T</div>
            </div>
            <div className={css.line}></div>
            {/* 所需支付 */}
            <div className={css.income}>
              <div className={css.left}>{language.need}:</div>
              <div className={css.incomeRight}>
                {inputNum > 0
                  ? interception(props.TTruePrice * inputNum, 4)
                  : 0}{" "}
                WFIL
              </div>
            </div>
            {/* WFIL余额 */}
            <div className={css.line}></div>
            <div className={css.income}>
              <div className={css.left}>WFIL {language.balance}:</div>
              <div className={css.incomeRight}>{WFILBalance} WFIL</div>
            </div>
            {/* 启用按钮 */}
            <div
              className={classNames(
                css.start,
                (interception(props.TTruePrice * inputNum, 4) - WFILBalance >
                  0 ||
                  interception(nowCanBuy) - inputNum < 0 ||
                  inputNum <= 0) &&
                  css.disabled
              )}
              onClick={() => {
                if (inputNum > 0) {
                  if (
                    interception(props.TTruePrice * inputNum, 4) -
                      WFILBalance <=
                      0 &&
                    interception(nowCanBuy) - inputNum >= 0
                  ) {
                    handleClick();
                  }
                } else if (inputNum <= 0) {
                  Toast.info(language.empty);
                }
              }}
            >
              {language.buy}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default inject(
  "lang",
  "chain",
  "mobility",
  "forceMining",
  "boardroom"
)(observer(BuyLotteryWindow));
