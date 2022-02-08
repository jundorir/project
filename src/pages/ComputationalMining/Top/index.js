import React from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import rightimg from "@assets/images/icon/headerLogo.png";

function Top(props) {
  const { lang, chain } = props;
  const { selectedLang } = lang;
  const [language, setLanguage] = React.useState([]);
  React.useEffect(() => {
    if (selectedLang.key === "English") {
      setLanguage(["Computational Mining", "Current Block number"]);
    } else if (selectedLang.key === "TraditionalChinese") {
      setLanguage(["算力挖礦", "當前區塊號"]);
    } else if (selectedLang.key === "SimplifiedChinese") {
      setLanguage(["算力挖矿", "当前区块号"]);
    }
  }, [selectedLang.key]);
  React.useEffect(() => {
    let interval = null;
    if (chain.address) {
      chain.getCurrentBlock();
      interval = setInterval(() => {
        chain.getCurrentBlock();
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [chain.address]);
  return (
    <div className={css.contain}>
      <div className={css.inner}>
        <div className={css.left}>
          <div className={css.title}>{language[0]}</div>
          <div className={css.describle}>T/WFIL</div>
        </div>
        {/* <div className={css.right}> */}
          {/* <div className={css.word}>
            {language[1]}：{chain.currentBlockNumber}
          </div> */}
        {/* </div> */}
      </div>
    </div>
  );
}

export default inject("lang", "chain")(observer(Top));
