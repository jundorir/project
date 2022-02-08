import css from "./index.module.less";
import React from "react";
import { inject, observer } from "mobx-react";
import classNames from "classnames";
import { Toast } from "antd-mobile";

const languageContext = {
  English: {
    yourMobility: "your liquidity",
    addMobility: "add liquidity",
    capitalPool: "Share of bonus pool:",
    removeMobility: "Remove liquidity to retrieve tokens",
    add: "add",
    remove: "remove",
    notActive: "Please bind the inviter to activate the account first",
  },
  TraditionalChinese: {
    yourMobility: "您的流動性",
    removeMobility: "移除流動性以取回代幣",
    addMobility: "添加流動性",
    capitalPool: "資金池中的份額:",
    add: "添加",
    remove: "移除",
    notActive: "請先綁定邀請人激活賬號",
  },
  SimplifiedChinese: {
    yourMobility: "您的流动性",
    addMobility: "添加流动性",
    removeMobility: "移除流动性以取回代币",
    capitalPool: "资金池中的份额:",
    add: "添加",
    remove: "移除",
    notActive: "请先绑定邀请人激活账号",
  },
};
function MobilityItem(props) {
  const [open, setOpen] = React.useState(false);
  const {
    mobility,
    chain,
    lang: { selectedLang },
    type,
  } = props;
  const language = languageContext[selectedLang.key];
  const globalConfig = {
    U: {
      text: "USDT/MMR LP",
      amount: mobility.U.quiteLPAmount,
      percent: mobility.U.quiteMyPercentInPool,
      AFILSelected: "USDT",
      WFILSelected: "MMR",
    },
    T: {
      text: "T/WFIL LP",
      amount: mobility.T.quiteLPAmount,
      percent: mobility.T.quiteMyPercentInPool,
      AFILSelected: "T",
      WFILSelected: "WFIL",
    },
    MMRS_TO_USDT: {
      text: "USDT/MMRS LP",
      amount: mobility.MMRS_TO_USDT.quiteLPAmount,
      percent: mobility.MMRS_TO_USDT.quiteMyPercentInPool,
      AFILSelected: "USDT",
      WFILSelected: "MMRS",
    },
  };
  function showNotActiveTips() {
    Toast.info(language.notActive);
  }
  const config = globalConfig[type];

  return (
    <div className={classNames(css.line, open && css.open)}>
      <div
        className={css.lineHeader}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <div className={css.left}>
          <div className={css[`icon_${config.WFILSelected}`]} />
          <div className={css[`icon_${config.AFILSelected}`]} />
          <div className={css.text}>{config.text}</div>
        </div>
        <div className={classNames(css.right, open && css.up)} />
      </div>
      <div className={classNames(css.lineText, css.amount)}>
        <div className={css.left}>{config.amount}</div>
        <div className={css.right} />
      </div>
      <div className={css.lineText}>
        <div className={css.left}>{language.capitalPool}</div>
        <div className={css.right}>{config.percent}%</div>
      </div>
      <div className={css.buttons}>
        <div
          className={classNames(
            css.increaseBtn,
            !chain.isActive && css.disabled
          )}
          onClick={() => {
            if (!chain.isActive) {
              showNotActiveTips();
              return;
            }
            mobility.showAddMobility(type);
          }}
        >
          {language.add}
        </div>
        <div
          className={classNames(css.removeBtn, !chain.isActive && css.disabled)}
          onClick={() => {
            if (!chain.isActive) {
              showNotActiveTips();
              return;
            }
            mobility.showRemoveMobility(type);
          }}
        >
          {language.remove}
        </div>
      </div>
    </div>
  );
}

export default inject("mobility", "chain", "lang")(observer(MobilityItem));
