/* eslint-disable no-undef */
import { makeAutoObservable, runInAction } from "mobx";
import {
  queryAmountFilBeClaimedInComputational,
  queryAmountReceivedInComputational,
  receiveRewardInComputational,
  queryUserTPowerAmountInComputational,
  queryUserWFILPowerAmountInComputational,
  withDrawInComputational,
  depositInComputational,
  queryNeedWFILByTInComputational,
  getBalanceAsync,
  getTPriceByRound,
  getTotalSalesByRound,
  getMarketPrice,
  getTBalanceInShop,
  getTotalLpInComputation,
  pledgeTotalPower,
  rewardFMInForceMining
} from "@utils/web3utils_future";

import { computeWeiToSymbol } from "@utils/common";

class ComputationalPower {
  // 通用
  WFILBalance = 0; // WFIL的余额

  // 通用 质押弹窗使用
  needWFILAmount = 0; // 质押T所需 的WFIL数量
  needWFILAmountFull = 0;
  view = 0;
  round = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  init(round) {
    if (this.round.get(round) === undefined) {
      this.round.set(round, {
        unclaimedIncome: 0, // 待领取收益
        unclaimedIncomeFull: 0, // 待领取收益
        totalIncome: 0, //累计已领取收益
        totalIncomeFull: 0, //累计已领取收益
        TBalance: 0, // T的余额
        myTInDeposit: 0, //我质押的T
        myWFILInDeposit: 0, //我质押的WFIL
        totalSales: 0,
        TPublishPrice: 0,
        TBalanceInShop: 0, // T在池子中的余额
        marketPrice: 0,
        totalLpInPool: 1000000,
      });
    }
  }

  viewDetail(round) {
    this.view = round;
  }

  updateData(round, key, value) {
    this.round.get(round)[key] = value;
  }

  async initPledge(round) {
    this.queryBalanceAsync();
    this.updateData(round, "needWFILAmount", "0.0000");
    this.updateData(round, "needWFILAmountFull", 0);
  }

  // 查询WFIL余额
  async queryBalanceAsync() {
    const WFIL = await getBalanceAsync("WFIL");
    runInAction(() => {
      this.WFILBalance = WFIL;
    });
  }

  async queryTBalance(round) {
    // todo 查询T的余额
    const T = await getBalanceAsync(`T${round}`);
    this.updateData(round, "TBalance", T);
  }

  // 查询质押的T
  async queryMyTInDesposit(round) {
    const T_Desposit = await queryUserTPowerAmountInComputational(round);
    this.updateData(round, "myTInDeposit", computeWeiToSymbol(T_Desposit, 4));
  }

  async queryTotalLpInPool(round) {
    const totalLpInPool = await getTotalLpInComputation(round);
    this.updateData(round, "totalLpInPool", totalLpInPool);
  }

  // 查询质押的WFIL
  async queryWFILInDesposit(round) {
    const WFIL_Desposit = await queryUserWFILPowerAmountInComputational(round);

    this.updateData(
      round,
      "myWFILInDeposit",
      computeWeiToSymbol(WFIL_Desposit, 4)
    );
  }

  // 更新待领取收益、累计已领取
  requestUpdateIncome(round) {
    // console.log('更新待领取收益、累计已领取')
    this.getUnclaimedIncome(round);
    this.getTotalIncome(round);
    if (round > 4) {
      this.queryTotalLpInPool(round);
    }
  }

  // 获取待领取收益
  async getUnclaimedIncome(round) {
    const getUnclaimedIncomeResult =
      await queryAmountFilBeClaimedInComputational(round);

    this.updateData(
      round,
      "unclaimedIncome",
      computeWeiToSymbol(getUnclaimedIncomeResult, 4)
    );
    this.updateData(round, "unclaimedIncomeFull", getUnclaimedIncomeResult);
  }
  // 累计已经领取
  async getTotalIncome(round) {
    const getTotalIncomeResult = await queryAmountReceivedInComputational(
      round
    );

    this.updateData(
      round,
      "totalIncome",
      computeWeiToSymbol(getTotalIncomeResult, 4)
    );
    this.updateData(round, "totalIncomeFull", getTotalIncomeResult);
  }

  // 领取奖励
  async receiveReward(round) {
    const result = await receiveRewardInComputational(round);
    return result;
  }

  // 质押
  async toPledge(amount, maxWFILIn, round) {
    console.log("amount, maxWFILIn, round", amount, maxWFILIn, round);
    const toPledgeResult = await depositInComputational(
      amount,
      maxWFILIn,
      round
    );

    if (toPledgeResult) {
      this.queryTBalance(round);
      this.queryMyTInDesposit(round);
      this.queryWFILInDesposit(round);
      if (round > 4) {
        this.queryTotalLpInPool(round);
      }
    }
    return toPledgeResult;
  }
  // 取回
  async toRedeem(amount, round) {
    const redeemResult = await withDrawInComputational(amount, round);
    if (redeemResult) {
      this.queryTBalance(round);
      this.queryMyTInDesposit(round);
      this.queryWFILInDesposit(round);
      if (round > 4) {
        this.queryTotalLpInPool(round);
      }
    }
    return redeemResult;
  }

  // 获取需要的USDT
  async getNeedUSDT(amount, round) {
    if (amount - 0 === 0) {
      this.updateData(round, "needWFILAmount", "0.0000");
      this.updateData(round, "needWFILAmountFull", 0);
      return;
    }
    const needWFILResult = await queryNeedWFILByTInComputational(amount, round);
    this.updateData(
      round,
      "needWFILAmount",
      computeWeiToSymbol(needWFILResult, 4)
    );
    this.updateData(round, "needWFILAmountFull", needWFILResult);
  }

  /**
   * getTotalSales
   */
  async queryTotalSalesByRound(round) {
    const total = await getTotalSalesByRound(round);
    this.updateData(round, "totalSales", total);
  }

  async queryTPriceByRound(round) {
    const TPublishPrice = await getTPriceByRound(round);
    if (TPublishPrice) {
      this.updateData(round, "TPublishPrice", TPublishPrice);
    }
  }

  async queryMarketPrice(round) {
    const result = await getMarketPrice(round);
    if (result) {
      const { reserve0, reserve1 } = result;
      const marketPrice = reserve1 / reserve0;
      // 这个价格只做展示用 所以直接四舍五入
      this.updateData(round, "marketPrice", marketPrice.toFixed(4));
    } else {
      this.updateData(
        round,
        "marketPrice",
        this.round.get(round)?.TPublishPrice
      );
    }
  }

  async queryTBalanceInShop(round) {
    const result = await getTBalanceInShop(round);
    this.updateData(round, "TBalanceInShop", result);
  }

  async queryPledgeTotalPower(round) {
    const result = await pledgeTotalPower(round);
    this.updateData(round, "pledgeTotalPower", result);
  }

   // 领取FM
   async rewardFM(userAddress, usdtHex, mmrsHex, idx, sign) {
    // todo 领取FM
    const result = await rewardFMInForceMining(
      userAddress,
      usdtHex,
      mmrsHex,
      idx,
      sign
    );
    return result;
  }
}

export default new ComputationalPower();
