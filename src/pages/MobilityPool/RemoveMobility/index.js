import css from "./index.module.less";
import React from "react";
import classNames from "classnames";
import { computeWeiToSymbol } from "@utils/common";
import { inject, observer } from "mobx-react";
import LPBox from "../components/LPBox";
import { Toast } from "antd-mobile";
const languageContext = {
  English: {
    balance: "balance",
    removeLiquidity: "Remove Liquidity",
    gain: {
      U: "gain MMR and USDT",
      MMRS_TO_USDT: "gain MMRS and USDT",
    },
    priceTips: "amount of money",
    will: "will gain",
    price: "price",
    approve: "approve",
    remove: "remove",
    approveSuccess: "approve success",
    approveFail: "approve fail",
    removeSuccess: "remove liquidity success",
    removeFail: "remove liquidity fail",
  },
  TraditionalChinese: {
    balance: "余額",
    removeLiquidity: "移除流動性",
    gain: {
      U: "獲得MMR和USDT",
      MMRS_TO_USDT: "獲得MMRS和USDT",
    },
    priceTips: "金額",
    will: "您將獲得",
    price: "價格",
    approve: "授權",
    remove: "移除",
    approveSuccess: "授權成功",
    approveFail: "授權失敗",
    removeSuccess: "移除流動性成功",
    removeFail: "移除流動性失敗",
  },
  SimplifiedChinese: {
    balance: "余额",
    removeLiquidity: "移除流动性",
    gain: {
      U: "获得MMR和USDT",
      MMRS_TO_USDT: "获得MMRS和USDT",
    },
    priceTips: "金额",
    will: "您将获得",
    price: "价格",
    approve: "授权",
    remove: "移除",
    removeSuccess: "移除流动性成功",
    removeFail: "移除流动性失败",
    approveSuccess: "授权成功",
    approveFail: "授权失败",
  },
};

const maxLength = (520 / 75) * window.rem;
/* global BigInt */
let approveInfo = {
  U: {
    type: "Router1",
    symbol: "LP",
  },
  T: {
    type: "TLpPool",
    symbol: "TLP",
  },
  MMRS_TO_USDT: {
    type: "Router1",
    symbol: "MMRS_USDT_LP",
  },
};
function RemoveMobility(props) {
  const {
    mobility,
    chain,
    lang: { selectedLang },
  } = props;
  const { AFILSelected, WFILSelected, type } = mobility;
  const language = languageContext[selectedLang.key];
  // const [percent, setPercent] = React.useState(0);
  const [{ btnLeft, coverWidth, percent }, setBar] = React.useState({
    btnLeft: null,
    coverWidth: null,
    percent: 0,
  });

  const [LP_APPROVE_AMOUNT, setApprove] = React.useState(0);
  const [{ AFILAmount, WFILAmount }, setValue] = React.useState({
    AFILAmount: 0,
    WFILAmount: 0,
  });
  const isApprove =
    LP_APPROVE_AMOUNT -
      (percent * mobility.current.myMobilityInPool) / 10 ** 20 >
    0;
  React.useEffect(() => {
    computeLiquidityRemoveValue();
  }, [percent]);

  React.useEffect(() => {
    if (chain.address) {
      queryAllowanceAll();
    }
  }, [chain.address]);

  async function computeLiquidityRemoveValue() {
    const lp =
      (BigInt(parseInt((percent * 1000).toFixed(2))) *
        BigInt(mobility.current.myMobilityInPool)) /
      100000n;

    const { tokenAAmount: AFILAmount, tokenBAmount: WFILAmount } =
      await mobility.queryLiquidityValueAsync(
        AFILSelected,
        WFILSelected,
        lp.toString()
      );
    setValue({
      AFILAmount,
      WFILAmount,
    });
  }

  async function queryAllowanceAll() {
    const LPAllowance = await chain.queryAllowanceAsync(approveInfo[type]);
    setApprove(LPAllowance);
  }

  async function removeLiquidity() {
    const lp =
      (BigInt(parseInt((percent * 1000).toFixed(2))) *
        BigInt(mobility.current.myMobilityInPool)) /
      100000n;
    let result = false;

    try {
      result = await mobility.removeLiquidity(lp.toString());
      if (result) {
        Toast.success(language.removeSuccess);
      } else {
        Toast.fail(language.removeFail);
      }
    } catch {
      Toast.fail(language.removeFail);
    }

    if (result) {
      queryAllowanceAll();
      setBar({
        btnLeft: -16 / window.rem,
        coverWidth: 0 / window.rem,
        percent: 0,
      });
    }
  }

  async function toApprove() {
    try {
      let { status, approveAmount } = await chain.toApprove(approveInfo[type]);
      setApprove(approveAmount);
      if (status) {
        Toast.success(language.approveSuccess);
      } else {
        Toast.fail(language.approveFail);
      }
    } catch (e) {
      Toast.fail(language.approveFail);
    }
  }

  return (
    <div className={css.content}>
      <div className={css.box}>
        <div className={css.title}>
          <div
            className={css.back}
            onClick={() => {
              mobility.backDisplayMobility();
            }}
          ></div>
          <div className={css.text}>{language.removeLiquidity}</div>
          {/* <div className={css.q} /> */}
        </div>
        <div className={css.tips}>{language.gain[type]}</div>
        <div className={css.amountBox}>
          <div className={css.header}>{language.priceTips}</div>
          <div className={css.percent}>{`${percent}%`}</div>
          <div className={css.bar}>
            <div
              className={classNames(
                css.bgBar,
                btnLeft === null &&
                  coverWidth === null &&
                  css[`percent${percent}`]
              )}
            >
              <div
                className={classNames(css.bgBar)}
                onClick={(e) => {
                  let width = e.pageX - (115 / 75) * window.rem;
                  width = width < 0 ? 0 : width;
                  width = width > maxLength ? maxLength : width;
                  let left = width - (16 / 75) * window.rem;
                  const p = ((width / maxLength) * 100).toFixed(2);
                  if (p - 0 === 100) {
                    setBar({
                      btnLeft: null,
                      coverWidth: null,
                      percent: 100,
                    });
                    return;
                  }
                  setBar({
                    btnLeft: left,
                    coverWidth: width,
                    percent: p,
                  });
                }}
              >
                <div
                  className={css.coverBar}
                  style={coverWidth !== null ? { width: coverWidth } : null}
                ></div>
                <div
                  className={css.barBtn}
                  style={btnLeft !== null ? { left: btnLeft } : null}
                  // onTouchMove={(e) => {
                  //   let width = e.touches[0].pageX - (115 / 75) * window.rem;
                  //   width = width < 0 ? 0 : width;
                  //   width = width > maxLength ? maxLength : width;
                  //   let left = width - (16 / 75) * window.rem;
                  //   setBar({
                  //     btnLeft: left,
                  //     coverWidth: width,
                  //     percent: ((width / maxLength) * 100).toFixed(2),
                  //   });
                  // }}
                />
              </div>
            </div>
          </div>
          <div className={css.percentButtons}>
            {[10, 25, 50, 75, 100].map((item) => {
              let showView = item === 100 ? "MAX" : `${item}%`;
              return (
                <div
                  key={item}
                  className={classNames(
                    css.percentBtn,
                    (percent === item || percent === `${item}.00`) &&
                      css.selected
                  )}
                  onClick={() => {
                    setBar({
                      btnLeft: null,
                      coverWidth: null,
                      percent: item,
                    });
                  }}
                >
                  {showView}
                </div>
              );
            })}
          </div>
        </div>
        <div className={css.incomeBox}>
          <div className={css.top}>{language.will}</div>
          <div className={css.middle}>
            <div className={css.line}>
              <div className={css.left}>
                <div className={css[`icon_${AFILSelected}`]} />
                <div className={css.symbol}>{AFILSelected}</div>
              </div>
              <div className={css.right}>
                {computeWeiToSymbol(AFILAmount, 4)}
              </div>
            </div>
            <div className={css.line}>
              <div className={css.left}>
                <div className={css[`icon_${WFILSelected}`]} />
                <div className={css.symbol}>{WFILSelected}</div>
              </div>
              <div className={css.right}>
                {computeWeiToSymbol(WFILAmount, 4)}
              </div>
            </div>
          </div>
          <div className={css.bottom}>
            <div className={css.line}>
              <div className={css.left}>{language.price}:</div>
              <div className={css.right}>
                1{AFILSelected} ≈ {mobility.current.BTOA}
                {WFILSelected}
              </div>
            </div>
            {/* <div className={classNames(css.line, css.last)}>
              <div></div>
              <div className={css.right}>1MMR= {mobility.ATOB}USDT </div>
            </div> */}
          </div>
        </div>

        <div className={css.buttons}>
          <div
            className={classNames(
              css.enableBtn,
              (percent - 0 === 0 ||
                mobility.current.myMobilityInPool - 0 === 0 ||
                isApprove) &&
                css.disabled
            )}
            onClick={() => {
              if (
                percent - 0 === 0 ||
                mobility.current.myMobilityInPool - 0 === 0 ||
                isApprove
              )
                return;
              toApprove();
            }}
          >
            {language.approve}
          </div>
          <div
            className={classNames(
              css.removeBtn,
              (percent - 0 === 0 ||
                mobility.current.myMobilityInPool - 0 === 0 ||
                !isApprove) &&
                css.disabled
            )}
            onClick={() => {
              if (
                percent - 0 === 0 ||
                mobility.current.myMobilityInPool - 0 === 0 ||
                !isApprove
              )
                return;
              removeLiquidity();
            }}
          >
            {language.remove}
          </div>
        </div>
      </div>
      <LPBox />
    </div>
  );
}

export default inject("mobility", "chain", "lang")(observer(RemoveMobility));
