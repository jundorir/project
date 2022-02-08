import React, { Fragment, useCallback } from 'react'
import css from './index.module.less'
import { inject, observer } from 'mobx-react'
import GainWindow from '@components/GainWindow'
import { interception } from '@utils/common'
import { Toast } from 'antd-mobile'
import { DAOReward } from '@utils/web3utils_future'

function Gain(props) {
  const { lang, chain, boardroom, server } = props
  const { selectedLang } = lang
  const { unclaimedIncome } = boardroom
  const { mmr_price } = server
  const [language, setLanguage] = React.useState({})
  const [gainDisplay, setGainDisplay] = React.useState('none')

  React.useEffect(() => {
    let interval = setInterval(() => {
      if (chain.address) {
        boardroom.threeSecondsRefresh()
        chain.getCurrentBlock()
        server.getFMData(chain.address);
      }
    }, 3000)
    return () => {
      clearInterval(interval)
    }
  }, [])
  
 

  React.useEffect(() => {
    if (selectedLang.key === 'English') {
      setLanguage({
        income: 'Income to be claimed',
        receive: 'receive',
        total: 'Accumulated received:',
        fail: 'Get the failure',
        none: 'No profit',
        blockNumber: 'Current Block Number'
      })
    } else if (selectedLang.key === 'TraditionalChinese') {
      setLanguage({
        income: '待領取收益',
        receive: '領取',
        total: '累計已領取：',
        fail: '領取失敗',
        none: '暫無收益',
        blockNumber: '當前區塊號'
      })
    } else if (selectedLang.key === 'SimplifiedChinese') {
      setLanguage({
        income: '待领取收益',
        receive: '领取',
        total: '累计已领取：',
        fail: '领取失败',
        none: '暂无收益',
        blockNumber: '当前区块号'
      })
    }
  }, [selectedLang.key])
  const handleGain = React.useCallback(async () => {
    if (chain.address) {
      try {
        const DAORewardResult = await DAOReward(chain.address)
        if (DAORewardResult) {
          boardroom.requestUpdateIncome()
          setGainDisplay('unset')
        }
      } catch (error) {
        Toast.fail(language.fail)
      }
    }
  }, [chain.address, language.fail])
  const closeGainWindow = useCallback(() => {
    setGainDisplay('none')
  }, [])
  //待领取MMR收益/累计已领取MMR
  React.useEffect(() => {
    if (chain.address) {
      boardroom.getUnclaimedIncome()
      boardroom.getTotalIncome()
    }
  }, [chain.address])

  return (
    <Fragment>
      <div style={{ display: gainDisplay }}>
        <GainWindow closeGainWindow={closeGainWindow} />
      </div>
      <div className={css.contain}>
        <div className={css.inner}>
          <div className={css.top}>
            <div className={css.topRImg}></div>
            <div className={css.topL}>
              {/* <div className={css.current}>
                {language.blockNumber}：{chain.currentBlockNumber}
              </div> */}
              <div className={css.one}>{language.income}</div>
              <div className={css.two}>
                <span className={css.number}>
                  {interception(unclaimedIncome, 4)}
                </span>
                <span>MMR</span>
              </div>
              <div className={css.three}>
                ≈$
                {unclaimedIncome > 0
                  ? (unclaimedIncome * mmr_price).toFixed(6)
                  : 0}
              </div>
            </div>
            <div className={css.topR}></div>
          </div>
          <div className={css.line}></div>
          <div className={css.bottom}>
            <div className={css.bottomL}>
              {language.total}
              {boardroom.totalIncome}MMR
            </div>
            <div
              className={css.bottomR}
              onClick={() => {
                if (unclaimedIncome > 0) {
                  handleGain()
                } else {
                  Toast.info(language.none)
                }
              }}
            >
              {language.receive}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default inject('lang', 'chain', 'boardroom', 'server')(observer(Gain))
