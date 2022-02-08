import React from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import AuthorizationModal from "@components/AuthorizationModal";
import { Toast } from "antd-mobile";
import classNames from "classnames";
import { checkFloatNumber } from "@utils/common";

const languageContext = {
  English: {
    tips: "MMRS-GR Plan",
    explain: "New MMR Ecology",
    approveSuccess: "approve success",
    approveFail: "approve fail",
    participateSuccess: "Successful subscription",
    participateFail: "Subscription failure",
    participateEnd: "Subscription end",
    alreadyParticipate: "You have subscribed",
    noBalance: "Insufficient funds",
    total: "total quota",
    subscribedAmount: "subscribedAmount",
    surplusAmount: "remaining amount",
    subscribeAmount: "subscriptionQuantity",
    balance: "balance",
    subscription: "subscription",
    subscribed: "subscribed",
    ieo: "IEO Description",
    title: "IEO Subscription",
    status0: "subscribing",
    status1: "subscribed",
    cannotJoin: "You cannot participate in this appointment",

    minLimit: "Each subscription cannot be less than 10",
    maxLimit: "Each subscription cannot be greater than 200",
    obtainedPower_board: "obtainedBoardPower",
    obtainedPower_MMRS: "obtainedMMRSPower",
    willObtainPower_board: "willObtainbBoardPower",
    willObtainPower_MMRS: "willObtainMMRSPower",

    tips1: "Each account is limited to ",
    tips2: " purchase per day",
    tips3: "The number range of each subscription is ",
    tips4:
      "The board's calculation power, MMRS calculation power will take effect on November 16, 2020",
  },
  TraditionalChinese: {
    tips: "MMRS-GR計劃",
    explain: "MMR全新生態",
    approveSuccess: "授權成功",
    approveFail: "授權失敗",
    participateSuccess: "認購成功",
    participateFail: "認購失敗",
    participateEnd: "認購已結束",
    alreadyParticipate: "您已認購",
    noBalance: "余額不足",
    total: "總額度",
    subscribedAmount: "已認購額度",
    surplusAmount: "剩余額度",
    subscribeAmount: "認購數量",
    balance: "可用余額",
    subscription: "認購",
    subscribed: "已認購",
    ieo: "IEO說明",
    title: "IEO認購",
    status0: "認購中",
    status1: "认购结束",
    cannotJoin: "您无法参与此次预约",
    minLimit: "每次認購不能小於10",
    maxLimit: "每次認購不能大於200",
    obtainedPower_board: "您已獲得董事會算力",
    obtainedPower_MMRS: "您已獲得MMRS算力",
    willObtainPower_board: "您將獲得董事會算力",
    willObtainPower_MMRS: "您將獲得MMRS算力",

    tips1: "每個賬號每天限購",
    tips2: "次",
    tips3: "每次認購數量範圍為 ",
    tips4: "董事會算力,MMRS算力將在2020-11-16日生效",
  },
  SimplifiedChinese: {
    tips: "MMRS-GR计划",
    explain: "MMR全新生态",
    approveSuccess: "授权成功",
    approveFail: "授权失败",
    participateSuccess: "认购成功",
    participateFail: "认购失败",
    participateEnd: "认购已结束",
    alreadyParticipate: "您已认购",
    noBalance: "余额不足",
    total: "总额度",
    subscribedAmount: "已认购额度",
    surplusAmount: "剩余额度",
    subscribeAmount: "认购数量",
    balance: "可用余额",
    subscription: "认购",
    subscribed: "已认购",
    ieo: "IEO说明",
    title: "IEO认购",
    status0: "认购中",
    status1: "认购结束",
    cannotJoin: "您无法参与此次预约",

    minLimit: "每次认购不能小于10",
    maxLimit: "每次认购不能大于200",
    obtainedPower_board: "您已获得董事会算力",
    obtainedPower_MMRS: "您已获得MMRS算力",
    willObtainPower_board: "您将获得董事会算力",
    willObtainPower_MMRS: "您将获得MMRS算力",
    tips1: "每个账号每天限购",
    tips2: "次",
    tips3: "每次认购数量范围为 ",
    tips4: "董事会算力,MMRS算力将在2020-11-16日生效",
  },
};
function OldPlan(props) {
  const {
    lang: { selectedLang },
    oldmmrsGR,
    chain,
  } = props;
  const language = languageContext[selectedLang.key];
  const [USDT_APPROVE_AMOUNT, setApprove] = React.useState(0);
  const [balance, setBalace] = React.useState(0);
  const [showModal, setShowModal] = React.useState(false);
  const isApprove = USDT_APPROVE_AMOUNT >= oldmmrsGR.subscription;

  React.useEffect(() => {
    if (chain.address) {
      oldmmrsGR.queryUserAmount();
      queryBalanceAll();
      queryAllowanceAll();
    }
  }, [chain.address]);

  async function queryBalanceAll() {
    const USDT = await chain.queryBalance("USDT");
    setBalace(USDT);
  }

  async function queryAllowanceAll() {
    const USDTAllowance = await chain.queryAllowanceAsync({
      type: "MMRS_GR",
      symbol: "USDT",
    });

    setApprove(USDTAllowance);
  }

  async function handleSubscribe() {
    if (oldmmrsGR.subscription < oldmmrsGR.min) {
      Toast.info(language.minLimit);
      return;
    }

    if (oldmmrsGR.subscription > oldmmrsGR.max) {
      Toast.info(language.maxLimit);
      return;
    }

    if (balance - oldmmrsGR.subscription < 0) {
      // 余额不足
      Toast.info(language.noBalance);
      return;
    }

    if (!isApprove) {
      // 未授权
      setShowModal(true);
      return;
    }

    try {
      const result = await oldmmrsGR.toFreeBuy();
      if (result) {
        Toast.success(language.participateSuccess);
      } else {
        Toast.fail(language.participateFail);
      }
    } catch (e) {
      Toast.fail(language.participateFail);
    }
  }

  async function toApprove(symbol = "USDT") {
    try {
      let { status, approveAmount } = await chain.toApprove({
        type: "MMRS_GR",
        symbol,
      });
      setApprove(approveAmount);
      if (status) {
        Toast.success(language.approveSuccess);
      } else {
        Toast.fail(language.approveFail);
      }
    } catch (e) {
      Toast.fail(language.approveFail);
    }
  }

  function renderModal() {
    if (showModal === true)
      return (
        <AuthorizationModal
          toApprove={toApprove}
          closeModal={() => {
            setShowModal("");
          }}
          AFIL_isApprove={isApprove}
          WFIL_isApprove={true}
          AFIL="USDT"
        />
      );
    return null;
  }

  return (
    <div className={css.plan}>
      <div className={css.banner}>
        <div className={css.box}>
          <div className={css.logo}>{language.tips}</div>
          <div className={css.explain}>{language.explain}</div>
        </div>
      </div>
      <div className={css.content}>
        <div className={css.box}>
          <div className={css.title}>
            <div>{language.title}</div>
            <div className={css.right}>{language.status0}</div>
          </div>
          <div className={css.item}>
            <div className={css.left}>{language.subscribedAmount}:</div>
            <div className={css.right}>
              {oldmmrsGR.userAmount}
              <span>USDT</span>
            </div>
          </div>
          <div className={css.item}>
            <div className={css.left}>{language.obtainedPower_board}:</div>
            <div className={css.right}>{oldmmrsGR.obtainedPower.BOARD}</div>
          </div>
          <div className={css.item}>
            <div className={css.left}>{language.obtainedPower_MMRS}:</div>
            <div className={css.right}>{oldmmrsGR.obtainedPower.MMRS}</div>
          </div>
          <div className={css.subscription}>{language.subscribeAmount}</div>
          <div className={css.inputBox}>
            <input
              value={oldmmrsGR.subscription}
              className={css.input}
              type="number"
              onChange={(e) => {
                console.log("eee", e.target.value);
                if (e.target.value === "") {
                  oldmmrsGR.setSubscription(e.target.value);
                } else {
                  if (checkFloatNumber(e.target.value)) {
                    let number = e.target.value;

                    if (number.length > 1 && number.startsWith("0")) {
                      number = number.replace(/^[0]+/, "");
                      if (number === "") number = "0";
                      if (number.startsWith(".")) number = "0" + number;
                    }
                    oldmmrsGR.setSubscription(number);
                  }
                }
              }}
            />
            <span>USDT</span>
          </div>
          <div className={css.balance}>
            {language.balance}: {balance} USDT
          </div>
          <div className={css.profit}>
            <div className={css.item}>
              <div className={css.left}>{language.willObtainPower_board}:</div>
              <div className={css.right}>{oldmmrsGR.willObtainPower.BOARD}</div>
            </div>
            <div className={classNames(css.item, css.noBoader)}>
              <div className={css.left}>{language.willObtainPower_MMRS}:</div>
              <div className={css.right}>{oldmmrsGR.willObtainPower.MMRS}</div>
            </div>
          </div>
          <div
            className={css.subscriptionButton}
            onClick={() => {
              handleSubscribe();
            }}
          >
            {language.subscription}
          </div>
          <div className={css.introduce}>
            <div className={css.head}>{language.ieo}:</div>
            <div className={css.tip}>
              1.{language.tips1} <span>1</span> {language.tips2}
            </div>
            <div className={css.tip}>
              2.{language.tips3} <span>10</span> - <span>200</span> USDT
            </div>
            <div className={css.tip}>
              3.董事会算力,MMRS算力将于 2021-11-16 生效
            </div>
          </div>
        </div>
      </div>
      {renderModal()}
    </div>
  );
}

export default inject("lang", "oldmmrsGR", "chain")(observer(OldPlan));
