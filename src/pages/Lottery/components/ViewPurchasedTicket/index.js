import css from "./index.module.less";
import EditNumberBox from "../EditNumber/EditNumberBox";
import React from "react";
import { inject, observer } from "mobx-react";

function ViewPurchasedTicket(props) {
  const {
    lottery,
    lang: { selectedLang },
  } = props;
  const [language, setLanguage] = React.useState({});

  React.useEffect(() => {
    const g_language = {
      English: {
        round: "round",
        yourTickets: "your tickets",
        buyTicket: "buy tickets",
      },
      TraditionalChinese: {
        round: "回合",
        yourTickets: "您的彩票",
        buyTicket: "購買彩票",
      },
      SimplifiedChinese: {
        round: "回合",
        yourTickets: "您的彩票",
        buyTicket: "购买彩票",
      },
    };

    setLanguage(g_language[selectedLang.key]);
  }, [selectedLang.key]);

  function renderEditNumberBox() {
    return lottery.currentPeriodUserDetail.ticketNumberArray.map(
      (item, index) => {
        return (
          <EditNumberBox
            ticket={item}
            id={index + 1}
            key={`${index}${item}`}
            canEdit={false}
          />
        );
      }
    );
  }
  const buy = React.useCallback(() => {
    props.showBuyTicket();
  }, []);

  const closeModal = React.useCallback(() => {
    props.closeModal();
  }, []);

  return (
    <div className={css.viewTicket}>
      <div className={css.viewTicketBox}>
        <div className={css.head}>
          <div className={css.back}> </div>
          <div className={css.title}>
            {language.round}
            {lottery.currentPeriod}
          </div>
          <div className={css.close} onClick={closeModal}></div>
        </div>
        <div className={css.info}>
          <div className={css.cost}>
            <div>{language.yourTickets}</div>
          </div>
          <div className={css.list}>{renderEditNumberBox()}</div>
          <div className={css.buy} onClick={buy}>
            {language.buyTicket}
          </div>
        </div>
      </div>
    </div>
  );
}

export default inject("lottery", "lang")(observer(ViewPurchasedTicket));
