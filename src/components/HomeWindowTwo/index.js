import React from "react";
import css from "./index.module.less";
import close from "@assets/images/icon/close.png";
// import question from '@assets/images/home/question.png'
import { inject, observer } from "mobx-react";

function HomeWindowTwo(props) {
  const { lang, server } = props;
  const { selectedLang } = lang;
  const [language, setLanguage] = React.useState([]);

  React.useEffect(() => {
    if (selectedLang.key === "English") {
      setLanguage(["Power"]);
    } else if (selectedLang.key === "TraditionalChinese") {
      setLanguage(["算力"]);
    } else if (selectedLang.key === "SimplifiedChinese") {
      setLanguage(["算力"]);
    }
  }, [selectedLang.key]);

  if (props?.show === false) return null;

  return (
    <div
      className={css.gainWindow}
      onClick={() => {
        props.closeModal();
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
              props.closeModal();
            }}
            className={css.closeImg}
            src={close}
            alt=" "
          />
        </div>
        <div className={css.MFIL}>
          <div className={css.MFILLeft}>{`MFIL ${language[0]}`}</div>
          <div className={css.MFILRight}>{server.ratio_mmr}</div>
        </div>
        <div className={css.line}></div>
        <div className={css.MMR}>
          <div className={css.MMRLeft}>{`MMR ${language[0]}`}</div>
          <div className={css.MMRRight}>{server.ratio_fil}</div>
        </div>
      </div>
    </div>
  );
}

export default inject("lang", "server")(observer(HomeWindowTwo));
