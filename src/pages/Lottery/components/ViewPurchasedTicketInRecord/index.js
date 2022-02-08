import css from "./index.module.less";
import EditNumberBox from "../EditNumber/EditNumberBox";
import React from "react";
import LotteryResult from "../LotteryResult";
import { inject, observer } from "mobx-react";
import { Toast } from "antd-mobile";

function ViewPurchasedTicket(props) {
  const {
    lottery,
    lang: { selectedLang },
  } = props;

  const {
    finalNumber,
    winTickets,
    totalWinTicketsNumber,
    totalTicketsNumber,
    loseTickets,
    totalWinRewardsMMR,
    totalWinRewardsPriceMMR,
    isReceive,
  } = lottery.purchasedTicketInRecord;

  const [language, setLanguage] = React.useState({});

  React.useEffect(() => {
    const g_language = {
      English: {
        round: "round",
        yourTickets: "your tickets",
        buyTicket: "buy tickets",
        winNumber: "WinningNumbers",
        totalTickets: "TotalTicketsNumber",
        winTickets: "WinningTicketsNumber",
        winBouns: "WinningAmount",
        receiveSuccess: "receive success",
        receiveFail: "receive fail",
        received: "received",
        notWin: "no win",
        receive: "receive",
      },
      TraditionalChinese: {
        round: "回合",
        yourTickets: "您的彩票",
        buyTicket: "購買彩票",
        winNumber: "中獎號碼",
        totalTickets: "彩票總數",
        winTickets: "中獎彩票",
        winBouns: "中獎金額",
        receiveSuccess: "領取成功",
        receiveFail: "領取失敗",
        received: "已領取",
        notWin: "未中獎",
        receive: "領取獎金",
      },
      SimplifiedChinese: {
        round: "回合",
        yourTickets: "您的彩票",
        buyTicket: "购买彩票",
        winNumber: "中奖号码",
        totalTickets: "彩票总数",
        winTickets: "中奖彩票",
        winBouns: "中奖金额",
        receiveSuccess: "领取成功",
        receiveFail: "领取失败",
        received: "已领取",
        notWin: "未中奖",
        receive: "领取奖金",
      },
    };

    setLanguage(g_language[selectedLang.key]);
  }, [selectedLang.key]);

  function renderEditNumberBox() {
    return [...winTickets, ...loseTickets].map((item) => {
      return (
        <EditNumberBox
          ticket={item.ticket}
          id={item.key}
          key={item.key}
          winNumber={item.winNumber}
          canEdit={false}
        />
      );
    });
  }
  const buy = React.useCallback(() => {
    props.showBuyTicket();
  }, []);

  const closeModal = React.useCallback(() => {
    props.closeModal();
    lottery.setViewPurchasedTicketInRecord(null);
  }, []);

  return (
    <div className={css.viewTicketInRecored}>
      <div className={css.viewTicketInRecoredBox}>
        <div className={css.head}>
          <div className={css.back}> </div>
          <div className={css.title}>
            {language.round}
            {lottery.viewPurchasedTicketInRecord}
          </div>
          <div className={css.close} onClick={closeModal}></div>
        </div>
        <div className={css.luckTicketTips}>{language.winNumber}</div>
        <LotteryResult
          showHead={false}
          period={lottery.viewPurchasedTicketInRecord}
        />
        <div className={css.info}>
          <div className={css.cost}>
            <div>{language.yourTickets}</div>
          </div>
          <div className={css.list}>
            {[
              {
                icon: "icon_ticket",
                title: language.totalTickets,
                amount: totalTicketsNumber,
              },
              {
                icon: "icon_gift",
                title: language.winTickets,
                amount: totalWinTicketsNumber,
              },
              {
                icon: "icon_coin",
                title: language.winBouns,
                amount: `${totalWinRewardsMMR}MMR`,
              },
            ].map((item) => {
              return (
                <div className={css.overview} key={item.icon}>
                  <div className={css.left}>
                    <div className={css[item.icon]} />
                    <div className={css.title}>{item.title}</div>
                  </div>
                  <div className={css.right}>{item.amount}</div>
                </div>
              );
            })}

            {renderEditNumberBox()}
          </div>
          <div
            className={css.receive}
            onClick={async () => {
              if (winTickets.length <= 0) {
                Toast.info(language.notWin);
                return;
              }

              if (!isReceive) {
                try {
                  const result = await lottery.toClaimTickets();
                  if (result) {
                    Toast.info(language.receiveSuccess);
                  } else {
                    Toast.info(language.receiveFail);
                  }
                } catch (e) {
                  Toast.info(language.receiveFail);
                }
              } else Toast.info(language.received);
            }}
          >
            {isReceive ? language.received : language.receive}
          </div>
          <div className={css.buy} onClick={buy}>
            {language.buyTicket}
          </div>
        </div>
      </div>
    </div>
  );
}

export default inject("lottery", "lang")(observer(ViewPurchasedTicket));
