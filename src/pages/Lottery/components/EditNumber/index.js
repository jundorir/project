import React from "react";
import EditNumberBox from "./EditNumberBox";
import css from "./index.module.less";
import { randomTicketArray } from "@utils/common";
import { inject, observer } from "mobx-react";
import { Toast } from "antd-mobile";
import AuthorizationModal from "@components/AuthorizationModal";

function EditNumber(props) {
  const {
    lottery,
    chain,
    lang: { selectedLang },
  } = props;
  const [language, setLanguage] = React.useState({});
  const [tickets, setTickets] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const [MMR_APPROVE_AMOUNT, setApprove] = React.useState(0);
  const [balance, setBalace] = React.useState(0);
  const isApprove = MMR_APPROVE_AMOUNT >= lottery.buyDetail.quiteActualCost;
  const isEnoughBalance = balance - lottery.buyDetail.quiteActualCost >= 0;

  React.useEffect(() => {
    const g_language = {
      English: {
        buySuccess: "buy success",
        buyFail: "buy fail",
        approveSuccess: "approve success",
        approveFail: "approve fail",
        tipsBuy: "buy:",
        lotteryTicket: "lottery ticket",
        editNumber: "edit number",
        totalCost: "total cost",
        tips: "The number is selected randomly. Click a number to edit. Available numbers: 0-9",
        random: "RANDOM",
        buy: "buy",
      },
      TraditionalChinese: {
        buySuccess: "購買成功",
        buyFail: "購買失敗",
        approveSuccess: "授權成功",
        approveFail: "授權失敗",
        tipsBuy: "購買:",
        lotteryTicket: "彩票",
        editNumber: "編輯號碼",
        totalCost: "總成本",
        tips: "號碼隨機選取。點按一個號碼進行編輯。可用數字：0-9",
        random: "隨機選取",
        buy: "確認購買",
      },
      SimplifiedChinese: {
        buySuccess: "购买成功",
        buyFail: "购买失败",
        approveSuccess: "授权成功",
        approveFail: "授权失败",
        tipsBuy: "购买:",
        lotteryTicket: "彩票",

        editNumber: "编辑号码",
        totalCost: "总成本",
        tips: "号码随机选取。点按一个号码进行编辑。可用数字：0-9",
        random: "随机选取",
        buy: "确认购买",
      },
    };

    setLanguage(g_language[selectedLang.key]);
  }, [selectedLang.key]);
  React.useEffect(() => {
    randomTickets();
  }, []);

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
      // const randomTicket = randomTicketArray(amount);
      try {
        const result = await lottery.toBuyTickets(tickets);
        if (result) {
          Toast.success(language.buySuccess);
          lottery.refreshNewestLotteryData();
          closeModal();
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

  function randomTickets() {
    const randomTicket = randomTicketArray(lottery.buyAmount);
    setTickets(randomTicket);
  }
  function renderEditNumberBox() {
    return tickets.map((item, index) => {
      return (
        <EditNumberBox
          ticket={item}
          id={index + 1}
          key={`${index}${item}`}
          onChange={(value) => {
            const tempTickets = [...tickets];
            tempTickets[index] = value;
            setTickets(tempTickets);
          }}
        />
      );
    });
  }

  const closeModal = React.useCallback(() => {
    props.closeModal();
  }, []);
  const goBack = React.useCallback(() => {
    props.goBack();
  }, []);
  return (
    <div className={css.editNumber}>
      <div className={css.editbox}>
        <div className={css.head}>
          <div className={css.back} onClick={goBack} />
          <div className={css.title}>{language.editNumber}</div>
          <div className={css.close} onClick={closeModal} />
        </div>

        <div className={css.info}>
          <div className={css.cost}>
            <div>{language.totalCost}</div>
            <div className={css.right}>
              {lottery.buyDetail.quiteShouldCost}MMR
            </div>
          </div>
          <div className={css.line}></div>
          <div className={css.rule}>{language.tips}</div>
          <div
            className={css.random}
            onClick={() => {
              randomTickets();
            }}
          >
            {language.random}
          </div>
          <div className={css.list}>{renderEditNumberBox()}</div>
          <div
            className={css.buy}
            onClick={() => {
              handleClick();
            }}
          >
            {language.buy}
          </div>
        </div>
      </div>
      {renderModal()}
    </div>
  );
}

export default inject("lottery", "chain", "lang")(observer(EditNumber));
