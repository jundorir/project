import { makeAutoObservable, runInAction, reaction } from "mobx";
import BigNumber from "bignumber.js";

import {
  getTPriceByRound,
  getTotalSalesByRound,
  getTimeByRound,
  getBuyEndTimeByRound,
  getBlockgTime,
  userAmountByRound,
  isApproveFlow,
  queryAllowance,
  getMMRBalanceAsync,
  getBalanceAsync,
  totalSubscribeAmountByRound,
  getUserBoardPowerByRound,
  nowTBalanceByRound,
  nowCanBuyByRound,
  toBuyTByRound,
  signUpByRound,
  rewardFMInForceMining,
  queryRushPurchaseEndTime,
  getTBalanceInShop,
  queryNeedWFILByTInComputational_NEW,
  rushTByRound,
} from "@utils/web3utils_future";
import { computeWeiToSymbol } from "@utils/common";
import chain from "./chain";

class ForceMiningNew {
  WFILBalance = 0; //WFIL货币余额
  TPrice = 0; //T的单价
  TBalance = 0; //我的T余额
  totalTBalance = 0; //全网的T余额
  minerTokenrAddr = ""; //minerTokenr的地址
  getTotalSales = 0; //本期发售总量
  // biggestLimit = 0; //认购最大额度
  isSignUp = 0; // 认购状态
  endTime = 0; // 认购结束时间
  buyEndTime = 0; // 购买结束时间
  userAmount = undefined; // 用户已认购的算力
  countdown = 0; // 认购计时
  overTime = 0; // 购买结束计时
  subscribeLeft = 0; // 认购结束剩余时间
  buyLeft = 0; // 购买结束剩余时间
  totalSubscribeAmount = 0; //已认购董事会算力
  userBoardPower = 0; //获取董事会MMR算力__算力认购
  nowCanBuy = 0;
  TTruePrice = 0;

  FMBalance = 0; // FM余额

  round = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  init(round) {
    // console.log("init", round);
    if (this.round.get(round) === undefined) {
      this.round.set(round, {
        needWFILAmount: "0.0000",
      });
    }
  }

  updateData(round, key, value) {
    // console.log("this.round.get(round)", this.round.get(round));
    this.round.get(round)[key] = value;
  }

  get biggestLimit() {
    return this.nowCanBuy + this.TBalance;
  }

  // 获取WFIL余额
  async getWFILBalanceAsync() {
    const WFILdata = await getMMRBalanceAsync("WFIL", chain.address);
    runInAction(() => {
      this.WFILBalance = WFILdata - 0;
    });
  }

  // 根据期数获取本期发售总量
  async queryTotalSalesByRound(round) {
    const getTotalSalesByRoundResult = await getTotalSalesByRound(round);
    this.updateData(round, "getTotalSales", getTotalSalesByRoundResult);
  }

  // 根据 期数 获取T单价
  async queryTPriceByRound(round) {
    const TPrice = await getTPriceByRound(round, false);
    this.updateData(round, "TPrice", computeWeiToSymbol(TPrice, 4));
    this.updateData(round, "TTruePrice", TPrice);
  }

  //   // 进入页面获取一次倒计时
  //   async getEndTimeByRound(round) {
  //     const getTimeResult = await getTimeByRound(round);
  //     const getBuyEndTimeResult = await getBuyEndTimeByRound(round);
  //     this.updateData(round, "subscribeLeft", getTimeResult);
  //     this.updateData(round, "buyLeft", getBuyEndTimeResult);
  //   }

  //本期剩余可购买的T
  async queryNowCanBuyByRound(round) {
    const TBalanceResult = await nowCanBuyByRound(round);
    this.updateData(round, "nowCanBuy", TBalanceResult - 0); //T剩余可买
  }

  // 已认购的算力 T
  async getTBalanceByRound(round) {
    const TBalanceResult = await nowTBalanceByRound(round);
    this.updateData(round, "TBalance", TBalanceResult - 0); //T余额
  }

  // 获取全网已认购的董事会算力
  async getTotalSubscribeAmountByRound(round) {
    const getTotalSubscribeAmountResult = await totalSubscribeAmountByRound(
      round
    );
    // console.log("全网已认购的董事会算力", getTotalSubscribeAmountResult);

    this.updateData(
      round,
      "totalSubscribeAmount",
      getTotalSubscribeAmountResult
    );
  }

  // 获取董事会MMR算力__算力认购
  async queryJoinedFM(round) {
    // 当前地址已经参与的FM
    const joinedFM = await getUserBoardPowerByRound(round);
    this.updateData(round, "joinedFM", joinedFM);
  }

  async queryEndTimeAll(round) {
    // const getTimeResult = ~~(+Date.now() / 1000) + 0.5 * 60;

    const getTimeResult = await getTimeByRound(round);
    // const getBuyEndTimeResult = ~~(+Date.now() / 1000) + 2 * 0.5 * 60;

    const getBuyEndTimeResult = await getBuyEndTimeByRound(round);

    // const rushEndTime = ~~(+Date.now() / 1000) + 3 * 0.5 * 60;

    const rushEndTime = await queryRushPurchaseEndTime(round);
    this.updateData(round, "endTime", getTimeResult);
    this.updateData(round, "buyEndTime", getBuyEndTimeResult);
    this.updateData(round, "rushEndTime", rushEndTime);
    this.getTimeByRound(round);
  }

  // 获取状态时间戳
  async getTimeByRound(round) {
    // const getBlockTimeResult = await getBlockgTime();
    const getBlockTimeResult = ~~(+Date.now() / 1000);
    this.updateData(round, "blockTime", getBlockTimeResult);

    // const roundInfo = this.round.get(round);
    // this.updateData(round, "countdown", roundInfo.endTime - getBlockTimeResult);
    // this.updateData(
    //   round,
    //   "overTime",
    //   roundInfo.buyEndTime - getBlockTimeResult
    // );
    // this.updateData(
    //   round,
    //   "rushTime",
    //   roundInfo.rushEndTime - getBlockTimeResult
    // );
    // console.log(roundInfo);
  }

  // 销毁FM
  async toSignUpByRound(round, amount) {
    const result = await signUpByRound(round, amount);
    if (result) {
      this.queryJoinedFM(round);
      this.getFMBalanceAsync();
      this.getTotalSubscribeAmountByRound(round);
    }
    return result;
  }

  async toBuyTByRound(amount, round) {
    const result = await toBuyTByRound(amount, round);
    if (result) {
      this.getTBalanceByRound(round);
      this.getWFILBalanceAsync();
      this.queryNowCanBuyByRound(round);
    }
    return result;
  }

  async getFMBalanceAsync() {
    const FMBalance = await getBalanceAsync("FM");
    runInAction(() => {
      this.FMBalance = FMBalance;
    });
  }

  async queryCanRushBuy(round) {
    const nowCanRushBuy = await getTBalanceInShop(round);
    this.updateData(round, "nowCanRushBuy", nowCanRushBuy);
  }

  async toRushTByRound(amount, round) {
    const result = await rushTByRound(amount, round);
    if (result) {
      // 查询我购买的T
      this.getTBalanceByRound(round);
      // 查询我的WFIL余额
      this.getWFILBalanceAsync();
      // 查询当前剩余可抢购T的数量
      this.queryCanRushBuy(round);
    }
    return result;
  }

  async queryAllowanceAll(round) {
    // NewShop
    this.queryFMAllowance(round);
    this.queryWFILAllowance(round);
  }

  async queryFMAllowance(round) {
    // 查询FM给 预购 合约的授权
    const allowance = await queryAllowance({
      type: "subscribe",
      symbol: "FM",
      round,
    });

    console.log("round", round);
    this.updateData(round, "FM_APPROMENT", allowance);
  }

  async queryWFILAllowance(round) {
    const allowance = await queryAllowance({
      type: "NewShop",
      symbol: "WFIL",
      round,
    });

    console.log("round", round);
    this.updateData(round, "WFIL_APPROMENT", allowance);
  }

  async toApprove(type, symbol, round) {
    console.log(type, symbol, round);
    let { status, approveAmount } = await isApproveFlow({
      type,
      symbol,
      round,
    });
    if (status) {
      this.updateData(round, `${symbol}_APPROMENT`, approveAmount);
    }
    return status;
  }

  async getNeedWFILNumber(amount, round) {
    if (amount - 0 === 0) {
      this.updateData(round, "needWFILAmount", "0.0000");
      this.updateData(round, "needWFILAmountFull", 0);
      return;
    }
    // const needWFILResult = await queryNeedWFILByTInComputational_NEW(
    //   amount,
    //   round
    // );

    const needTrueWFIL = this.round.get(round).TPrice * amount;
    this.updateData(round, "needWFILAmount", needTrueWFIL.toFixed(4));
    // this.updateData(round, "needWFILAmountFull", needWFILResult);
  }
}

export default new ForceMiningNew();
