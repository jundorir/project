import React, { Fragment, useCallback } from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import DetailWindow from "./DetailWindow";
import { Toast } from "antd-mobile";

function Gain(props) {
  const { lang, chain, daoProposal, data } = props;
  const {
    MMR_beClaimed = 0, //待领取MMR
    MMRS_beClaimed = 0, //待领取MMRS
    MMRS_unlock = 0, //剩余锁仓MMRS
    MMRS_Info = {}, //锁仓信息
    isVote = false, //是否投票
    lockTime = 0, //解锁时间
  } = daoProposal.round.get(data.daoId) || {};
  const { selectedLang } = lang;
  const [language, setLanguage] = React.useState({});
  // const [detalDisplay, setDetalDisplay] = React.useState(true);

  React.useEffect(() => {
    let interval = setInterval(() => {
      if (chain.address) {
        chain.getCurrentBlock();
        daoProposal.DAO_beClaimed(data.daoId);
        daoProposal.DAO_getAllCanWithDraw(data.daoId);
      }
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  React.useEffect(() => {
    if (selectedLang.key === "English") {
      setLanguage({
        income: "Income to be claimed",
        willLock: "To be unlocked",
        receive: "receive",
        total: "Accumulated received:",
        fail: "Get the failure",
        none: "No profit",
        blockNumber: "Current Block Number",
        leftReceive: "Remaining lock MMRS：",
        details: "Details",
        noGet: "No income",
        Unlock: "Unlock",
        noMMRS: "No unlocked MMRS",
        success1: "success",
        success2: "success",
      });
    } else if (selectedLang.key === "TraditionalChinese") {
      setLanguage({
        income: "待領取收益",
        willLock: "可解鎖",
        receive: "領取",
        total: "累計已領取：",
        fail: "領取失敗",
        none: "暫無收益",
        blockNumber: "當前區塊號",
        leftReceive: "剩余鎖倉MMRS：",
        details: "詳情",
        noGet: "暫無收益",
        Unlock: "解鎖",
        noMMRS: "暫無解鎖的MMRS",
        success1: "領取成功",
        success2: "解鎖成功",
      });
    } else if (selectedLang.key === "SimplifiedChinese") {
      setLanguage({
        income: "待领取收益",
        willLock: "可解锁",
        receive: "领取",
        total: "累计已领取：",
        fail: "领取失败",
        none: "暂无收益",
        blockNumber: "当前区块号",
        leftReceive: "剩余锁仓MMRS：",
        details: "详情",
        noGet: "暂无收益",
        Unlock: "解锁",
        noMMRS: "暂无解锁的MMRS",
        success1: "领取成功",
        success2: "解锁成功",
      });
    }
  }, [selectedLang.key]);
  async function getMMR() {
    if (MMR_beClaimed <= 0) {
      Toast.info(language.noGet);
      return;
    }
    const result = await daoProposal.DAO_reward(data.daoId);
    if (result) {
      Toast.success(language.success1);
    }
  }
  async function getMMRS() {
    if (MMRS_beClaimed - 0 <= 0) {
      daoProposal.DAO_reward(data.daoId);
      Toast.info(language.noMMRS);
      return;
    }
    const result = await daoProposal.DAO_withDraw(data.daoId);
    if (result) {
      daoProposal.DAO_withDraw(data.daoId);
      Toast.success(language.success2);
    }
  }
  function renderTime() {
    var date = new Date(lockTime * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + "-";
    var M =
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) + "-";
    var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
    var h =
      (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
    var m =
      (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
      ":";
    var s =
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
  }
  return (
    <Fragment>
      <div className={css.contain}>
        <div className={css.getMMR}>
          <div>
            <div className={css.income}>{language.income}</div>
            <div>
              <span className={css.number}>{MMR_beClaimed}</span>&nbsp;&nbsp;
              <span>MMR</span>
            </div>
          </div>
          <div className={css.receive} onClick={getMMR}>
            {language.receive}
          </div>
        </div>
        <div className={css.line}></div>
        <div className={css.getMMRS}>
          <div>
            <div className={css.income}>
              {language.willLock}&nbsp; ({renderTime()})
            </div>
            <div>
              <span className={css.number}>{MMRS_beClaimed}</span>&nbsp;&nbsp;
              <span>MMRS</span>
            </div>
          </div>
          <div className={css.receive} onClick={getMMRS}>
            {language.Unlock}
          </div>
        </div>
        <div
          className={css.getDetails}
          // onClick={() => {
          //   setDetalDisplay(true);
          // }}
        >
          <div className={css.left}>
            {language.leftReceive}
            <span className={css.leftNum}>{MMRS_unlock} MMRS</span>
          </div>
          {/* <div>
            <span className={css.leftNum}>{language.details}&nbsp;</span>
            <span className={css.rightRow}>&gt;</span>
          </div> */}
        </div>
      </div>
      {/* {renderModal()} */}
    </Fragment>
  );
}

export default inject("lang", "chain", "daoProposal", "server")(observer(Gain));
