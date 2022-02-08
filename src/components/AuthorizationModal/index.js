import React from "react";
import css from "./index.module.less";
import close from "@assets/images/icon/close.png";
import reauthorization from "@assets/images/icon/reauthorization.png";
import { inject, observer } from "mobx-react";
import { Toast } from "antd-mobile";

function AuthorizationModal(props) {
  const { lang, chain, AFIL_isApprove, WFIL_isApprove, toApprove, AFIL, WFIL } =
    props;
  const { selectedLang } = lang;
  const [language, setLanguage] = React.useState([]);
  // console.log("AFIL_isApprove, WFIL_isApprove", AFIL_isApprove, WFIL_isApprove);
  React.useEffect(() => {
    if (selectedLang.key === "English") {
      setLanguage([
        "asset deficiency",
        "Please authorize",
        "Authorized",
        "Authorized",
        "Authorization success",
      ]);
    } else if (selectedLang.key === "TraditionalChinese") {
      setLanguage(["授權資產不足", "請授權", "授權", "授權", "授權成功"]);
    } else if (selectedLang.key === "SimplifiedChinese") {
      setLanguage(["授权资产不足", "请授权", "授权", "授权", "授权成功"]);
    }
  }, [selectedLang.key]);
  const closeWindow = React.useCallback(() => {
    props.closeModal();
  }, [props]);

  React.useEffect(() => {
    if (AFIL_isApprove && WFIL_isApprove) {
      closeWindow();
    }
  }, [AFIL_isApprove, WFIL_isApprove]);
  // 授权MMR

  return (
    <div
      className={css.gainWindow}
      onClick={() => {
        closeWindow();
      }}
    >
      <div
        className={css.gainBox}
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
        {/* getsuccess图 */}
        <div className={css.logImg}>
          <img src={reauthorization} alt="" className={css.img} />
        </div>
        {/* 标题 */}
        {/* <div className={css.title}>{language[1]}</div> */}
        {/* 按钮 */}
        {!AFIL_isApprove && (
          <>
            <div className={css.bottomButton}>
              <div className={css.title}>
                {AFIL} {language[0]}
              </div>
              <div
                className={css.authorizationBTN}
                onClick={() => {
                  toApprove(AFIL);
                }}
              >
                {language[2]}
              </div>
            </div>
            {!WFIL_isApprove && <div className={css.line}></div>}
          </>
        )}
        {!WFIL_isApprove && (
          <div className={css.bottomButton}>
            <div className={css.title}>
              {WFIL} {language[0]}
            </div>
            <div
              className={css.pledgeBTN}
              onClick={() => {
                toApprove(WFIL);
              }}
            >
              {language[3]}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default inject("lang", "chain")(observer(AuthorizationModal));
