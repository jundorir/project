import ajax from "@common/ajax";

const API = {
  getContractAddress: "/index/getContractAddress",
  getData: "/index/getData",
  getAprData: "/index/aprData",
  getNotice: "/index/getAnnouncement",
  getCommunity: "/index/getInviter",
  getAgreement: "/index/getInstructions",
  getPledgeList: "/index/amountLog",
  getMillProduct: "/index/millProduct",
  getOrdinaryTConfig: "/index/getOrdinaryTConfig",
  getLotteryInfo: "/Lotterynew/getLotteryInfo",
  getLotteryHistory: "/Lotterynew/getLotteryInfoAll",
  getMMRSCommunity: "/mmrs/MMRSCommunity",
  getDynamicDeward: "/mmrs/dynamicDeward",
  getGRData: "/mmrs/mmrsGrData",
  getGRMMRS: "/mmrs/getMmrs",
  receiveMMRSAward: "/mmrs/receiveAward",
  getBlockNumber: "/mmrs/getBlockNumber",
  getMMRSPlanReplaceData: "/Mmrsreplace/getData",
  getMMRSPlanReceiveAward: "/Mmrsreplace/receiveAward",
  getFMData: "/fm/getFm",
  getFMAward: "fm/receiveAward",
  getDaoList: "/Dao/getDaoList",
  isBlackList: "/mmrsreplace/isBlackList",
};
export async function fetchContractAddress(env = 1) {
  const api = API.getContractAddress;
  return ajax.get(api, { params: { env } }).then((res) => {
    return res.data;
  });
}

export async function fetchData() {
  const api = API.getData;
  return ajax.get(api).then((res) => {
    return res.data;
  });
}
export async function fetchAprData() {
  const api = API.getAprData;
  return ajax.get(api).then((res) => {
    return res.data;
  });
}

export async function fetchNotice(page = 1, pagesize = 1000) {
  const api = API.getNotice;
  return ajax.get(api, { params: { page, pagesize } }).then((res) => {
    return res.data;
  });
}

export async function fetchCommunity(address, page = 1, pagesize = 20) {
  const api = API.getCommunity;
  return ajax
    .get(api, { params: { user: address, page, pagesize } })
    .then((res) => {
      return res.data;
    });
}

export async function fetchAgreement() {
  const api = API.getAgreement;
  return ajax.get(api).then((res) => {
    return res.data;
  });
}

export async function fetchPledgeList(
  address,
  page = 1,
  pagesize = 10,
  type = 1
) {
  const api = API.getPledgeList;
  return ajax
    .get(api, { params: { user: address, page, pagesize, type } })
    .then((res) => {
      return res.data;
    });
}

export async function fetchMillProduct() {
  const api = API.getMillProduct;
  return ajax.get(api).then((res) => {
    return res.data;
  });
}

export async function fetchOrdinaryTConfig() {
  const api = API.getOrdinaryTConfig;
  return ajax.get(api).then((res) => {
    return res.data;
  });
}

export async function fetchLotteryInfo(address) {
  const api = API.getLotteryInfo;
  return ajax.get(api, { params: { address } }).then((res) => {
    return res.data;
  });
}

export async function fetchLotteryHistory() {
  const api = API.getLotteryHistory;
  return ajax.get(api).then((res) => {
    return res.data;
  });
}

export async function fetchMMRSCommunity(address, page = 1, pagesize = 20) {
  const api = API.getMMRSCommunity;
  return ajax
    .get(api, { params: { user: address, page, pagesize } })
    .then((res) => {
      return res.data;
    });
}

export async function fetchDynamicDeward(
  address,
  page = 1,
  pagesize = 10,
  type = 1
) {
  const api = API.getDynamicDeward;
  return ajax
    .get(api, { params: { user: address, page, pagesize, type } })
    .then((res) => {
      return res.data;
    });
}

export async function fetchGRData(address) {
  const api = API.getGRData;
  return ajax.get(api, { params: { user: address } }).then((res) => {
    return res.data;
  });
}
// 获取待领取的mmrs
export async function fetchGRMMRS(address) {
  const api = API.getGRMMRS;
  return ajax.get(api, { params: { user: address } }).then((res) => {
    return res.data;
  });
}
// 获取待领取的mmrs 签名信息getBlockNumber
export async function fetchReceiveMMRSAward(address) {
  const api = API.receiveMMRSAward;
  return ajax.get(api, { params: { user: address } });
}
// 获取待领取的mmrs 签名信息
export async function fetchBlockNumber() {
  const api = API.getBlockNumber;
  return ajax.get(api).then((res) => {
    // console.log("当前区块号", res);
    return res.data;
  });
}
//GR置换 是否在黑名单
export async function isBlackList(address) {
  const api = API.isBlackList;
  return ajax.get(api, { params: { user: address } }).then((res) => {
    return res.data;
  });
}

export async function fetchMMRSPlanReplaceData(address) {
  const api = API.getMMRSPlanReplaceData;
  return ajax.get(api, { params: { user: address } }).then((res) => res.data);
}

export async function fetchReceiveMMRSReplaceAward(address) {
  const api = API.getMMRSPlanReceiveAward;
  return ajax.get(api, { params: { user: address } });
}

export async function fetchFMData(address) {
  console.log(address);
  const api = API.getFMData;
  return ajax.get(api, { params: { user: address } }).then((res) => res.data);
}

export async function fetchFMAward(address) {
  const api = API.getFMAward;
  return ajax.get(api, { params: { user: address } }).then((res) => res.data);
}

export async function fetchDaoList() {
  const api = API.getDaoList;
  return ajax.get(api).then((res) => res.data);
}
