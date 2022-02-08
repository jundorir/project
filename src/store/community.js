import { makeAutoObservable, reaction, runInAction } from "mobx";
import { fetchCommunity } from "@common/api";
import chain from "./chain";
class Community {
  list = [];
  page = 1;
  pagesize = 20;
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
    const data = await fetchCommunity(chain.address, this.page, this.pagesize);
    // if (list.length === 0) {
    //   list.push({
    //     id: 1,
    //     mmr: 1000 * Math.pow(10, 18),
    //     teamMmr: '1227500000000000000000',
    //     fil: 1200 * Math.pow(10, 18),
    //     teamFil: 1200 * Math.pow(10, 18),
    //     user: "0x123123312313131323232131",
    //   });
    // }
    if (data) {
      const { list, total } = data;
      runInAction(() => {
        this.list = [...this.list, ...list];
        this.total = total;
      });
    }
  }

  setPage(page) {
    this.page = page;
  }
}

export default new Community();
