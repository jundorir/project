import { Toast } from "antd-mobile";
import classNames from "classnames";
import { inject, observer } from "mobx-react";
import css from "./index.module.less";
import React from "react";
import GainWindow from "@components/GainWindow";

const languageContext = {
  English: {
    unclaimedIncome: "Income to beclainmed",
    totalIncomeTips: "Accumulated received：",
    receive: "receive",
    retrieve: "retrieve",
    addLiquidity: "add liquidity",
    none: "No profit",
    notActive: "Please bind the inviter to activate the account first",
  },
  TraditionalChinese: {
    unclaimedIncome: "待領取收益",
    totalIncomeTips: "累計已領取：",
    receive: "領取",
    retrieve: "取回",
    addLiquidity: "添加流動性",
    none: "暫無收益",
    notActive: "請先綁定邀請人激活賬號",
  },
  SimplifiedChinese: {
    unclaimedIncome: "待领取收益",
    totalIncomeTips: "累计已领取：",
    receive: "领取",
    retrieve: "取回",
    addLiquidity: "添加流动性",
    none: "暂无收益",
    notActive: "请先绑定邀请人激活账号",
  },
};
function Gain(props) {
  const {
    computationalPower,
    lang: { selectedLang },
    chain,
    round,
  } = props;
  const language = languageContext[selectedLang.key];
  const [showModal, setShowModal] = React.useState(false);
  const { unclaimedIncome = 0, totalIncome = 0 } =
    computationalPower.round.get(round) || {};

  React.useEffect(() => {
    let interval = null;
    if (chain.address) {
      computationalPower.requestUpdateIncome(round);
      interval = setInterval(() => {
        computationalPower.requestUpdateIncome(round);
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [chain.address]);

  async function receiveIncome() {
    if (!chain.address || unclaimedIncome - 0 <= 0) {
      Toast.info(language.none);
      return;
    }
    const result = await computationalPower.receiveReward(round);
    if (result) {
      computationalPower.requestUpdateIncome(round);
      setShowModal(true);
    }
  }

  function renderModal() {
    if (showModal) {
      return (
        <GainWindow
          closeGainWindow={() => {
            setShowModal(false);
          }}
        />
      );
    }

    return null;
  }

  return (
    <div className={css.incomeBox}>
      <div className={css.tips}>{language.unclaimedIncome}</div>
      <div className={css.totalBox}>
        <div className={css.total}>{unclaimedIncome}</div>
        <div className={css.symbol}>WFIL</div>
      </div>
      <div className={classNames(css.receive)} onClick={receiveIncome}>
        {language.receive}
      </div>

      <div className={css.bottom}>
        <div className={css.left}>
          {language.totalIncomeTips}
          {totalIncome}WFIL
        </div>
      </div>
      {renderModal()}
    </div>
  );
}

export default inject("lang", "chain", "computationalPower")(observer(Gain));
