import css from './index.module.less'
import React from 'react'
import { inject, observer } from 'mobx-react'
import MobilityItem from './MobilityItem'
import { Toast } from 'antd-mobile'

const languageContext = {
  English: {
    yourMobility: "your liquidity",
    addMobility: "add liquidity",
    capitalPool: "Share of bonus pool:",
    removeMobility: "Remove liquidity to retrieve tokens",
    add: "add",
    remove: "remove",
  },
  TraditionalChinese: {
    yourMobility: "您的流動性",
    removeMobility: "移除流動性以取回代幣",
    addMobility: "添加流動性",
    capitalPool: "資金池中的份額:",
    add: "添加",
    remove: "移除",
  },
  SimplifiedChinese: {
    yourMobility: "您的流动性",
    addMobility: "添加流动性",
    removeMobility: "移除流动性以取回代币",
    capitalPool: "资金池中的份额:",
    add: "添加",
    remove: "移除",
  },
};
function DisplayMobility(props) {
  const {
    mobility,
    chain,
    lang: { selectedLang }
  } = props
  const language = languageContext[selectedLang.key]

  React.useEffect(() => {
    if (chain.address) {
      mobility.queryAllInfoAsync('U')
      // mobility.queryAllInfoAsync("MMRS_TO_USDT");
    }
  }, [chain.address, mobility])

  // React.useEffect(() => {
  //   if (chain.address) {
  //     init();
  //   }
  // }, [chain.address]);

  

  // async function init() {
  //   try {
  //     if (!chain.contractAddress?.currentMap?.T) {
  //       await chain.queryTAddress();
  //     }
  //     mobility.queryAllInfoAsync("T");
  //   } catch {}
  // }

  return (
    <div className={css.content}>
      <div className={css.box}>
        <div className={css.title}>{language.yourMobility}</div>
        <div className={css.tips}>{language.removeMobility}</div>
        <MobilityItem type="U" />
        {/* <MobilityItem type="MMRS_TO_USDT" /> */}
        {/* <MobilityItem type="T" /> */}
        {
          chain.isActive && <div
          className={css.addBtn}
          onClick={() => {
            mobility.showAddMobility();
          }}
        >
          {language.addMobility}+
        </div>
        }
      </div>
    </div>
  )
}

export default inject('mobility', 'chain', 'lang')(observer(DisplayMobility))
