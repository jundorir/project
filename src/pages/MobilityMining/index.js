import css from './index.module.less'
import MobilityPledgeWindow from '@components/MobilityPledgeWindow'
import MobilityRedeemWindow from '@components/MobilityRedeemWindow'
import React from 'react'
import { inject, observer } from 'mobx-react'
import classNames from 'classnames'
import { useHistory } from 'react-router-dom'
import { Toast } from 'antd-mobile'

const languageContext = {
  English: {
    head: 'Liquidity Mining Area',
    unclaimedIncome: 'Income to beclainmed',
    totalIncomeTips: 'Accumulated received：',
    receive: 'receive',
    alreadyPledgeLP: 'LP of pledged',
    pledgeLP: 'pledge LP',
    retrieve: 'retrieve',
    addLiquidity: 'add liquidity',
    blockNumber: 'Current Block Number',
    none: 'No profit',
    notActive: 'Please bind the inviter to activate the account first'
  },
  TraditionalChinese: {
    head: '流動性挖礦區',
    unclaimedIncome: '待領取收益',
    totalIncomeTips: '累計已領取：',
    receive: '領取',
    alreadyPledgeLP: 'LP已質押',
    pledgeLP: '質押LP',
    retrieve: '取回',
    addLiquidity: '添加流動性',
    blockNumber: '當前區塊號',
    none: '暫無收益',
    notActive: '請先綁定邀請人激活賬號'
  },
  SimplifiedChinese: {
    head: '流动性挖矿区',
    unclaimedIncome: '待领取收益',
    totalIncomeTips: '累计已领取：',
    receive: '领取',
    alreadyPledgeLP: 'LP已质押',
    pledgeLP: '质押LP',
    retrieve: '取回',
    addLiquidity: '添加流动性',
    blockNumber: '当前区块号',
    none: '暂无收益',
    notActive: '请先绑定邀请人激活账号'
  }
}
function MobilityMining(props) {
  const history = useHistory()
  const [showModal, setShowModal] = React.useState(null)
  const {
    mobility,
    lang: { selectedLang },
    chain,
    server
  } = props
  const language = languageContext[selectedLang.key]

  const closeModal = React.useCallback(() => {
    setShowModal(null)
  }, [])
  const openPledgeModal = React.useCallback(type => {
    setShowModal(`pledge_${type}`)
  }, [])
  const openReplevyModal = React.useCallback(type => {
    setShowModal(`replevy_${type}`)
  }, [])

  const jumpToPool = React.useCallback(() => {
    history.push('/mobilityPool')
  }, [])

  React.useEffect(() => {
    if (chain.address) {
      init()
    }
  }, [chain.address, mobility])

  function showNotActiveTips() {
    Toast.info(language.notActive)
  }

  async function init() {
    mobility.queryIncome()
    // mobility.queryAllInfoAsync("U");
    // mobility.queryTotalLpPower("U");
    mobility.queryUserLpPower('U')
    // if (!chain.contractAddress?.currentMap?.T) {
    //   await chain.queryTAddress();
    // }
    // mobility.queryUserLpPower("T");
  }

  React.useEffect(() => {
    let interval = setInterval(() => {
      if (chain.address) {
        mobility.queryIncome()
        chain.getCurrentBlock()
      }
    }, 3000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  function renderModal() {
    if (showModal === null) return null
    const [operation, type] = showModal.split('_')
    if (operation === 'pledge')
      return (
        <MobilityPledgeWindow
          closeMobilityPledgeWindow={closeModal}
          type={type}
        />
      )
    if (operation === 'replevy')
      return (
        <MobilityRedeemWindow
          closeMobilityRedeemWindow={closeModal}
          type={type}
        />
      )
  }

  // const TVL =
  //   interception((mobility.U_TVL_USDT * server.fil_price) / 10 ** 18, 4) || 0;
  const TVL = server.tvl_lp
  const APR = server.apr_lp
  return (
    <div className={css.mobilityMining}>
      <div className={css.banner}>
        <div className={css.box}>
          <div className={css.logo}>{language.head}</div>
          <div className={css.explain}>MMR/USDT</div>
          <div className={css.current}>
            <div className={css.word}>
              {language.blockNumber}：{chain.currentBlockNumber}
            </div>
          </div>
        </div>
      </div>
      <div className={css.content}>
        <div className={css.incomeBox}>
          <div className={css.icon}></div>
          <div className={css.tips}>{language.unclaimedIncome}</div>
          <div className={css.totalBox}>
            <div className={css.total}>{mobility.unclaimedIncome}</div>
            <div className={css.symbol}>MMR</div>
          </div>
          <div className={css.price}>
            ≈${(mobility.unclaimedIncome * server.mmr_price).toFixed(4)}
          </div>
          <div className={css.bottom}>
            <div className={css.left}>
              {language.totalIncomeTips}
              {mobility.totalIncome}MMR
            </div>
            <div
              className={classNames(
                css.right
                // mobility.unclaimedIncome === "0" && css.disabled
              )}
              onClick={() => {
                if (!chain.address || mobility.unclaimedIncome === '0') {
                  Toast.info(language.none)
                  return
                }
                mobility.getReward()
              }}
            >
              {language.receive}
            </div>
          </div>
        </div>
        
      </div>
      <div className={css.liquidityPledgeBox}>
        <div className={css.box}>
          <div className={css.title}>
            <div className={css.left}>
              <div className={css.icon_m}></div>
              <div className={css.icon_u}></div>
              <div className={css.text}>USDT MMR</div>
            </div>
            <div className={css.right}>LP</div>
          </div>

          <div className={css.line}>
            <div className={css.left}>APR</div>
            <div className={css.right}>{APR}%</div>
          </div>
          <div className={css.line}>
            <div className={css.left}>TVL</div>
            <div className={css.right}>${TVL}</div>
          </div>

          <div className={css.alreadyPledge}>
            <div className={css.left}>
              <div>{language.alreadyPledgeLP}</div>
              <div>MMR/USDT</div>
            </div>
            <div className={css.right}>{mobility.userULpPower}</div>
          </div>

          <div className={css.buttons}>
            <div
              className={classNames(
                css.pledgeBtn,
                !chain.isActive && css.disabled
              )}
              onClick={() => {
                if (!chain.isActive) {
                  showNotActiveTips()
                  return
                }
                openPledgeModal('U')
              }}
            >
              {language.pledgeLP}
            </div>
            <div
              className={classNames(
                css.replevyBtn,
                !chain.isActive && css.disabled
              )}
              onClick={() => {
                if (!chain.isActive) {
                  showNotActiveTips()
                  return
                }
                openReplevyModal('U')
              }}
            >
              {language.retrieve}
            </div>
          </div>

          <div className={css.swapBtn} onClick={jumpToPool}>
            {language.addLiquidity}+
          </div>
        </div>
      </div>
      {/* <div className={css.liquidityPledgeBox}>
        <div className={css.box}>
          <div className={css.title}>
            <div className={css.left}>
              <div className={css.icon_m}></div>
              <div className={css.icon_t}></div>
              <div className={css.text}>T WFIL</div>
            </div>
            <div className={css.right}>LP</div>
          </div>

          <div className={css.alreadyPledge}>
            <div className={css.left}>
              <div>{language.alreadyPledgeLP}</div>
              <div>T/WFIL</div>
            </div>
            <div className={css.right}>{mobility.userTLpPower}</div>
          </div>

          <div className={css.buttons}>
            <div
              className={classNames(css.pledgeBtn, !chain.isActive && css.disabled)}
              onClick={() => {
                if(!chain.isActive) {
                  showNotActiveTips();
                  return
                };             
                   openPledgeModal("T");
              }}
            >
              {language.pledgeLP}
            </div>
            <div
              className={classNames(css.replevyBtn, !chain.isActive && css.disabled)}
              onClick={() => {
                if(!chain.isActive) {
                  showNotActiveTips();
                  return
                };
                openReplevyModal("T");
              }}
            >
              {language.retrieve}
            </div>
          </div>

          <div className={css.swapBtn} onClick={jumpToPool}>
            {language.addLiquidity}+
          </div>
        </div>
      </div> */}
      {renderModal()}
    </div>
  )
}

export default inject(
  'mobility',
  'lang',
  'server',
  'chain'
)(observer(MobilityMining))
