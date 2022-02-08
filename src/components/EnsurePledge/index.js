import React from "react";
import css from "./index.module.less";
import close from "@assets/images/icon/close.png";
import { inject, observer } from "mobx-react";
import classNames from "classnames";
import { Toast } from "antd-mobile";

function EnsurePledge(props) {
  const { lang, chain } = props;
  const { selectedLang } = lang;
  const { myDeposit } = chain;
  const { toPledge } = chain;
  const [language, setLanguage] = React.useState([]);
  // console.log('props--->', props.planId)
  React.useEffect(() => {
    if (selectedLang.key === "English") {
      setLanguage([
        "Are you sure to pledge?",
        "Gain computing power",
        "Pledge time",
        "days",
        "Pledge quantity",
        "cancel",
        "OK",
        "Pledge successful",
        "Pledge failed",
        "computing power",
      ]);
    } else if (selectedLang.key === "TraditionalChinese") {
      setLanguage([
        "確定質押？",
        "獲得算力",
        "質押時間",
        "天",
        "質押數量",
        "取消",
        "確定",
        "質押成功",
        "質押失敗",
        "算力",
      ]);
    } else if (selectedLang.key === "SimplifiedChinese") {
      setLanguage([
        "确定质押?",
        "获得算力",
        "质押时间",
        "天",
        "质押数量",
        "取消",
        "确定",
        "质押成功",
        "质押失败",
        "算力",
      ]);
    }
  }, [myDeposit, selectedLang.key]);
  const closeWindow = React.useCallback(() => {
    props.closeEnsurePledgeWindow();
  }, [props]);
  // 确定质押
  const handleAgree = React.useCallback(async () => {
    // console.log("number===>", props.planId);
    try {
      const result = await toPledge(props.pledgeNum, props.planId);
      if (result) {
        Toast.success(`${language[7]}`);
        closeWindow();
        chain.requestChainData();
        props.callback();
      }
    } catch (error) {
      Toast.fail(`${language[8]}`);
    }
  }, [chain, closeWindow, language, props.planId, props.pledgeNum, toPledge]);
  // 取消按钮
  const handleCancle = React.useCallback(() => {
    closeWindow();
  }, [closeWindow]);
  return (
    <div
      className={css.ensurePledge}
      onClick={() => {
        closeWindow();
      }}
    >
      <div
        className={css.ensurePledgeBox}
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
        <div className={css.title}>{language[0]}</div>
        {/* 中间部分 */}
        <div className={css.center}>
          <div className={css.hasPledged}>{language[1]}</div>
          <div className={css.pledgedShow}>
            <div className={css.pledgedShowNum}>
              <div>WFIL&nbsp;&nbsp;{language[9]}</div>
              <div>{props.pledgeNum}</div>
            </div>
            <div className={css.line}></div>
            <div className={css.pledgedShowNum}>
              <div>MMR&nbsp;&nbsp;{language[9]}</div>
              <div>
                {(Math.floor(
                  (props.pledgeNum * Math.pow(10, 5) * props.computed) /
                  Math.pow(10, 3)
                ) / Math.pow(10, 4)).toFixed(4)}
              </div>
            </div>
          </div>
          <div className={css.pledgeTime}>
            <div>{language[2]}</div>
            <div>
              {props.pledgeTime}&nbsp;
              {language[3]}
            </div>
          </div>
          <div className={css.line}></div>
          <div className={css.pledgeNum}>
            <div>{language[4]}</div>
            <div>{props.pledgeNum}&nbsp;WFIL</div>
          </div>
        </div>
        {/* 按钮行 */}
        <div className={css.button}>
          <div className={css.cancleButton} onClick={handleCancle}>
            {language[5]}
          </div>
          <div
            className={classNames(css.ensureButton)}
            onClick={() => {
              handleAgree();
            }}
          >
            {language[6]}
          </div>
        </div>
      </div>
    </div>
  );
}

export default inject("lang", "chain")(observer(EnsurePledge));
