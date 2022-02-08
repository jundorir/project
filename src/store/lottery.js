import { makeAutoObservable, reaction, runInAction } from "mobx";
import BigNumber from "bignumber.js";
import {
  getNewestLotteryPeriod,
  getViewLotteryDetail,
  calculateTotalPriceForBulkTickets,
  viewUserInfoForLotteryId,
  buyTickets,
  claimTickets,
} from "@utils/web3utils_future";
import { computeWeiToSymbol, checkLotteryTicketWin } from "@utils/common";
import { fetchLotteryInfo, fetchLotteryHistory } from "@common/api";
import server from "./server";
import chain from "./chain";
class Lottery {
  currentPeriod = 0;
  historyPeriod = 0;
  lastOpenLotteryPeroid = 0;
  viewPurchasedTicketInRecord = null;

  buyAmount = 0;

  lotteryPeriod = new Map();
  lotteryUserPeriod = new Map();
  checkIsWinPerioid = new Map();

  nowTime = Date.now();

  historyRecord = [];
  lotteryOpenHistoryRecord = {};

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.currentPeriod,
      (current) => {
        if (!!current) this.init();
      }
    );
  }

  get isCountDownEnd() {
    let status = 0; // 购买中
    const isBuyEnd =
      this.currentPeriodDetail.endTime * 1000 - this.nowTime <= 0;
    if (isBuyEnd) {
      status = 1; // 购买结束
      // const isOpenLottery = this.currentPeriodDetail.finalNumber !== "0";
      // if (isOpenLottery) status = 2; // 已开奖
    }
    return status;
  }

  refreshNowTime() {
    this.nowTime = Date.now();
  }

  get jackpotPrice() {
    return (
      this.currentPeriodDetail.amountCollectedInCakeSymbol * server.mmr_price
    ).toFixed(6);
  }

  get jackpot() {
    return this.currentPeriodDetail.amountCollectedInCakeSymbol;
  }

  get buyDetail() {
    const big_buyAmount = new BigNumber(this.buyAmount);
    const big_discountDivisor = new BigNumber(
      this.currentPeriodDetail.discountDivisor
    );
    const big_priceTicketInCake = new BigNumber(
      this.currentPeriodDetail.priceTicketInCake
    );
    let discountPercent = 0;
    if (
      this.buyAmount === 0 ||
      this.buyAmount === 1 ||
      this.currentPeriodDetail.discountDivisor === "1000000"
    ) {
      discountPercent = 0;
    } else {
      discountPercent = big_buyAmount
        .minus(1)
        .multipliedBy(100)
        .div(big_discountDivisor);
      // 等价于 discountPercent = ((buyAmount - 1) * 100) / discountDivisor;
    }

    const discountPrice = big_buyAmount
      .multipliedBy(big_priceTicketInCake)
      .multipliedBy(discountPercent)
      .div(100);
    // 等价于 discountPrice = buyAmount * priceTicketInCake * discountPercent / 100;

    const shouldCost = big_buyAmount.multipliedBy(big_priceTicketInCake);
    // 等价于 const shouldCost = buyAmount * priceTicketInCake;
    const actualCost = shouldCost.minus(discountPrice);
    // 等价于 const actualCost = shouldCost - discountPrice;

    return {
      discountPercent: discountPercent,
      discountPrice: discountPrice,
      shouldCost: shouldCost,
      actualCost: actualCost,
      quiteDiscountPercent: discountPercent.toString(),
      quiteDiscountPrice: computeWeiToSymbol(discountPrice),
      quiteShouldCost: computeWeiToSymbol(shouldCost),
      quiteActualCost: computeWeiToSymbol(actualCost),
    };
  }

  get currentPeriodUserDetail() {
    return (
      this.lotteryUserPeriod.get(`${chain.address}_${this.currentPeriod}`) ?? {
        ticketIDArray: [],
        ticketNumberArray: [],
        ticketStatusArray: [],
        ticketAmount: 0,
      }
    );
  }

  get currentPeriodDetail() {
    return (
      this.lotteryPeriod.get(this.currentPeriod) ?? {
        amountCollectedInCake: "0", // 当前奖池额度wei
        amountCollectedInCakeSymbol: "0", // 当前奖池额度mmr
        cakePerBracket: ["0", "0", "0", "0", "0", "0"], // 进度条
        countWinnersPerBracket: ["0", "0", "0", "0", "0", "0"], // 每个额度中奖人数
        discountDivisor: "2000",
        endTime: "0", // 结束时间
        finalNumber: "0", //中奖号码
        firstTicketId: "0",
        firstTicketIdNextLottery: "0",
        priceTicketInCake: "1000000000000000", // 彩票价格 wei
        priceTicketInCakeSymbol: "1", // 彩票价格 mmr
        rewardsBreakdown: ["200", "300", "500", "1000", "2000", "4000"],
        burnFee: "2000",
        startTime: "0", //开始时间
        status: "0", // 1购买阶段，2已开奖
        treasuryFee: "0", // 费率
      }
    );
  }

  get historyPeriodDetail() {
    return (
      this.lotteryPeriod.get(this.historyPeriod) ?? {
        amountCollectedInCake: "0", // 当前奖池额度wei
        amountCollectedInCakeSymbol: "0", // 当前奖池额度mmr
        cakePerBracket: ["0", "0", "0", "0", "0", "0"], // 每个额度中奖人分的钱
        countWinnersPerBracket: ["0", "0", "0", "0", "0", "0"], // 每个额度中奖人数
        discountDivisor: "2000",
        endTime: "0", // 结束时间
        finalNumber: "0", //中奖号码
        firstTicketId: "0",
        firstTicketIdNextLottery: "0",
        priceTicketInCake: "1000000000000000", // 彩票价格 wei
        priceTicketInCakeSymbol: "1", // 彩票价格 mmr
        rewardsBreakdown: ["500", "750", "1250", "1500", "2000", "4000"],
        startTime: "0", //开始时间
        status: "0", // 1购买阶段，2已开奖
        treasuryFee: "0", // 可能焚毁
      }
    );
  }

  get purchasedTicketInRecord() {
    return (
      this.checkIsWinPerioid.get(
        `${chain.address}_${this.viewPurchasedTicketInRecord}`
      ) ?? {
        finalNumber: "-------",
        winTickets: [],
        totalWinTicketsNumber: 0,
        totalTicketsNumber: 0,
        loseTickets: [],
        totalWinRewardsMMR: 0,
        totalWinRewardsPriceMMR: 0,
      }
    );
  }

  get lastPeriodIsWinInfo() {
    const info = this.checkIsWinPerioid.get(
      `${chain.address}_${this.lastOpenLotteryPeroid}`
    ) ?? {
      winTickets: [],
      totalWinTicketsNumber: 0,
      loseTickets: [],
      totalWinRewardsPriceMMR: 0,
      isWin: 0,
    };

    return {
      ...info,
      isWin: info.isWin ?? (info.totalWinTicketsNumber > 0 ? 1 : 2),
    };
  }

  changeBuyAmount(amount) {
    this.buyAmount = amount;
  }

  setViewPurchasedTicketInRecord(historyPeriod) {
    this.viewPurchasedTicketInRecord = historyPeriod;
    if (historyPeriod !== null) {
      this.checkIsWinFromMap(historyPeriod);
    }
  }

  async checkIsWin(period) {
    const lotteryPeriodInfo = await this.queryLotteryPeriodFromMap(period);
    const lotteryUserPeriodInfo =
      await this.queryViewUserInfoForLotteryIdFromMap(period);
    const ticketNumberArray = lotteryUserPeriodInfo.ticketNumberArray.map(
      (item, index) => {
        return {
          id: lotteryUserPeriodInfo.ticketIDArray[index],
          ticket: item,
          key: index + 1,
          receiveStatus: lotteryUserPeriodInfo.ticketStatusArray[index],
        };
      }
    );
    const { winTickets, loseTickets } = checkLotteryTicketWin(
      lotteryPeriodInfo.finalNumber,
      ticketNumberArray
    );

    const { cakePerBracket } = lotteryPeriodInfo;

    const totalWinWei = winTickets.reduce((a, b) => {
      return a + 1 * cakePerBracket[b.winNumber - 1];
    }, 0);
    const isReceive = winTickets.reduce((a, b) => {
      return a && b.receiveStatus;
    }, true);
    const big_totalWinWei = new BigNumber(totalWinWei);
    const totalWinRewardsPriceMMR = big_totalWinWei.multipliedBy(
      server.mmr_price
    );
    // .div(10 ** 18);

    this.checkIsWinPerioid.set(`${chain.address}_${period}`, {
      finalNumber: lotteryPeriodInfo.finalNumber,
      winTickets,
      isReceive,
      totalWinTicketsNumber: winTickets.length,
      totalTicketsNumber: winTickets.length + loseTickets.length,
      loseTickets,
      totalWinRewardsMMR: computeWeiToSymbol(totalWinWei),
      totalWinRewardsPriceMMR: computeWeiToSymbol(totalWinRewardsPriceMMR),
    });
  }

  async checkIsWinFromMap(period) {
    if (!this.checkIsWinPerioid.has(`${chain.address}_${period}`)) {
      await this.checkIsWin(period);
    }
    return this.checkIsWinPerioid.get(`${chain.address}_${period}`);
  }

  changeHistoryPeriod(historyPeriod) {
    this.historyPeriod = historyPeriod;
    this.queryLotteryPeriodFromMap(historyPeriod);
  }

  async init() {
    //查询当前这一期的数据
    await this.queryLotteryPeriod(this.currentPeriod);
    this.queryLotteryHistory();

    // 查询最后一期已开奖的数据
    if (this.lastOpenLotteryPeroid > 0) {
      await this.queryLotteryPeriod(this.lastOpenLotteryPeroid);
    }
  }

  async refreshNewestLotteryData() {
    await this.queryLotteryPeriod(this.currentPeriod);
    await this.queryViewUserInfoForLotteryId(this.currentPeriod);
  }

  async queryNewestLotteryPeriod() {
    const currentPeriod = await getNewestLotteryPeriod();
    console.log("currentPeriod =====>", currentPeriod);

    runInAction(() => {
      if (currentPeriod) {
        this.currentPeriod = currentPeriod;
        this.historyPeriod = currentPeriod - 1;
        this.lastOpenLotteryPeroid = currentPeriod - 1;
      }
    });
  }

  async queryLotteryPeriod(id) {
    const detail = await getViewLotteryDetail(id);
    console.log("detail", detail.amountCollectedInCake);
    const actualAmountCollectedInCake = new BigNumber(
      detail.amountCollectedInCake
    )
      // .div(10000)
      .multipliedBy(10000 - detail.treasuryFee)
      .idiv(10000);
    console.log(
      "actualAmountCollectedInCake ====>",
      actualAmountCollectedInCake,
      actualAmountCollectedInCake.toString()
    );
    runInAction(() => {
      this.lotteryPeriod.set(id, {
        ...detail,
        actualAmountCollectedInCake,
        amountCollectedInCakeSymbol: computeWeiToSymbol(
          actualAmountCollectedInCake
        ), // 当前奖池额度wei
        priceTicketInCakeSymbol: computeWeiToSymbol(detail.priceTicketInCake), // 彩票价格 wei
      });
    });
  }

  async queryLotteryPeriodFromMap(period) {
    if (!this.lotteryPeriod.has(period)) {
      await this.queryLotteryPeriod(period);
    }
    return this.lotteryPeriod.get(period);
  }

  // 查询折扣后价格
  async queryCalculateTotalPriceForBulkTickets(amount) {
    if (amount <= 1) {
      return this.currentPeriodDetail.amountCollectedInCakeSymbol * amount;
    }
    const discountPrice = await calculateTotalPriceForBulkTickets(
      this.currentPeriodDetail.discountDivisor,
      this.currentPeriodDetail.priceTicketInCake,
      amount
    );
    return discountPrice;
  }

  // 查询某一期中用户的彩票相关信息
  async queryViewUserInfoForLotteryId(period) {
    const result = await viewUserInfoForLotteryId(period);
    runInAction(() => {
      // 所有彩票id, 彩票对应号码, 所有彩票领奖状态, 买了多少张票
      this.lotteryUserPeriod.set(`${chain.address}_${period}`, {
        ticketIDArray: result[0],
        ticketNumberArray: result[1],
        ticketStatusArray: result[2],
        ticketAmount: result[3],
      });
    });
  }

  async queryViewUserInfoForLotteryIdFromMap(period = this.currentPeriod) {
    if (!this.lotteryUserPeriod.has(`${chain.address}_${period}`)) {
      await this.queryViewUserInfoForLotteryId(period);
    }
    return this.lotteryUserPeriod.get(`${chain.address}_${period}`);
  }

  async toBuyTickets(tickets) {
    const result = await buyTickets(this.currentPeriod, tickets);
    console.log("toBuyTickets", result);
    return result;
  }

  async toClaimTickets() {
    const { winTickets = [] } = this.purchasedTicketInRecord;
    const period = this.viewPurchasedTicketInRecord;
    const ticketIDArray = [];
    const bracketArray = [];

    winTickets.forEach((item) => {
      if (item.receiveStatus === false) {
        ticketIDArray.push(item.id);
        bracketArray.push(item.winNumber - 1);
      }
    });

    console.log(
      "period, ticketIDArray, bracketArray======> ",
      period,
      ticketIDArray,
      bracketArray
    );
    const result = await claimTickets(period, ticketIDArray, bracketArray);
    console.log("toClaimTickets", result);
    if (result) {
      await this.queryViewUserInfoForLotteryId(
        this.viewPurchasedTicketInRecord
      );
      await this.checkIsWin(this.viewPurchasedTicketInRecord);
    }
    return result;
  }

  // 我参与的历史
  async queryHistory() {
    if (chain.address) {
      const list = await fetchLotteryInfo(chain.address);
      runInAction(() => {
        this.historyRecord = list;
      });
    }
  }

  // 彩票开奖历史
  async queryLotteryHistory() {
    const list = await fetchLotteryHistory();
    const obj = {};

    list.forEach((item) => {
      obj[item.lottery_id] = item;
    });
    runInAction(() => {
      this.lotteryOpenHistoryRecord = obj;
    });
  }
}

export default new Lottery();
