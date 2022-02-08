import React from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";

function Header(props) {
  const { lang, chain } = props;
  const { selectedLang } = lang;
  const [language, setLanguage] = React.useState([]);
  React.useEffect(() => {
    if (selectedLang.key === "English") {
      setLanguage({
        proposal: "DAO Proposal",
        proposalInfo: "Real community governance",
        blockNumber: "Current Block number",
      });
    } else if (selectedLang.key === "TraditionalChinese") {
      setLanguage({
        proposal: "DAO提案",
        proposalInfo: "真正的社區治理",
        blockNumber: "當前區塊號",
      });
    } else if (selectedLang.key === "SimplifiedChinese") {
      setLanguage({
        proposal: "DAO提案",
        proposalInfo: "真正的社区治理",
        blockNumber: "当前区块号",
      });
    }
  }, [selectedLang.key]);
  return (
    <div className={css.contain}>
      <div className={css.inner}>
        <div className={css.left}>
          <div className={css.title}>{language.proposal}</div>
          <div className={css.describle}>{language.proposalInfo}</div>
        </div>
        <div className={css.right}>
          <div className={css.word}>
            {language.blockNumber}：{chain.currentBlockNumber}
          </div>
        </div>
      </div>
    </div>
  );
}

export default inject("lang", "chain")(observer(Header));
