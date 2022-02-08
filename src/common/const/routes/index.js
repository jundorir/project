import Home from "@pages/Home";
// import Vip from "@pages/Vip";
import Community from "@pages/Community";
import Invitation from "@pages/Invitation";
import Notice from "@pages/Notice";
import Swap from "@pages/Swap";
import Mining from "@pages/Mining";
import MobilityMining from "@pages/MobilityMining";
import MobilityPool from "@pages/MobilityPool";
// import Shop from "@pages/Shop";
import Boardroom from "@pages/Boardroom";
import DAOGovern from "@pages/DAOGovern";
import DAOProposal from "@pages/DAOProposal";
import Pledge from "@pages/Mining/Pledge";
import Details from "@pages/Mining/Details";
import NoticeDetail from "@pages/Notice/Detail";
import BoardroomPledge from "@pages/Boardroom/Details";
import Lottery from "@pages/Lottery";
import ForceMining from "@pages/ForceMining";
import ComputationalMining from "@pages/ComputationalMining";
import ComputationalMiningDetails from "@pages/ComputationalMining/Details";
import MMRSPlan from "@pages/MMRSPlan";
import MMRSCommunity from "@pages/MMRSCommunity";
import DynamicReward from "@pages/MMRSPlan/DynamicReward";
// import OldPlan from "@pages/OldPlan";

const routes = [
  {
    path: "/home",
    label: {
      English: "home",
      TraditionalChinese: "首頁",
      SimplifiedChinese: "首页",
    },
    icon: "home",
    component: <Home />,
  },
  {
    path: "/mining",
    label: {
      English: "WFILMining",
      TraditionalChinese: "WFIL挖礦",
      SimplifiedChinese: "WFIL挖矿",
    },
    icon: "block",
    component: <Mining />,
  },

  {
    path: "/computationalMining",
    label: {
      English: "computationalMining",
      TraditionalChinese: "算力挖礦",
      SimplifiedChinese: "算力挖矿",
    },
    icon: "slwk",
    component: <ComputationalMining />,
  },
  {
    path: "/mobilityMining",
    label: {
      English: "mobilityMining",
      TraditionalChinese: "流動性挖礦",
      SimplifiedChinese: "流动性挖矿",
    },
    icon: "loop",
    component: <MobilityMining />,
  },
  {
    path: "/boardroom",
    label: {
      English: "boardroom",
      TraditionalChinese: "董事會",
      SimplifiedChinese: "董事会",
    },
    icon: "boardroom",
    component: <Boardroom />,
  },
    {
    path: "/daoProposal",
    label: {
      English: "DAOGovern",
      TraditionalChinese: "DAO治理",
      SimplifiedChinese: "DAO治理",
    },
    icon: "dao",
    component: <DAOProposal />,
  },
  // {
  //   path: "/dao",
  //   label: {
  //     English: "DAOGovern",
  //     TraditionalChinese: "DAO治理",
  //     SimplifiedChinese: "DAO治理",
  //   },
  //   icon: "dao",
  //   component: <DAOGovern />,
  // },
  {
    path: "/swap",
    label: {
      English: "swap",
      TraditionalChinese: "兌換",
      SimplifiedChinese: "兑换",
    },
    icon: "swap",
    component: <Swap />,
  },
  {
    path: "/lottery",
    label: {
      English: "lottery",
      TraditionalChinese: "彩票",
      SimplifiedChinese: "彩票",
    },
    icon: "lottery",
    component: <Lottery />,
  },
  {
    path: "/mobilityPool",
    label: {
      English: "mobilityPool",
      TraditionalChinese: "流動性池",
      SimplifiedChinese: "流动性池",
    },
    icon: "mobility",
    component: <MobilityPool />,
    space: true,
  },
  {
    path: "/plan",
    label: {
      English: "GR Displace",
      TraditionalChinese: "GR置換",
      SimplifiedChinese: "GR置换",
    },
    icon: "dr",
    component: <MMRSPlan />,
    space: true,
  },
  // {
  //   path: "/oldPlan",
  //   label: {
  //     English: "blackHoleProject",
  //     TraditionalChinese: "测试GR计划",
  //     SimplifiedChinese: "测试GR计划",
  //   },
  //   icon: "dr",
  //   component: <OldPlan />,
  //   space: true,
  // },
  {
    path: "/MMRSCommunity",
    label: {
      English: "MMRSCommunity",
      TraditionalChinese: "MMRS社區",
      SimplifiedChinese: "MMRS社区",
    },
    icon: "mmrsct",
    component: <MMRSCommunity />,
  },
  // {
  //   path: "/shop",
  //   label: {
  //     English: "mall",
  //     TraditionalChinese: "算力商城",
  //     SimplifiedChinese: "算力商城",
  //   },
  //   icon: "calculator",
  //   component: <Shop />,
  // },

  // {
  //   path: "/vip",
  //   label: {
  //     English: "Be VIP",
  //     TraditionalChinese: "會員",
  //     SimplifiedChinese: "会员",
  //   },
  //   icon: "vip",
  //   component: <Vip />,
  // },
  {
    path: "/community",
    label: {
      English: "community",
      TraditionalChinese: "我的社區",
      SimplifiedChinese: "我的社区",
    },
    icon: "community",
    component: <Community />,
  },
  {
    path: "/invitation",
    label: {
      English: "invitation",
      TraditionalChinese: "邀請好友",
      SimplifiedChinese: "邀请好友",
    },
    icon: "invitation",
    component: <Invitation />,
  },
  {
    path: "/notice",
    label: {
      English: "notice",
      TraditionalChinese: "公告",
      SimplifiedChinese: "公告",
    },
    icon: "notice",
    component: <Notice />,
  },
  {
    path: "https://audit.mmr.finance/",
    label: {
      English: "auditReport",
      TraditionalChinese: "審計報告",
      SimplifiedChinese: "审计报告",
    },
    icon: "audit",
    _target: true,
  },
  {
    path: "https://dapp.mmr.finance/whitepaper.pdf",
    label: {
      English: "whitePaper",
      TraditionalChinese: "白皮書",
      SimplifiedChinese: "白皮书",
    },
    icon: "whitePaper",
    _target: true,
  },
];

export default routes;

export const SecondaryRoutes = [
  {
    path: "/forceMining/:round",
    mapPath: "/forceMining/",
    label: {
      English: "calculateSubscription",
      TraditionalChinese: "算力認購",
      SimplifiedChinese: "算力认购",
    },
    icon: "slrg",
    component: <ForceMining />,
  },
  {
    path: "/pledge",
    mapPath: "/pledge",
    label: {
      English: "pledge",
      TraditionalChinese: "質押",
      SimplifiedChinese: "质押",
    },
    component: <Pledge />,
  },

  {
    path: "/pledgeDetail/:address",
    mapPath: "/pledgeDetail/",
    label: {
      English: "pledge record",
      TraditionalChinese: "質押記錄",
      SimplifiedChinese: "质押记录",
    },
    component: <Details />,
  },
  {
    path: "/noticeDetail/:id",
    mapPath: "/noticeDetail/",
    label: {
      English: "Notice Detail",
      TraditionalChinese: "詳情",
      SimplifiedChinese: "详情",
    },
    component: <NoticeDetail />,
  },
  {
    path: "/miningDetail/:round",
    mapPath: "/miningDetail/",
    label: {
      English: (round) => `Phase ${round}`,
      TraditionalChinese: (round) => `第${round}期`,
      SimplifiedChinese: (round) => `第${round}期`,
    },
    component: <ComputationalMiningDetails />,
  },
  {
    path: "/boardroomPledge",
    mapPath: "/boardroomPledge",
    label: {
      English: "boardroom_pledge",
      TraditionalChinese: "董事會_質押",
      SimplifiedChinese: "董事会_质押",
    },
    component: <BoardroomPledge />,
  },
  {
    path: "/dynamicRewardDetails",
    mapPath: "/dynamicRewardDetails",
    label: {
      English: "Dynamic reward details",
      TraditionalChinese: "動態獎勵明細",
      SimplifiedChinese: "动态奖励明细",
    },
    component: <DynamicReward />,
  },
];
