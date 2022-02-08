import { makeAutoObservable, runInAction } from "mobx";
import {
  freeBuyInMMRS_GR,
  getLimitInMMRS_GR,
  getUserAmountInMMRS_GR,
  rewardInMMRS_GR,
  MMRSIncome,
  MMRSTotalIncome,
  MMRSDAOReward,
  getUserPowerMMRSBoard,
  getMMRSInMMRS_GR,
  mixBuyInMMRS_GR,
} from "@utils/web3utils_future";
import { computeWeiToSymbol } from "@utils/common";
import {
  fetchGRData,
  fetchGRMMRS,
  fetchReceiveMMRSReplaceAward,
  fetchMMRSPlanReplaceData,
  isBlackList,
} from "@common/api";
import chain from "./chain";
import server from "./server";
class mmrsGR {
  subscription = 0;
  min = 10;
  max = 200;
  boardCoefficient = 2;
  MMRSCoefficient = 1;
  mixboardCoefficient = 4;
  mixMMRSCoefficient = 2;
  userAmount = 0;
  MMRIncome = 0; //待领取MMR
  MMRTotalIncome = 0; //累计已领取MMR

  mmrs_price = 0;
  mmrs = 0;
  mmrsreplace_total = 0;
  mmrsreplace_surplus = 0;
  mmrsreplace_wait = 0;
  mmrsreplace_already = 0;
  mmrsreplace_price = 0;

  mmrs_usdt_wait = 0;
  mmrs_total = 0;
  mmrs_usdt_total = 0;
  mmrs_tvl = 0;
  mmrs_hashrate_all = 0;
  mmrs_price = 0;
  mmrs_usdt_today = 0;
  mmrs_hashrate_total = 0;
  mmrs_hashrate = 0;

  boardUserPower = 0; // 董事会算力
  needMMRS = 0; //参与需要的MMRS

  blackMember = false; //是否黑名单
  constructor() {
    makeAutoObservable(this);
  }

  get willObtainPower() {
    return {
      BOARD: this.boardCoefficient * this.subscription,
      MMRS: this.MMRSCoefficient * this.subscription,
      MIXBOARD: this.mixboardCoefficient * this.subscription,
      MIXMMRS: this.mixMMRSCoefficient * this.subscription,
    };
  }

  get fil_power() {
    console.log("server.fil_price - 0", server.fil_price - 0);
    if (!(server.fil_price - 0)) return 0;
    return ((this.mmrs / server.fil_price) * 5).toFixed(4);
  }

  setSubscription(subscription, isNeedMMRS = false) {
    this.subscription = subscription;
    if (isNeedMMRS) {
      this.getMMRSInMMRS_GR(subscription);
    }
  }

  async toFreeBuy() {
    const result = await freeBuyInMMRS_GR(this.subscription);
    if (result) {
      this.queryUserAmount();
      runInAction(() => {
        this.subscription = 0;
      });
    }
    return result;
  }

  async queryLimit() {
    console.log("queryLimit");

    const max = await getLimitInMMRS_GR();

    runInAction(() => {
      console.log("queryLimit result", max);
      this.max = max;
    });
  }
  async queryUserAmount() {
    const userAmount = await getUserAmountInMMRS_GR();
    runInAction(() => {
      this.userAmount = computeWeiToSymbol(userAmount, 4);
    });
  }

  // 更新MMRS董事会收益_待领取收益、累计已领取
  requestUpdateIncome() {
    this.MMRSIncome();
    this.MMRSTotalIncome();
  }
  // MMRS董事会收益
  async MMRSIncome() {
    const MMRSIncomeResult = await MMRSIncome();
    // console.log("MMRSIncomeResult----->", MMRSIncomeResult);
    if (MMRSIncomeResult) {
      runInAction(() => {
        this.MMRIncome = MMRSIncomeResult;
      });
    }
  }
  async MMRSTotalIncome() {
    const MMRSTotalIncomeResult = await MMRSTotalIncome();
    // console.log("MMRSTotalIncomeResult----->", MMRSTotalIncomeResult);
    if (MMRSTotalIncomeResult) {
      runInAction(() => {
        this.MMRTotalIncome = MMRSTotalIncomeResult;
      });
    }
  }
  async MMRSDAOReward() {
    const MMRSDAORewardResult = await MMRSDAOReward();
    console.log("MMRSDAORewardResult----->", MMRSDAORewardResult);
    // runInAction(() => {
    //   this.MMRIncome = MMRSIncomeResult
    // });
  }

  async receiveAward(info) {
    const result = await rewardInMMRS_GR(info);
    return result;
  }

  async queryAward() {
    const awardInfo = await fetchReceiveMMRSReplaceAward(chain.address);
    if (awardInfo.data) {
      /**
       * userAddress	string	领取地址
       * idx	string	id
       * symbol	string	symbol
       * usdt	string	领取的usdt
       * usdtBig	string	待领取usdt大数
       * usdtHex	string	待领取usdt16进制
       * mmrs	string	领取的mmrs
       * mmrsBig	string	待领取mmrs大数
       * mmrsHex	string	待领取mmrs16进制
       * sign	string	签名
       */
      const { userAddress, idx, usdtHex, mmrsHex, sign, isRepeat, repeatTis } =
        awardInfo.data;
      return {
        userAddress,
        idx,
        usdtHex,
        mmrsHex,
        sign,
        isRepeat,
        repeatTis,
        status: true,
      };
    } else {
      return {
        status: false,
        msg: awardInfo.msg,
      };
    }
  }
  async queryUserPowerMMRSBoard() {
    const result = await getUserPowerMMRSBoard();
    // console.log("result", result);
    if (result) {
      runInAction(() => {
        this.boardUserPower = result;
      });
    }
  }
  async getMMRSInMMRS_GR(number) {
    if (number === "0" || !number) {
      this.needMMRS = 0;
      return;
    }
    const result = await getMMRSInMMRS_GR(number);
    if (result) {
      runInAction(() => {
        this.needMMRS = result;
      });
    }
  }
  async mixBuyInMMRS_GR() {
    const result = await mixBuyInMMRS_GR(this.subscription);
    if (result) {
      this.queryUserAmount();
      runInAction(() => {
        this.subscription = 0;
      });
    }
    return result;
  }

  async queryMMRSPlanReplaceData() {
    const result = await fetchMMRSPlanReplaceData(chain.address);
    // console.log("queryMMRSPlanReplaceData", result);
    if (result) {
      // console.log(2);
      runInAction(() => {
        this.mmrs = result?.mmrs;
        this.mmrsreplace_total = result?.mmrsreplace_total; // 置换算力总值
        this.mmrsreplace_surplus = result?.mmrsreplace_surplus; //剩余算力
        this.mmrsreplace_wait = result?.mmrsreplace_wait; // 待领取的mmr
        this.mmrsreplace_already = result?.mmrsreplace_already; // 累计已领取
        this.mmrsreplace_price = result?.mmrsreplace_price; // 昨日结算价格
      });
    }
  }
  async isBlackList() {
    const result = await isBlackList(chain.address);
    runInAction(() => {
      this.blackMember = result;
    });
  }
}

export default new mmrsGR();
