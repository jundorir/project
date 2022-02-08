import { makeAutoObservable, runInAction, reaction } from "mobx";
import {
  getAccounts,
  getMMRPageInfo,
  getParent,
  bindParentAsync,
  rewardInAssignToken,
  withDrawInAssignToken,
  getBalanceAsync,
  isApproveFlow,
  depositInPledge,
  withDrawInPledge,
  getOutfeeInPledge,
  queryAmountFilBeClaimedInAssignToken,
  depositInAssignToken,
  enable,
  queryAllowance,
  getAmountReceived,
  getMMRBalanceAsync,
  getCurrentBlock,
  queryComputeAmounts,
  swapUSDTAndMMR,
  getLPTokenAddress,
} from "@utils/web3utils_future";
import { quiteAddress, computeWeiToSymbol } from "@utils/common";
import loading from "@utils/loading";
// import { curChainId } from "@common/const";
import { fetchContractAddress } from "@common/api";
// console.log("curChainId", curChainId);
// const curChainId = "0x1b354"; //测试环境
// const curChainId = "0x5"; //测试环境
const curChainId = "0x38"; //正式环境

const TAddressRegExp = /^T\d+Address$/;
class Chain {
  address = "";
  chainId = curChainId;
  initEnd = false;
  latelyTime = 0;
  isUpdating = false;
  cachedData = [];
  nowTotalSupply = 0;
  forceStop = false;

  totalDeposit = 0; // 全网总fil算力
  totalRewards = 0; // 全网已发放的fil
  mmrTotalRewards = 0; // 全网已发放的mmr
  MMRtotalDeposit = 0; // 全网总mmr算力
  myMMRDeposit = 0; // 我质押的mmr
  myDeposit = 0; //我质押的的fil
  currentBlockNumber = 0; //当前区块号

  fee = 3;
  MMRBalance = 0;
  bindParnet = null;
  balance = 0;
  WFILearnings = 0;
  MMRearnings = 0;
  isApprove = false;
  impowerAmount = 0;
  sharer = "";
  filReceived = 0;
  mmrReceived = 0;
  contractAddress = {};
  LPAddress = "";
  currentPeriod = 0;

  simpleUser = {};
  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.chainId,
      (current) => {
        if (current === undefined) {
          this.chainId = window.ethereum?.chainId;
        } else if (parseInt(current) !== parseInt(curChainId)) {
          loading.showNetWorkError();
        } else {
          loading.hidden();
        }
      }
    );
    reaction(
      () => this.address,
      (address) => {
        if (address !== "") {
          this.queryBindParent();
        }
      }
    );

    this.init();
  }

  get isLogin() {
    return !!this.address;
  }

  get isCorrectChain() {
    return this.chainId === curChainId;
  }

  async queryContractAddress() {
    const list = await fetchContractAddress();

    runInAction(() => {
      let contractTempAddress = {};
      let TCurrencyMap = {};
      list.forEach((element) => {
        contractTempAddress[element.name] = element.address;
        if (TAddressRegExp.test(element.name)) {
          const endIndex = element.name.indexOf("Address");
          TCurrencyMap[element.name.substring(0, endIndex)] = element.address;
        }
      });

      this.currentPeriod = parseInt(contractTempAddress.currentPeriod);
      let currencyMap = {
        AFIL: contractTempAddress.AFILAddress,
        WFIL: contractTempAddress.WFILAddress,
        MMR: contractTempAddress.MmrAddress,
        MMRS: contractTempAddress.MMRS_TOKEN,
        USDT: contractTempAddress.UsdtAddress,
        MMRS_USDT_LP: contractTempAddress.MMRS_USDT_LP,
        FM: contractTempAddress.fmttoken,
        ...TCurrencyMap,
      };

      this.contractAddress = {
        ...contractTempAddress,
        currencyMap: currencyMap,
      };
      console.log("this.contractAddress", this.contractAddress);
    });
  }

  get isActive() {
    return (
      this.bindParnet !== null &&
      this.bindParnet !== "0x0000000000000000000000000000000000000000"
    );
  }

  setAddress(address) {
    this.address = address;
    if (address !== "") {
      localStorage.setItem("address", address);
      return;
    }
    localStorage.removeItem("address");
  }

  get quiteAddress() {
    if (!this.address) return "";
    return quiteAddress(this.address);
  }

  async init() {
    this.registerListener();
    this.chainId = window.ethereum?.chainId;

    await this.queryContractAddress();

    const account = await this.getNowAccounts();

    this.queryLPAddress("U");
    // this.queryLPAddress("T");
    this.getOutfee();
    this.querySimpleUser();

    if (account) {
      this.queryBindParent();
      this.getBalance();
      this.getUnclaimed();
      this.getCurrentBlock();
    }

    this.initEnd = true;
  }

  async querySimpleUser() {
    let jsonString = localStorage.getItem("simple_user");
    if (jsonString !== null) {
      try {
        let simpleUser = JSON.parse(jsonString);
        if (
          !this.simpleUser.userSlippageTolerance ||
          !this.simpleUser.userComputationalSlippageTolerance
        ) {
          simpleUser = {
            userSlippageTolerance: 0,
            userComputationalSlippageTolerance: 0,
            ...simpleUser,
          };
          this.setSimpleUser(simpleUser);
        }
        this.simpleUser = simpleUser;
      } catch {}
    } else {
      this.setSimpleUser({
        userSlippageTolerance: 0,
        userComputationalSlippageTolerance: 0,
      });
    }
  }

  async queryLPAddress(type) {
    const LPAddress = await getLPTokenAddress(type);
    runInAction(() => {
      this.contractAddress.currencyMap = {
        ...this.contractAddress.currencyMap,
        [type === "U" ? "LP" : "TLP"]: LPAddress,
      };
    });
  }

  async setSimpleUser(simpleUser) {
    let jsonString = JSON.stringify(simpleUser);
    localStorage.setItem("simple_user", jsonString);
    this.simpleUser = simpleUser;
  }

  async requestChainData() {
    // console.log("chain refresh...");
    this.queryMMRPageInfo();
    this.getUnclaimed();
    this.getBalance();
    this.queryAmountReceived();
    this.getCurrentBlock();
  }
  async getNowAccounts() {
    const accounts = await getAccounts();
    if (accounts?.length > 0) {
      this.setAddress(accounts[0]);
    }
    return accounts?.[0];
  }

  registerListener() {
    window.ethereum?.on("chainChanged", (newChainId) => {
      // console.log("chainChanged", newChainId);

      runInAction(() => {
        this.chainId = newChainId;
      });
    });

    window.ethereum?.on("accountsChanged", (accounts) => {
      let newAddress = "";
      if (accounts.length > 0) {
        newAddress = accounts[0];
      }
      this.setAddress(newAddress);
    });
    window.ethereum?.on("connect", (connectInfo) => {
      // console.log("connect", connectInfo);
      runInAction(() => {
        this.chainId = connectInfo.chainId;
      });
    });
  }

  login() {
    enable();
  }

  async queryMMRPageInfo() {
    const {
      myDeposit,
      totalDeposit,
      totalRewards,
      mmrTotalRewards,
      myMMRDeposit,
      MMRtotalDeposit,
    } = await getMMRPageInfo();
    runInAction(() => {
      this.myDeposit = computeWeiToSymbol(myDeposit, 4);
      this.totalDeposit = computeWeiToSymbol(totalDeposit, 4);
      this.totalRewards = computeWeiToSymbol(totalRewards, 4);
      this.mmrTotalRewards = computeWeiToSymbol(mmrTotalRewards, 4);
      this.myMMRDeposit = computeWeiToSymbol(myMMRDeposit, 4);
      this.MMRtotalDeposit = computeWeiToSymbol(MMRtotalDeposit, 4);
    });
  }

  async queryBindParent() {
    let parent = localStorage.getItem(`${this.address}_bind_parent`);
    if (
      parent === null ||
      parent === "false" ||
      parent === "0x0000000000000000000000000000000000000000"
    ) {
      // console.log('111222233334444')
      parent = await getParent();
      console.log("parent", parent);
      if (parent === false) {
        return;
      }
      localStorage.setItem(`${this.address}_bind_parent`, parent);
    }

    runInAction(() => {
      this.bindParnet = parent;
    });
    // console.log("parent ==>", parent);
  }

  async bindParnetFunction(parentAddress) {
    // loading.show();
    // return;
    const bindResult = await bindParentAsync(parentAddress);

    if (bindResult) {
      localStorage.setItem(`${this.address}_bind_parent`, parentAddress);
    }
    return bindResult;

    // if (bindResult) {
    //   this.queryBindParent()
    // }
    // loading.hidden();
    // return bindResult;
  }
  //查询上级地址是否可绑定
  async queryParnetFunction(query) {
    const queryResult = await getParent(query);
    return queryResult;
  }
  // 收获算力奖励
  async reapRewards() {
    // loading.show();
    const reapRewardsResult = await rewardInAssignToken();
    // console.log("reapRewardsResult ==>", reapRewardsResult);
    if (reapRewardsResult) {
      // this.queryBindParent();
    }

    // loading.hidden();
    return reapRewardsResult;
  }
  // 取回质押的算力
  async withDraw(amount, id) {
    // loading.show();
    const withDrawResult = await withDrawInAssignToken(amount, id);
    // loading.hidden();
    return withDrawResult;
  }
  // 获取代币余额
  async getBalance() {
    const getBalanceResult = await getBalanceAsync("WFIL");
    // console.log('getBalanceResult------>', getBalanceResult)
    runInAction(() => {
      this.balance = getBalanceResult;
    });
    return getBalanceResult;
  }
  //获取待领取收益
  async getUnclaimed() {
    const getUnclaimedResult = await queryAmountFilBeClaimedInAssignToken();
    if (getUnclaimedResult) {
      // console.log('getUnclaimedResult===>', getUnclaimedResult)
      runInAction(() => {
        this.WFILearnings = getUnclaimedResult[0];
        this.MMRearnings = getUnclaimedResult[1];
      });
    }
    return getUnclaimedResult;
  }

  // 质押算力
  async toPledge(amount, planId) {
    // loading.show();
    const toPledgeResult = await depositInAssignToken(amount, planId);
    // loading.hidden();
    return toPledgeResult;
  }

  async queryBalance(symbol) {
    if (symbol === "MMR") {
      return getMMRBalanceAsync("MMR", this.address);
    }

    // if (symbol === "USDT") {
    //   const balance = await getEthBalanceAsync();
    //   return computeWeiToSymbol(balance, 4);
    // }

    const balace = await getBalanceAsync(symbol);
    return balace;
  }

  async queryAllowanceAsync(symbol) {
    const allowance = await queryAllowance(symbol);
    return allowance;
  }
  async toApprove({ type, symbol, round, from = null }) {
    // console.log("chain.toApprove ===>", type, symbol);
    // loading.show();
    if (type === "Router1") {
    }

    const balace = await isApproveFlow({ type, symbol, round });
    if (balace && symbol === "WFIL" && from === "pledge") {
      runInAction(() => {
        this.isApprove = true;
        this.impowerAmount = balace.approveAmount;
      });
    }
    // loading.hidden();
    return balace;
  }

  async depositInSwap(amount, type, minOut = 0, AFILSelected, WFILSelected) {
    if (type === "Router1") {
      let result = await swapUSDTAndMMR({
        from: AFILSelected,
        to: WFILSelected,
        amount,
        minOut,
      });
      return result;
    }
    const result = await depositInPledge(amount);
    return result;
  }
  async withDrawInSwap(amount, type, minOut = 0, AFILSelected, WFILSelected) {
    if (type === "Router1") {
      let result = await swapUSDTAndMMR({
        from: WFILSelected,
        to: AFILSelected,
        amount,
        minOut,
      });
      return result;
    }
    const result = await withDrawInPledge(amount);
    return result;
  }

  async queryComputeAmountsInSwap(amount, fromSymbol, toSymbol) {
    const result = await queryComputeAmounts(amount, fromSymbol, toSymbol);
    // console.log("result ===>", result);
    return computeWeiToSymbol(result, 4);
  }

  async getOutfee() {
    const fee = await getOutfeeInPledge();
    // console.log('fee', fee)
    console.log(
      "window.ethereum?.chainId ===> getOutfee",
      this.chainId,
      // typeof this.chainId,
      // curChainId,
      // this.chainId === null ? "1" : "2",
      // this.chainId === "" ? "3" : "4",
      // this.chainId === undefined ? "5" : "6",
      "-----",
      window.ethereum?.chainId
    );
    runInAction(() => {
      this.fee = fee;
    });
  }

  async setSharer(sharer) {
    // console.log('sharer', sharer)
    this.sharer = sharer;
  }

  async queryAmountReceived() {
    const amountReceived = await getAmountReceived();
    // console.log('amountReceived======>', amountReceived)
    runInAction(() => {
      this.filReceived = computeWeiToSymbol(amountReceived[0], 8);
      this.mmrReceived = computeWeiToSymbol(amountReceived[1], 4);
    });
  }

  async queryMMRBalanceAsync() {
    const MMRBalance = await getMMRBalanceAsync();
    this.MMRBalance = MMRBalance;
  }
  // 获取当前区块号
  async getCurrentBlock() {
    const getCurrentBlockResult = await getCurrentBlock();
    runInAction(() => {
      this.currentBlockNumber = getCurrentBlockResult;
    });
  }
}

export default new Chain();
