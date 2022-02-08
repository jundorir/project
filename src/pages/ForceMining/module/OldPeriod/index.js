import React, { Fragment, useCallback } from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import ForceMiningBuyWindow from "@components/ForceMiningBuyWindow";
import ForceMiningSignUpWindow from "@components/ForceMiningSignUpWindow";
import MoreDetailsWindow from "@components/MoreDetailsWindow";
import Countdown from "@components/Countdown";
import { interception } from "@utils/common";
import { useHistory } from "react-router-dom";
import classNames from "classnames";
import { Toast } from "antd-mobile";

function Details(props) {
  const history = useHistory();
  const { lang, chain, boardroom, forceMining, showRound } = props;
  const { selectedLang } = lang;
  const { hasPledged, totalHasPledged } = boardroom;
  const [showModal, setShowModal] = React.useState(null);

  React.useEffect(() => {
    forceMining.init(showRound);
  }, [forceMining, showRound]);

  const {
    countdown,
    TBalance,
    userAmount,
    endTime,
    buyEndTime,
    biggestLimit,
    nowCanBuy,
    totalSubscribeAmount,
    overTime,
    buyLeft,
    subscribeLeft,
    TPrice,
    TTruePrice,
    getTotalSales,
  } = forceMining.round.get(showRound) || {};

  console.log(
    "nowCanBuy + TBalance",
    nowCanBuy + TBalance,
    nowCanBuy,
    TBalance
  );

  const [language, setLanguage] = React.useState({});

  React.useEffect(() => {
    if (selectedLang.key === "English") {
      setLanguage({
        hasPledged: "Has pledged",
        getback: "get back",
        ForceMining: "Calculate force subscribe",
        price: "unit price",
        buy: "buy",
        current: "Current period:",
        title: "FIL power",
        more: "More details ",
        timeLeft: "time remaining：",
        period: "period",
        sold: "current-period quantity",
        left: "left",
        pledge: "pledge",
        inBuy: "In the subscription",
        obligation: "obligation",
        all: "Network board of directors power",
        had: "Subscribed for board account",
        signUp: "Subscribe to sign up",
        refused: "No qualification for registration",
        isSignUp: "Subscribed for",
        pay: "Pay",
        continuePay: "Continue to pay",
        overPay: "Buy limited",
        instructions: "Subscribe explain",
        instructions1:
          "MR members subscribe at the discretion of the board of directors",
        instructions2:
          "After the subscription and registration, the maximum personal subscription quota of the current period will be allocated according to the registration quota",
        instructions3:
          "After the subscription, pay WFIL to obtain the corresponding calculation force T",
        strategy: "Calculate force mining strategy",
        strategy1: "Buy to calculate force",
        in: "in",
        inOne: "liquidity",
        inTwo: "Calculate the force mining",
        strategy2: "Add T/WFIL liquidity to the liquidity page",
        strategy3: "to liquidity page Pledge ",
        strategy4: "Earn revenue on the liquidity mining page",
        biggest: "Maximum amount you can subscribe:",
        red: "Obtain the corresponding calculation power after completing the payment，purchase end time can be calculated after mining",
        lastTime: "deadline",
        buylastTime: "deadline",
        notSignUp: "Not subscribe",
        href: "Calculate the force node view",
        closed: "Registration closed",
        already: "The power you have subscribed for",
        nothing: "not have",
        will: "coming soon",
        allEnd: "The subscription for the current period has closed",
        productIMG: "Product pictures",
      });
    } else if (selectedLang.key === "TraditionalChinese") {
      setLanguage({
        hasPledged: "已質押",
        getback: "取回",
        ForceMining: "算力認購",
        price: "單價",
        buy: "購買",
        current: "當前期數：",
        title: "FIL算力",
        more: "更多詳情",
        timeLeft: "距離認購結束還剩：",
        period: "期",
        sold: "本期發售數量",
        left: "剩余",
        pledge: "質押",
        inBuy: "認購中",
        obligation: "待付款",
        all: "全網董事會算力",
        had: "全網已认购董事会MMR",
        signUp: "已認購董事會MMR",
        refused: "暫無報名資格",
        isSignUp: "已認購報名",
        pay: "購買",
        continuePay: "继续購買",
        overPay: "已达到最大认购额度",
        instructions: "認購說明",
        instructions1: "MMR會員憑借董事會MMR質押數量進行認購報名",
        instructions2: "認購報名結束後根據報名額度分配本期個人最大認購額度",
        instructions3: "認購結束後支付WFIL獲得相應的算力T",
        strategy: "算力挖礦攻略",
        strategy1: "購買算力",
        in: "在",
        inOne: "流動性",
        inTwo: "算力挖礦",
        strategy2: "頁面 添加 T/WFIL 流動性",
        strategy3: "頁面 質押",
        strategy4: "頁面 獲取收益",
        biggest: "您的認購最大額度：",
        red: "完成付款後獲得相應算力，購買結束時間以後可進行算力挖礦",
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
        timeLeft: "距离认购结束还剩：",
        period: "期",
        sold: "本期发售数量",
        left: "剩余",
        pledge: "质押",
        inBuy: "认购中",
        obligation: "待付款",
        all: "全网董事会MMR",
        had: "全网已认购董事会MMR",
        signUp: "认购报名",
        refused: "暂无报名资格",
        isSignUp: "已认购报名",
        pay: "购买",
        continuePay: "继续购买",
        overPay: "已达到最大认购额度",
        instructions: "认购说明",
        instructions1: "MMR会员凭借董事会MMR质押数量进行认购报名",
        instructions2: "认购报名结束后根据报名额度分配本期个人最大认购额度",
        instructions3: "认购结束后支付WFIL获得相应的算力T",
        strategy: "算力挖矿攻略",
        strategy1: "购买算力",
        in: "在",
        inOne: "流动性",
        inTwo: "算力挖矿",
        strategy2: "页面 添加 T/WFIL 流动性",
        strategy3: "页面 质押 ",
        strategy4: "页面 获取收益",
        biggest: "您的认购最大额度：",
        red: "完成付款后获得相应算力，购买结束时间以后可进行算力挖矿",
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
      });
    }
  }, [selectedLang.key]);
  // 获取董事会已质押算力获取算力认购权限

  function renderPayShow() {
    if (TBalance <= 0 && overTime <= 0) {
      return language.pay;
    } else if (TBalance > 0 && overTime <= 0) {
      if (nowCanBuy <= 0) {
        return language.overPay;
      } else if (nowCanBuy > 0) {
        return language.continuePay;
      }
    }
    if (overTime > 0) {
      return language.allEnd;
    }
  }

  // 渲染按钮行
  function renderBTN() {
    if (overTime >= 0) {
      // 已结束
      return <div className={css.graybtn}>{language.allEnd}</div>;
    }
    if (userAmount > 0 && countdown > 0) {
      // 已认购报名
      return <div className={css.graybtn}>{language.isSignUp}</div>;
    } else if (userAmount > 0 && countdown <= 0) {
      // 付款
      return (
        <div
          className={classNames(
            css.btn,
            nowCanBuy <= 0 || overTime >= 0 ? css.disabled : ""
          )}
          onClick={() => {
            if (nowCanBuy > 0 && overTime < 0) {
              toPay();
            }
          }}
        >
          {renderPayShow()}
        </div>
      );
    } else if (userAmount <= 0 && hasPledged <= 0 && countdown > 0) {
      // 没有算力，未结束认购，暂无报名资格
      return <div className={css.graybtn}>{language.refused}</div>;
    } else if (userAmount <= 0 && countdown <= 0 && overTime < 0) {
      // 没有认购
      return <div className={css.graybtn}>{language.notSignUp}</div>;
    } else if (userAmount <= 0 && hasPledged > 0 && countdown > 0) {
      // 认购报名
      return (
        <div className={css.btn} onClick={tosignUp}>
          {language.signUp}
        </div>
      );
    }
  }
  // 监听TBalance与biggestLimit变化改变付款显示状态

  // 监测是否已认购报名、已质押、发生变化
  // 转换时间戳
  function timestampToTime(timestamp) {
    if (timestamp === 0) return null;
    var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + "-";
    var M =
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) + "-";
    var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
    var h =
      (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
    var m =
      (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
      ":";
    var s =
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
  }

  // 渲染状态文字
  function renderState() {
    if (countdown <= 0 && userAmount > 0 && TBalance <= 0 && overTime < 0) {
      return language.obligation; // 待付款
    } else if (countdown > 0) {
      return language.inBuy; // 认购中
    }
  }
  // 认购报名弹窗
  function tosignUp() {
    setShowModal("ForceMiningSignUpWindow");
  }

  // 付款弹窗
  function toPay() {
    if (chain.address) {
      forceMining.getWFILBalanceAsync();
    }
    setShowModal("ForceMiningBuyWindow");
  }

  React.useEffect(() => {
    if (chain.address) {
      boardroom.getHasPledged();
      boardroom.getTotalPledged();
      forceMining.getWFILBalanceAsync();
      forceMining.getTotalSubscribeAmountByRound(showRound);
      forceMining.getTBalanceByRound(showRound);
      forceMining.getUserBoardPowerByRound(showRound);
    }
  }, [chain.address]);
  // 2、根据当前期数获取minerToken的地址 // 监测期数变化

  // 获取本期发售总量
  React.useEffect(() => {
    let timeInterval = null;

    if (chain.address) {
      if (timeInterval) clearInterval(timeInterval);

      forceMining.queryTPriceByRound(showRound);
      forceMining.queryTotalSalesByRound(showRound);
      forceMining.getEndTimeByRound(showRound);
      forceMining.getTimeByRound(showRound);
      forceMining.queryNowCanBuyByRound(showRound);

      timeInterval = setInterval(() => {
        forceMining.getTimeByRound(showRound);
        forceMining.getTotalSubscribeAmountByRound(showRound);
        forceMining.queryNowCanBuyByRound(showRound);
        forceMining.getTBalanceByRound(showRound);
      }, 3000);
    }

    return () => {
      clearInterval(timeInterval);
    };
  }, [chain.address, forceMining, showRound]);

  // 倒计时
  function renderCountDown(num) {
    if (num === 3) return null;
    if (overTime >= 0 && countdown <= 0) return null;
    const deadline = num === 1 ? subscribeLeft : buyLeft;
    if (deadline * 1000 - Date.now() <= 0) return null;
    return (
      <Countdown
        deadline={deadline}
        current={num}
        onEnd={(num) => {
          if (num === 2) {
            renderCountDown(3);
          }
          if (countdown > 0) {
            renderCountDown(1);
          } else if (overTime < 0 && countdown <= 0) {
            renderCountDown(2);
          }
        }}
      />
    );
  }

  function closeModal() {
    setShowModal(null);
  }

  function renderModal() {
    console.log('showModal', showModal)
    if (showModal === "ForceMiningSignUpWindow") {
      return (
        <ForceMiningSignUpWindow
          closeForceMiningSignUpWindow={closeModal}
          round={showRound}
        />
      );
    }
    if (showModal === "ForceMiningBuyWindow") {
      return (
        <ForceMiningBuyWindow
          closeForceMiningBuyWindow={closeModal}
          TPrice={TPrice}
          TTruePrice={TTruePrice}
          nowCanBuy={nowCanBuy}
          round={showRound}
        />
      );
    }

    if (showModal === "MoreDetailsWindow") {
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

  return (
    <Fragment>
      {/* 算力挖矿 */}
      <div className={css.contain}>
        <div className={css.inner}>
          <div className={css.lineone}>
            <div className={css.lineoneL}>{language.ForceMining}</div>
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
                    setShowModal("MoreDetailsWindow");
                  }}
                >
                  {language.more}
                </div>
                {/* <div className={css.currentR}>{renderState()}</div> */}
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
          <div className={css.time}>
            <div className={css.timeInner}>
              <div className={css.timeInnerLine}>
                <div className={css.timeInnerLineL}>
                  {language.current}
                  {showRound.toString().padStart(3, 0)}
                  {language.period}
                </div>
                <div className={css.timeInnerLineStage}>{renderState()}</div>
              </div>
              <div className={css.division}></div>
              <div className={css.timeInnerLine}>
                <div className={css.timeInnerLineL}>
                  {countdown > 0 ? language.lastTime : language.buylastTime}:
                </div>
                <div className={css.timeInnerLineR}>
                  {countdown > 0
                    ? timestampToTime(endTime)
                    : timestampToTime(buyEndTime)}
                </div>
              </div>
            </div>
            {/* 倒计时 */}
            {countdown > 0
              ? renderCountDown(1)
              : overTime < 0
              ? renderCountDown(2)
              : ""}
          </div>
          {/* 全网算力 */}
          {countdown > 0 ? (
            <div className={css.all}>
              <div className={css.allInner}>
                <div className={css.allInnerL}>{language.had}</div>
                <div className={css.allInnerR}>{totalSubscribeAmount}</div>
              </div>
            </div>
          ) : (
            ""
          )}
          {/* 您的认购最大额度 */}
          {/* {userAmount > 0 && countdown <= 0 ? ( */}
          {countdown <= 0 ? (
            <div className={css.biggest}>
              <div className={css.biggestInner}>
                <div className={css.yourData}>
                  <span>{language.biggest}</span>
                  <span className={css.biggestNum}>
                    {interception(nowCanBuy + TBalance)} T
                  </span>
                </div>
                <div className={css.biggestline}></div>
                <div className={css.yourData}>
                  <span>{language.already}：</span>
                  <span className={css.biggestNum}>{TBalance} T</span>
                </div>
                <div className={css.biggestline}></div>
                <div className={css.redword}>{language.red}</div>
              </div>
            </div>
          ) : (
            ""
          )}
          {/* 按钮行 */}
          {renderBTN()}
        </div>
      </div>
      {/* 认购说明 */}
      <div className={css.instructions}>
        <div className={css.instructionsInner}>
          <div className={css.instructionsTitle}>{language.instructions}</div>
          <div className={css.instructions1}>
            {/* <img className={css.markNum} src={pic1} alt="" /> */}
            <div className={css.markNum}>
              <div className={css.num}>1</div>
            </div>
            {language.instructions1}
          </div>
          <div className={css.instructions1}>
            {/* <img className={css.markNum} src={pic2} alt="" /> */}
            <div className={css.markNum}>
              <div className={css.num}>2</div>
            </div>
            {language.instructions2}
          </div>
          <div className={css.instructions1}>
            {/* <img className={css.markNum} src={pic3} alt="" /> */}
            <div className={css.markNum}>
              <div className={css.num}>3</div>
            </div>
            {language.instructions3}
          </div>
        </div>
      </div>
      <div className={css.strategy}>
        <div className={css.strategyInner}>
          <div className={css.strategyTitle}>{language.strategy}</div>
          <div className={css.strategy1}>
            {/* <img className={css.markNum} src={pic1} alt="" /> */}
            <div className={css.markNum}>
              <div className={css.num}>1</div>
            </div>
            {language.strategy1}
          </div>

          <div className={css.strategy1}>
            {/* <img className={css.markNum} src={pic2} alt="" /> */}
            <div className={css.markNum}>
              <div className={css.num}>2</div>
            </div>
            {language.in}&nbsp;&nbsp;
            <span
              className={css.mobilityMining}
              onClick={(e) => {
                e.stopPropagation();
                // Toast.info(language.will)
                document.getElementById("content").scrollTop = 0;
                history.push("/computationalMining");
              }}
            >
              {language.inTwo}
            </span>
            &nbsp;&nbsp;
            {language.strategy3}
          </div>
          <div className={css.strategy1}>
            {/* <img className={css.markNum} src={pic3} alt="" /> */}
            <div className={css.markNum}>
              <div className={css.num}>3</div>
            </div>
            {language.in}&nbsp;&nbsp;
            <span
              className={css.mobilityMining}
              onClick={(e) => {
                e.stopPropagation();
                // Toast.info(language.will)
                document.getElementById("content").scrollTop = 0;
                history.push("/computationalMining");
              }}
            >
              {language.inTwo}
            </span>
            &nbsp;&nbsp;
            {language.strategy4}
          </div>
        </div>
        {renderModal()}
      </div>
    </Fragment>
  );
}
export default inject(
  "lang",
  "chain",
  "boardroom",
  "forceMining"
)(observer(Details));
