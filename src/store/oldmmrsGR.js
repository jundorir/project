import { makeAutoObservable, runInAction } from "mobx";
import { oldfreeBuyInMMRS_GR, olduserAmountInMMRS_GR } from "@utils/web3utils_future";
import { computeWeiToSymbol } from "@utils/common";

class mmrsGR {
  subscription = 0;
  min = 10;
  max = 200;
  boardCoefficient = 2;
  MMRSCoefficient = 1;
  userAmount = 0;
  constructor() {
    makeAutoObservable(this);
  }

  get obtainedPower() {
    return {
      BOARD: this.boardCoefficient * this.userAmount,
      MMRS: this.MMRSCoefficient * this.userAmount,
    };
  }

  get willObtainPower() {
    return {
      BOARD: this.boardCoefficient * this.subscription,
      MMRS: this.MMRSCoefficient * this.subscription,
    };
  }

  async toFreeBuy() {
    const result = await oldfreeBuyInMMRS_GR(this.subscription);
    if (result) {
      this.queryUserAmount();
      runInAction(() => {
        this.subscription = 0;
      });
    }
    return result;
  }

  async queryUserAmount() {
    const userAmount = await olduserAmountInMMRS_GR();
    runInAction(() => {
      this.userAmount = computeWeiToSymbol(userAmount, 4);
    });
  }

  setSubscription(subscription) {
    // 10 - 200
    this.subscription = subscription;
  }
}

export default new mmrsGR();
