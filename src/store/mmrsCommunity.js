import { makeAutoObservable, reaction, runInAction } from "mobx";
import { fetchMMRSCommunity } from "@common/api";
import chain from "./chain";
class mmrsCommunity {
  list = [];
  page = 1;
  pagesize = 10;
  total = 0;

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => this.page,
      () => {
        this.requestCommunityList();
      }
    );
  }

  init() {
    this.list = [];
    this.total = 0;

    if (this.page !== 1) {
      this.page = 1;
    } else {
      this.requestCommunityList();
    }
  }
  async requestCommunityList() {
    const data = await fetchMMRSCommunity(
      chain.address,
      this.page,
      this.pagesize
    );
    if (data) {
      const { list, total } = data;
      runInAction(() => {
        this.list = [...this.list, ...list];
        this.total = total;
      });
    }
    // if (list) {
    //   runInAction(() => {
    //     this.list = [...this.list, ...list];
    //     this.total = total;
    //   });
    // }
  }

  setPage(page) {
    this.page = page;
  }
}

export default new mmrsCommunity();
