import { makeAutoObservable, runInAction, reaction } from "mobx";
import {
  getTPriceByRound,
  getTotalSalesByRound,
  getTimeByRound,
  getBuyEndTimeByRound,
  getBlockgTime,
  getBiggestLimit,
  userAmountByRound,
  getMMRBalanceAsync,
  totalSubscribeAmountByRound,
  getUserBoardPowerByRound,
  nowTBalanceByRound,
  nowCanBuyByRound,
  signUpByRound,
  toBuyTByRound,
} from "@utils/web3utils_future";
import { computeWeiToSymbol, interception } from "@utils/common";
import chain from "./chain";

class Boardroom {
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

  round = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  init(round) {
    if (this.round.get(round) === undefined) {
      this.round.set(round, {});
    }
  }

  updateData(round, key, value) {
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

  // 获取认购最大额度
  // async getBiggestLimitAbi(address, TAddr) {
  //   const getBiggestLimitResult = await getBiggestLimit(address, TAddr);
  //   console.log('getBiggestLimitAbi', getBiggestLimitResult)
  //   if (getBiggestLimitResult) {
  //     runInAction(() => {
  //       this.biggestLimit = getBiggestLimitResult;
  //     });
  //   }
  // }

  // //当前时间<状态时间，此结果小于0，认购已结束，大于0，已经认购过
  // async userAmountAbi() {
  //   const userAmountAbiResult = await userAmount(chain.address);
  //   runInAction(() => {
  //     this.isSignUp = userAmountAbiResult;
  //   });
  // }

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

  // 进入页面获取一次倒计时
  async getEndTimeByRound(round) {
    const getTimeResult = await getTimeByRound(round);
    const getBuyEndTimeResult = await getBuyEndTimeByRound(round);
    this.updateData(round, "subscribeLeft", getTimeResult);
    this.updateData(round, "buyLeft", getBuyEndTimeResult);
  }

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
  async getUserBoardPowerByRound(round) {
    const getUserBoardPowerResult = await getUserBoardPowerByRound(round);

    this.updateData(round, "userBoardPower", getUserBoardPowerResult);
  }

  // 获取状态时间戳
  async getTimeByRound(round) {
    const getTimeResult = await getTimeByRound(round);
    const getBuyEndTimeResult = await getBuyEndTimeByRound(round);
    // const getBuyEndTimeResult = 1632160716 + 30;
    // console.log("getTimeResult===>", getTimeResult);
    const getBlockTimeResult = await getBlockgTime();
    // console.log("getBlockTimeResult===>", getBlockTimeResult);

    const userAmountResult = await userAmountByRound(round);
    // console.log("认购资格：>0已认购，=0未认购", userAmountResult);

    if (getBuyEndTimeResult) {
      this.updateData(round, "buyEndTime", getBuyEndTimeResult);
    }
    this.updateData(round, "endTime", getTimeResult);
    this.updateData(round, "blockTime", getBlockTimeResult);
    this.updateData(round, "countdown", getTimeResult - getBlockTimeResult);
    this.updateData(
      round,
      "overTime",
      getBlockTimeResult - getBuyEndTimeResult
    );
    this.updateData(round, "userAmount", userAmountResult);
  }

  async toSignUpByRound(round) {
    const result = await signUpByRound(round);
    if (result) {
      this.getTimeByRound(round);
      this.getTotalSubscribeAmountByRound(round);
    }
    return result;
  }

  async toBuyTByRound(amount, round) {
    const result = await toBuyTByRound(amount, round);
    if (result) {
      this.getTBalanceByRound(round);
      this.getWFILBalanceAsync();
      this.nowCanBuyByRound(round);
    }
    return result;
  }
}

export default new Boardroom();
