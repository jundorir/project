import React from "react";
import css from "./index.module.less";
import close from "@assets/images/icon/close.png";
import { inject, observer } from "mobx-react";
import { Toast } from "antd-mobile";

function GetbackWindow(props) {
  const { lang, chain, forceMining, round } = props;
  const { selectedLang } = lang;
  const { userBoardPower } = forceMining;
  const [language, setLanguage] = React.useState([]);
  React.useEffect(
    (props) => {
      if (selectedLang.key === "English") {
        setLanguage({
          title: "Calculate force subscribe",
          now: "Current address individual board calculation MMR is",
          isSure: "Determine whether the subscription",
          ensure: "ensure",
          success: "Subscription successful",
          fail: "Subscribe to failure",
        });
      } else if (selectedLang.key === "TraditionalChinese") {
        setLanguage({
          title: "算力認購",
          now: "當前地址個人董事會MMR為",
          isSure: "確定是否認購",
          ensure: "確定",
          success: "認購成功",
          fail: "認購失敗",
        });
      } else if (selectedLang.key === "SimplifiedChinese") {
        setLanguage({
          title: "算力认购",
          now: "当前地址个人董事会MMR为",
          isSure: "确定是否认购",
          ensure: "确定",
          success: "认购成功",
          fail: "认购失败",
        });
      }
    },
    [selectedLang.key]
  );
  const closeWindow = React.useCallback(() => {
    props.closeForceMiningSignUpWindow();
  }, [props]);

  // 确定认购报名
  async function toSignUp() {
    // console.log(chain.address)
    if (chain.address) {
      try {
        const result = await forceMining.toSignUpByRound(round);
        if (result) {
          closeWindow();
          Toast.success(language.success);
        }
      } catch (error) {
        Toast.fail(language.fail);
      }
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
        <div className={css.title}>{language.title}</div>
        {/* 中间部分 */}
        <div className={css.now}>{language.now}</div>
        <div className={css.num}>{userBoardPower}</div>
        <div className={css.isSure}>{language.isSure}</div>
        <div className={css.button} onClick={toSignUp}>
          {language.ensure}
        </div>
      </div>
    </div>
  );
}

export default inject(
  "lang",
  "chain",
  "boardroom",
  "forceMining"
)(observer(GetbackWindow));
