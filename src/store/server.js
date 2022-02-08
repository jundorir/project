import { makeAutoObservable, runInAction } from "mobx";
import { interception } from "@utils/common";

import {
  fetchData,
  fetchNotice,
  fetchAgreement,
  fetchAprData,
  fetchMillProduct,
  fetchOrdinaryTConfig,
  fetchBlockNumber,
  fetchFMData,
  fetchFMAward,
} from "@common/api";
class Server {
  fil_price = 0;
  mmr_price = 0;
  ratio = "100.00"; // 固定收益率
  ratio2 = "100.00"; // 质押挖矿综合收益率
  block_reward = 0; // 每个块的奖励
  earnings_mmr = 0; // 24小时综合收益mmr
  earnings_fil = 0; // 24小时综合收益fil
  block_reward_mmr = 0; //每块区块奖励mmr
  block_reward_fil = 0; //每块区块奖励fil
  ratio_mmr = 0; //固定收益率mmr
  ratio_fil = 0; //固定收益率fil
  noticeList = [];
  noticeReadList = [];
  agreement = "";
  list = [];
  is_transfer = 1;
  tvl_director = 0;
  apr_director = 0;
  tvl_lp = 0;
  apr_lp = 0;
  tvl_computcomputational = 0;
  apr_computcomputational = 0;
  productInfo = null;
  BlockNumber = 0;

  FM_wait = 0; //FM待领取


  OrdinaryT = {};

  constructor() {
    makeAutoObservable(this);
    this.requestServerData();
  }
  async requestServerData() {
    this.queryData();
    this.queryAprData();
  }
  async queryData() {
    try {
      const data = await fetchData();
      runInAction(() => {
        this.is_transfer = data.is_transfer;
        // this.is_transfer = 0
        this.fil_price = data.fil_price;
        // this.ratio = (Math.floor(data.ratio * 10000) / 10000).toFixed(4);
        // this.ratio2 = (Math.floor(data.ratio2 * 10000) / 10000).toFixed(4);
        this.block_reward = data.block_reward;
        this.mmr_price = data.mmr_price;
        // this.earnings_mmr = computeWeiToSymbol(data.earnings_mmr, 4);
        // this.earnings_fil = computeWeiToSymbol(data.earnings_fil, 4);
        this.block_reward_mmr = data.block_reward_mmr;
        this.block_reward_fil = data.block_reward_fil;
        this.ratio_mmr = (Math.floor(data.ratio_mmr * 10000) / 10000).toFixed(
          4
        );
        this.ratio_fil = (Math.floor(data.ratio_fil * 10000) / 10000).toFixed(
          4
        );
      });
    } catch {}
  }

  async queryAprData() {
    try {
      const data = await fetchAprData();
      runInAction(() => {
        this.tvl_director = interception(data.tvl_director || 0);
        this.apr_director = interception(data.apr_director || 0);
        this.tvl_lp = interception(data.tvl_lp || 0);
        this.apr_lp = interception(data.apr_lp || 0);
        this.tvl_computcomputational = interception(
          data.tvl_computcomputational || 0
        );
        this.apr_computcomputational = interception(
          data.apr_computcomputational || 0
        );
      });
    } catch {}
  }

  async queryNotice() {
    const list = await fetchNotice();
    let noticeReadList = localStorage.getItem("readNotice");
    if (noticeReadList === null || noticeReadList === "") {
      noticeReadList = [];
    } else {
      noticeReadList = noticeReadList?.split(",") || [];
    }
    if (list) {
      runInAction(() => {
        this.noticeList = list;
        this.noticeReadList = noticeReadList;
      });
    }
  }

  getNoticeById(id) {
    const notice = this.noticeList.filter(
      (item) => item.id.toString() === id.toString()
    );
    return notice[0];
  }

  read(id) {
    let newReadList = [...this.noticeReadList, id.toString()];
    let sampleList = [...new Set(newReadList)];
    if (sampleList.length > this.noticeReadList.length) {
      this.noticeReadList = sampleList;
      localStorage.setItem("readNotice", sampleList.join(","));
    }
  }

  async queryAgreement() {
    const data = await fetchAgreement();
    runInAction(() => {
      this.agreement = data;
    });
  }
  // async requestPledgeList() {
  //   const address = chain.address
  //   const { list } = await fetchPledgeList()
  //   console.log('data>>>>>>>>>', list)
  //   if (list) {
  //     this.list = list
  //   }
  // }
  async queryProductInfo() {
    const data = await fetchMillProduct();
    // console.log("productInfo ===>", data);
    let template = new Map();
    data?.forEach((element) => {
      template.set(element.period, element);
    });
    runInAction(() => {
      this.productInfo = template;
    });
  }

  async queryOrdinaryTConfig() {
    const data = await fetchOrdinaryTConfig();
    // console.log("data ==>", data);
    if (data) {
      runInAction(() => {
        this.OrdinaryT = { ...data };
      });
    }
  }
  async queryBlockNumber() {
    const data = await fetchBlockNumber();
    // console.log("区块号data ==>", data);
    if (data) {
      runInAction(() => {
        this.BlockNumber = data;
      });
    }
  }

  //FM 获取页面数据
  async getFMData(address) {
    const result = await fetchFMData(address);
    if (result) {
      this.FM_wait = result;
    }
  }
  //FM 领取
  async getFMAward(address) {
    return await fetchFMAward(address);
  }
}

export default new Server();
