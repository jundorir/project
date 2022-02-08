import React from "react";
import css from "./index.module.less";
import QRCode from "qrcode.react";
import { inject, observer } from "mobx-react";
import { Toast } from "antd-mobile";
import classNames from "classnames";

const languageContext = {
  English: {
    headTips: "Make computing within reach",
    scan: "SCAN",
    copySuccess: "copy success",
    copyFail: "copy fail",
    copy: "copy",
  },
  TraditionalChinese: {
    headTips: "讓算力觸手可及",
    scan: "掃一掃",
    copySuccess: "復製成功",
    copyFail: "復製失敗",
    copy: "復製",
  },
  SimplifiedChinese: {
    headTips: "让算力触手可及",
    scan: "扫一扫",
    copySuccess: "复制成功",
    copyFail: "复制失败",
    copy: "复制",
  },
};
function Invitation(props) {
  const {
    lang: { selectedLang },
    chain,
  } = props;
  // const address = "http://192.168.101.168:3000/?sharer=" + chain.address;
  const inventerUser = chain.address
    ? `?sharer=${chain.address}`
    : `${chain.address}`;
  // const address = "https://www.mmr.finance/" + inventerUser;
  const address = `https://${window.location.host}/` + inventerUser;
  const [language, setLanguage] = React.useState(
    languageContext[selectedLang.key]
  );

  React.useEffect(() => {
    setLanguage(languageContext[selectedLang.key]);
  }, [selectedLang.key]);

  const copyWord = React.useCallback(() => {
    if (chain.address !== "") {
      // console.log(123);
      var tag = document.createElement("input");
      tag.setAttribute("id", "cp_input");
      tag.value = address;
      document.getElementsByTagName("body")[0].appendChild(tag);
      document.getElementById("cp_input").select();
      document.execCommand("copy");
      document.getElementById("cp_input").remove();
      Toast.success(languageContext[selectedLang.key].copySuccess);
    } else {
      Toast.fail(languageContext[selectedLang.key].copyFail);
    }
  }, [address]);
  return (
    <div className={css.invitation}>
      <div className={classNames(css.banner,  css[[selectedLang.key]])}>
        {/* <div className={css.box}>
          <div className={css.logo}>MMR</div>
          <div className={css.explain}>(MAKE ME RICH)</div>
          <div className={css.tips}>{language.headTips}</div>
          <div className={css.icon}></div>
        </div> */}
      </div>
      <div className={css.content}>
        <div className={css.qrCodeBox}>
          <div className={css.scan}>扫一扫</div>
          <div className={css.code}>
            <QRCode value={address} className={css.qr} />
          </div>
          <div className={css.link}>{address}</div>
          <div className={css.copy} onClick={() => copyWord()}>
            {language.copy}
          </div>
        </div>
      </div>
    </div>
  );
}

export default inject("chain", "lang")(observer(Invitation));
