import React, { memo } from "react";
import css from "./index.module.less";
const languageContext = {
  English: {
    error: "Blockchain network error",
    tips: "It can only be accessed through DAPP browser of BSC network",
    proposal: "Please check your wallet settings",
  },
  TraditionalChinese: {
    error: "區塊鏈網絡錯誤",
    tips: "只能通過bsc網絡的dapp瀏覽器訪問",
    proposal: "請檢查錢包設置",
  },
  SimplifiedChinese: {
    error: "区块链网络错误",
    tips: "只能通过bsc网络的dapp浏览器访问",
    proposal: "请检查钱包设置",
  },
};
const NetWorkError = memo((props) => {
  const { language } = props;
  const lang = languageContext[language];
  // console.log("lang", lang);
  return (
    <div className={css.network}>
      <div className={css.box}>
        <div className={css.error} />
        <div className={css.title}>{lang.error}</div>
        <div className={css.tips}>{lang.tips}</div>
        <div className={css.tips}>{lang.proposal}</div>
      </div>
    </div>
  );
});

export default NetWorkError;
