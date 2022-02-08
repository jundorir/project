const env = "test"; //production test  local;

const GolbalConfig = {
  production: {
    DBAddress: "0x429A13cdc9e0Fc119033FC4d8654cd19D84e098d",
    AFILAddress: "0x687a145e9807bE30B215aFbb968a748dbC581b58",
    curChainId: "0x1b2e5",
    WFILAddress: "0xa8Af0B08344BFeFE0b8bDdBEd6A17933E3c566E8",
    WAMIAddress: "0x712D07eA8811610AE315e726fcc630959565CF37",
    pledgeAddress: "0x1f504Ab3142bBAeed3cC05b1968e4c77adCf461D",
    assignTokenAddress: "0x7e7B74477be3E6740eEF1713fE377354416a15e0",
  },
  test: {
    DBAddress: "0x429A13cdc9e0Fc119033FC4d8654cd19D84e098d",
    AFILAddress: "0x687a145e9807bE30B215aFbb968a748dbC581b58",
    curChainId: "0x1b2e5",
    WFILAddress: "0xa8Af0B08344BFeFE0b8bDdBEd6A17933E3c566E8",
    WAMIAddress: "0x712D07eA8811610AE315e726fcc630959565CF37",
    pledgeAddress: "0x1f504Ab3142bBAeed3cC05b1968e4c77adCf461D",
    assignTokenAddress: "0x7e7B74477be3E6740eEF1713fE377354416a15e0",
  },
  local: {
    DBAddress: "0x429A13cdc9e0Fc119033FC4d8654cd19D84e098d",
    AFILAddress: "0x687a145e9807bE30B215aFbb968a748dbC581b58",
    curChainId: "0x1b2e5",
    WFILAddress: "0xa8Af0B08344BFeFE0b8bDdBEd6A17933E3c566E8",
    WAMIAddress: "0x712D07eA8811610AE315e726fcc630959565CF37",
    pledgeAddress: "0x1f504Ab3142bBAeed3cC05b1968e4c77adCf461D",
    assignTokenAddress: "0x7e7B74477be3E6740eEF1713fE377354416a15e0",
  },
};

const {
  DBAddress,
  AFILAddress,
  curChainId,
  WFILAddress,
  WAMIAddress,
  pledgeAddress,
  assignTokenAddress,
} = GolbalConfig[env];

export {
  DBAddress,
  AFILAddress,
  curChainId,
  WFILAddress,
  WAMIAddress,
  pledgeAddress,
  assignTokenAddress,
  env,
};

// export const currencyAddressToSymbol = {
//   [GolbalConfig[env].AFILAddress.toLowerCase()]: "AFIL",
//   [GolbalConfig[env].WAMIAddress.toLowerCase()]: "MMR",
//   [GolbalConfig[env].WFILAddress.toLowerCase()]: "WFIL",
// };
// export const currencyMap = {
//   AFIL: GolbalConfig[env].AFILAddress,
//   MMR: GolbalConfig[env].WAMIAddress,
//   WFIL: GolbalConfig[env].WFILAddress,
// };
