import React from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import classNames from "classnames";
import IncomeStatementWindow from "@components/IncomeStatementWindow"; //弹窗
import InfomationWindow from "@components/InfomationWindow"; //弹窗
import DAOGain from "./DAOGain";
import { Toast } from "antd-mobile";
import ShowModal from "@components/ShowModal";

const languageContext = {
  English: {
    totalReceivedMMR: "Received MMR",
    yesterday: "MMR settlement price yesterday",
    displacementFilPower: "displacement FIL power",
    displacementTotal: "displacement power total",
    surplusPower: "surplus power",
    desplacement: "GR Displacement",
    tips: "MMRS-GR Displacement",
    explain:
      "power automatically replaces FIL power and enjoys FIL mining revenue",

    title: "GR Plan-MMRS",
    beclainmedIncome: "Income to beclainmed",
    dynamicReward: "Dynamic Reward",
    dynamicRewardDetail: "Dynamic Reward Detail",
    receive: "receive",
    accumulatedReceived: "Received ",
    MyRemaining: "My Remaining",
    MMRSPower: "MMRS Power",
    accumulatedAcquired: "Acquired ",
    MMRSBoardPower: "MMRS Board Power",
    Participate: "Participate",
    totalMMRSComputingPower: "Total MMRS Power",
    MMRSPrice: "MMRS Price",
    todayNewCapital: "New capital today",
    toBind: "Please bind user relationship first",
    currentBlock: "Current Block number",
    queryError: "query data error",
    maintenancing: "receiving function maintenance",
    receiveSuccess: "receive success",
    receiveFail: "receive fail",
    noIcome: "No profit",
    effective: "The calculation force is in effect",
    total: "Personal effort",
    beforeMMRS: "Original MMRS Power",
    infomation:
      "Tip: After receiving the operation, wait for the confirmation of 10 blocks on the chain, and the data will be updated correctly",
  },
  TraditionalChinese: {
    title: "GR計劃-MMRS",
    beclainmedIncome: "待領取收益",
    dynamicReward: "動態獎勵",
    dynamicRewardDetail: "動態收益明細",
    receive: "領取",
    accumulatedReceived: "累計已領取",
    MyRemaining: "我的剩余",
    MMRSPower: "MMRS算力",
    accumulatedAcquired: "累計已獲得",
    MMRSBoardPower: "MMRS董事會算力",
    Participate: "立即參與",
    totalMMRSComputingPower: "全網MMRS算力",
    MMRSPrice: "MMRS價格",
    todayNewCapital: "今日新入資金",
    toBind: "請先綁定用戶關系",
    currentBlock: "當前區塊號",
    queryError: "獲取數據失敗",
    maintenancing: "領取功能維護中",
    receiveSuccess: "領取成功",
    receiveFail: "領取失敗",
    noIcome: "暫無收益",
    effective: "已生效算力",
    total: "個人總算力",
    infomation: "提示：領取操作以後，等待鏈上約10個區塊確認，數據將會正確更新",

    totalReceivedMMR: "累計已領取MMR",
    yesterday: "昨日MMR結算價格",
    displacementFilPower: "置換FIL算力",
    displacementTotal: "置換算力總值",
    surplusPower: "當前剩余算力",
    desplacement: "GR置換",
    tips: "MMRS-GR置換",
    explain: "算力自動置換FIL算力，享受fil挖礦收益",
    beforeMMRS: "原MMRS算力",
  },
  SimplifiedChinese: {
    title: "GR计划-MMRS",
    beclainmedIncome: "待领取收益",
    dynamicReward: "动态奖励",
    dynamicRewardDetail: "动态收益明细",
    receive: "领取",
    accumulatedReceived: "累计已领取",
    MyRemaining: "我的剩余",
    MMRSPower: "MMRS算力",
    accumulatedAcquired: "累计已获得",
    MMRSBoardPower: "MMRS董事会算力",
    Participate: "立即参与",
    totalMMRSComputingPower: "全网MMRS算力",
    MMRSPrice: "MMRS价格",
    todayNewCapital: "今日新入资金",
    toBind: "请先绑定用户关系",
    currentBlock: "当前区块号",
    queryError: "获取数据失败",
    maintenancing: "领取功能维护中",
    receiveSuccess: "领取成功",
    receiveFail: "领取失败",
    noIncome: "暂无收益",
    effective: "已生效算力",
    total: "个人总算力",
    infomation: "提示：领取操作以后，等待链上约10个区块确认，数据将会正确更新",

    totalReceivedMMR: "累计已领取MMR",
    yesterday: "昨日MMR结算价格",
    displacementFilPower: "置换FIL算力",
    displacementTotal: "置换算力总值",
    surplusPower: "当前剩余算力",
    desplacement: "GR置换",
    tips: "MMRS-GR置换",
    explain: "算力自动置换FIL算力，享受fil挖矿收益",
    beforeMMRS: "原MMRS算力",
  },
};
function MMRSPlan(props) {
  const {
    lang: { selectedLang },
    mmrsGR,
    chain,
    server,
  } = props;
  const language = languageContext[selectedLang.key];
  const [showModal, setShowModal] = React.useState(false);
  const [showWindow, setShowWindow] = React.useState(false);
  const [showInfomation, setShowInfomation] = React.useState(false);
  const [infomation, setInfomation] = React.useState("");

  React.useEffect(() => {
    if (chain.address && chain.isActive) {
      mmrsGR.isBlackList();
      mmrsGR.queryMMRSPlanReplaceData();
      mmrsGR.queryUserPowerMMRSBoard();
      server.queryBlockNumber();
    }
  }, [chain.address]);

  async function getAwardInfo() {
    try {
      const result = await mmrsGR.queryAward();
      console.log("result ===>", result);
      if (result.status) {
        return result;
      } else {
        if (result.msg === "领取功能维护中") {
          Toast.info(language.maintenancing);
          return null;
        }
      }
    } catch {}
    Toast.info(language.queryError);
    return null;
  }

  async function handleReceive() {
    if (chain.address && !mmrsGR.blackMember) {
      if (mmrsGR.mmrsreplace_wait - 0 === 0) {
        Toast.info(language.noIncome);
        return;
      }
      const awardInfo = await getAwardInfo();
      if (!awardInfo) return;
      if (awardInfo.isRepeat - 0 === 1) {
        setShowInfomation(true);
        setInfomation(awardInfo);
      } else if (awardInfo.isRepeat - 0 === 0) {
        try {
          const chainResult = await mmrsGR.receiveAward(awardInfo);
          console.log("chainResult ===>", chainResult);
          if (chainResult) {
            mmrsGR.queryMMRSPlanReplaceData();
            mmrsGR.queryUserPowerMMRSBoard();
            Toast.info(language.receiveSuccess);
            return;
          }
        } catch {}
        Toast.info(language.receiveFail);
        return;
      }
    }
  }

  async function toGet() {
    console.log(infomation);
    if (infomation) {
      try {
        const chainResult = await mmrsGR.receiveAward(infomation);
        if (chainResult) {
          mmrsGR.queryUserPowerMMRSBoard();
          Toast.info(language.receiveSuccess);
          return;
        }
      } catch {}
      Toast.info(language.receiveFail);
      return;
    }
  }
  function renderModal() {
    // if (showModal === "showJoin")
    //   return (
    //     <PlanJoinModal
    //       closeModal={() => {
    //         setShowModal(false);
    //       }}
    //     />
    //   );

    if (showModal === "showTips") {
      return (
        <div>
          <IncomeStatementWindow
            closeIncomeStatementWindow={() => {
              setShowModal(false);
            }}
          />
        </div>
      );
    }
    if (showWindow === true) {
      return (
        <div>
          <ShowModal
            closeShowWindow={() => {
              setShowWindow(false);
            }}
          />
        </div>
      );
    }
    if (showInfomation === true) {
      return (
        <div>
          <InfomationWindow
            data={infomation.repeatTis}
            closeShowInfomation={() => {
              setShowInfomation(false);
            }}
            toGet={() => {
              setShowInfomation(false);
              toGet();
            }}
          />
        </div>
      );
    }
    return null;
  }

  return (
    <div className={css.plan}>
      <div className={css.banner}>
        <div className={css.box}>
          <div className={css.logo}>{language.tips}</div>
          <div className={css.explain}>{language.explain}</div>
        </div>
      </div>
      <div className={css.content}>
        <div className={css.blockNumber}>
          <div className={css.word}>
            {language.currentBlock}：{server.BlockNumber}
          </div>
        </div>
        <div className={css.info}>
          <div className={css.tips}>
            {language.desplacement}
            <span
              className={css.questionMark}
              onClick={() => {
                setShowModal("showTips");
              }}
            ></span>
          </div>
          <div className={css.list}>
            <div className={classNames(css.item, css.first)}>
              <div className={css.left}>{language.beforeMMRS}:</div>
              <div className={css.right}>{mmrsGR.mmrs}</div>
            </div>
            <div className={css.item}>
              <div className={css.left}>{language.surplusPower}:</div>
              <div className={css.right}>{mmrsGR.mmrsreplace_surplus}</div>
            </div>
            <div className={css.item}>
              <div className={css.left}>{language.displacementTotal}:</div>
              <div className={css.right}>{mmrsGR.mmrsreplace_total}</div>
            </div>
          </div>
          <div className={css.incomeBox}>
            <div className={css.head}>{language.beclainmedIncome}</div>
            <div className={css.unclaimedIncome}>
              <div className={css.total}>
                {!mmrsGR.blackMember ? mmrsGR.mmrsreplace_wait : 0}
                <span>MMR</span>
              </div>

              <div className={css.button} onClick={handleReceive}>
                {language.receive}
              </div>
              <div className={css.bottom}>
                {language.yesterday}: ${mmrsGR.mmrsreplace_price}
              </div>
            </div>
            <div className={css.totalClaimedIncome}>
              {language.totalReceivedMMR}: {mmrsGR.mmrsreplace_already}
            </div>
          </div>
        </div>

        {/* 领取董事会算力 */}
        <DAOGain blackMember={mmrsGR.blackMember} />
      </div>
      {renderModal()}
    </div>
  );
}

export default inject("lang", "mmrsGR", "chain", "server")(observer(MMRSPlan));
