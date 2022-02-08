import langStore from "./lang";
import chainStore from "./chain";
import viewStore from "./view";
import serverStore from "./server";
import communityStore from "./community";
import pledgeListStore from "./pledgeList";
import boardroomStore from "./boardroom";
import computationalPowerStore from "./computationalPower";
import mobilityStore from "./mobility";
import forceMiningStore from "./forceMining";
import forceMiningNewStore from "./forceMiningNew";
// import lotteryStore from "./lottery";
import mmrsGRStore from "./mmrsGR";
import mmrsCommunityStore from "./mmrsCommunity";
import dynamicRewardListStore from "./DynamicRewardList";
import oldmmrsGRStore from "./oldmmrsGR";
import daoProposalStore from "./daoProposal";

const Store = {
  lang: langStore,
  chain: chainStore,
  view: viewStore,
  server: serverStore,
  community: communityStore,
  pledgeList: pledgeListStore,
  boardroom: boardroomStore,
  mobility: mobilityStore,
  forceMining: forceMiningStore,
  forceMiningNew: forceMiningNewStore,
  // lottery: lotteryStore,
  computationalPower: computationalPowerStore,
  mmrsGR: mmrsGRStore,
  mmrsCommunity: mmrsCommunityStore,
  dynamicRewardList: dynamicRewardListStore,
  oldmmrsGR: oldmmrsGRStore,
  daoProposal: daoProposalStore,
};

export default Store;
