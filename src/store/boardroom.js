import { makeAutoObservable, runInAction, reaction } from 'mobx'
import {
  getEthBalanceAsync,
  getIncome,
  getTotalIncome,
  hasPledged,
  getMMRBalanceAsync,
  toPledge,
  DAORedeem,
  needUSDT,
  totalHasPledged,
  redeemable,
  MMRhasPledged
} from '@utils/web3utils_future'
import { computeWeiToSymbol, interception } from '@utils/common'
// import loading from '@utils/loading'
import chain from './chain'

class Boardroom {
  EthBalance = 0 //以太坊货币余额
  MMRBalance = 0 //MMR货币余额
  USDTBalance = 0 //USDT货币余额
  unclaimedIncome = 0 //待领取收益
  totalIncome = 0 //累计已领取收益
  hasPledged = 0 //董事会_已质押算力
  totalHasPledged = 0 //董事会_全网已质押算力
  USDThasPledged = 0 //董事会_已质押算力USDT
  MMRhasPledged = 0 // 董事会_已质押MMR
  needMMRAmount = 0 //董事会_质押需要的USDT数量
  MMRRedeemable = '0.0000' //董事会_可赎回的MMR
  USDTRedeemable = '0.0000' //董事会_可赎回的USDT
  MMRForce = 0 //董事会_以MMR计价的总算力

  constructor() {
    makeAutoObservable(this)
    this.init()
  }

  async init() {
    runInAction(() => {
      this.needMMRAmount = 0
    })
  }

  // 更新余额数据
  requestUpdateData() {
    this.getBalanceAsync()
  }
  // 更新待领取收益、累计已领取
  requestUpdateIncome() {
    // console.log('更新待领取收益、累计已领取')
    this.getUnclaimedIncome()
    this.getTotalIncome()
  }
  // 3秒刷新董事会首页数据
  threeSecondsRefresh() {
    // console.log('3秒刷新数据')
    this.getUnclaimedIncome()
    this.getTotalIncome()
    this.getHasPledged()
    this.getTotalPledged()
    this.getMMRRedeemable()
  }
  // 确定赎回后刷新数据
  getbackRrfesh() {
    this.getHasPledged()
    this.getMMRRedeemable()
    this.getMMRHasPledged()
  }
  // 获取以太坊货币余额
  async getEthBalanceAsync() {
    const getEthBalanceResult = await getEthBalanceAsync()
    runInAction(() => {
      this.EthBalance = computeWeiToSymbol(getEthBalanceResult, 4)
    })
  }
  // 获取MMR余额、获取USDT余额
  async getBalanceAsync() {
    const MMRdata = await getMMRBalanceAsync('MMR', chain.address)
    // console.log("MMRdata余额",MMRdata);
    const USDTdata = await getMMRBalanceAsync('USDT', chain.address)
    runInAction(() => {
      this.MMRBalance = MMRdata - 0
      this.USDTBalance = USDTdata - 0
    })
  }
  // 获取待领取收益
  async getUnclaimedIncome() {
    const getUnclaimedIncomeResult = await getIncome()
    // console.log("董事会待领取MMR",getUnclaimedIncomeResult);
    runInAction(() => {
      this.unclaimedIncome = getUnclaimedIncomeResult - 0
    })
  }
  // 累计已领取MMR收益
  async getTotalIncome() {
    const getTotalIncomeResult = await getTotalIncome()
    runInAction(() => {
      this.totalIncome = getTotalIncomeResult - 0
    })
  }
  // 获取当前用户已质押代币算力/算已质押的USDT
  async getHasPledged() {
    const getUnclaimedIncomeResult = await hasPledged()
    // console.log( 'hasPledged===>',computeWeiToSymbol(getUnclaimedIncomeResult,4))
    runInAction(() => {
      this.hasPledged = computeWeiToSymbol(getUnclaimedIncomeResult,4)
      this.USDThasPledged = interception(
        // eslint-disable-next-line no-undef
        computeWeiToSymbol((BigInt(getUnclaimedIncomeResult) / 6n).toString()),
        4
      )
    })
  }
  // 获取当前用户已质押的MMR
  async getMMRHasPledged() {
    const getMMRHasPledgedResult = await MMRhasPledged()
    runInAction(() => {
      this.MMRForce = interception(
        // eslint-disable-next-line no-undef
        computeWeiToSymbol((BigInt(getMMRHasPledgedResult)).toString()),
        4
      )
      this.MMRhasPledged = interception(
        // eslint-disable-next-line no-undef
        computeWeiToSymbol((BigInt(getMMRHasPledgedResult)*5n/6n).toString()),
        4
      )
    })
  }
  // 获取董事会全网已质押代币算力
  async getTotalPledged() {
    const getTotalHasPledgedResult = await totalHasPledged()
    // console.log("getTotalHasPledgedResult",getTotalHasPledgedResult);
    runInAction(() => {
      this.totalHasPledged = getTotalHasPledgedResult
    })
  }
  // 获取董事会当前用户可赎回MMR及USDT
  async getMMRRedeemable() {
    const getMMRRedeemableResult = await redeemable()
    // console.log(getMMRRedeemableResult);
    if (getMMRRedeemableResult) {
      runInAction(() => {
        this.MMRRedeemable = getMMRRedeemableResult[1]
        this.USDTRedeemable = getMMRRedeemableResult[0]
      })
    }
  }

  // 董事会质押算力
  async toPledge(address, amount) {
    const toPledgeResult = await toPledge(address, amount)
    return toPledgeResult
  }
  // 董事会取回质押MMR
  async DAORedeem(address, amount) {
    const DAORedeemResult = await DAORedeem(address, amount)
    return DAORedeemResult
  }
  // 董事会获取需要USDT
  async getNeedUSDT(amount) {
    const needUSDTResult = await needUSDT(amount)
    const data = interception(needUSDTResult * 5, 4)
    runInAction(() => {
      this.needMMRAmount = data
    })
  }
}

export default new Boardroom()
