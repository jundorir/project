import React from "react";
import css from "./index.module.less";
import close from "@assets/images/icon/close.png";
import { inject, observer } from "mobx-react";
import classNames from "classnames";
import { Toast } from "antd-mobile";

function EnsurePledgeModal(props) {
  const { lang, AFIL_Number, WFIL_Number, AFIL, WFIL, toPledge } = props;
  const { selectedLang } = lang;
  const [language, setLanguage] = React.useState([]);
  React.useEffect(() => {
    const languages = {
      English: {
        sure: "Are you sure to pledge?",
        AFIL: `${AFIL} required for pledge`,
        WFIL: `${WFIL} required for pledge`,
        cancel: "cancel",
        ensure: "ensure",
        fail: "Transaction failure",
        success: "trade successfully",
      },
      TraditionalChinese: {
        sure: "確定質押？",
        AFIL: `質押需要的${AFIL}`,
        WFIL: `質押需要的${WFIL}`,
        cancel: "取消",
        ensure: "確定",
        fail: "交易失敗",
        success: "交易成功",
      },
      SimplifiedChinese: {
        sure: "确定质押?",
        AFIL: `质押需要的${AFIL}`,
        WFIL: `质押需要的${WFIL}`,
        cancel: "取消",
        ensure: "确定",
        fail: "交易失败",
        success: "交易成功",
      },
    };
    setLanguage(languages[selectedLang.key]);
  }, [selectedLang.key]);

  const closeWindow = React.useCallback(() => {
    props.closeModal();
  }, [props]);
  // 确定质押

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
        <div className={css.title}>{language.sure}</div>
        {/* 中间部分 */}
        <div className={css.center}>
          <div className={css.pledgeCurrency}>
            <div>{language.AFIL}</div>
            <div>
              {AFIL_Number}&nbsp;{AFIL}
            </div>
          </div>
          <div className={css.line}></div>
          <div className={css.pledgeCurrency}>
            <div>{language.WFIL}</div>
            <div>
              {WFIL_Number}&nbsp; {WFIL}
            </div>
          </div>
        </div>
        {/* 按钮行 */}
        <div className={css.button}>
          <div className={css.cancleButton} onClick={closeWindow}>
            {language.cancel}
          </div>
          <div
            className={classNames(css.ensureButton)}
            onClick={() => {
              toPledge();
            }}
          >
            {language.ensure}
          </div>
        </div>
      </div>
    </div>
  );
}

export default inject("lang")(observer(EnsurePledgeModal));
