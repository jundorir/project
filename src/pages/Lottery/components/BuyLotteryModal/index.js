import React from "react";
import css from "./index.module.less";
import close from "@assets/images/icon/close.png";
import { inject, observer } from "mobx-react";
import classNames from "classnames";
import { Toast } from "antd-mobile";
import { randomTicketArray } from "@utils/common";
import AuthorizationModal from "@components/AuthorizationModal";

function BuyLotteryModal(props) {
  const { lang, chain, lottery } = props;
  const { selectedLang } = lang;
  const [language, setLanguage] = React.useState({});
  const [showModal, setShowModal] = React.useState(false);
  const [MMR_APPROVE_AMOUNT, setApprove] = React.useState(0);
  const [balance, setBalace] = React.useState(0);
  const isApprove = MMR_APPROVE_AMOUNT >= lottery.buyDetail.quiteActualCost;
  const isEnoughBalance = balance - lottery.buyDetail.quiteActualCost >= 0;
  const max = 1000;
  const availableBuyAmount = max - lottery.currentPeriodUserDetail.ticketAmount;

  React.useEffect(
    (props) => {
      const globalLanguage = {
        English: {
          title: "Buy a lottery ticket",
          balance: "balance",
          cost: "cost (MMR)",
          discount: "Bulk discount",
          needPay: "You have to pay",
          buy: "buy",
          content:
            '"Buy Now" will select a random number. The price is set before the start of each round, when it equals $5. It cannot be changed after purchase',
          empty: "Please enter the quantity",
          edit: "edit ticket number",
          noBalance: "Insufficient funds",
          buySuccess: "buy success",
          buyFail: "buy fail",
          approveSuccess: "approve success",
          approveFail: "approve fail",
          tipsBuy: "buy:",
          lotteryTicket: "lottery ticket",
        },
        TraditionalChinese: {
          title: "購買彩票",
          balance: "余額",
          cost: "成本(MMR)",
          discount: "批量折扣",
          needPay: "您需支付",
          buy: "立即購買",
          content:
            "“立即購買”會選擇隨機號碼。價格在每回合開始前確定，當時等於5美元。購買後不可更改",
          empty: "請輸入數量",
          edit: "查看編輯號碼",
          noBalance: "余額不足",
          buySuccess: "購買成功",
          buyFail: "購買失敗",
          approveSuccess: "授權成功",
          approveFail: "授權失敗",
          tipsBuy: "購買:",
          lotteryTicket: "彩票",
        },
        SimplifiedChinese: {
          title: "购买彩票",
          balance: "余额",
          cost: "成本(MMR)",
          discount: "批量折扣",
          needPay: "您需支付",
          buy: "立即购买",
          content:
            "“立即购买”会选择随机号码。价格在每回合开始前确定，当时等于5美元。购买后不可更改",
          empty: "请输入数量",
          edit: "查看编辑号码",
          noBalance: "余额不足",

          buySuccess: "购买成功",
          buyFail: "购买失败",
          approveSuccess: "授权成功",
          approveFail: "授权失败",
          tipsBuy: "购买:",
          lotteryTicket: "彩票",
        },
      };
      setLanguage(globalLanguage[selectedLang.key]);
    },
    [selectedLang.key]
  );

  const closeWindow = React.useCallback(() => {
    props.closeBuyLotteryWindow();
  }, [props]);

  React.useEffect(() => {
    if (chain.address) {
      queryBalanceAll();
      queryAllowanceAll();
    }
  }, [chain.address]);

  async function handleClick() {
    if (!isEnoughBalance) {
      // 余额不足
      Toast.info(language.noBalance);
      return;
    }
    if (!isApprove) {
      // 授权额度不足
      setShowModal(true);
      return;
    }
    const amount = parseInt(lottery.buyAmount);
    if (!!amount) {
      const randomTicket = randomTicketArray(amount);
      try {
        const result = await lottery.toBuyTickets(randomTicket);
        if (result) {
          Toast.success(language.buySuccess);
          lottery.refreshNewestLotteryData();
          closeWindow();
        } else {
          Toast.fail(language.buyFail);
        }
      } catch (e) {
        Toast.fail(language.buyFail);
      }
    } else {
      Toast.info(language.empty);
    }
  }

  async function queryBalanceAll() {
    const MMR = await chain.queryBalance("MMR");
    setBalace(MMR);
  }

  async function queryAllowanceAll() {
    const MMRAllowance = await chain.queryAllowanceAsync({
      type: "Lottery",
      symbol: "MMR",
    });

    setApprove(MMRAllowance);
  }

  async function toApprove(symbol = "MMR") {
    try {
      let { status, approveAmount } = await chain.toApprove({
        type: "Lottery",
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
          AFIL="MMR"
        />
      );
    return null;
  }

  return (
    <div
      className={css.getbackWindow}
      onClick={() => {
        closeWindow();
      }}
    >
      <div
        className={css.getbackBox}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* 关闭按钮 */}
        <div className={css.closeImgBox}>
          <img
            onClick={(e) => {
              e.stopPropagation();
              closeWindow();
            }}
            className={css.closeImg}
            src={close}
            alt=" "
          />
        </div>
        {/* 标题 */}
        <div className={css.title}>{language.title}</div>
        {/* 中间部分 */}
        <div className={css.center}>
          <div className={css.header}>
            <div className={css.buy}>{language.tipsBuy}</div>
            <div className={css.ticket}>
              <div className={css.text}>{language.lotteryTicket}</div>
              <div className={css.icon} />
            </div>
          </div>
          {/* 输入框 */}
          <div className={css.inputbox}>
            <input
              className={css.input}
              value={lottery.buyAmount}
              type="text"
              onChange={(e) => {
                let value = e.target.value.replace(/[^\d]/g, "");
                if (value === "") {
                  value = 0;
                }
                let unitMax =
                  availableBuyAmount < 100 ? availableBuyAmount : 100;
                if (value - unitMax > 0) value = unitMax;
                lottery.changeBuyAmount(parseInt(value));
              }}
            />
            <div className={css.computedCost}>
              ≈{lottery.buyDetail.quiteShouldCost}
              MMR
            </div>
          </div>
          <div className={css.balance}>
            MMR {language.balance}：{balance}
          </div>
          <div className={css.checkNumber}>
            <div
              className={css.button}
              onClick={() => {
                if (max - lottery.currentPeriodUserDetail.ticketAmount > 0)
                  lottery.changeBuyAmount(1);
              }}
            >
              1
            </div>
            <div
              className={css.button}
              onClick={() => {
                if (availableBuyAmount >= 100) lottery.changeBuyAmount(100);
                else lottery.changeBuyAmount(availableBuyAmount);
              }}
            >
              MAX
            </div>
          </div>
          {/* 成本 */}
          <div className={css.cost}>
            <div className={css.left}>{language.cost}</div>
            <div>{lottery.buyDetail.quiteShouldCost}MMR</div>
          </div>
          {/* 批量折扣 */}
          <div className={css.discount}>
            <div className={css.left}>
              {lottery.buyDetail.quiteDiscountPercent}%{language.discount}
            </div>
            <div>{lottery.buyDetail.quiteDiscountPrice}MMR</div>
          </div>
          <div className={css.line}></div>
          {/* 您需支付 */}
          <div className={css.needPay}>
            <div className={css.left}>{language.needPay}</div>
            <div className={css.needPayRight}>
              {lottery.buyDetail.quiteActualCost}MMR
            </div>
          </div>
          {/* 启用按钮 */}
          <div
            className={classNames(
              css.quicklyBuy,
              !isEnoughBalance && css.disabled
            )}
            onClick={() => {
              handleClick();
            }}
          >
            {language.buy}
          </div>
          <div
            className={classNames(
              css.edit,
              lottery.buyAmount <= 0 && css.disabled
            )}
            onClick={() => {
              props.toEditBox();
            }}
          >
            {language.edit}
          </div>
          {/* 说明 */}
          <div className={css.content}>{language.content}</div>
        </div>
      </div>
      {renderModal()}
    </div>
  );
}

export default inject("lang", "chain", "lottery")(observer(BuyLotteryModal));
