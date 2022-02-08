/* eslint-disable no-undef */
import React from "react";
import css from "./index.module.less";
import close from "@assets/images/icon/close.png";
import { inject, observer } from "mobx-react";
import classNames from "classnames";
import { Toast } from "antd-mobile";
import { checkFloatNumber, computeWeiToSymbol } from "@utils/common";

function RedeemModal(props) {
  const { lang, chain, computationalPower, round } = props;
  const { selectedLang } = lang;
  const {
    myTInDeposit = 0,
    myWFILInDeposit = 0,
    unclaimedIncomeFull = 0,
    totalIncomeFull = 0,
  } = computationalPower.round.get(round) || {};
  const [language, setLanguage] = React.useState({});
  const [inputNum, setInputNum] = React.useState("");
  const big = BigInt(unclaimedIncomeFull) + BigInt(totalIncomeFull);
  const allIncome = computeWeiToSymbol(big.toString(), 4);

  React.useEffect(
    (props) => {
      if (selectedLang.key === "English") {
        setLanguage({
          redemption: "Redemption",
          pledged: "Pledged no consumption power",
          pledgedLP: "Pledged LP",
          number: "Redemption Number(T)",
          cancel: "cancel",
          ensure: "ensure",
          fail: "Redemption of failure",
          success: "Redemption of success",
          empty: "Please enter the redemption number",
          MMRRedeemable: "Residual callable MMR",
          USDTRedeemable: "Residual callable USDT",
          MMRForce: "Total force in MMR terms",
          totalRewards: "Total income in current period(WFIL)",
          none: "The MMR is not redeemable at this time",
          note: "Subject to confirmation of on-chain transaction",
          WFILPower: "WFIL power",
          withdraw: "withdraw percentage",
          explain: "Redemption description",
          explain1:
            "1. The non-destructive calculation force part shall be directly returned to the calculation force T",
          explain2:
            "2. The LP part shall be refunded to wfil and calculation force T according to the actual value at the time of redemption",
        });
      } else if (selectedLang.key === "TraditionalChinese") {
        setLanguage({
          redemption: "贖回",
          pledged: "已質押無損算力",
          pledgedLP: "已質押LP",
          number: "贖回数量(T)",
          cancel: "取消",
          ensure: "確定",
          fail: "贖回失敗",
          success: "贖回成功",
          empty: "請輸入贖回數量",
          MMRRedeemable: "可贖回的MMR",
          USDTRedeemable: "可贖回的USDT",
          MMRForce: "以MMR計價的總算力",
          totalRewards: "本期算力挖礦總收益（WFIL)",
          none: "暫無可贖回MMR",
          note: "實際贖回數量以鏈上交易確認時為準",
          WFILPower: "WFIL算力",
          withdraw: "贖回百分比",
          explain: "贖回說明",
          explain1: "1. 無損算力部分直接退還算力T",
          explain2: "2. LP部分按贖回時的實際價值退還WFIL和算力T",
        });
      } else if (selectedLang.key === "SimplifiedChinese") {
        setLanguage({
          redemption: "赎回",
          pledged: "已质押无损算力",
          pledgedLP: "已质押LP",
          number: "赎回数量(T)",
          cancel: "取消",
          ensure: "确定",
          fail: "赎回失败",
          success: "赎回成功",
          empty: "请输入赎回数量",
          MMRRedeemable: "可赎回MMR",
          USDTRedeemable: "可赎回USDT",
          MMRForce: "MMR本金",
          totalRewards: "本期算力挖矿总收益（WFIL)",
          none: "暂无可赎回MMR",
          note: "实际赎回数量以链上交易确认时为准",
          WFILPower: "WFIL算力",
          withdraw: "赎回百分比",
          explain: "赎回说明",
          explain1: "1. 无损算力部分直接退还算力T",
          explain2: "2. LP部分按赎回时的实际价值退还WFIL和算力T",
        });
      }
    },
    [selectedLang.key]
  );
  const closeWindow = React.useCallback(() => {
    props.closeModal();
  }, [props]);
  //获取董事会当前用户可赎回MMR,已质押的MMR
  React.useEffect(() => {
    if (chain.address) {
      computationalPower.queryMyTInDesposit(round);
      computationalPower.queryWFILInDesposit(round);
    }
  }, [chain.address]);
  // 确定取回
  const handleAgree = React.useCallback(
    async (num) => {
      if (chain.address) {
        try {
          const result = await computationalPower.toRedeem(num, round);
          if (result) {
            closeWindow();
            Toast.success(language.success);
          }
        } catch (error) {
          Toast.fail(language.fail);
        }
      }
    },
    [chain.address, language]
  );

  return (
    <div
      className={css.getbackWindow}
      onClick={() => {
        closeWindow();
      }}
    >
      <div
        className={css.getbackBox}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* 关闭按钮 */}
        <div className={css.closeImgBox}>
          <img
            onClick={(e) => {
              e.stopPropagation();
              closeWindow();
            }}
            className={css.closeImg}
            src={close}
            alt=" "
          />
        </div>
        {/* 标题 */}
        <div className={css.title}>{language.redemption}</div>
        {/* 中间部分 */}
        <div className={css.center}>
          {/* 已质押USDT/MMR */}
          <div className={css.list}>
            <div className={css.item}>
              <div className={css.left}>{language.pledged}</div>
              <div className={css.right}>{myTInDeposit} T</div>
            </div>
            <div className={css.item}>
              <div className={css.left}>{language.pledgedLP}</div>
              <div className={css.right}>{myWFILInDeposit} LP</div>
            </div>
            <div className={css.item}>
              <div className={css.left}>{language.WFILPower}</div>
              <div className={css.right}>{myTInDeposit * 2} T</div>
            </div>
          </div>

          {/* 已产生的奖励 */}
          <div className={css.titleLine}>{language.totalRewards} </div>
          <div className={css.income}>{allIncome}</div>

          {/* 赎回数量 */}
          <div className={css.titleLine}>{language.withdraw}</div>
          <div className={css.inputbox}>
            <input
              className={css.input}
              value={inputNum}
              type="number"
              onChange={(e) => {
                if (e.target.value === "") {
                  setInputNum("");
                } else {
                  if (checkFloatNumber(e.target.value)) {
                    let number = e.target.value;
                    if (number > 100) {
                      number = 100;
                    }
                    if (number.length > 1 && number.startsWith("0")) {
                      number = number.replace(/^[0]+/, "");
                      if (number === "") number = "0";
                      if (number.startsWith(".")) number = "0" + number;
                    }
                    setInputNum(number);
                  }
                }
              }}
            />
            <div className={css.percent}>%</div>
            <div
              className={css.max}
              onClick={() => {
                setInputNum(100);
              }}
            >
              MAX
            </div>
          </div>
          <div className={css.button}>
            <div className={css.cancleButton} onClick={closeWindow}>
              {language.cancel}
            </div>
            <div
              className={classNames(
                css.ensureButton,
                (inputNum <= 0 || myTInDeposit <= 0) && css.disabled
              )}
              onClick={() => {
                if (inputNum > 0 && myTInDeposit > 0) {
                  handleAgree(inputNum);
                } else if (myTInDeposit <= 0) {
                  Toast.info(language.none);
                } else {
                  Toast.info(language.empty);
                }
              }}
            >
              {language.ensure}
            </div>
          </div>

          <div className={css.explain}>
            <div className={css.head}>{language.explain}</div>
            <div className={css.tip}>{language.explain1}</div>
            <div className={css.tip}>{language.explain2}</div>
          </div>
        </div>
        {/* 按钮行 */}
      </div>
    </div>
  );
}

export default inject(
  "lang",
  "chain",
  "computationalPower"
)(observer(RedeemModal));
