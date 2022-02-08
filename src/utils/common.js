import { BigNumber } from "ethers";
import { constructMediaData, sha256FromBuffer } from "@zoralabs/zdk";
// import {
//   // ReserveAuctionV3Address,
//   // MarketAddress,
//   // currencyAddressToSymbol,
// } from "@common/const";
/**
 * @param {*} num
 * @param {*} digit
 * @returns
 */
export const digitWei = (num, digit) => {
  num = num || 0;
  digit = digit || 0;
  let strNum = num.toString();
  let length = strNum.length;
  if (length <= digit) {
    strNum = "0." + digitNum(digit - length) + "" + strNum;
  } else {
    strNum =
      strNum.substr(0, strNum.length - digit) +
      "." +
      strNum.substr(strNum.length - digit);
  }
  return strNum;
};

const digitNum = (digit) => {
  let a = "";
  for (let i = 0; i < digit; i++) {
    a += "0";
  }
  return a;
};

/**
 * Converts File to an ArrayBuffer for hashing preperation
 * @param {File} file uploaded file
 * @returns {ArrayBuffer} from file
 */
export const getFileBuffer = async (file) => {
  return new Promise((res, rej) => {
    // create file reader
    let reader = new FileReader();
    // register event listeners
    reader.addEventListener("loadend", (e) => res(e.target.result));
    reader.addEventListener("error", rej);
    // read file
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Generates Metadata
 * @param {*} version
 * @param {*} payload
 * @returns
 */
export const generateMetadata = (version, payload) => {
  return JSON.stringify(payload);
};

/**
 * 构造BidShare方法
 * @param {*} creator
 * @param {*} owner
 * @param {*} prevOwner
 * @param {*} platform
 * @returns
 */
export const constructBidShares = (
  creator = 0,
  owner = 0,
  prevOwner = 0,
  platform = 0
) => {
  const decimalCreator = DecimalNew(parseFloat(creator.toFixed(4)));
  const decimalOwner = DecimalNew(parseFloat(owner.toFixed(4)));
  const decimalPrevOwner = DecimalNew(parseFloat(prevOwner.toFixed(4)));
  const decimalPlatform = DecimalNew(parseFloat(platform.toFixed(4)));
  return {
    creator: decimalCreator,
    owner: decimalOwner,
    prevOwner: decimalPrevOwner,
    platform: decimalPlatform,
  };
};

const countDecimals = (value) => {
  if (value.includes && value.includes("."))
    return value.split(".")[1].length || 0;
  return 0;
};
const DecimalNew = (value, precision = 18) => {
  const decimalPlaces = countDecimals(value.toString());
  const difference = precision - decimalPlaces;
  const zeros = BigNumber.from(10).pow(difference);
  value = value.toString();
  const abs = BigNumber.from(`${value.replace(".", "")}`);
  return { value: abs.mul(zeros) };
};

// const countDecimals = (value) => {
//   if (value.includes && value.includes("."))
//     return value.split(".")[1].length || 0;
//   return 0;
// };
const DecimalToBig = (value, precision = 18) => {
  const decimalPlaces = countDecimals(value.toString());
  const difference = precision - decimalPlaces;
  const zeros = BigNumber.from(10).pow(difference);
  value = value.toString();
  const abs = BigNumber.from(`${value.replace(".", "")}`);
  return abs.mul(zeros);
};

/**
 * @param {*} f
 * @returns
 */
export const promisify = (f) => {
  return function () {
    let args = Array.prototype.slice.call(arguments);
    return new Promise(function (resolve, reject) {
      args.push(function (err, result) {
        if (err) reject(err);
        else resolve(result);
      });
      f.apply(null, args);
    });
  };
};

export const quiteAddress = (address, { left = 6, right = 4 } = {}) => {
  if (!address) return "";
  return address.slice(0, left) + "..." + address.slice(-right);
};

// 获取metaData中的参数
export const getUrlQueryObject = (
  url = "https://storageapi.fleek.co/bear-beep-team-bucket/cd52369b-0ccf-4d91-b8e3-8039db85c18c?type=image/png&name=up&desc=up"
) => {
  if (!url) return {};
  const firstQuestionMarkIndex = url.indexOf("?");
  const queryString = url.slice(firstQuestionMarkIndex + 1);
  const array = queryString.split("&");
  const map = {};
  array.forEach((item) => {
    const [key, value] = item.split("=");
    map[key] = value;
  });
  return map;
};

/**
 * Mints media to Contract
 * @param {*} file media to mint
 * @param {*} name of media
 * @param {*} description of media
 * @param {*} fee to share with previous owner
 */
export const getMediaData = async (file, name, description, mediaType) => {
  const metadataJSON = generateMetadata("nft-20210101", {
    description: description ? description : "",
    mimeType: file.type,
    name: name,
    version: "nft-20210101",
  });
  const buffer = await getFileBuffer(file);
  const contentHash = sha256FromBuffer(Buffer.from(buffer));
  const metadataHash = sha256FromBuffer(Buffer.from(metadataJSON));
  let formData = new FormData();
  formData.append("upload", file);
  formData.append("name", name);
  formData.append("metadata", metadataJSON);

  const upload = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  }).then((res) => res.json());
  // console.log("upload", upload);
  // 存储数据在fleek云服务器上
  const { fileUrl = "https://", metadataUrl = "https://" } = upload;

  // console.log("fileUrl, metadataUrl =====>", fileUrl, metadataUrl);
  const mediaData = constructMediaData(
    fileUrl,
    `${metadataUrl}?type=${file.type}&name=${name}&desc=${
      description ? description : ""
    }&mediaType=${mediaType}`,
    contentHash,
    metadataHash
  );
  return mediaData;
};

export const getBidShareData = async (platform, fee) => {
  const bidShares = constructBidShares(
    parseFloat(fee),
    100 - parseFloat(fee) - platform,
    0,
    platform
  );
  return bidShares;
};

export const computeSymbolToWei = (symbolAmount, symbol = "ETH") => {
  let wei = "0";
  if (window.Web3) {
    wei = window.Web3.utils.toWei(symbolAmount.toString());
  } else {
    wei = DecimalToBig(symbolAmount);
  }
  return wei;
};

export const computeWeiToSymbol = (
  weiAmount,
  fixed = 6,
  precision = 18,
  symbol = "ETH"
) => {
  if (weiAmount === "0" || weiAmount === false || weiAmount === undefined)
    return "0";
  if (fixed < 0) throw new Error("fixed can not less than 0");
  let symbolAmount = "0";
  if (window.Web3) {
    symbolAmount = window.Web3.utils.fromWei(weiAmount.toString());
  } else {
    symbolAmount = digitWei(weiAmount, precision);
  }
  const index = symbolAmount.indexOf(".");
  if (index !== -1) {
    const isHasDot = fixed !== 0;
    return symbolAmount
      .substring(0, index + fixed + isHasDot)
      .padEnd(index + fixed + isHasDot, "0");
  }

  return symbolAmount;
};

export const formateAddress = (address) => {
  if (address.length < 40) return address;
  let tempAddress = "";
  if (address.length >= 40) tempAddress = "0x" + address.slice(-40);
  return tempAddress;
};

export const checkFloatNumber = (floatNumber, ext = 4) => {
  let regStr = `^\\d+(\\.?\\d{0,${ext}})$`;
  let reg = new RegExp(regStr);
  return reg.test(floatNumber);
};

export function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return decodeURIComponent(r[2]);
  }
  return "";
}

//截取小区点后面几位
export const interception = (data, number = 4) => {
  return (parseInt(data * 10 ** number) / 10 ** number).toFixed(number);
};

// 可重复6位数
export const randomTicketArray = (ticketAmount) => {
  return new Array(ticketAmount).fill(0).map(() => {
    return (
      "1" +
      Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0")
    );
  });
};

// 不可重复6位数
// export const randomTicketArray = (ticketAmount) => {
//   let initArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
//   let template = 0;
//   return new Array(ticketAmount).fill(0).map(() => {
//     let i = 10;
//     for (; i; ) {
//       let j = parseInt(Math.random() * i);
//       template = initArray[--i];
//       initArray[i] = initArray[j];
//       initArray[j] = template;
//     }

//     return initArray.join("").substr(0, 6);
//   });
// };

export const checkLotteryTicketWin = (luckTicket, tickets) => {
  /// '1223456'
  /// ['012345', '123456', '234567']
  let filterTickets = [];
  tickets.forEach((item, index) => {
    for (let i = 0; i < 6; i++) {
      if (luckTicket[i] !== item.ticket[i]) {
        filterTickets.push({
          ...item,
          winNumber: i - 1,
        });
        break;
      }
      if (i === 6) {
        filterTickets.push({
          ...item,
          winNumber: 6,
        });
      }
    }
  });
  let sortedFilterTickets = filterTickets.sort(
    (a, b) => b.winNumber - a.winNumber
  );
  let winTickets = [];
  let loseTickets = [];

  sortedFilterTickets.forEach((item) => {
    if (item.winNumber > 0) {
      winTickets.push(item);
    } else {
      loseTickets.push(item);
    }
  });

  return {
    winTickets,
    loseTickets,
  };
};

window.checkLotteryTicketWin = checkLotteryTicketWin;
