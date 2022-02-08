import { makeAutoObservable, reaction, runInAction } from "mobx";
import { fetchDynamicDeward } from "@common/api";
import chain from "./chain";
class DynamicRewardList {
  list = [];
  page = 1;
  pagesize = 10;
  total = 0;
  type = 1;
  accumulatedGain = 0; //累计已获得动态奖励

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => this.page,
      () => {
        this.requestDynamicDeward();
      }
    );
    // this.init();
  }

  init() {
    this.list = [];
    this.total = 0;

    if (this.page !== 1) {
      this.page = 1;
    } else {
      this.requestDynamicDeward();
    }
  }
  async requestFresh() {
    console.log("DynamicDeward refresh...");
    const { list, total, accumulatedGain } = await fetchDynamicDeward(
      chain.address,
      1,
      this.pagesize * this.page,
      this.type
    );
    runInAction(() => {
      this.list = list;
      this.total = total;
      this.accumulatedGain = accumulatedGain;
    });
  }
  async requestDynamicDeward() {
    const data = await fetchDynamicDeward(
      chain.address,
      this.page,
      this.pagesize,
      this.type
    );
    console.log("data========>", data);
    if (data) {
      const { list, total, accumulatedGain } = data;
      runInAction(() => {
        this.list = [...this.list, ...list];
        this.total = total;
        this.accumulatedGain = accumulatedGain;
      });
    }
  }

  setPage(page) {
    this.page = page;
  }
}

export default new DynamicRewardList();
