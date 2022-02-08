import { digitWei, computeSymbolToWei, computeWeiToSymbol } from "./common";
import loading from "@utils/loading";

import chain from "../store/chain";
import lang from "../store/lang";
import {
  assignToken as assignTokenAbi,
  netDB as netDBAbi,
  pledge as pledgeAbi,
  WfilErc20 as WfilErc20Abi,
  BaseERC20 as BaseERC20Abi,
  MMRERC20 as MMRAbi,
  Board as BoardAbi,
  WmiswapV1Router01 as WmiswapV1Router01Abi,
  WmiswapV1RouterRead as WmiswapV1RouterReadAbi,
  LpMintPool as LpMintPoolAbi,
  powerMint as powerMintAbi,
  Shop as ShopAbi,
  minerToken as minerTokenAbi,
  subscribe as subscribeAbi,
  MMRLottery as MMRLotteryAbi,
  Mediation as MediationAbi,
  verifyMmrsOrUsdt as VerifyMmrsAndUsdtAbi,
  NewBoardMintPool as newBoradAbi,
  freedomList as MMRS_GRAbi,
  mmrsPledge as mmrs_pledgeAbi,
  FMTMintPool as FMTMintPoolAbi,
  FMTSubscribe as FMTSubscribeAbi,
  DaoCommit as DaoCommitAbi,
} from "../abi";
import { Toast } from "antd-mobile";

let web3_Provider = null;
if (typeof window.web3 !== "undefined") {
  web3_Provider = new window.Web3(window.web3.currentProvider);
  window.utils = web3_Provider.utils;
  window.web3_Provider = web3_Provider;
}

export async function getAccounts() {
  return window.ethereum?.request({ method: "eth_accounts" });
}

let Global_Contract = {};
let Contract = {
  AssignToken: "AssignToken",
  Pledge: "Pledge",
  BaseERC20: "BaseERC20",
  NetDB: "NetDB",
  MMR: "MMR",
  Board: "Board",
  WmiswapV1Router01: "WmiswapV1Router01",
  WmiswapV1RouterRead: "WmiswapV1RouterRead",
  LpMintPool: "LpMintPool",
  Shop: "Shop",
  TLpMintPool: "TLpMintPool",
  minerToken: "minerToken",
  subscribe: "subscribe",
  Lottery: "Lottery",
  Mediation: "Mediation",
  VerifyMmrsAndUsdt: "VerifyMmrsAndUsdt",
  newBorad: "newBorad",
  MMRS_GR: "MMRS_GR",
  mmrs_pledge: "mmrs_pledge",
  FMTMintPool: "FMTMintPool",
  FMTSubscribe: "FMTSubscribe",
  DaoCommit: "DaoCommit",
};
let Abi = {
  AssignToken: assignTokenAbi,
  Pledge: pledgeAbi,
  BaseERC20: BaseERC20Abi,
  NetDB: netDBAbi,
  MMR: MMRAbi,
  Board: BoardAbi,
  WmiswapV1Router01: WmiswapV1Router01Abi,
  WmiswapV1RouterRead: WmiswapV1RouterReadAbi,
  LpMintPool: LpMintPoolAbi,
  TLpMintPool: powerMintAbi,
  Shop: ShopAbi,
  minerToken: minerTokenAbi,
  subscribe: subscribeAbi,
  Lottery: MMRLotteryAbi,
  Mediation: MediationAbi,
  VerifyMmrsAndUsdt: VerifyMmrsAndUsdtAbi,
  newBorad: newBoradAbi,
  MMRS_GR: MMRS_GRAbi,
  mmrs_pledge: mmrs_pledgeAbi,

  FMTMintPool: FMTMintPoolAbi,
  FMTSubscribe: FMTSubscribeAbi,
  DaoCommit: DaoCommitAbi,
};

function getNowUserAddress() {
  return chain.address;
}

export function enable() {
  return new Promise((resolve, reject) => {
    if (typeof window.ethereum === "undefined") {
      console.log("MetaMask没有安装!");
      return;
    }
    if (typeof window.web3 === "undefined") {
      console.log("看起来你需要一个Dapp浏览器来启动。");
      return;
    }
    if (window.ethereum.enable) {
      window.ethereum
        .enable()
        .then((accounts) => {
          resolve(accounts[0]);
        })
        .catch(function (reason) {
          reject(reason.message);
        });
      return;
    } else {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          resolve(accounts[0]);
        })
        .catch(function (reason) {
          reject(reason.message);
        });
    }
  });
}

function getContract(contractName, contractAddress) {
  if (contractAddress === undefined) {
    // console.log("contractName, contractAddress", contractName, contractAddress);
    Toast.info(lang.networkError);
    return null;
  }
  // console.log("web3_Provider", web3_Provider);
  if (web3_Provider === null) {
    if (typeof window.web3 !== "undefined") {
      web3_Provider = new window.Web3(window.web3.currentProvider);
      window.utils = web3_Provider.utils;
      window.web3_Provider = web3_Provider;
    }
  }
  if (web3_Provider === null) return null;
  if (
    [
      Contract.AssignToken,
      Contract.Pledge,
      Contract.BaseERC20,
      Contract.NetDB,
      Contract.MMR,
      Contract.Board,
      Contract.WmiswapV1Router01,
      Contract.WmiswapV1RouterRead,
      Contract.LpMintPool,
      Contract.Shop,
      Contract.IMinerToken,
      Contract.TLpMintPool,
      Contract.minerToken,
      Contract.subscribe,
      Contract.Lottery,
      Contract.Mediation,
      Contract.newBorad,
      Contract.VerifyMmrsAndUsdt,
      Contract.MMRS_GR,
      Contract.mmrs_pledge,
      Contract.FMTMintPool,
      Contract.FMTSubscribe,
      Contract.DaoCommit,
    ].includes(contractName)
  ) {
    if (!Global_Contract[contractName + contractAddress])
      Global_Contract[contractName + contractAddress] =
        new web3_Provider.eth.Contract(Abi[contractName], contractAddress);
    return Global_Contract[contractName + contractAddress];
  }
  return null;
}

function sendAsync(params, needLog = false) {
  //   loading.show();
  return new Promise((resolve, reject) => {
    window.ethereum.sendAsync(
      {
        method: "eth_sendTransaction",
        params: params,
        from: getNowUserAddress(),
      },
      function (err, result) {
        console.log("err: ", err, "result:", result);
        // return;
        loading.show();
        if (!!err) {
          reject(err);
          loading.hidden();
          return;
        }
        let a = null;
        if (result.error) {
          reject(result.error.message);
          if (!!a) clearInterval(a);
          loading.hidden();
          return;
        }
        if (result.result) {
          a = setInterval(() => {
            web3_Provider.eth
              .getTransactionReceipt(result.result)
              .then((res) => {
                // console.log("getTransactionReceipt ==>", res);
                if (res) {
                  loading.hidden();
                  clearInterval(a);
                  if (!needLog) {
                    resolve(res.status); // res.status true or false;
                  } else {
                    resolve({
                      status: res.status,
                      logs: res.logs,
                    }); // res.status true or false;
                  }
                } else {
                }
              });
          }, 200);
        }
      }
    );
  });
}

/**
 * 获取首页信息
 * @returns
 */
export async function getMMRPageInfo() {
  const contract = getContract(
    Contract.AssignToken,
    chain.contractAddress?.assignTokenAddress
  );
  return new Promise((resolve) => {
    contract?.methods?.mmrPageInfo(getNowUserAddress()).call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        // console.log("getMMRPageInfo ===> ", result);
        resolve(result);
      }
    });
  });
}

/**
 * 获取绑定的父节点
 * @returns
 */
export async function getParent(query = null) {
  const contract = getContract(
    Contract.NetDB,
    chain.contractAddress?.DBAddress
  );
  return new Promise((resolve) => {
    contract?.methods
      ?.getParent(query ? query : getNowUserAddress())
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          // console.log("getParent ===> ", result);
          resolve(result);
        }
      });
  });
}

/**
 * 绑定的父节点
 * @returns
 */
export async function bindParentAsync(parentAddress) {
  const contract = getContract(
    Contract.NetDB,
    chain.contractAddress?.DBAddress
  );
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.DBAddress,
      value: "0x0",
      data: contract?.methods
        ?.bindParent(getNowUserAddress(), parentAddress)
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}

/**
 * 代币交易授权
 * @returns
 */
export function approve(TokenAddress, contractAddress) {
  const contract = getContract(Contract.BaseERC20, TokenAddress);
  let params = [
    {
      from: getNowUserAddress(),
      to: TokenAddress,
      value: "0x0",
      data: contract?.methods
        ?.approve(
          contractAddress,
          web3_Provider.utils.toHex(
            web3_Provider.utils.toBN("1000000000000000000000000000000000")
          )
        )
        .encodeABI(),
    },
  ];
  return sendAsync(params, true);
}

/**
 * 是否允许调用钱包地址
 * @returns
 */
export function allowance(TokenAddress, contractAddress) {
  const contract = getContract(Contract.BaseERC20, TokenAddress);
  return new Promise((resolve) => {
    contract?.methods
      ?.allowance(getNowUserAddress(), contractAddress)
      .call((err, result) => {
        if (err) {
          resolve(-1);
        }
        // console.log("allowance result ====> ", result);
        if (result < 10000000000000000000000000000000) {
          resolve(false);
        } else {
          resolve(result);
        }
      });
  });
}

window.queryAllowance = queryAllowance;
export async function queryAllowance({ type, symbol, round = 1 }) {
  const map = {
    Pledge: chain.contractAddress?.pledgeAddress,
    AssignToken: chain.contractAddress?.assignTokenAddress,
    Router1: chain.contractAddress?.Router1Address,
    Board: chain.contractAddress?.BoardAddress,
    LpMintPool: chain.contractAddress?.lppoolAddress,
    TLpPool: chain.contractAddress?.[`Tlp${round}poolAddress`],
    Shop: chain.contractAddress?.ShopAddress,
    NewShop: chain.contractAddress?.newShop,
    minerToken: chain.contractAddress?.minerTokenAddress,
    subscribe: chain.contractAddress?.[`Subscribe${round}Address`],
    Lottery: chain.contractAddress?.LotteryAddress,
    Mediation: chain.contractAddress?.mediation,
    newBorad: chain.contractAddress?.newBorad,
    MMRS_GR: chain.contractAddress?.MMRS_GR,
    mmrs_pledge: chain.contractAddress?.mmrs_pledge,
    DaoCommit: chain.contractAddress?.DaoCommit,
  };
  const TokenAddress = chain.contractAddress.currencyMap?.[symbol];
  const contractAddress = map[type];
  const contract = getContract(Contract.BaseERC20, TokenAddress);

  const result = await new Promise((resolve) => {
    contract?.methods
      ?.allowance(getNowUserAddress(), contractAddress)
      .call((err, result) => {
        if (err) {
          resolve(-1);
        }
        resolve(result);
      });
  });
  // console.log("result ====> ", result);
  return result / Math.pow(10, 18);
}

/**
 * 授权合约允许代币交易流程
 * @param {*} type 1代表MediaAddress,2代表MarketAddress
 * @param {*} TokenAddress 默认为U地址,后续增加更多地址
 * @returns
 */
window.isApproveFlow = isApproveFlow;
export async function isApproveFlow({ type, symbol, round = 1 }) {
  const map = {
    Pledge: chain.contractAddress?.pledgeAddress,
    AssignToken: chain.contractAddress?.assignTokenAddress,
    Router1: chain.contractAddress?.Router1Address,
    Board: chain.contractAddress?.BoardAddress,
    LpMintPool: chain.contractAddress?.lppoolAddress,
    TLpPool: chain.contractAddress?.[`Tlp${round}poolAddress`],
    Shop: chain.contractAddress?.ShopAddress,
    minerToken: chain.contractAddress?.minerTokenAddress,
    Lottery: chain.contractAddress?.LotteryAddress,
    Mediation: chain.contractAddress?.mediation,
    newBorad: chain.contractAddress?.newBorad,
    MMRS_GR: chain.contractAddress?.MMRS_GR,
    mmrs_pledge: chain.contractAddress?.mmrs_pledge,
    NewShop: chain.contractAddress?.newShop,
    subscribe: chain.contractAddress?.[`Subscribe${round}Address`],
    DaoCommit: chain.contractAddress?.DaoCommit,
  };

  try {
    let isAllowance = await allowance(
      chain.contractAddress.currencyMap?.[symbol],
      map[type]
    );
    if (isAllowance) {
      return {
        status: true,
        approveAmount: isAllowance / Math.pow(10, 18),
      };
    }

    let { status, logs } = await approve(
      chain.contractAddress.currencyMap?.[symbol],
      map[type]
    );
    if (status) {
      return {
        status: status,
        approveAmount: logs[0].data / Math.pow(10, 18),
      };
    }
  } catch (e) {
    return {
      status: false,
      approveAmount: 0,
    };
  }
}

/**
 * 根据代币地址获取
 * @param {*} TokenAddress
 */
export async function getBalanceAsync(symbol = "AFIL") {
  // console.log("symbol", symbol);
  //USDTAddress

  const TokenAddress = chain.contractAddress.currencyMap?.[symbol];
  // console.log("TokenAddress", TokenAddress);
  const contract = getContract(Contract.BaseERC20, TokenAddress);
  return new Promise((resolve) => {
    contract?.methods?.balanceOf(getNowUserAddress()).call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        resolve(computeWeiToSymbol(result, 4));
      }
    });
  });
}
window.getBalanceAsyncTest = getBalanceAsyncTest;
export async function getBalanceAsyncTest(symbol = "AFIL") {
  // console.log("symbol", symbol);
  //USDTAddress
  const TokenAddress = chain.contractAddress.currencyMap?.[symbol];
  // console.log("TokenAddress", TokenAddress);
  const contract = getContract(Contract.BaseERC20, TokenAddress);
  return new Promise((resolve) => {
    contract?.methods?.balanceOf(getNowUserAddress()).call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        resolve(computeWeiToSymbol(result, 4));
      }
    });
  });
}

/**
 * swap from afil to wami
 * @param {*} amount
 * @returns
 */
export async function depositInPledge(amount) {
  const contract = getContract(
    Contract.Pledge,
    chain.contractAddress?.pledgeAddress
  );
  let wei = computeSymbolToWei(amount);
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.pledgeAddress,
      value: "0x0",
      data: contract?.methods
        ?.deposit(web3_Provider.utils.toHex(web3_Provider.utils.toBN(wei)))
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}

export async function getOutfeeInPledge() {
  const contract = getContract(
    Contract.Pledge,
    chain.contractAddress?.pledgeAddress
  );

  return new Promise((resolve) => {
    contract?.methods?.getOutfee().call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        // console.log("getOutfeeInPledge ===>", result);
        resolve(result);
      }
    });
  });
}

/**
 * swap from wami to afil
 * @param {*} amount
 * @returns
 */
export async function withDrawInPledge(amount) {
  const contract = getContract(
    Contract.Pledge,
    chain.contractAddress?.pledgeAddress
  );
  let wei = computeSymbolToWei(amount);
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.pledgeAddress,
      value: "0x0",
      data: contract?.methods
        ?.withDraw(web3_Provider.utils.toHex(web3_Provider.utils.toBN(wei)))
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}

/**
 * 质押算力
 * @param {*} amount
 * @returns
 */
export async function depositInAssignToken(amount, planId) {
  // console.log("amount=====>", amount, planId);
  const contract = getContract(
    Contract.AssignToken,
    chain.contractAddress?.assignTokenAddress
  );
  let wei = computeSymbolToWei(amount);
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.assignTokenAddress,
      value: "0x0",
      data: contract?.methods
        ?.depositByPeriod(
          web3_Provider.utils.toHex(web3_Provider.utils.toBN(wei)),
          planId
        )
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}

/**
 * 取回质押的算力
 * @param {*} amount
 * @returns
 */
export async function withDrawInAssignToken(percent, id) {
  // console.log("percent, idpercent, id", percent, id);
  const contract = getContract(
    Contract.AssignToken,
    chain.contractAddress?.assignTokenAddress
  );
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.assignTokenAddress,
      value: "0x0",
      data: contract?.methods?.withDrawById(percent, id).encodeABI(),
    },
  ];
  return sendAsync(params);
}

/**
 *
 * @returns 收获算力奖励
 */
export async function rewardInAssignToken() {
  const contract = getContract(
    Contract.AssignToken,
    chain.contractAddress?.assignTokenAddress
  );
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.assignTokenAddress,
      value: "0x0",
      data: contract?.methods?.reward().encodeABI(),
    },
  ];
  return sendAsync(params);
}

/**
 * 获取算力收益的值
 * @returns 获取算力收益的值
 */
window.queryAmountFilBeClaimedInAssignToken =
  queryAmountFilBeClaimedInAssignToken;
export async function queryAmountFilBeClaimedInAssignToken() {
  const contract = getContract(
    Contract.AssignToken,
    chain.contractAddress?.assignTokenAddress
  );

  return new Promise((resolve) => {
    contract?.methods
      ?.amountFilBeClaimed(getNowUserAddress())
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          // console.log('queryAmountFilBeClaimedInAssignToken ===>', result)
          resolve(result);
        }
      });
  });
}
/**
 * 获取每块区块奖励
 * @returns 每块区块奖励
 */
export async function getCurPerUintReward() {
  const contract = getContract(
    Contract.AssignToken,
    chain.contractAddress?.assignTokenAddress
  );
  return new Promise((resolve) => {
    contract?.methods?.curPerUintReward().call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        resolve(Number(digitWei(result, 36)));
      }
    });
  });
}

export async function getAmountReceived() {
  const contract = getContract(
    Contract.AssignToken,
    chain.contractAddress?.assignTokenAddress
  );
  return new Promise((resolve) => {
    contract?.methods
      ?.amountReceived(getNowUserAddress())
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          resolve(result);
        }
      });
  });
}

window.getMMRBalanceAsync = getMMRBalanceAsync;
export async function getMMRBalanceAsync(
  symbol = "MMR",
  address = chain.contractAddress?.assignTokenAddress
) {
  // console.log("TokenAddress", chain.contractAddress.currencyMap?.[symbol]);
  const TokenAddress = chain.contractAddress.currencyMap?.[symbol];
  const contract = getContract(Contract.MMR, TokenAddress);
  return new Promise((resolve) => {
    contract?.methods?.balanceOf(address).call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        resolve(computeWeiToSymbol(result, 4));
      }
    });
  });
}

//获取当前区块号
export async function getCurrentBlock() {
  const blockNumber = await web3_Provider.eth.getBlockNumber();
  return blockNumber;
}
//获取当前区块时间
export async function getBlockgTime() {
  const blockNumber = await web3_Provider.eth.getBlockNumber();
  const blockTime = await web3_Provider.eth.getBlock(blockNumber);
  return blockTime.timestamp;
}

/**
 *
 * @returns 获取以太坊货币余额
 */
export async function getEthBalanceAsync() {
  const balance = await web3_Provider.eth.getBalance(getNowUserAddress());
  return balance;
}

//new function 二期董事会接口
/**
 *
 * 董事会_领取MMR
 */
export async function DAOReward(address) {
  const contract = getContract(
    Contract.Board,
    chain.contractAddress?.BoardAddress
  );
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.BoardAddress,
      value: "0x0",
      data: contract?.methods?.Reward(address).encodeABI(),
    },
  ];
  return sendAsync(params);
}
/**
 *
 * 董事会_待领取收益
 */
export async function getIncome() {
  const contract = getContract(
    Contract.Board,
    chain.contractAddress?.BoardAddress
  );
  return new Promise((resolve) => {
    contract?.methods
      ?.amountBeClaimed(getNowUserAddress())
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          // console.log('result----------->', result)
          resolve(computeWeiToSymbol(result[0], 4));
        }
      });
  });
}
/**
 *
 * 董事会_累计已领取
 */
export async function getTotalIncome() {
  const contract = getContract(
    Contract.Board,
    chain.contractAddress?.BoardAddress
  );
  return new Promise((resolve) => {
    contract?.methods
      ?._rewardHadReceive(getNowUserAddress())
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          // console.log("------------------>", result);
          resolve(computeWeiToSymbol(result, 4));
        }
      });
  });
}
/**
 *
 * 董事会_当前用户已质押算力
 */
export async function hasPledged() {
  const contract = getContract(
    Contract.Board,
    chain.contractAddress?.BoardAddress
  );
  return new Promise((resolve) => {
    contract?.methods?._userPowers(getNowUserAddress()).call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        resolve(result);
      }
    });
  });
}
/**
 *
 * 董事会_总共已质押算力
 */
export async function totalHasPledged() {
  const contract = getContract(
    Contract.Board,
    chain.contractAddress?.BoardAddress
  );
  return new Promise((resolve) => {
    contract?.methods?._totalPower().call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        resolve(computeWeiToSymbol(result, 4));
      }
    });
  });
}
/**
 *
 * 董事会_剩余可赎回的MMR
 */
export async function redeemable() {
  const contract = getContract(
    Contract.Board,
    chain.contractAddress?.BoardAddress
  );
  return new Promise((resolve) => {
    contract?.methods
      ?.consultExtractedCopy(getNowUserAddress())
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          // console.log("当前用户可赎回MMR", result);
          const USDTResult = computeWeiToSymbol(result[0], 4);
          const MMRResult = computeWeiToSymbol(result[1], 4);
          resolve([USDTResult, MMRResult]);
        }
      });
  });
}
/**
 * 董事会质押
 * @param {*} amount
 * @returns
 */
export async function toPledge(address, amount) {
  const contract = getContract(
    Contract.Board,
    chain.contractAddress?.BoardAddress
  );
  let wei = computeSymbolToWei(amount);
  // console.log(
  //   'chain.contractAddress?.BoardAddress----->',
  //   chain.contractAddress.BoardAddress
  // )
  // let wei = amount
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.BoardAddress,
      value: "0x0",
      data: contract?.methods
        ?.pledge(
          address,
          web3_Provider.utils.toHex(web3_Provider.utils.toBN(wei))
        )
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}
/**
 * 董事会赎回
 * @param {*} amount
 * @returns
 */
export async function DAORedeem(address, amount) {
  const contract = getContract(
    Contract.Board,
    chain.contractAddress?.BoardAddress
  );
  // let wei = computeSymbolToWei(amount)
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.BoardAddress,
      value: "0x0",
      data: contract?.methods
        ?.withDraw(
          address,
          web3_Provider.utils.toHex(web3_Provider.utils.toBN(amount))
        )
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}
/**
 *
 * 董事会_需要的USDT_换算
 * 董事会_需要的MMR_换算
 */
export async function needUSDT(amount) {
  const contract = getContract(
    Contract.Board,
    chain.contractAddress?.BoardAddress
  );
  let wei = computeSymbolToWei(amount);
  return new Promise((resolve) => {
    contract?.methods
      ?.needMMrAmount(
        web3_Provider.utils.toHex(web3_Provider.utils.toBN(wei)),
        chain.contractAddress?.MmrAddress,
        chain.contractAddress?.UsdtAddress
      )
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          resolve(computeWeiToSymbol(result, 4));
        }
      });
  });
}
/**
 *
 * 董事会_已质押的MMR
 */
export async function MMRhasPledged() {
  const contract = getContract(
    Contract.Board,
    chain.contractAddress?.BoardAddress
  );
  return new Promise((resolve) => {
    contract?.methods
      ?._userPowerByMMR(getNowUserAddress())
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          const data = result;
          // console.log("MMRhasPledged------WEB3------------>", result);
          resolve(data);
        }
      });
  });
}

/**
 *
 * 算力挖矿_单价__minerToken合约
 */
export async function getTPrice(getAbiAddressResult) {
  const contract = getContract(Contract.minerToken, getAbiAddressResult);
  console.log("contract =====> ", contract);
  return new Promise((resolve) => {
    contract?.methods?.price().call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        resolve(computeWeiToSymbol(result, 4));
      }
    });
  });
}
/**
 * 通过MINERTOKEN获取MINER这个字符串
 *
 */
export async function formMinerTokenToString(minerTokenAddr) {
  const contract = getContract(Contract.minerToken, minerTokenAddr);
  return new Promise((resolve) => {
    contract?.methods?.name().call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        resolve(result);
      }
    });
  });
}
/**
 * 算力挖矿_购买功能
 * @param {*} amount
 * @returns
 */
export async function toBuyTByRound(amount, round) {
  const TokenAddress = chain.contractAddress.currencyMap?.[`T${round}`];
  const data = await formMinerTokenToString(TokenAddress);

  const contractAddress =
    round > 4
      ? chain.contractAddress?.newShop
      : chain.contractAddress?.ShopAddress;

  const contract = getContract(Contract.Shop, contractAddress);
  let wei = computeSymbolToWei(amount);
  if (data) {
    let params = [
      {
        from: getNowUserAddress(),
        to: contractAddress,
        value: "0x0",
        data: contract?.methods
          ?.buyMinerToken(
            web3_Provider.utils.toHex(web3_Provider.utils.toBN(wei)),
            data
          )
          .encodeABI(),
      },
    ];
    return sendAsync(params);
  }
}

export async function rushTByRound(amount, round) {
  // rushPurchase

  const TokenAddress = chain.contractAddress.currencyMap?.[`T${round}`];
  const data = await formMinerTokenToString(TokenAddress);

  const contractAddress = chain.contractAddress?.newShop;

  const contract = getContract(Contract.Shop, contractAddress);
  let wei = computeSymbolToWei(amount);
  if (data) {
    let params = [
      {
        from: getNowUserAddress(),
        to: contractAddress,
        value: "0x0",
        data: contract?.methods
          ?.rushPurchase(
            web3_Provider.utils.toHex(web3_Provider.utils.toBN(wei)),
            data
          )
          .encodeABI(),
      },
    ];
    return sendAsync(params);
  }
}
/**
 * 获取认购结束时间
 */
export async function getTimeByRound(round) {
  const TokenAddress = chain.contractAddress.currencyMap?.[`T${round}`];
  const contract = getContract(Contract.minerToken, TokenAddress);
  return new Promise((resolve) => {
    contract?.methods?._SubscribeEndtime().call((err, result) => {
      if (err) {
        // console.log("错误");
        resolve(false);
      }
      if (result) {
        resolve(result);
      }
    });
  });
}
/**
 * 获取购买结束时间
 */
export async function getBuyEndTimeByRound(round) {
  const TokenAddress = chain.contractAddress.currencyMap?.[`T${round}`];

  const contract = getContract(Contract.minerToken, TokenAddress);
  return new Promise((resolve) => {
    contract?.methods?._BuyEndtime().call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        resolve(result);
      }
    });
  });
}

/**
 * 算力挖矿_认购报名
 */
export async function signUpByRound(round, amount = 0) {
  if (round > 4) return newSignUpByRound(round, amount);
  const Address = chain.contractAddress?.[`Subscribe${round}Address`];
  const contract = getContract(Contract.subscribe, Address);
  let params = [
    {
      from: getNowUserAddress(),
      to: Address,
      value: "0x0",
      data: contract?.methods?.subScribequal(getNowUserAddress()).encodeABI(),
    },
  ];
  return sendAsync(params);
}

/**
 * 算力挖矿_认购报名(新) 第5期之后(含)
 */
async function newSignUpByRound(round, amount) {
  const Address = chain.contractAddress?.[`Subscribe${round}Address`];
  const contract = getContract(Contract.FMTSubscribe, Address);
  const wei = computeSymbolToWei(amount);
  const weiHex = web3_Provider.utils.toHex(web3_Provider.utils.toBN(wei));
  let params = [
    {
      from: getNowUserAddress(),
      to: Address,
      value: "0x0",
      data: contract?.methods
        ?.subScribequal(getNowUserAddress(), weiHex)
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}
/**
 * 算力挖矿_认购最大额度
 */
export async function getBiggestLimit(address, TAddr) {
  const contract = getContract(
    Contract.Shop,
    chain.contractAddress?.ShopAddress
  );
  const data = await formMinerTokenToString(TAddr);
  return new Promise((resolve) => {
    contract?.methods?.getUserBuyLimits(address, data).call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        resolve(computeWeiToSymbol(result, 4));
      }
    });
  });
}
/**
 * 当前时间<状态时间，此结果小于等于0，认购已结束，显示未认购，大于0，已经认购过
 */
export async function userAmountByRound(round) {
  const Address = chain.contractAddress?.[`Subscribe${round}Address`];
  let contractName = Contract.subscribe;
  if (round > 4) contractName = Contract.FMTSubscribe;
  const contract = getContract(contractName, Address);
  return new Promise((resolve) => {
    contract?.methods
      ?._userSubscribedAmount(getNowUserAddress())
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          resolve(computeWeiToSymbol(result, 4));
        }
      });
  });
}
/**
 * 全网已认购的董事会算例
 */
export async function totalSubscribeAmountByRound(round) {
  const Address = chain.contractAddress?.[`Subscribe${round}Address`];

  const contractName = round > 4 ? Contract.FMTSubscribe : Contract.subscribe;

  const contract = getContract(contractName, Address);
  return new Promise((resolve) => {
    contract?.methods?._totalSubscribeAmount().call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        resolve(computeWeiToSymbol(result, 4));
      }
    });
  });
}
/**
 * 获取董事会MMR算力__算力认购
 * round <= 4 获取 董事会算力
 * round > 4  获取 销毁的FM代币
 */
export async function getUserBoardPowerByRound(round) {
  const Address = chain.contractAddress?.[`Subscribe${round}Address`];

  const contractName = round > 4 ? Contract.FMTSubscribe : Contract.subscribe;

  const contract = getContract(contractName, Address);
  return new Promise((resolve) => {
    contract?.methods
      ?.getUserBoardPower(getNowUserAddress())
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          resolve(computeWeiToSymbol(result, 4));
        }
      });
  });
}
/**
 * 本期已经购买的T
 */
export async function nowTBalanceByRound(round) {
  const Address = chain.contractAddress?.[`Subscribe${round}Address`];

  const contractName = round > 4 ? Contract.FMTSubscribe : Contract.subscribe;
  const contract = getContract(contractName, Address);

  return new Promise((resolve) => {
    contract?.methods
      ?._userBuyedAmount(getNowUserAddress())
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          // console.log('本期已经购买的T', computeWeiToSymbol(result, 4))
          resolve(computeWeiToSymbol(result, 4));
        }
      });
  });
}
/**
 * 本期剩余可购买的T
 */
export async function nowCanBuyByRound(round) {
  const TokenAddress = chain.contractAddress.currencyMap?.[`T${round}`];
  const data = await formMinerTokenToString(TokenAddress);

  const contractAddress =
    round > 4
      ? chain.contractAddress?.newShop
      : chain.contractAddress?.ShopAddress;

  const contract = getContract(Contract.Shop, contractAddress);
  return new Promise((resolve) => {
    contract?.methods
      ?.getUserBuyLimits(getNowUserAddress(), data)
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          // console.log('本期剩余可购买的T', computeWeiToSymbol(result, 4))
          resolve(computeWeiToSymbol(result, 4));
        }
      });
  });
}

// _userBuyedAmount  ----subscrile本期已经购买的T
// getUserBuyLimits  ----Shop  本期剩余可购买的 参数二是MINNERTOKEN地址

// assignToken abi  ===> mmrPageInfo 获取首页 总质押 我的质押 总发放收益
// netDB abi  ===> bindParent 激活绑定
// netDB abi  ===> getParent 获取绑定的人

// baseERC20 abi ===> balanceOf 获取代币余额
// baseERC20 abi ===> Approve 授权

// pledge abi ===> deposit 从官方代币 到 我们的代币 不收费
// pledge abi ===> withDraw 从 我们的代币到 官方代币 不收费
// pledge abi ===> getOutfee  获取Swap手续费

// assignToken abi ===> depositByPeriod 按时间质押算力
// assignToken abi ===> withDrawById  取回质押
// assignToken abi ===> reward 收获算力奖励
// assignToken abi ===> amountFilBeClaimed 获取算力收益的值
// assignToken abi ===> amountReceived 获取已经领取的fil 和mmr

// 矿山剩余 MMRERC20 abi ====> balanceOf

// window.getMMRPageInfo = getMMRPageInfo;
// window.getParent = getParent;
// window.bindParentAsync = bindParentAsync;
window.getBalanceAsync = getBalanceAsync;

// borad abi ====> Reward 领取按钮 董事会
// borad abi ====> amountBeClaimed 待领取收益  董事会
// borad abi ====> _rewardHadReceive 累计已领取收益  董事会
// borad abi ====> pledge 质押  董事会
// borad abi ====> withDraw 取回  董事会
// borad abi ====> _userPowers 用户已经质押的代币 董事会
// borad abi ====> _userPowers/_totalPower 剩余价值份额 董事会
// borad abi ====> consultExtracted 剩余可赎回的MMR
// borad abi ====> _pledgeMmrAmount 已质押的MMR数量

// router1 abi ====> addLiquidity 添加流动性 流动池
// router1 abi ====> removeLiquidity 移除流动性 流动池
// router1 abi ====> swapExactTokensForTokens  默认的USDT 兑换 MMR 流动池(swap)
// router1 abi ====> swapTokensForExactTokens  默认的 MMR 兑换 USDT  流动池(swap)
// router1 abi ====> getAmountIn USDT 算 MMR  比例 流动池
// router1 abi ====> getAmountOut MMR 算 USDT 比例 流动池
// router1 abi ====> getAmountsIn   默认的上面算下面 流动池
// router1 abi ====> getAmountsOut   默认的下面算上面 流动池

//
// lp ===> amountBeClaimed 待领取收益
// lp ===> _rewardHadReceive 累计已领取收益

// Shop ===> tokenAddr 算力挖矿_购买_WFIL余额 参数暂时为MMR地址
// minerToken ===> price 算力挖矿_购买_价格
// Shop ===> TokenList_Length 算力挖矿_期数 1就是1期
// Shop ===> getTokenAddrByIndex  参数传期数1进去,获取到token地址，通过token拿到时间(minerToken===>_SubscribeEndtime)
// minerToken ===> totalSupply 算力挖矿_本期发售总量
// subscribe ===> subScribequal 算力挖矿_认购报名
// Shop ===> buyMinerToken 算力挖矿_购买按钮 参数name:(minerToken中的name)
// Shop ===> getUserBuyLimits 认购最大额度  地址MINER1
// subscrible ===> _userSubscribedAmount 大于0表示已经购买过了 小于0表示认购已结束
// minerToken ===> _BuyEndtime 获取购买结束时间
// subscrible ===> _totalSubscribeAmount 已认购的董事会算力

export async function getAmountsInAsync(amount, from, to) {
  const contract = getContract(
    Contract.WmiswapV1Router01,
    chain.contractAddress?.Router1Address
  );
  const wei = computeSymbolToWei(amount);

  return new Promise((resolve) => {
    contract?.methods
      ?.getAmountsIn(web3_Provider.utils.toHex(web3_Provider.utils.toBN(wei)), [
        to,
        from,
      ])
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          resolve(computeWeiToSymbol(result, 4));
        }
      });
  });
}

export async function getAmountsOutAsync(amount, from, to) {
  const contract = getContract(
    Contract.WmiswapV1Router01,
    chain.contractAddress?.Router1Address
  );
  const wei = computeSymbolToWei(amount);
  return new Promise((resolve) => {
    contract?.methods
      ?.getAmountsOut(
        web3_Provider.utils.toHex(web3_Provider.utils.toBN(wei)),
        [from, to]
      )
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          resolve(result[1]);
        }
      });
  });
}

export async function queryComputeAmounts(amount, fromSymbol, toSymbol) {
  const FromTokenAddress = chain.contractAddress.currencyMap?.[fromSymbol];
  const ToTokenAddress = chain.contractAddress.currencyMap?.[toSymbol];
  // 我需要amount数量的toSymbol 需要多少个fromSymbol
  // return getAmountsInAsync(amount, ToTokenAddress, FromTokenAddress);
  return getAmountsOutAsync(amount, FromTokenAddress, ToTokenAddress);
}

export async function swapUSDTAndMMR({ from, to, amount, minOut = 0 }) {
  const contract = getContract(
    Contract.WmiswapV1Router01,
    chain.contractAddress?.Router1Address
  );

  // console.log("minOut =====>>>>>>", minOut);

  const AMOUNT = computeSymbolToWei(amount);
  const MIN = computeSymbolToWei(minOut);

  const PATHS = [
    chain.contractAddress.currencyMap?.[from],
    chain.contractAddress.currencyMap?.[to],
  ];

  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.Router1Address,
      value: "0x0",
      data: contract?.methods
        ?.swapExactTokensForTokens?.(
          web3_Provider.utils.toHex(web3_Provider.utils.toBN(AMOUNT)),
          web3_Provider.utils.toHex(web3_Provider.utils.toBN(MIN)),
          PATHS,
          getNowUserAddress(),
          Math.floor(+new Date() / 1000) + 10 * 60
        )
        .encodeABI(),
    },
  ];

  return sendAsync(params);
}
/**
 * 添加流动性
 */
export async function addLiquidityAsync(
  symbolA,
  symbolB,
  AAmount,
  BAmount,
  amountAMin = 0,
  amountBMin = 0
) {
  const contract = getContract(
    Contract.WmiswapV1Router01,
    chain.contractAddress?.Router1Address
  );
  const tokenAAddress = chain.contractAddress.currencyMap?.[symbolA];
  const tokenBAddress = chain.contractAddress.currencyMap?.[symbolB];
  // const AMOUNT = computeSymbolToWei(AAmount);
  // const BAMOUNT = computeSymbolToWei(BAmount);
  const to = getNowUserAddress();
  const deadline = Math.floor(+Date.now() / 1000) + 10 * 60;

  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.Router1Address,
      value: "0x0",
      data: contract?.methods
        ?.addLiquidity(
          tokenAAddress,
          tokenBAddress,
          web3_Provider.utils.toHex(web3_Provider.utils.toBN(AAmount)),
          web3_Provider.utils.toHex(web3_Provider.utils.toBN(BAmount)),
          amountAMin,
          amountBMin,
          to,
          deadline
        )
        .encodeABI(),
    },
  ];

  return sendAsync(params);
}
/**
 * 移除流动性
 */
export async function removeLiquidityAsync(
  symbolA,
  symbolB,
  liquidityAmount,
  amountAMin = 0,
  amountBMin = 0
) {
  const contract = getContract(
    Contract.WmiswapV1Router01,
    chain.contractAddress?.Router1Address
  );

  const tokenAAddress = chain.contractAddress.currencyMap?.[symbolA];
  const tokenBAddress = chain.contractAddress.currencyMap?.[symbolB];
  const to = getNowUserAddress();
  const deadline = Math.floor(+Date.now() / 1000) + 10 * 60;
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.Router1Address,
      value: "0x0",
      data: contract?.methods
        ?.removeLiquidity(
          tokenAAddress,
          tokenBAddress,
          web3_Provider.utils.toHex(web3_Provider.utils.toBN(liquidityAmount)),
          amountAMin,
          amountBMin,
          to,
          deadline
        )
        .encodeABI(),
    },
  ];

  return sendAsync(params);
}

// routerread ===> getAllInfo 获取交易对 【全局流动性, 当前用户的流动性, MMR, USDT】
// routerread ===> getLiquidityValueByToken  获取预期获得的流动性
// routerread ===> getLiquidityValue  获取预期移除流动性获得的 代币

export async function getAllInfoAsync(symbolA, symbolB) {
  const contract = getContract(
    Contract.WmiswapV1RouterRead,
    chain.contractAddress?.RouterReadAddress
  );

  const A_ADDRESS = chain.contractAddress.currencyMap?.[symbolA];
  const B_ADDRESS = chain.contractAddress.currencyMap?.[symbolB];

  return new Promise((resolve) => {
    contract?.methods
      ?.getAllInfo(A_ADDRESS, B_ADDRESS, getNowUserAddress())
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          resolve(result);
        }
      });
  });
}

export async function getLiquidityValueAsync(
  symbolA,
  symbolB,
  liquidityAmount
) {
  const contract = getContract(
    Contract.WmiswapV1RouterRead,
    chain.contractAddress?.RouterReadAddress
  );

  const A_ADDRESS = chain.contractAddress.currencyMap?.[symbolA];
  const B_ADDRESS = chain.contractAddress.currencyMap?.[symbolB];

  const bn = web3_Provider.utils.toHex(
    web3_Provider.utils.toBN(liquidityAmount)
  );

  return new Promise((resolve) => {
    contract?.methods
      ?.getLiquidityValue(A_ADDRESS, B_ADDRESS, bn)
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          resolve(result);
        }
      });
  });
}

export async function getLiquidityValueByTokenAsync(
  symbolA,
  symbolB,
  amountA,
  amountB
) {
  const contract = getContract(
    Contract.WmiswapV1RouterRead,
    chain.contractAddress?.RouterReadAddress
  );

  const A_ADDRESS = chain.contractAddress.currencyMap?.[symbolA];
  const B_ADDRESS = chain.contractAddress.currencyMap?.[symbolB];
  const A_AMOUNT = computeSymbolToWei(amountA);
  const B_AMOUNT = computeSymbolToWei(amountB);

  return new Promise((resolve) => {
    contract?.methods
      ?.getLiquidityValueByToken(A_ADDRESS, B_ADDRESS, A_AMOUNT, B_AMOUNT, 0, 0)
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          resolve(result);
        }
      });
  });
}

export async function _addLiquidity_internalAsync(symbolA, symbolB, amountA) {
  const contract = getContract(
    Contract.WmiswapV1RouterRead,
    chain.contractAddress?.RouterReadAddress
  );

  const A_ADDRESS = chain.contractAddress.currencyMap?.[symbolA];
  const B_ADDRESS = chain.contractAddress.currencyMap?.[symbolB];
  const A_AMOUNT = computeSymbolToWei(amountA);
  const B_AMOUNT = computeSymbolToWei("1000000000000000");

  return new Promise((resolve) => {
    contract?.methods
      ?._addLiquidity_internal(A_ADDRESS, B_ADDRESS, A_AMOUNT, B_AMOUNT, 0, 0)
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          resolve(result);
        }
      });
  });
}

// 待领取收益————流动性挖矿区
export async function getUnclaimedIncomeInMobilityMining() {
  const contract = getContract(
    Contract.LpMintPool,
    chain.contractAddress?.lppoolAddress
  );
  return new Promise((resolve) => {
    contract?.methods
      ?.amountBeClaimed(getNowUserAddress())
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          console.log("待领取收益————流动性挖矿区result----------->", result);
          resolve(computeWeiToSymbol(result[0], 4));
        }
      });
  });
}

// 已领取收益——————流动性挖矿区
export async function getTotalIncomeInMobilityMining() {
  const contract = getContract(
    Contract.LpMintPool,
    chain.contractAddress?.lppoolAddress
  );
  return new Promise((resolve) => {
    contract?.methods
      ?._rewardHadReceive(getNowUserAddress())
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          console.log("已领取收益——————流动性挖矿区----------------->", result);
          resolve(computeWeiToSymbol(result, 4));
        }
      });
  });
}

export async function getRewardInMobilityMining() {
  const contract = getContract(
    Contract.LpMintPool,
    chain.contractAddress?.lppoolAddress
  );
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.lppoolAddress,
      value: "0x0",
      data: contract?.methods?.Reward(getNowUserAddress()).encodeABI(),
    },
  ];
  return sendAsync(params);
}
// window.getLPTokenAddress = getLPTokenAddress;
export async function getLPTokenAddress(type = "U") {
  const info = {
    U: [Contract.LpMintPool, chain.contractAddress?.lppoolAddress],
    T: [Contract.TLpMintPool, chain.contractAddress?.TlppoolAddress],
  };
  const contract = getContract(...info[type]);

  return new Promise((resolve) => {
    contract?.methods?.LpTokenAddr().call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        resolve(result);
      }
    });
  });
}

// export async function getTTokenAddress() {
//   const round = await getNper();
//   return getMinerTokenrAddr(round - 1);
//   // const contract = getContract(
//   //   Contract.Shop,
//   //   chain.contractAddress?.ShopAddress
//   // );
//   // return new Promise((resolve) => {
//   //   contract?.methods.tokenAddr("MINER1").call((err, result) => {
//   //     if (err) {
//   //       resolve(false);
//   //     }
//   //     if (result) {
//   //       resolve(result);
//   //     }
//   //   });
//   // });
// }

export async function getUserLpPower(type = "U") {
  const info = {
    U: [Contract.LpMintPool, chain.contractAddress?.lppoolAddress],
    T: [Contract.LpMintPool, chain.contractAddress?.TlppoolAddress],
  };
  const contract = getContract(...info[type]);
  return new Promise((resolve) => {
    contract?.methods
      ?._userLpPowers(getNowUserAddress())
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          resolve(computeWeiToSymbol(result, 4));
        }
      });
  });
}

export async function getTotalLpPower(type = "U") {
  const info = {
    U: [Contract.LpMintPool, chain.contractAddress?.lppoolAddress],
    T: [Contract.LpMintPool, chain.contractAddress?.TlppoolAddress],
  };
  const contract = getContract(...info[type]);
  return new Promise((resolve) => {
    contract?.methods?._totalLpPower().call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        // resolve(computeWeiToSymbol(result, 4));
        resolve(result);
      }
    });
  });
}

export async function pledgeInMobilityMining(lpAmount, type = "U") {
  const info = {
    U: [Contract.LpMintPool, chain.contractAddress?.lppoolAddress],
    T: [Contract.LpMintPool, chain.contractAddress?.TlppoolAddress],
  };
  const contract = getContract(...info[type]);
  let wei = computeSymbolToWei(lpAmount);
  let params = [
    {
      from: getNowUserAddress(),
      to: info[type][1],
      value: "0x0",
      data: contract?.methods
        ?.pledge(
          getNowUserAddress(),
          web3_Provider.utils.toHex(web3_Provider.utils.toBN(wei))
        )
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}

export async function redeemInMobilityMining(lpAmount, type = "U") {
  const info = {
    U: [Contract.LpMintPool, chain.contractAddress?.lppoolAddress],
    T: [Contract.LpMintPool, chain.contractAddress?.TlppoolAddress],
  };
  const contract = getContract(...info[type]);
  let wei = computeSymbolToWei(lpAmount);
  let params = [
    {
      from: getNowUserAddress(),
      to: info[type][1],
      value: "0x0",
      data: contract?.methods
        ?.withDraw(
          getNowUserAddress(),
          web3_Provider.utils.toHex(web3_Provider.utils.toBN(wei))
        )
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}

window.getAllInfoAsync = getAllInfoAsync;

/**
 *  _userTPowerAmount ===> 我质押的T
 * _userWfilPowerAmount ===> 我质押的WFIL
 *  _TADDR ===> T的地址
 *
 *  getNeedWFILByTAmount ===>质押所需的T
 *
 * deposit ===>质押
 *
 * withDraw ===> 赎回
 */

// 算力挖矿获取的待领取收益
export async function queryAmountFilBeClaimedInComputational(round) {
  const contractName = round > 4 ? Contract.FMTMintPool : Contract.TLpMintPool;
  const contract = getContract(
    contractName,
    chain.contractAddress?.[`Tlp${round}poolAddress`]
  );

  return new Promise((resolve) => {
    contract?.methods
      ?.amountBeClaimed(getNowUserAddress())
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          resolve(result[0]);
        }
      });
  });
}

window.queryAmountFilBeClaimedInComputational =
  queryAmountFilBeClaimedInComputational;
// 算力挖矿获取的已领取收益
export async function queryAmountReceivedInComputational(round) {
  const contractName = round > 4 ? Contract.FMTMintPool : Contract.TLpMintPool;
  const contract = getContract(
    contractName,
    chain.contractAddress?.[`Tlp${round}poolAddress`]
  );
  return new Promise((resolve) => {
    contract?.methods
      ?._rewardHadReceive(getNowUserAddress())
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          resolve(result);
        }
      });
  });
}
window.queryAmountReceivedInComputational = queryAmountReceivedInComputational;
// 算力挖矿领取收益
export async function receiveRewardInComputational(round) {
  const contractName = round > 4 ? Contract.FMTMintPool : Contract.TLpMintPool;
  const contract = getContract(
    contractName,
    chain.contractAddress?.[`Tlp${round}poolAddress`]
  );
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.[`Tlp${round}poolAddress`],
      value: "0x0",
      data: contract?.methods?.reward(getNowUserAddress()).encodeABI(),
    },
  ];
  return sendAsync(params);
}

// window.queryUserTPowerAmountInComputational =
//   queryUserTPowerAmountInComputational;
// 获取我质押的T
export async function queryUserTPowerAmountInComputational(round) {
  if (round > 4) return queryUserTPowerAmountInComputational_NEW(round);
  const contract = getContract(
    Contract.TLpMintPool,
    chain.contractAddress?.[`Tlp${round}poolAddress`]
  );

  return new Promise((resolve) => {
    contract?.methods
      ?._userTPowerAmount(getNowUserAddress())
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          resolve(result);
        }
      });
  });
}

async function queryUserTPowerAmountInComputational_NEW(round) {
  const contract = getContract(
    Contract.FMTMintPool,
    chain.contractAddress?.[`Tlp${round}poolAddress`]
  );

  return new Promise((resolve) => {
    contract?.methods?._userPowers(getNowUserAddress()).call((err, result) => {
      console.log("err ===>", err);
      console.log("result ===>", result);
      if (err) {
        resolve(false);
      }
      if (result) {
        resolve(result / 2);
      }
    });
  });
}

// 获取我质押的WFIL
export async function queryUserWFILPowerAmountInComputational(round) {
  // todo 未对接完成
  if (round > 4) return queryUserLpInComputational(round);
  const contract = getContract(
    Contract.TLpMintPool,
    chain.contractAddress?.[`Tlp${round}poolAddress`]
  );

  return new Promise((resolve) => {
    contract?.methods
      ?._userWfilPowerAmount(getNowUserAddress())
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          resolve(result);
        }
      });
  });
}

export async function queryUserLpInComputational(round) {
  const contract = getContract(
    Contract.FMTMintPool,
    chain.contractAddress?.[`Tlp${round}poolAddress`]
  );
  return new Promise((resolve) => {
    contract?.methods?._userLp(getNowUserAddress()).call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        resolve(result);
      }
    });
  });
}

// 获取 算力挖矿中T的地址 未使用
export async function queryTAddressInComputational(round) {
  const contract = getContract(
    Contract.TLpMintPool,
    chain.contractAddress?.[`Tlp${round}poolAddress`]
  );

  return new Promise((resolve) => {
    contract?.methods?._TADDR().call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        resolve(result);
      }
    });
  });
}

// 获取 质押所需WFIL
export async function queryNeedWFILByTInComputational(amount, round) {
  if (round > 4) return queryNeedWFILByTInComputational_NEW(amount, round);
  const contract = getContract(
    Contract.TLpMintPool,
    chain.contractAddress?.[`Tlp${round}poolAddress`]
  );

  let wei = computeSymbolToWei(amount);
  return new Promise((resolve) => {
    contract?.methods
      ?.getNeedWFILByTAmount(
        web3_Provider.utils.toHex(web3_Provider.utils.toBN(wei))
      )
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          console.log("queryNeedWFILByTInComputational ====> ", result);
          resolve(result);
        }
      });
  });
}

window.queryNeedWFILByTInComputational_NEW =
  queryNeedWFILByTInComputational_NEW;
export async function queryNeedWFILByTInComputational_NEW(amount, round) {
  const contract = getContract(
    Contract.FMTMintPool,
    chain.contractAddress?.[`Tlp${round}poolAddress`]
  );

  let wei = computeSymbolToWei(amount / 2); // 除以2时合约要求的 原因不详
  return new Promise((resolve) => {
    contract?.methods
      ?.needWfilAmount(web3_Provider.utils.toHex(web3_Provider.utils.toBN(wei)))
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          console.log("queryNeedWFILByTInComputational ====> ", result);
          resolve(result);
        }
      });
  });
}

// 算力挖矿质押算力
export async function depositInComputational(amount, WFILAmoutWei, round) {
  if (round > 4) return depositInComputational_NEW(amount, round);
  // todo  未对接
  const contract = getContract(
    Contract.TLpMintPool,
    chain.contractAddress?.[`Tlp${round}poolAddress`]
  );
  let wei = computeSymbolToWei(amount);
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.[`Tlp${round}poolAddress`],
      value: "0x0",
      data: contract?.methods
        ?.deposit(
          getNowUserAddress(),
          web3_Provider.utils.toHex(web3_Provider.utils.toBN(wei)),
          web3_Provider.utils.toHex(web3_Provider.utils.toBN(WFILAmoutWei))
        )
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}

async function depositInComputational_NEW(amount, round) {
  const contract = getContract(
    Contract.FMTMintPool,
    chain.contractAddress?.[`Tlp${round}poolAddress`]
  );
  let wei = computeSymbolToWei(amount);
  console.log("amount, round", wei, amount, round);
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.[`Tlp${round}poolAddress`],
      value: "0x0",
      data: contract?.methods
        ?.pledge(
          getNowUserAddress(),
          web3_Provider.utils.toHex(web3_Provider.utils.toBN(wei))
        )
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}

// 算力挖矿赎回算力
export async function withDrawInComputational(amount, round) {
  const contractName = round > 4 ? Contract.FMTMintPool : Contract.TLpMintPool;

  const contract = getContract(
    contractName,
    chain.contractAddress?.[`Tlp${round}poolAddress`]
  );
  let number = amount;
  if (round <= 4) {
    let wei = computeSymbolToWei(amount);
    number = web3_Provider.utils.toHex(web3_Provider.utils.toBN(wei));
  }
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.[`Tlp${round}poolAddress`],
      value: "0x0",
      data: contract?.methods
        ?.withDraw(getNowUserAddress(), number)
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}

export async function getTotalSalesByRound(round) {
  const TokenAddress = chain.contractAddress.currencyMap?.[`T${round}`];

  const contract = getContract(Contract.minerToken, TokenAddress);
  return new Promise((resolve) => {
    contract?.methods?.totalSupply().call((err, result) => {
      if (err) {
        // console.log("错误");
        resolve(false);
      }
      if (result) {
        if (round > 4) {
          resolve(computeWeiToSymbol(result, 4) - 5);
        } else {
          resolve(computeWeiToSymbol(result, 4));
        }
      }
    });
  });
}

export async function getTPriceByRound(round, toSymbol = true) {
  const TokenAddress = chain.contractAddress.currencyMap?.[`T${round}`];

  const contract = getContract(Contract.minerToken, TokenAddress);
  return new Promise((resolve) => {
    contract?.methods?.price().call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        if (toSymbol) {
          resolve(computeWeiToSymbol(result, 4));
        } else {
          resolve(result);
        }
      }
    });
  });
}

export async function getMarketPrice(round) {
  const TokenAddress = chain.contractAddress.currencyMap?.[`T${round}`];
  const WFILAddress = chain.contractAddress.currencyMap?.["WFIL"];

  const contract = getContract(
    Contract.WmiswapV1RouterRead,
    chain.contractAddress?.RouterReadAddress
  );

  return new Promise((resolve) => {
    contract?.methods
      ?.getPriceAndTotalSupply(TokenAddress, WFILAddress)
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          resolve(result);
        }
      });
  });
}

window.getMarketPrice = getMarketPrice;
window.getUSDTTOWFILPrice = getUSDTTOWFILPrice;

export async function getUSDTTOWFILPrice() {
  const TokenAddress = chain.contractAddress.currencyMap?.USDT;
  const WFILAddress = chain.contractAddress.currencyMap?.AFIL;

  const contract = getContract(
    Contract.WmiswapV1RouterRead,
    chain.contractAddress?.RouterReadAddress
  );

  return new Promise((resolve) => {
    contract?.methods
      ?.getPriceAndTotalSupply(TokenAddress, WFILAddress)
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          resolve(result);
        }
      });
  });
}

// 查询池子中T的余额
export async function getTBalanceInShop(round) {
  const TokenAddress = chain.contractAddress.currencyMap?.[`T${round}`];
  const contract = getContract(Contract.BaseERC20, TokenAddress);

  const contractAddress =
    round > 4
      ? chain.contractAddress?.newShop
      : chain.contractAddress?.ShopAddress;
  return new Promise((resolve) => {
    contract?.methods?.balanceOf(contractAddress).call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        resolve(computeWeiToSymbol(result, 4));
      }
    });
  });
}

window.getTotalLpInComputation = getTotalLpInComputation;
export async function getTotalLpInComputation(round) {
  const TokenAddress = chain.contractAddress?.[`T${round}lpAddress`];
  const contract = getContract(Contract.BaseERC20, TokenAddress);

  return new Promise((resolve) => {
    contract?.methods?.totalSupply().call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        resolve(computeWeiToSymbol(result, 4));
      }
    });
  });
}

window.getTBalanceInShop = getTBalanceInShop;
window.getNewestLotteryPeriod = getNewestLotteryPeriod;
// 获取正在进行中的彩票期数
// viewCurrentLotteryId
export async function getNewestLotteryPeriod() {
  const contract = getContract(
    Contract.Lottery,
    chain.contractAddress?.LotteryAddress
  );

  return new Promise((resolve) => {
    contract?.methods?.viewCurrentLotteryId().call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        resolve(parseInt(result));
      }
    });
  });
}

window.getViewLotteryDetail = getViewLotteryDetail;
// 获取某一期彩票详情
export async function getViewLotteryDetail(id) {
  const contract = getContract(
    Contract.Lottery,
    chain.contractAddress?.LotteryAddress
  );

  return new Promise((resolve) => {
    contract?.methods?.viewLottery(id).call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        console.log("result =====>", result);
        resolve(result);
      }
    });
  });
}
window.calculateTotalPriceForBulkTickets = calculateTotalPriceForBulkTickets;
// 查询折扣后的价格
export async function calculateTotalPriceForBulkTickets(
  _discountDivisor,
  _priceTicket,
  _numberTickets
) {
  const contract = getContract(
    Contract.Lottery,
    chain.contractAddress?.LotteryAddress
  );

  return new Promise((resolve) => {
    contract?.methods
      ?.calculateTotalPriceForBulkTickets(
        _discountDivisor,
        _priceTicket,
        _numberTickets
      )
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          console.log("result =====>", result);
          resolve(result);
        }
      });
  });
}

window.viewUserInfoForLotteryId = viewUserInfoForLotteryId;
export async function viewUserInfoForLotteryId(id) {
  const contract = getContract(
    Contract.Lottery,
    chain.contractAddress?.LotteryAddress
  );

  return new Promise((resolve) => {
    contract?.methods
      ?.viewUserInfoForLotteryId_1(getNowUserAddress(), id)
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          window.tickets = result[1];
          console.log("result =====>", result);
          resolve(result);
        }
      });
  });
}

window.buyTickets = buyTickets;
export async function buyTickets(period, tickets) {
  console.log("period, tickets ======>", period, tickets);
  const contract = getContract(
    Contract.Lottery,
    chain.contractAddress?.LotteryAddress
  );
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.LotteryAddress,
      value: "0x0",
      data: contract?.methods?.buyTickets(period, tickets).encodeABI(),
    },
  ];
  return sendAsync(params);
}

window.claimTickets = claimTickets;
export async function claimTickets(period, ticketIDArray, bracketArray) {
  const contract = getContract(
    Contract.Lottery,
    chain.contractAddress?.LotteryAddress
  );
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.LotteryAddress,
      value: "0x0",
      data: contract?.methods
        ?.claimTickets(period, ticketIDArray, bracketArray)
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}

// MMRS_GR
// window.freeBuyInMMRS_GR = freeBuyInMMRS_GR;
// 参与
export async function freeBuyInMMRS_GR(amount) {
  const contract = getContract(
    Contract.Mediation,
    chain.contractAddress?.mediation
  );

  const wei = computeSymbolToWei(amount);
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.mediation,
      value: "0x0",
      data: contract?.methods
        ?.freeBuy(web3_Provider.utils.toHex(web3_Provider.utils.toBN(wei)))
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}

window.oldFreeBuy = oldFreeBuy;
export async function oldFreeBuy(amount = 200) {
  const contract = getContract(
    Contract.freedomList,
    chain.contractAddress?.MMRS_GR
  );

  const wei = computeSymbolToWei(amount);
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.MMRS_GR,
      value: "0x0",
      data: contract?.methods
        ?.freeBuy(web3_Provider.utils.toHex(web3_Provider.utils.toBN(wei)))
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}
// getLimit

window.getLimitInMMRS_GR = getLimitInMMRS_GR;
export async function getLimitInMMRS_GR() {
  const contract = getContract(
    Contract.Mediation,
    chain.contractAddress?.mediation
  );
  console.log("getLimitInMMRS_GR");
  return new Promise((resolve) => {
    contract?.methods?.getLimit().call((err, result) => {
      console.log("err, result", err, result);
      if (err) {
        resolve(false);
      }
      if (result) {
        resolve(computeWeiToSymbol(result, 0));
      }
    });
  });
}

export async function getUserAmountInMMRS_GR() {
  const contract = getContract(
    Contract.Mediation,
    chain.contractAddress?.mediation
  );

  return new Promise((resolve) => {
    contract?.methods?._userAmount(getNowUserAddress()).call((err, result) => {
      if (err) {
        resolve(false);
      }

      console.log("_userAmount===>", err, result);
      // if (result) {
      resolve(result);
      // }
    });
  });
}

export async function rewardInMMRS_GR({
  userAddress,
  usdtHex,
  mmrsHex,
  idx,
  sign,
}) {
  const contract = getContract(
    Contract.VerifyMmrsAndUsdt,
    chain.contractAddress?.mmrsReplace
  );

  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.mmrsReplace,
      value: "0x0",
      data: contract?.methods
        ?.reward(userAddress, "0x" + usdtHex, "0x" + mmrsHex, idx, sign)
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}

/**
 *
 * MMRS董事会_待领取收益
 */
export async function MMRSIncome() {
  const contract = getContract(
    Contract.newBorad,
    chain.contractAddress?.newBorad
  );
  return new Promise((resolve) => {
    contract?.methods
      ?.amountBeClaimed(getNowUserAddress())
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          // console.log("MMRS董事会_待领取收益----------->", result);
          resolve(computeWeiToSymbol(result[0], 4));
        }
      });
  });
}
/**
 *
 * MMRS董事会_累计已领取
 */
export async function MMRSTotalIncome() {
  const contract = getContract(
    Contract.newBorad,
    chain.contractAddress?.newBorad
  );
  return new Promise((resolve) => {
    contract?.methods
      ?._rewardHadReceive(getNowUserAddress())
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          // console.log("MMRS董事会_累计已领取----------->", result);
          resolve(computeWeiToSymbol(result, 4));
        }
      });
  });
}

/**
 *
 *  MMRS董事会_领取MMR按钮
 */
export async function MMRSDAOReward() {
  const contract = getContract(
    Contract.newBorad,
    chain.contractAddress?.newBorad
  );
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.newBorad,
      value: "0x0",
      data: contract?.methods?.Reward(getNowUserAddress()).encodeABI(),
    },
  ];
  return sendAsync(params);
}
// 参与
export async function oldfreeBuyInMMRS_GR(amount) {
  const contract = getContract(
    Contract.MMRS_GR,
    chain.contractAddress?.MMRS_GR
  );

  const wei = computeSymbolToWei(amount);
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.MMRS_GR,
      value: "0x0",
      data: contract?.methods
        ?.freeBuy(web3_Provider.utils.toHex(web3_Provider.utils.toBN(wei)))
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}
// 参与度
export async function olduserAmountInMMRS_GR() {
  const contract = getContract(
    Contract.MMRS_GR,
    chain.contractAddress?.MMRS_GR
  );

  return new Promise((resolve) => {
    contract?.methods?._userAmount(getNowUserAddress()).call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        resolve(result);
      }
    });
  });
}

export async function getUserPowerMMRSBoard() {
  // getUserPower
  const contract = getContract(
    Contract.newBorad,
    chain.contractAddress?.newBorad
  );
  return new Promise((resolve) => {
    contract?.methods?.getUserPower(getNowUserAddress()).call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        resolve(computeWeiToSymbol(result, 4));
      }
    });
  });
}
// MMRS_GR
// MMRS+USDT参与
export async function mixBuyInMMRS_GR(amount) {
  const contract = getContract(
    Contract.mmrs_pledge,
    chain.contractAddress?.mmrs_pledge
  );

  const wei = computeSymbolToWei(amount);
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.mmrs_pledge,
      value: "0x0",
      data: contract?.methods
        ?.pledge(web3_Provider.utils.toHex(web3_Provider.utils.toBN(wei)))
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}
// MMRS_GR
// USDT需要的MMRS
export async function getMMRSInMMRS_GR(amount) {
  // getUserPower
  const contract = getContract(
    Contract.mmrs_pledge,
    chain.contractAddress?.mmrs_pledge
  );
  const wei = computeSymbolToWei(amount);
  return new Promise((resolve) => {
    contract?.methods
      ?.quote(web3_Provider.utils.toHex(web3_Provider.utils.toBN(wei)))
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          console.log("转换后的MMRS----->", result);
          resolve(computeWeiToSymbol(result, 4));
        }
      });
  });
}

// 领取FM
export async function rewardFMInForceMining(
  userAddress,
  usdtHex,
  mmrsHex,
  idx,
  sign
) {
  const contract = getContract(
    Contract.VerifyMmrsAndUsdt,
    chain.contractAddress?.fm
  );

  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.fm,
      value: "0x0",
      data: contract?.methods
        ?.reward(userAddress, "0x" + usdtHex, "0x" + mmrsHex, idx, sign)
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}

export async function queryRushPurchaseEndTime(round) {
  const TokenAddress = chain.contractAddress.currencyMap?.[`T${round}`];
  const contract = getContract(Contract.minerToken, TokenAddress);
  return new Promise((resolve) => {
    contract?.methods?._RushPurchaseEndTime().call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        resolve(result);
      }
    });
  });
}

//  总质押
export async function pledgeTotalPower(round) {
  // deplagetotalPower_NEW
  if (round > 4) return pledgeTotalPower_NEW(round);
  const contract = getContract(
    Contract.TLpMintPool,
    chain.contractAddress?.[`Tlp${round}poolAddress`]
  );
  return new Promise((resolve) => {
    contract?.methods?._totalTPower().call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        resolve(computeWeiToSymbol(result, 4));
      }
    });
  });
}

export async function pledgeTotalPower_NEW(round) {
  console.log("round ===>", round);
  const contract = getContract(
    Contract.FMTMintPool,
    chain.contractAddress?.[`Tlp${round}poolAddress`]
  );
  return new Promise((resolve) => {
    contract?.methods?._totalPower().call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        resolve(computeWeiToSymbol(result, 4));
      }
    });
  });
  //
}

/**
 * 提案
 */
// 投票
export async function DAO_commitVote(round, num, isPositive) {
  console.log(round, num, isPositive);
  const contract = getContract(
    Contract.DaoCommit,
    chain.contractAddress?.DaoCommit
  );
  let wei = computeSymbolToWei(num);
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.DaoCommit,
      value: "0x0",
      data: contract?.methods
        ?.CommitVote(
          round,
          num,
          // web3_Provider.utils.toHex(web3_Provider.utils.toBN(wei)),
          isPositive
        )
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}
// 领取MMR
export async function DAO_reward(round) {
  const contract = getContract(
    Contract.DaoCommit,
    chain.contractAddress?.DaoCommit
  );
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.DaoCommit,
      value: "0x0",
      data: contract?.methods?.reward(round).encodeABI(),
    },
  ];
  return sendAsync(params);
}
// 领取MMRS
export async function DAO_withDraw(round) {
  const contract = getContract(
    Contract.DaoCommit,
    chain.contractAddress?.DaoCommit
  );
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.DaoCommit,
      value: "0x0",
      data: contract?.methods?.withDraw(round).encodeABI(),
    },
  ];
  return sendAsync(params);
}
// 待领取MMR
export async function DAO_beClaimed(round) {
  const contract = getContract(
    Contract.DaoCommit,
    chain.contractAddress?.DaoCommit
  );
  return new Promise((resolve) => {
    contract?.methods
      ?.beClaimed(getNowUserAddress(), round)
      .call((err, result) => {
        if (err) {
          resolve("");
        }
        if (result) {
          // console.log("待领取MMR", result);
          resolve(computeWeiToSymbol(result, 4));
        }
      });
  });
  //
}
// 待领取MMRS ==>getAllCanWithDraw
export async function DAO_getAllCanWithDraw(round) {
  console.log("getAllCanWithDraw+++", round);
  const contract = getContract(
    Contract.DaoCommit,
    chain.contractAddress?.DaoCommit
  );
  return new Promise((resolve) => {
    contract?.methods
      ?.getAllCanWithDraw(getNowUserAddress(), round)
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          // resolve(computeWeiToSymbol(result, 4));
          // console.log("待领取锁仓111111111111111", result);
          resolve(result);
        }
      });
  });
  //
}
//锁仓信息
// export async function DAO_Info(round) {
//   const contract = getContract(
//     Contract.DaoCommit,
//     chain.contractAddress?.DaoCommit
//   );
//   return new Promise((resolve) => {
//     // contract?.methods?.getUserVoteInfo(round).call((err, result) => {
//     contract?.methods
//       ?.userWithDrawInfo(getNowUserAddress(), round, 0)
//       .call((err, result) => {
//         if (err) {
//           resolve(false);
//         }
//         if (result) {
//           console.log("锁仓信息", result);
//           resolve(result);
//         }
//       });
//   });
//   //
// }
//是否投票
export async function DAO_userVoteInfo(round) {
  const contract = getContract(
    Contract.DaoCommit,
    chain.contractAddress?.DaoCommit
  );
  return new Promise((resolve) => {
    contract?.methods
      ?.isRewardForPeriod(getNowUserAddress(), round)
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          // console.log("是否投票", result);
          resolve(result);
        }
      });
  });
  //
}
//投票数量
export async function DAO_voteResultInfo(round) {
  const contract = getContract(
    Contract.DaoCommit,
    chain.contractAddress?.DaoCommit
  );
  return new Promise((resolve) => {
    contract?.methods?.voteResultInfo(round).call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        // console.log("投票数量", result);
        resolve(result);
      }
    });
  });
  //
}
//截止时间
export async function DAO_periodDeadline(round) {
  const contract = getContract(
    Contract.DaoCommit,
    chain.contractAddress?.DaoCommit
  );
  return new Promise((resolve) => {
    contract?.methods?.periodDeadline(round).call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        // console.log("截止时间", result);
        resolve(result);
      }
    });
  });
  //
}
//解锁时间
export async function periodLockEndTime(round) {
  const contract = getContract(
    Contract.DaoCommit,
    chain.contractAddress?.DaoCommit
  );
  return new Promise((resolve) => {
    contract?.methods?.periodLockEndTime(round).call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        // console.log("解锁", result);
        resolve(result);
      }
    });
  });
  //
}
//CommitVote 投票
//reward 领取MMR
//withDraw 领取MMRS
//beClaimed  待领取MMR
// getAllCanWithDraw 待领取MMRS
// getUserVoteInfo 锁仓信息
// userVoteInfo 是否投票
//voteResultInfo 投票数量
//periodDeadline 截止时间
//periodLockEndTime 解锁时间
