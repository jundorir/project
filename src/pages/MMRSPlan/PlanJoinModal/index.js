import React from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import classNames from "classnames";
import { Toast } from "antd-mobile";
import AuthorizationModal from "@components/AuthorizationModal";
import close from "@assets/images/icon/close.png";
import { checkFloatNumber } from "@utils/common";
import { Fragment } from "react/cjs/react.production.min";

const languageContext = {
  English: {
    approveSuccess: "approve success",
    approveFail: "approve fail",
    ParticipateSuccess: "Participate Success",
    ParticipateFail: "Participate failure",
    noBalance: "Insufficient funds",
    balance: "balance",
    willObtain: "Will Obtain",
    tips: "Purchase is limited once a day, and each time can be subscribed ",

    MMRSBoardComputationalPower: "MMRS Board Power",
    MMRSComputationalPower: "MMRS Power",

    minLimit: "Each subscription cannot be less than ",
    maxLimit: "Each subscription cannot be greater than ",
    cumulativeAmountParticipated: "Total Participated",
    NumberOfParticipants: "Number Of Participants",
    Participate: "Participate",
    way: "participation way",
    sum: "balance",
    need: "need",
  },
  TraditionalChinese: {
    approveSuccess: "授權成功",
    approveFail: "授權失敗",
    ParticipateSuccess: "參與成功",
    ParticipateFail: "參與失敗",

    cumulativeAmountParticipated: "累計已參與金額",
    willObtain: "您將獲得",
    tips: "每日限購1次，每次可認購 ",

    minLimit: "每次認購不能小於",
    maxLimit: "每次認購不能大於",
    balance: "可用余額",
    noBalance: "余額不足",
    NumberOfParticipants: "參與數量",
    MMRSBoardComputationalPower: "MMRS董事會算力",
    MMRSComputationalPower: "MMRS算力",
    Participate: "立即參與",
    way: "選擇參與方式",
    sum: "余額",
    need: "需要",
  },
  SimplifiedChinese: {
    approveSuccess: "授权成功",
    approveFail: "授权失败",
    ParticipateSuccess: "参与成功",
    ParticipateFail: "参与失败",

    cumulativeAmountParticipated: "累计已参与金额",
    willObtain: "您将获得",
    boardPower: "MMRS董事会算力",
    MMRSPower: "MMRS算力",
    tips: "每日限购1次，每次可认购 ",

    minLimit: "每次认购不能小于",
    maxLimit: "每次认购不能大于",
    balance: "可用余额",
    noBalance: "余额不足",
    NumberOfParticipants: "参与数量",
    MMRSBoardComputationalPower: "MMRS董事会算力",
    MMRSComputationalPower: "MMRS算力",
    Participate: "立即参与",
    way: "选择参与方式",
    sum: "余额",
    need: "需要",
  },
};

function PlanJoinModal(props) {
  const {
    mmrsGR,
    chain,
    lang: { selectedLang },
    closeModal,
  } = props;
  const [USDT_APPROVE_AMOUNT, setApprove] = React.useState(0);
  const [{ WAY2_USDTAllowance, WAY2_MMRSAllowance }, setApproveWay2] =
    React.useState({
      WAY2_USDTAllowance: 0,
      WAY2_MMRSAllowance: 0,
    });
  const [balance, setBalace] = React.useState(0);
  const [MMRSbalance, setMMRSBalace] = React.useState(0);
  const [showModal, setShowModal] = React.useState(false);
  const isApprove = USDT_APPROVE_AMOUNT >= mmrsGR.subscription;
  const isApprove_WAY2_USDT = WAY2_USDTAllowance >= mmrsGR.subscription;
  const isApprove_WAY2_MMRS = WAY2_MMRSAllowance >= mmrsGR.needMMRS;
  //   const language = languageContext[selectedLang.key];
  const [language, setLanguage] = React.useState({});
  const [way, setWay] = React.useState("one");
  const inputMaxLimit = 10 ** 10;

  React.useEffect(() => {
    setLanguage(languageContext[selectedLang.key]);
  }, [selectedLang.key]);

  React.useEffect(() => {
    if (chain.address) {
      mmrsGR.queryUserAmount();
      mmrsGR.queryLimit();
      queryBalanceAll();
      queryAllowanceAll();
    }
  }, [chain.address]);

  React.useEffect(() => {
    if (way === "one") {
      mmrsGR.getMMRSInMMRS_GR(mmrsGR.subscription);
    }
  }, [way, mmrsGR]);

  async function queryBalanceAll() {
    const USDT = await chain.queryBalance("USDT");
    const MMRS = await chain.queryBalance("MMRS");
    setBalace(USDT);
    setMMRSBalace(MMRS);
  }

  async function queryAllowanceAll() {
    const USDTAllowance = await chain.queryAllowanceAsync({
      type: "Mediation",
      symbol: "USDT",
    });

    const WAY2_USDTAllowance = await chain.queryAllowanceAsync({
      type: "mmrs_pledge",
      symbol: "USDT",
    });
    const WAY2_MMRSAllowance = await chain.queryAllowanceAsync({
      type: "mmrs_pledge",
      symbol: "MMRS",
    });

    setApprove(USDTAllowance);
    setApproveWay2({
      WAY2_USDTAllowance,
      WAY2_MMRSAllowance,
    });
  }

  async function handleJoin() {
    if (mmrsGR.subscription - mmrsGR.min < 0) {
      Toast.info(language.minLimit + mmrsGR.min);
      return;
    }

    if (mmrsGR.subscription - mmrsGR.max > 0) {
      Toast.info(language.maxLimit + mmrsGR.max);
      return;
    }
    if (balance - mmrsGR.subscription < 0) {
      // USDT余额不足
      Toast.info("USDT" + language.noBalance);
      return;
    }

    if (way === "one") {
      if (MMRSbalance - mmrsGR.needMMRS < 0) {
        // MMRS余额不足
        Toast.info("MMRS" + language.noBalance);
        return;
      }

      if (!isApprove_WAY2_USDT || !isApprove_WAY2_MMRS) {
        // 未授权
        setShowModal(true);
        return;
      }
      try {
        const result = await mmrsGR.mixBuyInMMRS_GR();
        if (result) {
          Toast.success(language.ParticipateSuccess);
          mmrsGR.queryMMRSPlanReplaceData();
          mmrsGR.queryUserPowerMMRSBoard();
          closeModal();
        } else {
          Toast.fail(language.ParticipateFail);
        }
      } catch (e) {
        Toast.fail(language.ParticipateFail);
      }
    } else {
      if (!isApprove) {
        // 未授权
        setShowModal(true);
        return;
      }
      try {
        const result = await mmrsGR.toFreeBuy();

        if (result) {
          Toast.success(language.ParticipateSuccess);
          mmrsGR.queryMMRSPlanReplaceData();
          mmrsGR.queryUserPowerMMRSBoard();
          closeModal();
        } else {
          Toast.fail(language.ParticipateFail);
        }
      } catch (e) {
        Toast.fail(language.ParticipateFail);
      }
    }
  }

  function setMax() {
    mmrsGR.setSubscription(
      balance - mmrsGR.max > 0 ? mmrsGR.max : balance,
      way === "one"
    );
  }

  async function toApprove(symbol = "USDT") {
    try {
      let { status, approveAmount } = await chain.toApprove({
        type: "Mediation",
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

  async function toApprove_WAY2(symbol = "USDT") {
    try {
      let { status, approveAmount } = await chain.toApprove({
        type: "mmrs_pledge",
        symbol,
      });
      setApproveWay2({
        WAY2_USDTAllowance,
        WAY2_MMRSAllowance,
        [`WAY2_${symbol}Allowance`]: approveAmount,
      });
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
    if (showModal === true) {
      if (way === "two") {
        return (
          <AuthorizationModal
            toApprove={toApprove}
            closeModal={() => {
              setShowModal(false);
            }}
            AFIL_isApprove={isApprove}
            WFIL_isApprove={true}
            AFIL="USDT"
          />
        );
      }
      return (
        <AuthorizationModal
          toApprove={toApprove_WAY2}
          closeModal={() => {
            setShowModal(false);
          }}
          AFIL_isApprove={isApprove_WAY2_USDT}
          WFIL_isApprove={isApprove_WAY2_MMRS}
          AFIL="USDT"
          WFIL="MMRS"
        />
      );
    }

    return null;
  }
  function showChooseBox() {
    // setShowBox(!showBox);
  }
  function toChoose(item) {
    setWay(item);
  }
  function renderPublicItem() {
    return (
      <Fragment>
        <div className={css.item}>
          <div className={css.left}>
            {language.cumulativeAmountParticipated}:
          </div>
          <div className={css.right}>
            {mmrsGR.userAmount}
            <span>USDT</span>
          </div>
        </div>
        <div className={css.item}>
          <div className={css.left}>
            {language.tips} {mmrsGR.min} - {mmrsGR.max} USDT
          </div>
        </div>
        <div className={css.subscription}>
          {language.NumberOfParticipants}(USDT):
        </div>
        <div className={css.inputBox}>
          <input
            value={mmrsGR.subscription}
            className={css.input}
            type="number"
            onChange={(e) => {
              console.log("eee", e.target.value);
              if (e.target.value === "") {
                mmrsGR.setSubscription(e.target.value, way === "one");
                // if (way === "one") mmrsGR.getMMRSInMMRS_GR(0);
              } else {
                if (checkFloatNumber(e.target.value)) {
                  let number = e.target.value;
                  if (number.length > 1 && number.startsWith("0")) {
                    number = number.replace(/^[0]+/, "");
                    if (number === "") number = "0";
                    if (number.startsWith(".")) number = "0" + number;
                  }
                  if (number > inputMaxLimit) number = inputMaxLimit;
                  mmrsGR.setSubscription(number, way === "one");
                  // if (way === "one") mmrsGR.getMMRSInMMRS_GR(number);
                }
              }
            }}
          />
          <div className={css.max} onClick={setMax}>
            MAX
          </div>
        </div>
        <div className={css.balance}>
          {way === "USDT" ? `${language.balance}` : `USDT${language.sum}`}:
          {balance} USDT
        </div>
      </Fragment>
    );
  }
  function renderItem() {
    if (way === "two") {
      return <Fragment>{renderPublicItem()}</Fragment>;
    }
    return (
      <Fragment>
        {renderPublicItem()}
        <div className={css.needMMRS}>
          <div className={css.left}>{language.need}MMRS:</div>
          <div className={css.right}>{mmrsGR.needMMRS}</div>
        </div>
        <div className={css.balance}>
          MMRS{language.sum}:{MMRSbalance} MMRS
        </div>
      </Fragment>
    );
  }
  return (
    <div
      className={css.join}
      onClick={() => {
        closeModal();
      }}
    >
      <div
        className={css.joinBox}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={css.title}>
          <div>{language.NumberOfParticipants}(USDT)</div>
        </div>
        <div className={css.closeImgBox}>
          <img
            onClick={(e) => {
              e.stopPropagation();
              closeModal();
            }}
            className={css.closeImg}
            src={close}
            alt=" "
          />
        </div>
        <div className={classNames(css.item, css.topChooseBox)}>
          <div className={css.left}>{language.way}:</div>
          <div
            className={classNames(css.right, css.choose)}
            onClick={showChooseBox}
          >
            <div
              className={classNames(css.option, way === "one" && css.choosed)}
              onClick={() => {
                toChoose("one");
              }}
            >
              USDT+MMRS
            </div>
            <div
              className={classNames(css.option, way === "two" && css.choosed)}
              onClick={() => {
                toChoose("two");
              }}
            >
              USDT
            </div>
          </div>
        </div>
        {renderItem()}
        <div className={css.profit}>
          <div className={css.item}>
            <div className={css.tips}>{language.willObtain}</div>
          </div>
          <div className={css.item}>
            <div className={css.left}>
              {language.MMRSBoardComputationalPower}:
            </div>
            <div className={css.right}>
              {way === "one"
                ? mmrsGR.willObtainPower.MIXBOARD
                : mmrsGR.willObtainPower.BOARD}
            </div>
          </div>
          <div className={classNames(css.item, css.noBoader)}>
            <div className={css.left}>{language.MMRSComputationalPower}:</div>
            <div className={css.right}>
              {way === "one"
                ? mmrsGR.willObtainPower.MIXMMRS
                : mmrsGR.willObtainPower.MMRS}
            </div>
          </div>
        </div>
        <div
          className={css.button}
          onClick={() => {
            handleJoin();
          }}
        >
          {language.Participate}
        </div>
      </div>
      {renderModal()}
    </div>
  );
}

export default inject("lang", "mmrsGR", "chain")(observer(PlanJoinModal));
