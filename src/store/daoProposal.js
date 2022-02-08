/* eslint-disable no-undef */
import { makeAutoObservable, runInAction } from "mobx";
import {
  getBalanceAsync,
  DAO_commitVote,
  DAO_reward,
  DAO_withDraw,
  DAO_beClaimed,
  DAO_getAllCanWithDraw,
  // DAO_Info,
  DAO_userVoteInfo,
  DAO_voteResultInfo,
  DAO_periodDeadline,
  periodLockEndTime,
} from "@utils/web3utils_future";
import { fetchDaoList } from "@common/api";
import { computeWeiToSymbol } from "@utils/common";

class DaoProposal {
  DaoList = []; //治理list
  round = new Map();
  MMRSBalance = 0; //MMRS余额
  constructor() {
    makeAutoObservable(this);
  }

  init(round) {
    if (this.round.get(round) === undefined) {
      this.round.set(round, {
        MMR_beClaimed: 0, //待领取MMR
        MMRS_beClaimed: 0, //待领取MMRS
        MMRS_Info: {}, //锁仓信息
        isVote: false, //是否投票
        positive: 0, //赞成票
        against: 0, //反对票
        deadline: 0, // 截止时间
      });
    }
  }

  viewDetail(round) {
    this.view = round;
  }

  updateData(round, key, value) {
    this.round.get(round)[key] = value;
  }

  async initData(round) {
    this.queryBalanceAsync();
    // this.updateData(round, "needWFILAmount", "0.0000");
    // this.updateData(round, "needWFILAmountFull", 0);
  }
  async reFreshData(round) {
    this.queryBalanceAsync();
    this.DAO_userVoteInfo(round);
    this.DAO_voteResultInfo(round);
  }

  // 查询MMRS余额
  async queryBalanceAsync() {
    const MMRS = await getBalanceAsync("MMRS");
    if (MMRS) {
      runInAction(() => {
        this.MMRSBalance = MMRS;
      });
    }
  }

  //治理 List
  async getDaoList() {
    const data = await fetchDaoList();
    console.log("daoList", data);
    if (data) {
      runInAction(() => {
        this.DaoList = data;
      });
    }
  }
  //投票
  async DAO_commitVote(round, num, isPositive) {
    try {
      return await DAO_commitVote(round, num, isPositive);
    } catch (error) {
      return false;
    }
  }
  //领取MMR
  async DAO_reward(round) {
    try {
      return await DAO_reward(round);
    } catch (error) {
      return false;
    }
  }
  //领取MMRS
  async DAO_withDraw(round) {
    try {
      return await DAO_withDraw(round);
    } catch (error) {
      return false;
    }
  }
  //待领取MMR
  async DAO_beClaimed(round) {
    const result = await DAO_beClaimed(round);
    this.updateData(round, "MMR_beClaimed", result);
    // if (result) {
    //   runInAction(() => {
    //     this.MMR_beClaimed = result;
    //   });
    // }
  }
  //待领取MMRS
  async DAO_getAllCanWithDraw(round) {
    const result = await DAO_getAllCanWithDraw(round);
    this.updateData(round, "MMRS_beClaimed", result[0] * 50000);
    this.updateData(round, "MMRS_unlock", result[1] * 50000);
  }
  //锁仓信息
  // async DAO_Info(round) {
  //   const result = await DAO_Info(round);
  //   if (result) {
  //     this.updateData(round, "MMRS_Info", result);
  //   }
  // }
  //是否投票
  async DAO_userVoteInfo(round) {
    const result = await DAO_userVoteInfo(round);
    this.updateData(round, "isVote", result);
  }
  //投票数量
  async DAO_voteResultInfo(round) {
    const result = await DAO_voteResultInfo(round);
    this.updateData(round, "against", result?.against);
    this.updateData(round, "positive", result?.positive);
  }
  //截止时间
  async DAO_periodDeadline(round) {
    const result = await DAO_periodDeadline(round);
    this.updateData(round, "deadline", result);
  }
  //解锁时间
  async periodLockEndTime(round) {
    const result = await periodLockEndTime(round);
    this.updateData(round, "lockTime", result);
  }
}

export default new DaoProposal();
