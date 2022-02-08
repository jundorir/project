import React from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import MoreDetailsWindow from "@components/MoreDetailsWindow";
import { checkFloatNumber } from "@utils/common";
import classNames from "classnames";
import { Toast } from "antd-mobile";
import AuthorizationModal from "@components/AuthorizationModal";
import Stepper from "./Stepper";
function Details(props) {
  const { lang, chain, forceMiningNew: forceMining, showRound, server } = props;
  const { selectedLang } = lang;
  const [showModal, setShowModal] = React.useState(null);
  const [inputNum, setInputNum] = React.useState("");
  const [language, setLanguage] = React.useState({});

  React.useEffect(() => {
    if (selectedLang.key === "English") {
      setLanguage({
        price: "unit price",
        title: "FIL power",
        more: "More details ",
        period: "period",
        sold: "current-period quantity",
        left: "left",
        pledge: "pledge",
        inBuy: "In the subscription",
        signUp: "Subscribe to sign up",
        refused: "No qualification for registration",
        isSignUp: "Subscribed for",
        pay: "Pay",
        continuePay: "Continue to pay",
        overPay: "Buy limited",
        strategy: "Calculate force mining strategy",
        strategy1: "Buy to calculate force",
        in: "in",
        lastTime: "deadline",
        buylastTime: "deadline",
        notSignUp: "Not subscribe",
        href: "To view",
        closed: "Registration closed",
        already: "The power you have subscribed for",
        nothing: "not have",
        will: "coming soon",
        allEnd: "The subscription for the current period has closed",
        productIMG: "Product pictures",
        success: "success",
        fail: "faild",
        receive: "receive",
        stage: "stage",
        overTime: " end time",
        alreadyFM: "Has participated FM",
        expected: "expected T per FM",
        joinFM: " Has participated FM",
        canGet: "Can receive FM",
        share: "share of subscription power with FM ",
        length: "Get a power quota",
        way: "current period",
        FMBL: "FM balance",
        one: `1. Receiving FM: Receiving a certain amount of FM with the board of Directors' calculating power and WFIL's calculating power`,
        two: `2. Subscription stage: obtain the corresponding subscription shares of the current period with FM`,
        three: `3. Purchase stage: purchase the current period's computing power T within 24 hours`,
        four: `4. Rush purchase stage: if there is still residual computing power at the end of the subscription computing power stage, you can buy directly`,

        subscribeT: "subscribe",
        buyT: "buy",
        snapT: "Snap up",
        finishT: "ended",
        successfully: "Quota obtained successfully",
        failure: "Quota acquisition failure",
        insufficient: "WFIL balance is insufficient",
        successfulB: "Subscription successful",
        failureB: "Subscribe to failure",
        SuccessfulRP: "Successful rush purchase",
        RPfailed: "Rush purchase failed",
        CurrentCan: "can be subscribed to",
        totalLeft: "Remaining rush buying",
        nowEnd: "ended",
        head1: "Acquire subscription power share with FM",
        head2: "subscription",
        head3: "rush purchase",
        placeholder1: "Acquire subscription power share with FM",
        placeholder2: "Enter subscription quantity",
        placeholder3: "Enter the rush purchase quantity",
        buttonText1: "Get the power limit",
        buttonText2: "Confirm subscription",
        buttonText3: "Confirm rush purchase",
        need: "need ",
        balance: "balance",
        totalNet: "total network",
        currenAdd: "current address",
        theAddressCanBuy: "current address can buy: ",
        theAddressAlreadyBuy: "current address buyed: ",
        totalCanBuy: "surplus T",
      });
    } else if (selectedLang.key === "TraditionalChinese") {
      setLanguage({
        price: "單價",
        current: "當前期數：",
        title: "FIL算力",
        more: "更多詳情",
        period: "期",
        sold: "本期發售數量",
        left: "剩余",
        pledge: "質押",
        inBuy: "認購中",
        signUp: "已認購董事會MMR",
        refused: "暫無報名資格",
        isSignUp: "已認購報名",
        pay: "購買",
        continuePay: "继续購買",
        overPay: "已达到最大认购额度",
        strategy: "算力挖礦攻略",
        strategy1: "購買算力",
        in: "在",
        lastTime: "認購結束時間",
        buylastTime: "購買結束時間",
        notSignUp: "未認購報名",
        href: "算力節點查看",
        closed: "報名已結束",
        already: "您已認購的算力",
        nothing: "無",
        will: "即將上線",
        allEnd: "本期算力認購已結束",
        productIMG: "產品圖片",
        success: "領取成功",
        fail: "領取失敗",
        receive: "領取",
        stage: "階段",
        overTime: "結束時間",
        alreadyFM: "全網已參與FM",
        expected: "預計每份FM可認購算力",
        joinFM: "當前地址已參與FM",
        canGet: "可領取FM",
        share: "憑FM獲得認購算力份額",
        length: "獲得算力額度",
        way: "本期認購方式",
        FMBL: "FM余額",
        one: "1、領取FM：憑董事會算力及WFIL算力領取一定額度FM",
        two: "2、認購階段：憑FM獲得本期相應算力認購份額",
        three: "3、購買階段：在24小時內購買本期算力T",
        four: "4、搶購階段：若認購算力階段結束還有剩余算力，則可直接購買",
        subscribeT: "認購階段",
        buyT: "購買階段",
        snapT: "搶購階段",
        finishT: "已結束",
        successfully: "額度獲取成功",
        failure: "額度獲取失敗",
        insufficient: "WFIL余額不足",
        successfulB: "認購成功",
        failureB: "認購失敗",
        SuccessfulRP: "搶購成功",
        RPfailed: "搶購失敗",
        CurrentCan: "當前地址可認購算力",
        totalLeft: "全網剩余可搶購算力",
        nowEnd: "本期算力認購已結束",
        head1: "憑FM獲得認購算力份額",
        head2: "算力認購",
        head3: "算力搶購",
        placeholder1: "憑FM獲得認購算力份額",
        placeholder2: "輸入認購數量",
        placeholder3: "輸入搶購數量",
        buttonText1: "獲得算力額度",
        buttonText2: "確定認購",
        buttonText3: "確定搶購",
        need: "需要",
        balance: "余額",
        totalNet: "全網累計已認購算力",
        currenAdd: "當前地址已認購算力",
        theAddressCanBuy: "當前地址剩余可認購算力：",
        theAddressAlreadyBuy: "當前地址已認購算力",
        totalCanBuy: "全網剩余可搶購算力",
      });
    } else if (selectedLang.key === "SimplifiedChinese") {
      setLanguage({
        hasPledged: "已质押",
        getback: "取回",
        ForceMining: "算力认购",
        price: "单价",
        buy: "购买",
        current: "当前期数：",
        title: "FIL算力",
        more: "更多详情",
        period: "期",
        sold: "本期发售数量",
        left: "剩余",
        pledge: "质押",
        inBuy: "认购中",
        signUp: "认购报名",
        refused: "暂无报名资格",
        isSignUp: "已认购报名",
        pay: "购买",
        continuePay: "继续购买",
        overPay: "已达到最大认购额度",
        strategy: "算力挖矿攻略",
        strategy1: "购买算力",
        in: "在",
        lastTime: "认购结束时间",
        buylastTime: "购买结束时间",
        notSignUp: "未认购报名",
        href: "算力节点查看",
        closed: "报名已结束",
        already: "您已认购的算力",
        nothing: "无",
        will: "即将上线",
        allEnd: "本期算力认购已结束",
        productIMG: "产品图片",
        success: "领取成功",
        fail: "领取失败",
        receive: "领取",
        stage: "阶段",
        overTime: "结束时间",
        alreadyFM: "全网已参与FM",
        expected: "预计每份FM可认购算力",
        joinFM: "当前地址已参与FM",
        canGet: "可领取FM",
        share: "凭FM获得认购算力份额",
        length: "获得算力额度",
        way: "本期认购方式",
        FMBL: "FM余额",
        one: "1、领取FM：凭董事会算力及WFIL算力领取一定额度FM",
        two: "2、认购阶段：凭FM获得本期相应算力认购份额",
        three: "3、购买阶段：在24小时内购买本期算力T",
        four: "4、抢购阶段：若认购算力阶段结束还有剩余算力，则可直接购买",
        text1: "份额认购",
        text2: "认购",
        text3: "抢购",
        approveSuccess: "授权成功",
        approveFail: "授权失败",
        subscribeT: "认购阶段",
        buyT: "购买阶段",
        snapT: "抢购阶段",
        finishT: "已结束",
        successfully: "额度获取成功",
        failure: "额度获取失败",
        insufficient: "WFIL余额不足",
        successfulB: "认购成功",
        failureB: "认购失败",
        SuccessfulRP: "抢购成功",
        RPfailed: "抢购失败",
        CurrentCan: "当前地址可认购算力",
        totalLeft: "全网剩余可抢购算力",
        nowEnd: "本期算力认购已结束",
        head1: "凭FM获得认购算力份额",
        head2: "算力购买",
        head3: "算力抢购",
        placeholder1: "凭FM获得认购算力份额",
        placeholder2: "输入认购数量",
        placeholder3: "输入抢购数量",
        buttonText1: "获得算力额度",
        buttonText2: "确定购买",
        buttonText3: "确定抢购",
        need: "需要",
        balance: "余额",
        totalNet: "全网累计已认购算力",
        currenAdd: "当前地址已认购算力",
        theAddressCanBuy: "当前地址剩余可认购算力：",
        theAddressAlreadyBuy: "当前地址已认购算力",
        totalCanBuy: "全网剩余可抢购算力",
      });
    }
  }, [selectedLang.key]);
  React.useEffect(() => {
    forceMining.init(showRound);
  }, [forceMining, showRound]);
  const {
    TBalance,
    userAmount,
    nowCanBuy,
    totalSubscribeAmount,
    TPrice,
    needWFILAmount,
    endTime,
    buyEndTime,
    rushEndTime,
    nowCanRushBuy,
    getTotalSales,
    joinedFM,
    FM_APPROMENT,
    WFIL_APPROMENT,
    blockTime,
  } = forceMining.round.get(showRound) || {};

  const stepsText = [
    {
      title: language.subscribeT,
      time: endTime,
    },
    {
      title: language.buyT,
      time: buyEndTime,
    },
    { title: language.snapT, time: rushEndTime },
    { title: language.finishT, time: rushEndTime },
  ];

  const NowSteps = getNowSteps();
  const NowStepText = stepsText[NowSteps];

  const { FMBalance, WFILBalance } = forceMining;
  const isFMApprove = inputNum > 0 && FM_APPROMENT - inputNum >= 0;
  const isWFILApprove = inputNum > 0 && WFIL_APPROMENT - inputNum >= 0;

  // 获取董事会已质押算力获取算力认购权限

  function getNowSteps() {
    const nowTime = ~~(+Date.now() / 1000);
    if (nowTime < endTime) {
      // 当前时间 小于 认购时间  认购阶段
      return 0;
    }

    if (nowTime < buyEndTime) {
      // 现在时间小于 购买结束时间  购买阶段
      return 1;
    }

    if (nowTime < rushEndTime) {
      // 现在时间 小于 抢购结束时间  抢购阶段
      return 2;
    }
    return 3;
  }

  React.useEffect(() => {
    if (chain.address) {
      forceMining.getWFILBalanceAsync();
      forceMining.getFMBalanceAsync();
      forceMining.queryAllowanceAll(showRound);
      forceMining.getTotalSubscribeAmountByRound(showRound);
      forceMining.getTBalanceByRound(showRound);
      forceMining.queryJoinedFM(showRound);
      forceMining.queryCanRushBuy(showRound);
    }
  }, [chain.address]);
  // 2、根据当前期数获取minerToken的地址 // 监测期数变化

  // 获取本期发售总量
  React.useEffect(() => {
    let timeInterval = null;
    changeInput("");
    if (timeInterval) clearInterval(timeInterval);

    // 查询T的价格
    forceMining.queryTPriceByRound(showRound);
    // 查询发售数量
    forceMining.queryTotalSalesByRound(showRound);

    if (chain.address && (NowSteps === 1 || NowSteps === 2)) {
      forceMining.getTBalanceByRound(showRound);
    }

    forceMining.queryEndTimeAll(showRound);
    forceMining.queryNowCanBuyByRound(showRound);
    forceMining.queryCanRushBuy(showRound);
    // 查询全网已经参与的FM
    forceMining.getTotalSubscribeAmountByRound(showRound);

    timeInterval = setInterval(() => {
      forceMining.getTimeByRound(showRound);
      if (NowSteps === 0) {
        // 预购阶段 获取已经销毁的fm数量
        forceMining.getTotalSubscribeAmountByRound(showRound);
      }

      if (chain.address && (NowSteps === 1 || NowSteps === 2)) {
        forceMining.getTBalanceByRound(showRound);
      }

      if (NowSteps === 1) {
        // 购买阶段  可购买数量
        forceMining.queryNowCanBuyByRound(showRound);
      }
      if (NowSteps === 2) {
        // 抢购阶段
        forceMining.queryCanRushBuy(showRound);
      }
    }, 3000);

    return () => {
      clearInterval(timeInterval);
    };
  }, [chain.address, forceMining, showRound, NowSteps]);

  function closeModal() {
    setShowModal(null);
  }

  async function toApprove(symbol) {
    console.log("toApprove", symbol);
    let type = "subscribe";
    if (symbol === "WFIL") type = "NewShop";
    try {
      const status = await forceMining.toApprove(type, symbol, showRound);
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
    if (showModal === "Auth_FM") {
      return (
        <AuthorizationModal
          closeModal={() => {
            setShowModal(null);
          }}
          AFIL_isApprove={isFMApprove}
          WFIL_isApprove={true}
          toApprove={toApprove}
          AFIL="FM"
          WFIL="FM"
        />
      );
    }

    if (showModal === "Auth_WFIL") {
      return (
        <AuthorizationModal
          AFIL_isApprove={isWFILApprove}
          WFIL_isApprove={true}
          toApprove={toApprove}
          AFIL="WFIL"
          WFIL="WFIL"
          closeModal={() => {
            setShowModal(null);
          }}
        />
      );
    }

    if (showModal === "MoreDetailsWindow") {
      console.log('MoreDetailsWindow ===>')
      return (
        <MoreDetailsWindow
          closeMoreDetailsWindow={closeModal}
          currentNper={showRound}
          getTotalSales={getTotalSales}
          TPrice={TPrice}
        />
      );
    }
    return null;
  }

  // 认购
  async function toSignUp() {
    console.log("isFMApprove", isFMApprove);
    if (!isFMApprove) {
      setShowModal("Auth_FM");
      return;
    }
    try {
      const result = await forceMining.toSignUpByRound(showRound, inputNum);
      if (result) {
        Toast.success(language.successfully);
        return;
      }
    } catch {}
    Toast.fail(language.failure);
  }

  // 购买
  async function toBuyT() {
    if (WFILBalance - needWFILAmount < 0) {
      Toast.show(language.insufficient);
      return;
    }
    if (!isWFILApprove) {
      setShowModal("Auth_WFIL");
      return;
    }
    try {
      const result = await forceMining.toBuyTByRound(inputNum, showRound);
      if (result) {
        Toast.success(language.successfulB);
        return;
      }
    } catch {}
    Toast.fail(language.failureB);
  }

  // 抢购
  async function toRushT() {
    if (WFILBalance - needWFILAmount < 0) {
      Toast.show(language.insufficient);
      return;
    }
    if (!isWFILApprove) {
      setShowModal("Auth_WFIL");
      return;
    }
    try {
      const result = await forceMining.toRushTByRound(inputNum, showRound);
      if (result) {
        Toast.success(language.SuccessfulRP);
        return;
      }
    } catch {}
    Toast.fail(language.RPfailed);
  }

  function changeInput(number) {
    if (number > 10 ** 10) {
      number = 10 ** 10;
    }
    setInputNum(number);
    if (NowSteps === 1 || NowSteps === 2) {
      // todo 获取需求的wfil
      forceMining.getNeedWFILNumber(number, showRound);
    }
  }

  function renderHotKey() {
    if (NowSteps === 1) {
      return (
        <div className={css.hotTips}>
          {language.theAddressCanBuy}
          <span className={css.context}>{nowCanBuy}T</span>
        </div>
      );
    }

    return null;
  }

  function renderBuyBox() {
    if (NowSteps < 3) {
      const head = [language.head1, language.head2, language.head3];
      const placeholder = [
        language.placeholder1,
        language.placeholder2,
        language.placeholder3,
      ];
      const symbol = ["FM", "T", "T"];
      const needSymbol = ["FM", "WFIL", "WFIL"];
      const balance = [FMBalance, WFILBalance, WFILBalance];
      const buttonText = [
        language.buttonText1,
        language.buttonText2,
        language.buttonText3,
      ];

      const buttonOnClick = [toSignUp, toBuyT, toRushT];
      const disabled = [
        inputNum > 0 && FMBalance - inputNum >= 0,
        inputNum > 0 &&
          nowCanBuy > 0 &&
          inputNum <= nowCanBuy &&
          WFILBalance - needWFILAmount >= 0,
        inputNum > 0 &&
          nowCanRushBuy > 0 &&
          inputNum - nowCanRushBuy <= 0 &&
          WFILBalance - needWFILAmount >= 0,
      ];

      return (
        <div className={css.swap}>
          <div className={css.head}>{head[NowSteps]}</div>
          {renderHotKey()}
          <div
            className={classNames(css.inputBox, {
              [css.hotKey]: NowSteps === 1,
            })}
          >
            <input
              className={css.input}
              placeholder={placeholder[NowSteps]}
              value={inputNum}
              disabled={false}
              type="number"
              onWheel={(e) => e.target.blur()}
              onChange={(e) => {
                if (e.target.value === "") {
                  changeInput("");
                } else {
                  if (checkFloatNumber(e.target.value)) {
                    let number = e.target.value;
                    if (number.length > 1 && number.startsWith("0")) {
                      number = number.replace(/^[0]+/, "");
                      if (number === "") number = "0";
                      if (number.startsWith(".")) number = "0" + number;
                    }
                    changeInput(number);
                  }
                }
              }}
            />

            <div className={css.symbol}>{symbol[NowSteps]}</div>
            <div
              className={css.max}
              onClick={() => {
                setMax();
              }}
            >
              MAX
            </div>
          </div>
          {NowSteps !== 0 && (
            <div className={classNames(css.balance, css.need)}>
              {language.need}
              {needSymbol[NowSteps]}: {needWFILAmount}
            </div>
          )}
          <div className={css.balance}>
            {needSymbol[NowSteps]}
            {language.balance}：{balance[NowSteps]}
          </div>
          <div
            className={classNames(
              css.button,
              !disabled[NowSteps] && css.disabled
            )}
            onClick={buttonOnClick[NowSteps]}
          >
            {buttonText[NowSteps]}
          </div>
        </div>
      );
    }

    return null;
  }

  function renderFlexInfo() {
    if (NowSteps === 0 || NowSteps === 1) {
      return (
        <>
          <div className={classNames(css.item, css.first)}>
            <div className={css.left}>{language.alreadyFM}</div>
            <div className={css.right}>{totalSubscribeAmount} FM</div>
          </div>
          <div className={css.item}>
            <div className={css.left}>{language.expected}</div>
            <div className={css.right}>
              {totalSubscribeAmount === "0"
                ? 0
                : (getTotalSales / totalSubscribeAmount).toFixed(4)}
              T
            </div>
          </div>
          <div className={css.item}>
            <div className={css.left}>{language.joinFM}</div>
            <div className={css.right}>{joinedFM} FM</div>
          </div>
          {NowSteps === 1 && (
            <div className={css.item}>
              <div className={css.left}>{language.theAddressAlreadyBuy}</div>
              <div className={css.right}>{TBalance} T</div>
            </div>
          )}
        </>
      );
    }

    if (NowSteps >= 2) {
      return (
        <>
          <div className={classNames(css.item, css.first)}>
            <div className={css.left}>{language.totalNet}</div>
            <div className={css.right}>{getTotalSales - nowCanRushBuy} T</div>
          </div>
          <div className={css.item}>
            <div className={css.left}>{language.currenAdd}</div>
            <div className={css.right}>{TBalance} T</div>
          </div>
          {NowSteps === 2 && (
            <div className={css.item}>
              <div className={css.left}>{language.totalCanBuy}</div>
              <div className={css.right}>{nowCanRushBuy} T</div>
            </div>
          )}
        </>
      );
    }
    return null;
  }
  function setMax() {
    if (NowSteps === 0) {
      changeInput(FMBalance);
      return;
    }

    if (NowSteps === 1) {
      changeInput(nowCanBuy);
    }

    if (NowSteps === 2) {
      changeInput(nowCanRushBuy);
    }
  }

  function renderBuy() {
    if (NowSteps === 3) return null;
    return (
      <div className={css.explainBox}>
        {renderBuyBox()}
        <div className={css.explain}>
          <div className={css.head}>{language.way}</div>
          <div className={css.explainText}>{language.one}</div>
          <div className={css.explainText}>{language.two}</div>
          <div className={css.explainText}>{language.three}</div>
          <div className={css.explainText}>{language.four}</div>
        </div>
      </div>
    );
  }

  // const stepsText = [language.text1, language.text2, language.text3];
  return (
    <>
      <Stepper
        round={showRound}
        step={NowSteps}
        deadline={[endTime, buyEndTime, rushEndTime, null]}
      ></Stepper>
      <div className={css.contain}>
        <div className={css.inner}>
          <div className={css.lineone}>
            <div className={css.lineoneL}>{NowStepText?.title}</div>
            <div></div>
            <a
              className={css.lineoneR}
              href={"https://filfox.info/zh/address/f021479"}
              target="_blank"
              rel="noreferrer"
            >
              {language.href}
            </a>
          </div>

          <div className={css.linefive}>
            {/* <div className={css.product}>
              <div className={css.productLine}>
                <div className={css.productLineOne}>{language.productIMG}</div>
                <div className={css.productLineTwo}>PRODUCT</div>
              </div>
            </div> */}
            <div className={css.linefiveInner}>
              <div className={css.current}>
                <div className={css.currentL}>
                  {language.title}
                  {showRound.toString().padStart(3, 0)}
                  {language.period}
                </div>
                <div
                  className={css.currentR}
                  onClick={() => {
                    console.log(111222333)
                    setShowModal("MoreDetailsWindow");
                  }}
                >
                  {language.more}
                </div>
              </div>
              <div className={css.innerline}></div>
              {/* 发行总量与单价 */}
              <div className={css.totalAndSold}>
                <div className={css.sold}>
                  <div className={css.soldL}>{language.sold}</div>
                  <div className={css.soldR}>{getTotalSales}T</div>
                </div>
                <div className={css.totalAndSoldLine}></div>
                <div className={css.price}>
                  <div className={css.priceL}>{language.price}</div>
                  <div className={css.priceR}>{TPrice}WFIL/T</div>
                </div>
              </div>
            </div>
          </div>

          <div className={css.detail}>
            <div className={css.list}>{renderFlexInfo()}</div>
          </div>
        </div>
      </div>

      {renderBuy()}
      {renderModal()}

    </>
  );
}
export default inject(
  "lang",
  "chain",
  "forceMiningNew",
  "server"
)(observer(Details));
