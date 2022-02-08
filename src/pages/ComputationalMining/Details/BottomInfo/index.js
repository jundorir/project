import classNames from "classnames";
import css from "./index.module.less";
import React from "react";
import RedeemModal from "../../components/RedeemModal";
import PledgeModal from "../../components/PledgeModal";
import { inject, observer } from "mobx-react";
import { Toast } from "antd-mobile";
import { interception } from "@utils/common";
import NewRedeemModal from "../../components/NewRedeemModal";

function BottomInfo(props) {
  const { lang, chain, computationalPower, round, server } = props;
  const { selectedLang } = lang;
  const {
    myTInDeposit = 0,
    myWFILInDeposit = 0,
    TBalance = 0,
    totalLpInPool = 1000000,
    totalSales = 2000,
    pledgeTotalPower = 0,
  } = computationalPower.round.get(round) || {};
  const { release_lock = 0 } = server.OrdinaryT[round] ?? {};
  const { is_stack = "0", product_hashrate } =
    server.productInfo?.get(round) || {};

  const [language, setLanguage] = React.useState([]);
  const [showModal, setShowModal] = React.useState("");

  const closeModal = React.useCallback(() => {
    setShowModal("");
  }, []);

  let pledgeTotalPercent = 0;
  let current_product_hashrate = 0;
  if (totalSales !== 0) {
    pledgeTotalPercent = (pledgeTotalPower / totalSales).toFixed(8);
  }
  if (pledgeTotalPercent !== 0) {
    current_product_hashrate = (product_hashrate / pledgeTotalPercent).toFixed(
      8
    );
  } else {
    current_product_hashrate = (product_hashrate * totalSales).toFixed(8);
  }

  React.useEffect(() => {
    const g_language = {
      English: {
        myPledgeTPower: "PledgedTPower:",
        myPledgeWFILPower: "PledgedWFILPower:",
        myTBalance: "TPowerBalance:",
        myLockT: "MyLockT:",
        notActive: "Please bind the inviter to activate the account first",
        pledge: "pledge",
        redeem: "redeem",
        already: "T/WFIL quantity is pledged",
        undamagedT: "My pledged T",
        pledgePercent: "My pledge percentage",
        notStart: "pledge has not been opened",
        current: 'Actual output per T per day'
      },
      TraditionalChinese: {
        myPledgeTPower: "我質押的算力:",
        myPledgeWFILPower: "我質押的WFIL:",
        myTBalance: "剩余可質押算力:",
        myLockT: "個人T總鎖倉:",
        notActive: "請先綁定邀請人激活賬號",
        pledge: "質押",
        redeem: "贖回",
        already: "已質押T/WFIL數量",
        undamagedT: "我質押的T",
        pledgePercent: "我的質押占比",
        notStart: "質押尚未開啟",
        current: '每T每天實際產量',
      },
      SimplifiedChinese: {
        myPledgeTPower: "我质押的算力:",
        myPledgeWFILPower: "我质押的WFIL:",
        myTBalance: "剩余可质押算力:",
        myLockT: "个人T总锁仓:",
        notActive: "请先绑定邀请人激活账号",
        pledge: "质押",
        redeem: "赎回",
        already: "已质押T/WFIL数量",
        undamagedT: "我质押的T",
        pledgePercent: "我的质押占比",
        notStart: "质押尚未开启",
        current: '每T每天实际产量'
      },
    };

    setLanguage(g_language[selectedLang.key]);
  }, [selectedLang.key]);

  function renderModal() {
    if (showModal === "redeem") {
      if (round > 4) {
        return <NewRedeemModal closeModal={closeModal} round={round} />;
      }
      return <RedeemModal closeModal={closeModal} round={round} />;
    }

    if (showModal === "pledge") {
      return <PledgeModal closeModal={closeModal} round={round} />;
    }

    return null;
  }
  React.useEffect(() => {
    if (chain.address) {
      computationalPower.queryMyTInDesposit(round);
      computationalPower.queryWFILInDesposit(round);
      computationalPower.queryTBalance(round);
      if (round > 4) {
        computationalPower.queryTotalLpInPool(round);
      }
    }
  }, [chain.address, computationalPower, round]);

  function renderList() {
    if (round > 4) {
      return (
        <>
          <div className={css.item}>
            <div className={css.left}>{language.undamagedT}</div>
            <div className={css.right}>{myTInDeposit * 2}T</div>
          </div>
          <div className={css.item}>
            <div className={css.left}>{language.pledgePercent}</div>
            <div className={css.right}>
              {((myTInDeposit * 2 * 100) / totalSales).toFixed(2)}%
            </div>
          </div>
          <div className={css.item}>
            <div className={css.left}>{language.current}</div>
            <div className={css.right}>{current_product_hashrate}WFIL</div>
          </div>
          {/* <div className={css.item}>
            <div className={css.left}>{language.LPPercent}</div>
            <div className={css.right}>
              {((myWFILInDeposit * 100) / totalLpInPool).toFixed(4)}%
            </div>
          </div> */}
        </>
      );
    }

    return (
      <>
        <div className={css.item}>
          <div className={css.left}>{language.myPledgeTPower}</div>
          <div className={css.right}>{myTInDeposit}T</div>
        </div>
        <div className={css.item}>
          <div className={css.left}>{language.myPledgeWFILPower}</div>
          <div className={css.right}>{myWFILInDeposit}WFIL</div>
        </div>
        <div className={css.item}>
          <div className={css.left}>{language.myLockT}</div>
          <div className={css.right}>
            {(myTInDeposit * release_lock).toFixed(4)}WFIL
          </div>
        </div>
      </>
    );
  }

  return (
    <div className={css.bottomInfo}>
      <div className={css.title}>{language.already}</div>
      <div className={css.list}>
        {renderList()}
        <div className={classNames(css.item, css.last)}>
          <div className={css.left}>{language.myTBalance}</div>
          <div className={css.right}>{interception(TBalance)}T</div>
        </div>
      </div>
      <div className={css.buttons}>
        <div
          className={classNames(
            css.button,
            !(is_stack === "1" && chain.address && chain.isActive) &&
              css.disabled
          )}
          onClick={() => {
            if (is_stack === "0") {
              Toast.fail(language.notStart);
              return;
            }
            if (chain.address && chain.isActive) {
              setShowModal("pledge");
            } else if (!chain.isActive) {
              Toast.fail(language.notActive);
            }
          }}
        >
          {language.pledge}
        </div>
        <div
          className={classNames(
            css.button,
            css.replevy,
            !(chain.address && chain.isActive) && css.disabled
          )}
          onClick={() => {
            if (chain.address && chain.isActive) {
              setShowModal("redeem");
            } else if (!chain.isActive) {
              Toast.fail(language.notActive);
            }
          }}
        >
          {language.redeem}
        </div>
      </div>

      {renderModal()}
    </div>
  );
}

export default inject(
  "lang",
  "chain",
  "server",
  "computationalPower"
)(observer(BottomInfo));
