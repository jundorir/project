import { makeAutoObservable, runInAction, reaction } from "mobx";
import {
  getEthBalanceAsync,
  getAllInfoAsync,
  getLiquidityValueAsync,
  getLiquidityValueByTokenAsync,
  addLiquidityAsync,
  removeLiquidityAsync,
  getUnclaimedIncomeInMobilityMining,
  getTotalIncomeInMobilityMining,
  getRewardInMobilityMining,
  getUserLpPower,
  getTotalLpPower,
  pledgeInMobilityMining,
  redeemInMobilityMining,
} from "@utils/web3utils_future";
import { computeWeiToSymbol, interception } from "@utils/common";
import server from "./server";
const selected = {
  U: ["USDT", "MMR"],
  T: ["T", "WFIL"],
  MMRS_TO_USDT: ["USDT", "MMRS"],
};
class Mobility {
  showView = 0;
  type = "U";

  // totalMobilityInPool = 0; // 池里的 总流动性
  // usdtInPool = 0; // 池子里的 总usdt
  // mmrInPool = 0; // 池子里的 总mmr
  // myMobilityInPool = 0; // 池中 总的我的 流动性
  // USDTAmount = 0; // 我的LP可兑换出 的  USDT
  // MMRAmount = 0; //  我的LP可兑换 的  MMR
  // myPercentInPool = 0; // 池中我的流动性百分比

  addLiiquidityLp = {
    liquidity: 0,
    USDTCost: 0,
    MMRCost: 0,
    TCost: 0,
    WFILCost: 0,
  }; // 添加流动性预期获得的LP
  exceptPercent = 0; //预期资金池百分比

  ////// 挖矿区
  unclaimedIncome = 0; // 待领取收益MMR
  totalIncome = 0; // 已领取MMR
  userULpPower = 0; // 用户已经质押的LP
  totalULpPower = 0; // LP池总质押
  userTLpPower = 0; // 用户已经质押的TLP

  AFILSelected = "USDT";
  WFILSelected = "MMR";

  U = {
    totalMobilityInPool: 0, // 池里的 总流动性
    AFILInPool: 0, // 池子里的 总usdt
    WFILInPool: 0, // 池子里的 总mmr
    myMobilityInPool: 0, // 池中 总的我的 流动性
    AFILAmount: 0, // 我的LP可兑换出 的  USDT
    WFILAmount: 0, //  我的LP可兑换 的  MMR
    myPercentInPool: 0, // 池中我的流动性百分比
    ATOB: 0, // 目前对应 USDT 兑换 MMR
    BTOA: 0, // 目前对应 MMR 兑换 USDT
    quiteLPAmount: 0,
    quiteAFILAmount: 0,
    quiteWFILAmount: 0,
    quiteMyPercentInPool: 0,
  };
  T = {
    totalMobilityInPool: 0,
    AFILInPool: 0,
    WFILInPool: 0,
    myMobilityInPool: 0,
    AFILAmount: 0,
    WFILAmount: 0,
    myPercentInPool: 0,
    ATOB: 0,
    BTOA: 0,
    quiteLPAmount: 0,
    quiteAFILAmount: 0,
    quiteWFILAmount: 0,
    quiteMyPercentInPool: 0,
  };

  MMRS_TO_USDT = {
    totalMobilityInPool: 0,
    AFILInPool: 0,
    WFILInPool: 0,
    myMobilityInPool: 0,
    AFILAmount: 0,
    WFILAmount: 0,
    myPercentInPool: 0,
    ATOB: 0,
    BTOA: 0,
    quiteLPAmount: 0,
    quiteAFILAmount: 0,
    quiteWFILAmount: 0,
    quiteMyPercentInPool: 0,
  };

 

  constructor() {
    makeAutoObservable(this);
  }

  get current() {
    return this[this.type];
  }

  get U_TVL_USDT() {
    if (this.U.totalMobilityInPool === 0) return 0;
    return (
      (this.U.AFILInPool * this.totalULpPower * 2) / this.U.totalMobilityInPool
    );
  }

  async init() {
    this.exceptPercent = 0;
    this.addLiiquidityLp = {
      liquidity: 0,
      USDTCost: 0,
      MMRCost: 0,
      TCost: 0,
      WFILCost: 0,
    };
  }

  // 获取以太坊货币余额
  async getEthBalanceAsync() {
    const getEthBalanceResult = await getEthBalanceAsync();
    runInAction(() => {
      this.EthBalance = computeWeiToSymbol(getEthBalanceResult, 4);
    });
  }

  async queryAllInfoAsync(type = this.type) {
    if (!server.is_transfer) return;
    try {
      console.log('queryAllInfoAsync =====>', type)

      const info = await getAllInfoAsync(...selected[type]);
      console.log('queryAllInfoAsync =====>', type, info)
      // console.log("info ===>", info);
      const [totalMobilityInPool, myMobilityInPool, AFILInPool, WFILInPool] = [
        info[0],
        info[1],
        info[2],
        info[3],
      ];

      const { tokenAAmount, tokenBAmount } =
        await this.queryLiquidityValueAsync(
          ...selected[type],
          myMobilityInPool
        );
      // console.log(
      //   `totalMobilityInPool, myMobilityInPool, AFILInPool, WFILInPool, tokenAAmount, tokenBAmount`,
      //   totalMobilityInPool,
      //   myMobilityInPool,
      //   AFILInPool,
      //   WFILInPool,
      //   tokenAAmount,
      //   tokenBAmount
      // );

      const myPercentInPool = !!totalMobilityInPool
        ? myMobilityInPool / totalMobilityInPool
        : 0;
      runInAction(() => {
        this[type] = {
          totalMobilityInPool: totalMobilityInPool,
          AFILInPool: AFILInPool,
          WFILInPool: WFILInPool,
          myMobilityInPool: myMobilityInPool,
          AFILAmount: tokenAAmount,
          WFILAmount: tokenBAmount,
          myPercentInPool: myPercentInPool,
          ATOB: interception(AFILInPool / WFILInPool, 4),
          BTOA: interception(WFILInPool / AFILInPool, 4),
          quiteLPAmount: computeWeiToSymbol(myMobilityInPool, 4),
          quiteAFILAmount: computeWeiToSymbol(tokenAAmount, 4),
          quiteWFILAmount: computeWeiToSymbol(tokenBAmount, 4),
          quiteMyPercentInPool: interception(myPercentInPool, 10),
        };
      });
    } catch (e) {
      // console.log(e);
    }
  }

  async queryLiquidityValueAsync(symbolA, symbolB, liquidityAmount) {
    if (liquidityAmount === 0 || liquidityAmount === "0") {
      return {
        tokenAAmount: 0,
        tokenBAmount: 0,
      };
    }
    return getLiquidityValueAsync(symbolA, symbolB, liquidityAmount);
  }

  // 算计获取的流动性
  async queryLiquidityValueByTokenAsync(symbolA, symbolB, amountA, amountB) {
    console.log(
      "queryLiquidityValueByTokenAsync",
      symbolA,
      symbolB,
      amountA,
      amountB
    );
    const {
      liquidity,
      amountA: symbolACost,
      amountB: symbolBCost,
    } = await getLiquidityValueByTokenAsync(symbolA, symbolB, amountA, amountB);
    console.log(
      "queryLiquidityValueByTokenAsyncCCCCost ====> ",
      liquidity,
      symbolACost,
      symbolBCost
    );

    runInAction(() => {
      this.addLiiquidityLp = {
        liquidity,
        [`${symbolA}Cost`]: symbolACost,
        [`${symbolB}Cost`]: symbolBCost,
      };
      this.exceptPercent = interception(
        (liquidity * 100) / this.current.totalMobilityInPool,
        10
      );
    });
    return computeWeiToSymbol(symbolBCost, 4);
  }

  async addLiquidity() {
    const result = await addLiquidityAsync(
      this.AFILSelected,
      this.WFILSelected,
      this.addLiiquidityLp[`${this.AFILSelected}Cost`],
      this.addLiiquidityLp[`${this.WFILSelected}Cost`]
    );
    if (result) {
      // 添加流动性成功
      this.queryAllInfoAsync();
      this.init();
    }
    return result;
  }

  async removeLiquidity(liquidityAmount) {
    const result = await removeLiquidityAsync(
      this.AFILSelected,
      this.WFILSelected,
      liquidityAmount
    );
    if (result) {
      // 添加流动性成功
      this.queryAllInfoAsync();
    }
    return result;
  }

  async queryIncome() {
    const income = await getUnclaimedIncomeInMobilityMining();
    const total = await getTotalIncomeInMobilityMining();
    console.log("income ===> ", income);
    console.log("total ===> ", total);
    runInAction(() => {
      this.unclaimedIncome = income;
      this.totalIncome = total;
    });
  }

  async getReward() {
    const result = await getRewardInMobilityMining();
    if (result) {
      this.queryIncome();
    }
  }

  async queryUserLpPower(type) {
    const userLpPower = await getUserLpPower(type);
    runInAction(() => {
      this[`user${type}LpPower`] = userLpPower;
    });
  }

  async queryTotalLpPower(type = "U") {
    const totalLpPower = await getTotalLpPower(type);
    runInAction(() => {
      this[`total${type}LpPower`] = totalLpPower;
    });
  }

  async pledgeLiquidity(lpAmount, type = "U") {
    const result = await pledgeInMobilityMining(lpAmount, type);
    if (result) {
      this.queryAllInfoAsync(type);
      this.queryUserLpPower(type);
    }
    return result;
  }
  async redeemLiquidity(lpAmount, type = "U") {
    const result = await redeemInMobilityMining(lpAmount, type);
    if (result) {
      if (type) {
        this.queryAllInfoAsync(type);
        this.queryUserLpPower(type);
      }
    }
    return result;
  }

  backDisplayMobility() {
    this.showView = 0;
  }

  showAddMobility(type = "U") {
    console.log("type", type);
    this.showView = 1;
    this.changeSelected(...selected[type], type);
  }
  showRemoveMobility(type = "U") {
    this.showView = 2;
    this.changeSelected(...selected[type], type);
  }

  changeSelected(AFILSelected, WFILSelected, type) {
    this.type = type;
    this.AFILSelected = AFILSelected;
    this.WFILSelected = WFILSelected;
    console.log("this.AFILSelected", this.AFILSelected);
    console.log("this.WFILSelected", this.WFILSelected);
  }
}

export default new Mobility();
