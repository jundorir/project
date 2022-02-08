const { BigNumber } = require("bignumber.js");
// minus 减
// multipliedBy times  乘
const digitWei = (num, digit) => {
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

const computeWeiToSymbol = (
  weiAmount,
  fixed = 6,
  precision = 18,
  symbol = "ETH"
) => {
  if (weiAmount === "0") return "0";
  // console.log("weiAmount", weiAmount);
  const symbolAmount = digitWei(weiAmount, precision);
  // console.log("symbolAmount ======>", symbolAmount);
  const index = symbolAmount.indexOf(".");

  return symbolAmount.substring(0, index + fixed + 1);
};
function test(buyAmount, discountDivisor, priceTicketInCake) {
  const big_buyAmount = new BigNumber(buyAmount);
  const big_discountDivisor = new BigNumber(discountDivisor);
  const big_priceTicketInCake = new BigNumber(priceTicketInCake);
  let discountPercent = 0;
  if (buyAmount === 0 || buyAmount === 1 || discountDivisor === "1000000") {
    discountPercent = 0;
  } else {
    discountPercent = big_buyAmount
      .minus(1)
      .multipliedBy(100)
      .div(big_discountDivisor);
    // 等价于 discountPercent = ((buyAmount - 1) * 100) / discountDivisor;
  }
  console.log(discountPercent, discountPercent.toString());

  const discountPrice = big_buyAmount
    .multipliedBy(big_priceTicketInCake)
    .multipliedBy(discountPercent)
    .div(100);
  // 等价于 discountPrice = buyAmount * priceTicketInCake * discountPercent / 100;

  const shouldCost = big_buyAmount.multipliedBy(big_priceTicketInCake);
  // 等价于 const shouldCost = buyAmount * priceTicketInCake;
  const actualCost = shouldCost.minus(discountPrice);
  // 等价于 const actualCost = shouldCost - discountPrice;

  console.log(
    `discountPercent, discountPrice, shouldCost, actualCost ====> ${discountPercent}, ${computeWeiToSymbol(
      discountPrice
    )}, ${computeWeiToSymbol(shouldCost)}, ${computeWeiToSymbol(actualCost)}`
  );
}

// for (let i = 0; i < 101; i++) {
//   test(i, 1000, 10 ** 17);
// }
console.log(new BigNumber(10 ** 23).multipliedBy(10 ** 16).div(10 ** 18).toString())