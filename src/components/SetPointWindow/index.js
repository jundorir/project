import React, { useEffect } from "react";
import css from "./index.module.less";
import close from "@assets/images/icon/close.png";
import mark from "@assets/images/icon/mark.png";
import { inject, observer } from "mobx-react";
import classNames from "classnames";
import { checkFloatNumber } from "@utils/common";

function SetPointWindow(props) {
  const { lang, chain, view = "" } = props;
  const { selectedLang } = lang;
  const [language, setLanguage] = React.useState({});
  const [inputNum, setInputNum] = React.useState(
    chain.simpleUser[`user${view}SlippageTolerance`] / 100
  );
  const [allowanceOne, setAllowanceOne] = React.useState("");
  let balance = 100;
  React.useEffect(
    (props) => {
      if (selectedLang.key === "English") {
        setLanguage({
          setting: "Setting",
          global: "global",
          speed: "Default transaction speed (GWEI)",
          normal: "normal(5)",
          fast: "fast(6)",
          timely: "timely(7)",
          // exchange: "Exchange and mobility",
          exchange: "swap",
          tolerance: "Slip point tolerance",
          instructions: "Your transaction may fail",
          closingTime: "Closing time (minutes)",
          expertMode: "expert mode",
          forbidden: "Disable multi hop",
          tone: "Light prompt tone",
          comutational: "Computational mining",
        });
      } else if (selectedLang.key === "TraditionalChinese") {
        setLanguage({
          setting: "設置",
          global: "全局",
          speed: "默認交易速度（GWEI）",
          normal: "标准(5)",
          fast: "快速(6)",
          timely: "及时(7)",
          // exchange: "交換和流動性",
          exchange: "交換",
          tolerance: "滑點容差",
          instructions: "您的交易可能會失敗",
          closingTime: "交易截止時間(分鐘)",
          expertMode: "專家模式",
          forbidden: "禁用多跳",
          tone: "輕快提示音",
          comutational: "算力挖礦",
        });
      } else if (selectedLang.key === "SimplifiedChinese") {
        setLanguage({
          setting: "设置",
          global: "全局",
          speed: "默认交易速度（GWEI）",
          normal: "标准(5)",
          fast: "快速(6)",
          timely: "及时(7)",
          // exchange: "交换和流动性",
          exchange: "交换",
          comutational: "算力挖矿",
          tolerance: "滑点容差",
          instructions: "您的交易可能会失败",
          closingTime: "交易截止时间(分钟)",
          expertMode: "专家模式",
          forbidden: "禁用多跳",
          tone: "轻快提示音",
        });
      }
    },
    [selectedLang.key]
  );
  const closeWindow = React.useCallback(() => {
    props.closeSetPointWindow();
  }, [props]);

  function changeSimpleUser(userSlippageTolerance) {
    chain.setSimpleUser({
      ...chain.simpleUser,
      [`user${view}SlippageTolerance`]: userSlippageTolerance * 100,
    });
    setInputNum(userSlippageTolerance);
  }

  //选择容差
  function chooseOne(value) {
    const num = value - 0;
    if (
      (num === 0.1 && allowanceOne === "0.1") ||
      (num === 0.5 && allowanceOne === "0.5") ||
      (num === 1 && allowanceOne === "1.0")
    ) {
      changeSimpleUser(0);
    } else {
      changeSimpleUser(value);
    }
  }
  //监听容差输入框
  useEffect(() => {
    const num = inputNum - 0;
    let value = num;
    if (num === 0.1) {
      value = allowanceOne === "0.1" ? "" : "0.1";
    }
    if (num === 0.5) {
      value = allowanceOne === "0.5" ? "" : "0.5";
    }
    if (num === 1) {
      value = allowanceOne === "1.0" ? "" : "1.0";
    }
    setAllowanceOne(value);
  }, [inputNum]);

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
        <div className={css.title}>{language.setting}</div>
        {/* 中间部分 */}
        <div className={css.center}>
          <div className={css.exchange}>
            {view === "" ? language.exchange : language.comutational}
          </div>
          <div className={css.line}> </div>
          <div className={css.tolerance}>
            {language.tolerance}
            {/* <img src={mark} alt="" className={css.mark} /> */}
          </div>
          <div className={css.inputbox}>
            <input
              className={css.input}
              value={inputNum}
              type="number"
              onChange={(e) => {
                if (e.target.value === "") {
                  changeSimpleUser("");
                } else {
                  if (checkFloatNumber(e.target.value, 2)) {
                    let number = e.target.value;
                    if (number - balance > 0) {
                      number = balance;
                    }
                    if (number.length > 1 && number.startsWith("0")) {
                      number = number.replace(/^[0]+/, "");
                      if (number === "") number = "0";
                      if (number.startsWith(".")) number = "0" + number;
                    }
                    changeSimpleUser(number);
                  }
                }
              }}
            />
            <div className={css.percent}>%</div>
          </div>
          <div className={css.checkAllowance}>
            {["0.1", "0.5", "1.0"].map((item) => {
              return (
                <div
                  key={item}
                  className={classNames(
                    css.options,
                    allowanceOne === item && css.checkoptions
                  )}
                  onClick={() => {
                    chooseOne(item);
                  }}
                >
                  {item}%
                </div>
              );
            })}
          </div>
          <div className={css.instructions}>{language.instructions}</div>
          {/* <div className={css.closingTime}>
            <div className={css.closingTimeL}>
              {language.closingTime}
              <img src={mark} alt="" className={css.mark} />
            </div>
            <div className={css.closingTimeR}>20</div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default inject("lang", "chain")(observer(SetPointWindow));
