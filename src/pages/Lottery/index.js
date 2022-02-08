import css from "./index.module.less";
import React from "react";
import classNames from "classnames";
import { inject, observer } from "mobx-react";
import CountDown from "./components/CountDown";
import BuyLotteryModal from "./components/BuyLotteryModal";
import RewardList from "./components/RewardList";
import LotteryResult from "./components/LotteryResult";
import EditNumber from "./components/EditNumber";
import ViewPurchasedTicket from "./components/ViewPurchasedTicket";
import ViewPurchasedTicketInRecord from "./components/ViewPurchasedTicketInRecord";
import moment from "moment";
import CheckIsWin from "./components/CheckIsWin";

function Lottery(props) {
  const {
    lottery,
    chain,
    lang: { selectedLang },
  } = props;
  const { currentPeriodDetail } = lottery;
  const [showModal, setShowModal] = React.useState("");
  const [showHistoryDetail, setShowHistoryDetail] = React.useState(null);
  const [tab, changeTab] = React.useState(0);
  const intervalRef = React.useRef(null);
  const [language, setLanguage] = React.useState({});
  const buyButtonTips = [language.buyTicket, language.waitOpenLottery];

  React.useEffect(() => {
    const g_language = {
      English: {
        buyTicket: "Buy Tickets",
        buyTicketTips:
          "All the MMR paid by ticket buyers for this round of lottery will be injected back into the prize pool.",
        buyTicketStepTips:
          "The price is determined at the beginning of the round, and each lottery ticket is equivalent to depositing $5 in the MMR，purchase up to 1000 pieces per round",
        accumulatedBonus: "AccumulatedBonus",
        accumulatedBonusTips:
          "After each round, if no one wins in one of the bonus groups, the unclaimed MMR in that group will be rolled over to the next round and redistributed in the bonus pool.",
        waitOpenLottery: "Waiting for the lottery",
        waitOpenLotteryTips:
          "There are two lottery every day: once every 12 hours.",
        checkReward: "CheckBonus",
        checkRewardTips:
          "After the round, return to the page and check whether you have won the prize!",
        hit: "Hit the first ",
        bit: " bit",
        destroyPool: "destroy pool",
        round: "round",
        openLotteryTimeBefore: "Open Lottery Time",
        openLotteryTimeAfter: "", // Open Lottery Time
        thisRoundhas: "this round you have",
        ticketsNumber: "tickets",
        viewTicket: "view tickets",
        date: "date",
        yourTickets: "your tickets",
        noHistory: "No History",
        openLotteryTimeBefore2: "Awarded on",
        lotteryTicket: "Lottery Ticket",
        bouns: "bonus!",
        bounsPool: "bouns pool",
        getTicketNow: "get your ticket now",
        finishRound: "finished rounds",
        LotteryRecord: "LotteryRecord",
        ParticipationRecord: "ParticipationRecord",
        rule: "rule",
        ruleTips:
          "If the numbers on the lottery hit the winning number in the correct order, you will win part of the prize in the prize pool.",
        winCondtions: "win condition",
        winCondtionsTips:
          "The numbers on the lottery must be hit in the correct order to win the prize",
        example1:
          "This is an example of lottery. There are two lottery tickets A and B",
        example2:
          "·Lottery a: the first three and the last two hit, but the fourth was wrong, so this lottery won only the “top three hit Award“",
        example3:
          "·Lottery B: Although you hit the last five digits, the first digit is wrong, so this lottery did not win the prize. Bonus groups cannot be superimposed: if you hit the first three digits in order, you will only win the prize in the hit three digit group, not the prize in the hit one digit group and the hit two digit group.",
        bonusFund: "BonusFund",
        bonusFundTips: "The bonus of each round draw comes from two sources",
        hitBitsTips: "Hit Bits",
        bonusShares: "Bonus Shares",
      },
      TraditionalChinese: {
        buyTicket: "購買彩票",
        buyTicketTips: "購票者購買該回合彩票所支付的MMR將全部註入回獎池。",
        buyTicketStepTips:
          "價格在回合開始時確定，每張彩票相當於在MMR中存入5美元，每回合最多購買1000張",
        accumulatedBonus: "滾存獎金",
        accumulatedBonusTips:
          "在每一回合之後，如果其中一個獎金組中無人中獎，則該組中無人領取的MMR將滾存到下一回合並在獎池中重新分配。",
        waitOpenLottery: "等待開獎",
        waitOpenLotteryTips: "每天有兩次開獎：每12小時一次。",
        checkReward: "檢查獎金",
        checkRewardTips: "回合結束後，返回頁面並檢查您是否中獎！",
        hit: "命中前",
        bit: "位",
        destroyPool: "銷毀池",
        round: "回合",
        openLotteryTimeBefore: "已於",
        openLotteryTimeAfter: "開獎", // Open Lottery Time
        thisRoundhas: "本回合您有",
        ticketsNumber: "張彩票",
        viewTicket: "查看您的彩票",
        date: "日期",
        yourTickets: "您的彩票",
        noHistory: "暫無歷史記錄",
        openLotteryTimeBefore2: "已開獎於",
        isWin: "我中獎了嗎",
        quicklyView: "立即查看",
        collectableBonus: "可收集的獎金",
        viewDetail: "查看詳情!",
        noBouns: "沒有可收集的獎金",
        gookLuckNext: "祝你下次好運!",
        lotteryTicket: "彩票",
        bouns: "獎金!",
        bounsPool: "獎金池",
        getTicketNow: "立即獲取您的彩票",
        finishRound: "已完成的回合",
        LotteryRecord: "開獎記錄",
        ParticipationRecord: "參與記錄",
        rule: "玩法",
        ruleTips:
          "如果彩票上的數字以正確的順序命中中獎號碼，您將贏得獎池中的部分獎金。",
        winCondtions: "中獎條件",
        winCondtionsTips: "彩票上的數字必須以正確的順序命中才能中獎",
        example1: "這是一個開獎示例，有A和B兩張彩票",
        example2:
          "·彩票A:前3位和後2位命中，但第4位錯誤，所以此彩票僅贏得了「命中前3位獎」",
        example3:
          "·彩票B:盡管命中最後5位數字，但第一位數字是錯誤的，因此這張彩票並未中獎。獎金組不可疊加：如果您按順序命中前3位數字，則您將只能贏得命中3位組中的獎金，而不會贏得命中1位和命中2位組中的獎金。",
        bonusFund: "獎金資金",
        bonusFundTips: "每回合抽獎的獎金來自兩個來源",
        hitBitsTips: "命中位數",
        bonusShares: "獎金分配",
      },
      SimplifiedChinese: {
        buyTicket: "购买彩票",
        buyTicketTips: "购票者购买该回合彩票所支付的MMR将全部注入回奖池。",
        buyTicketStepTips:
          "价格在回合开始时确定，每张彩票相当于在MMR中存入5美元，每回合最多购买1000张",
        accumulatedBonus: "滚存奖金",
        accumulatedBonusTips:
          "在每一回合之后，如果其中一个奖金组中无人中奖，则该组中无人领取的MMR将滚存到下一回合并在奖池中重新分配。",
        waitOpenLottery: "等待开奖",
        waitOpenLotteryTips: "每天有两次开奖：每12小时一次。",
        checkReward: "检查奖金",
        checkRewardTips: "回合结束后，返回页面并检查您是否中奖！",
        hit: "命中前",
        bit: "位",
        destroyPool: "销毁池",
        round: "回合",
        openLotteryTimeBefore: "已于",
        openLotteryTimeAfter: "开奖", // Open Lottery Time
        thisRoundhas: "本回合您有",
        ticketsNumber: "张彩票",
        viewTicket: "查看您的彩票",
        date: "日期",
        yourTickets: "您的彩票",
        noHistory: "暂无历史记录",
        openLotteryTimeBefore2: "已开奖于",
        isWin: "我中奖了吗",
        quicklyView: "立即查看",
        collectableBonus: "可收集的奖金",
        viewDetail: "查看详情!",
        noBouns: "没有可收集的奖金",
        gookLuckNext: "祝你下次好运!",
        lotteryTicket: "彩票",
        bouns: "奖金!",
        bounsPool: "奖金池",
        getTicketNow: "立即获取您的彩票",
        finishRound: "已完成的回合",
        LotteryRecord: "开奖记录",
        ParticipationRecord: "参与记录",
        rule: "玩法",
        ruleTips:
          "如果彩票上的数字以正确的顺序命中中奖号码，您将赢得奖池中的部分奖金。",
        winCondtions: "中奖条件",
        winCondtionsTips: "彩票上的数字必须以正确的顺序命中才能中奖",
        example1: "这是一个开奖示例，有A和B两张彩票",
        example2:
          "·彩票A:前3位和后2位命中，但第4位错误，所以此彩票仅赢得了“命中前3位奖“",
        example3:
          "·彩票B:尽管命中最后5位数字，但第一位数字是错误的，因此这张彩票并未中奖。奖金组不可叠加：如果您按顺序命中前3位数字，则您将只能赢得命中3位组中的奖金，而不会赢得命中1位和命中2位组中的奖金。",
        bonusFund: "奖金资金",
        bonusFundTips: "每回合抽奖的奖金来自两个来源",
        hitBitsTips: "命中位数",
        bonusShares: "奖金分配",
      },
    };

    setLanguage(g_language[selectedLang.key]);
  }, [selectedLang.key]);

  const bonusStepData = [
    {
      key: 1,
      title: language.buyTicket,
      tips: language.buyTicketTips,
    },
    {
      key: 2,
      title: language.accumulatedBonus,
      tips: language.accumulatedBonusTips,
    },
    // {
    //   key: 3,
    //   title: "CAKE注入",
    //   tips: "在一周的时间里，会从奖金库中提取总计平均35,000CAKE添加到抽奖回合中。此CAKE当然也包括在滚存中！在我们的指南中阅读更多内容CAKE代币经济模型",
    // },
  ];
  const stepData = [
    {
      key: 1,
      title: language.buyTicket,
      tips: language.buyTicketStepTips,
    },
    {
      key: 2,
      title: language.waitOpenLottery,
      tips: language.waitOpenLotteryTips,
    },
    {
      key: 3,
      title: language.checkReward,
      tips: language.checkRewardTips,
    },
  ];

  React.useEffect(() => {
    if (chain.initEnd) {
      lottery.queryNewestLotteryPeriod();
    }
  }, [chain.initEnd]);

  React.useEffect(() => {
    if (chain.address && lottery.currentPeriod) {
      lottery.queryViewUserInfoForLotteryId(lottery.currentPeriod);
    }
  }, [chain.address, lottery.currentPeriod]);
  React.useEffect(() => {
    if (chain.address && tab === 1) {
      if (showHistoryDetail !== null) setShowHistoryDetail(null);
      lottery.queryHistory();
    }
  }, [chain.address]);

  React.useEffect(() => {
    if (lottery.isCountDownEnd === 1 || lottery.isCountDownEnd === 2) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        lottery.queryNewestLotteryPeriod();
      }, 10 * 1000);
    }
    if (lottery.isCountDownEnd === 0) {
      clearInterval(intervalRef.current);
    }
  }, [lottery.isCountDownEnd]);

  const showHistoryModalRecord = React.useCallback((period) => {
    lottery.setViewPurchasedTicketInRecord(period);
    setShowModal("viewPurchasedTicketInRecord");
  }, []);

  function renderShareItemView() {
    const data = [
      {
        left: `${language.hit}1${language.bit}`,
        right: "2%",
        key: 1,
      },
      {
        left: `${language.hit}2${language.bit}`,
        right: "3%",
        key: 2,
      },
      {
        left: `${language.hit}3${language.bit}`,
        right: "5%",
        key: 3,
      },
      {
        left: `${language.hit}4${language.bit}`,
        right: "10%",
        key: 4,
      },
      {
        left: `${language.hit}5${language.bit}`,
        right: "20%",
        key: 5,
      },
      {
        left: `${language.hit}6${language.bit}`,
        right: "40%",
        key: 6,
      },
      {
        left: language.destroyPool,
        right: "20%",
        key: 7,
      },
    ];
    return data.map((item) => {
      return (
        <div className={css.item} key={item.key}>
          <div className={css.left}>{item.left}</div>
          <div className={css.right}>{item.right}</div>
        </div>
      );
    });
  }

  function renderStepsView(data) {
    return data.map((item) => {
      return (
        <div
          className={classNames(css.step, data.length === item.key && css.last)}
          key={item.key}
        >
          <div className={css.rank}>{item.key}</div>
          <div className={css.info}>
            <div className={css.title}>{item.title}</div>
            <div className={css.tips}>{item.tips}</div>
          </div>
        </div>
      );
    });
  }

  function renderRecordView() {
    if (tab === 1) {
      if (!!showHistoryDetail) {
        const time = moment(showHistoryDetail.drawn_time * 1000).format(
          "YYYY-MM-DD HH:mm"
        );
        return (
          <div className={css.historyRecordOne}>
            <div className={css.headBox}>
              <div className={css.head}>
                <div
                  className={css.back}
                  onClick={() => {
                    setShowHistoryDetail(null);
                  }}
                />
                <div className={css.roundInfo}>
                  <div className={css.round}>
                    <div className={css.tips}>{language.round}</div>
                    <div className={css.number}>
                      {showHistoryDetail.lottery_id}
                    </div>
                  </div>
                  <div className={css.date}>
                    {`${language.openLotteryTimeBefore}${time}${language.openLotteryTimeAfter}`}
                  </div>
                </div>
              </div>
            </div>
            <LotteryResult period={showHistoryDetail.lottery_id} />
            <div className={css.hasTicket}>
              <div className={css.hasNumber}>
                {`${language.thisRoundhas}${showHistoryDetail.number_tickets}${language.ticketsNumber}`}
              </div>
              <div
                className={css.see}
                onClick={() => {
                  showHistoryModalRecord(showHistoryDetail.lottery_id);
                }}
              >
                {language.viewTicket}
              </div>
            </div>
            <RewardList period={showHistoryDetail.lottery_id} />
          </div>
        );
      }
      if (lottery.historyRecord.length > 0)
        return (
          // <>
          <div className={css.historyRecord}>
            <div className={css.tips}>{language.round}</div>
            <div className={css.head}>
              <div className={css.round}>#</div>
              <div className={css.fullDate}>{language.date}</div>
              <div className={css.ticket}>{language.yourTickets}</div>
            </div>
            <div className={css.list}>
              {lottery.historyRecord.map((item) => {
                const [yearMonthDay, hourMinute] = moment(
                  item.drawn_time * 1000
                )
                  .format("YYYY-MM-DD HH:mm")
                  .split(" ");
                return (
                  <div
                    className={css.item}
                    key={item.lottery_id}
                    onClick={() => {
                      setShowHistoryDetail(item);
                      lottery.queryLotteryPeriodFromMap(item.lottery_id);
                    }}
                  >
                    <div className={css.round}>{item.lottery_id}</div>
                    <div className={css.fullDate}>
                      <div className={css.date}>{yearMonthDay}</div>
                      <div className={css.time}>{hourMinute}</div>
                    </div>
                    <div className={css.ticket}>
                      {item.number_tickets}
                      <div className={css.arrow} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          // {/* <RewardList /> */}
          // </>
        );

      return (
        <div className={css.record}>
          <div className={css.empty} />
          <div className={css.emptyTips}>{language.noHistory}</div>
        </div>
      );
    }

    if (lottery.historyPeriod === 0) {
      return (
        <div className={css.record}>
          <div className={css.empty} />
          <div className={css.emptyTips}>{language.noHistory}</div>
        </div>
      );
    }

    console.log(
      "lottery.lotteryOpenHistoryRecord[lottery.historyPeriod]",
      lottery.lotteryOpenHistoryRecord
    );

    const time = moment(
      lottery.lotteryOpenHistoryRecord[lottery.historyPeriod]?.drawn_time *
        1000 || +Date.now()
    ).format("YYYY-MM-DD HH:mm");
    return (
      <div className={css.record}>
        <div className={css.operation}>
          <div
            className={css.goLeft10}
            onClick={() => {
              if (lottery.currentPeriod > 0 && lottery.historyRecord !== 1) {
                lottery.changeHistoryPeriod(1);
              }
            }}
          />
          <div
            className={css.goLeft1}
            onClick={() => {
              const historyPeriod = lottery.historyPeriod - 1;
              if (historyPeriod > 0) {
                lottery.changeHistoryPeriod(historyPeriod);
              }
            }}
          />
          <div className={css.issueNumber}>{lottery.historyPeriod}</div>
          <div
            className={css.goRight1}
            onClick={() => {
              const historyPeriod = lottery.historyPeriod + 1;
              if (historyPeriod <= lottery.lastOpenLotteryPeroid) {
                lottery.changeHistoryPeriod(historyPeriod);
              }
            }}
          />
          <div
            className={css.goRight10}
            onClick={() => {
              if (
                lottery.lastOpenLotteryPeroid !== 0 &&
                lottery.lastOpenLotteryPeroid !== lottery.historyPeriod
              ) {
                lottery.changeHistoryPeriod(lottery.lastOpenLotteryPeroid);
              }
            }}
          />
        </div>
        <div className={css.time}>
          {language.openLotteryTimeBefore2}
          {time}
        </div>
        <LotteryResult period={lottery.historyPeriod} />
        <RewardList period={lottery.historyPeriod} />
      </div>
    );
  }

  function renderModal() {
    if (showModal === "buyLottery") {
      return (
        <BuyLotteryModal
          closeBuyLotteryWindow={() => {
            setShowModal("");
            lottery.changeBuyAmount(0);
          }}
          toEditBox={() => {
            setShowModal("editNumber");
          }}
        />
      );
    }

    if (showModal === "editNumber") {
      return (
        <EditNumber
          ticketAmount={lottery.buyAmount}
          goBack={goBack}
          closeModal={() => {
            closeModal();
            lottery.changeBuyAmount(0);
          }}
        />
      );
    }

    if (showModal === "viewPurchasedTicket") {
      // 查看已经购买的彩票
      return (
        <ViewPurchasedTicket
          closeModal={() => {
            closeModal();
          }}
          showBuyTicket={showBuyTicket}
        />
      );
    }

    if (showModal === "viewPurchasedTicketInRecord") {
      // 查看历史记录中已经购买的彩票
      return (
        <ViewPurchasedTicketInRecord
          closeModal={() => {
            closeModal();
          }}
          showBuyTicket={showBuyTicket}
        />
      );
    }

    return null;
  }

  function goBack() {
    setShowModal("buyLottery");
  }
  function closeModal() {
    setShowModal("");
  }

  function showBuyTicket() {
    if (lottery.isCountDownEnd !== 0) return;
    setShowModal("buyLottery");
  }

  return (
    <div className={css.lottery}>
      <div className={css.banner}>
        <div className={css.box}>
          <div className={css.logo}>MMR {language.lotteryTicket}</div>
          <div className={css.bonus}>{`$${lottery.jackpotPrice}`}</div>
          <div className={css.tips}>{language.bouns}</div>
          <div className={css.buyBox} onClick={showBuyTicket}>
            {buyButtonTips[lottery.isCountDownEnd]}
          </div>
        </div>
      </div>
      <div className={css.content}>
        <div className={css.immediatelyBuyYourLotteryTicket}>
          <div className={css.topBox}>
            <div className={css.title}>{language.getTicketNow}!</div>
            <CountDown
              deadline={currentPeriodDetail.endTime * 1000}
              isCountDownEnd={lottery.isCountDownEnd}
              cb={() => {
                lottery.refreshNowTime();
              }}
            />
          </div>
          <div className={css.bonusPool}>
            <div className={css.poolBox}>
              <div className={css.title}>{language.bounsPool}</div>
              <div className={css.price}>{`$${lottery.jackpotPrice}`}</div>
              <div className={css.mmr}>{lottery.jackpot}MMR</div>
            </div>
          </div>
          <div className={css.myLotteryTicketNumber}>
            {language.thisRoundhas}
            {lottery.currentPeriodUserDetail.ticketIDArray?.length}{" "}
            {language.ticketsNumber}
            {lottery.currentPeriodUserDetail.ticketIDArray?.length > 0 && (
              <div
                className={css.see}
                onClick={() => {
                  setShowModal("viewPurchasedTicket");
                }}
              >
                {language.viewTicket}
              </div>
            )}
          </div>

          <div className={css.buy} onClick={showBuyTicket}>
            {/* 购买彩票 */}
            {buyButtonTips[lottery.isCountDownEnd]}
          </div>

          <RewardList period={lottery.currentPeriod} />
        </div>
        {/* {renderIsWin()} */}
        <CheckIsWin showHistoryModalRecord={showHistoryModalRecord} />

        <div className={css.history}>
          <div className={css.title}>{language.finishRound}</div>
          <div className={css.tabs}>
            {[language.LotteryRecord, language.ParticipationRecord].map(
              (item, index) => {
                return (
                  <div
                    className={classNames(
                      css.tab,
                      tab === index && css.selected
                    )}
                    key={index}
                    onClick={() => {
                      changeTab(index);
                      if (index === 1) {
                        lottery.queryHistory();
                      }
                    }}
                  >
                    {item}
                    <div className={css.line} />
                  </div>
                );
              }
            )}
          </div>
          {renderRecordView()}
        </div>

        <div className={css.rule}>
          <div className={css.topBox}>
            <div className={css.title}>{language.rule}</div>
            <div className={css.tips}>{language.ruleTips}</div>
          </div>

          <div className={css.steps}>{renderStepsView(stepData)}</div>

          <div className={css.condition}>
            <div className={css.title}>{language.winCondtions}</div>
            <div className={css.tips}>{language.winCondtionsTips}</div>
            <div className={css.example}>
              <div className={css.text}>{language.example1}</div>
              <div className={css.text}>{language.example2}</div>
              <div className={css.text}>{language.example3}</div>
              <div className={css.image} />
            </div>
          </div>

          <div className={css.bonus}>
            <div className={css.title}>{language.bonusFund}</div>
            <div className={css.tips}>{language.bonusFundTips}</div>
          </div>

          <div className={css.bonusSteps}>{renderStepsView(bonusStepData)}</div>

          <div className={css.share}>
            <div className={css.top}>
              <div>{language.hitBitsTips}</div>
              <div>{language.bonusShares}</div>
            </div>
            {renderShareItemView()}
          </div>
        </div>
      </div>

      {renderModal()}
    </div>
  );
}

export default inject("lang", "lottery", "chain")(observer(Lottery));
