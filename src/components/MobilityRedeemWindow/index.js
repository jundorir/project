import React from "react";
import css from "./index.module.less";
import close from "@assets/images/icon/close.png";
import { inject, observer } from "mobx-react";
import classNames from "classnames";
import { Toast } from "antd-mobile";
import { checkFloatNumber } from "@utils/common";

function MobilityredeemWindow(props) {
  const { lang, mobility, type } = props;
  const { selectedLang } = lang;
  const [language, setLanguage] = React.useState({});
  const [inputNum, setInputNum] = React.useState("");
  let balance = mobility[`user${[type]}LpPower`];
  React.useEffect(
    (props) => {
      if (selectedLang.key === "English") {
        setLanguage({
          redemption: "Redemption of the LP",
          pledged: "pledged",
          number: "Number of redemption",
          cancel: "cancel",
          ensure: "ensure",
          redeemSuccess: "redeem success",
          redeemFail: "redeem fail",
        });
      } else if (selectedLang.key === "TraditionalChinese") {
        setLanguage({
          redemption: "贖回LP",
          pledged: "已质押",
          number: "贖回數量",
          cancel: "取消",
          ensure: "確定",
          redeemSuccess: "贖回成功",
          redeemFail: "贖回失敗",
        });
      } else if (selectedLang.key === "SimplifiedChinese") {
        setLanguage({
          redemption: "赎回LP",
          pledged: "已质押",
          number: "赎回数量",
          cancel: "取消",
          ensure: "确定",
          redeemSuccess: "赎回成功",
          redeemFail: "赎回失败",
        });
      }
    },
    [selectedLang.key]
  );
  const closeWindow = React.useCallback(() => {
    props.closeMobilityRedeemWindow();
  }, [props]);

  async function redeemLiquidity() {
    let result = false;
    try {
      result = await mobility.redeemLiquidity(inputNum, type);
      if (result) {
        Toast.success(language.redeemSuccess);
      } else {
        Toast.fail(language.redeemFail);
      }
    } catch {
      Toast.fail(language.redeemFail);
    }

    if (result) {
      // queryAllowanceAll();
      setInputNum(0);
    }
  }
  // 取消按钮
  const handleCancle = React.useCallback(() => {
    closeWindow();
  }, [closeWindow]);
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
        <div className={css.title}>{language.redemption}</div>
        {/* 中间部分 */}
        <div className={css.center}>
          <div className={css.hasPledged}>
            {language.pledged} {type === "U" ? "USDT/MMR" : "T/WFIL"} LP
          </div>
          <div className={css.pledgedShow}>
            <span className={css.pledgedShowNum}>{balance}</span>
            {/* <span className={css.pledgedShowUnit}>WFIL</span> */}
          </div>
          <div className={css.getscale}>{language.number}</div>
          <div className={css.inputbox}>
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
          <div className={css.instructions}>{language[4]}</div>
        </div>
        {/* 按钮行 */}
        <div className={css.button}>
          <div className={css.cancleButton} onClick={handleCancle}>
            {language.cancel}
          </div>
          <div
            className={classNames(
              css.ensureButton,
              inputNum - 0 <= 0 && css.disabled
            )}
            onClick={() => {
              if (inputNum - 0 <= 0) return;
              redeemLiquidity();
            }}
          >
            {language.ensure}
          </div>
        </div>
      </div>
    </div>
  );
}

export default inject("lang", "mobility")(observer(MobilityredeemWindow));
