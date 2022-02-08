import { makeAutoObservable, reaction, runInAction } from "mobx";
import { fetchPledgeList } from "@common/api";
import chain from "./chain";
class PledgeList {
  list = [];
  page = 1;
  pagesize = 10;
  total = 0;
  type = 1;

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => this.page,
      () => {
        this.requestPledgeList();
      }
    );
    this.init();
  }

  init() {
    this.list = [];
    this.total = 0;

    if (this.page !== 1) {
      this.page = 1;
    } else {
      this.requestPledgeList();
    }
  }
  async requestFresh() {
    console.log("pledgeList refresh...");
    const { list, count } = await fetchPledgeList(
      chain.address,
      1,
      this.pagesize * this.page,
      this.type
    );
    runInAction(() => {
      this.list = list;
      this.total = count;
    });
  }
  async requestPledgeList() {
    // console.log("aaaaaaaaaaaaaaaaaaaaaaaa--------->", chain.address);
    const data = await fetchPledgeList(
      chain.address,
      this.page,
      this.pagesize,
      this.type
    );
    if (data) {
      const { list, count } = data;
      runInAction(() => {
        this.list = [...this.list, ...list];
        this.total = count;
        // this.total = total
      });
    }
  }

  setPage(page) {
    this.page = page;
  }
}

export default new PledgeList();
