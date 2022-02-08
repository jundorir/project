import React, { Fragment, useCallback } from 'react'
import css from './index.module.less'
import { inject, observer } from 'mobx-react'
import GainWindow from '@components/GainWindow'
import classNames from 'classnames'
import { Toast } from 'antd-mobile'
import { getCurrentBlock } from '@utils/web3utils_future'
function Gain(props) {
  const { lang, chain } = props
  const { selectedLang } = lang
  const { WFILearnings, MMRearnings } = chain
  const [language, setLanguage] = React.useState([])
  const [gainDisplay, setGainDisplay] = React.useState('none')
  const closeGainWindow = useCallback(() => {
    setGainDisplay('none')
  }, [])
  React.useEffect(() => {
    let interval = setInterval(() => {
      if (chain.address) {
        chain.requestChainData()
      }
    }, 3000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  React.useEffect(() => {
    if (selectedLang.key === 'English') {
      setLanguage([
        'Income to be claimed',
        'gain',
        'No profit',
        'Earned income',
        'Current Block Number'
      ])
    } else if (selectedLang.key === 'TraditionalChinese') {
      setLanguage([
        '待領取收益',
        '領取',
        '暫無收益',
        '累計已領取',
        '當前區塊號'
      ])
    } else if (selectedLang.key === 'SimplifiedChinese') {
      setLanguage([
        '待领取收益',
        '领取',
        '暂无收益',
        '累计已领取',
        '当前区块号'
      ])
    }
  }, [selectedLang.key])
  const handleclick = React.useCallback(async () => {
    if (chain.address) {
      const result = await chain.reapRewards()
      if (result) {
        chain.requestChainData()
        setGainDisplay('unset')
      }
    }
  }, [chain])
  return (
    <Fragment>
      <div style={{ display: gainDisplay }}>
        <GainWindow closeGainWindow={closeGainWindow} />
      </div>
      <div className={css.contain}>
        <div className={css.inner}>
          {/* <div className={css.current}>
            {language[4]}：{chain.currentBlockNumber}
          </div> */}
          <div className={css.top}>
            <div className={css.left}>{language[0]}</div>
            <div
              className={classNames(
                css.botton,
                (WFILearnings <= 0 || MMRearnings <= 0) && css.disabled
              )}
              onClick={e => {
                e.preventDefault()
                if (chain.address) {
                  chain.requestChainData()
                  if (WFILearnings > 0 || MMRearnings > 0) {
                    handleclick()
                  } else {
                    Toast.info(`${language[2]}`)
                  }
                }
              }}
            >
              {language[1]}
            </div>
          </div>
          <div className={css.line}></div>
          <div className={css.center}>
            <div className={css.one}>
              <div className={css.unit}>WFIL</div>
              <div className={css.num}>
                {(WFILearnings / Math.pow(10, 18)).toFixed(8)}
              </div>
            </div>
            <div className={css.middle}></div>
            <div className={css.two}>
              <div className={css.unit}>MMR</div>
              <div className={css.num}>
                {(MMRearnings / Math.pow(10, 18)).toFixed(4)}
              </div>
            </div>
          </div>
          <div className={css.line}></div>
          <div className={css.bottom}>
            {/* <div className={css.bottomInner}> */}
            <div className={css.bottomTitle}>
              <span className={css.bottomTitleL}>{language[3]}WFIL ：</span>
              {chain.filReceived}
            </div>
            <div className={css.bottomTitle1}>
              <span className={css.bottomTitleL}>{language[3]}MMR：</span>
              {chain.mmrReceived}
            </div>
            {/* <div className={css.center}>
                <div className={css.one}>
                  <div className={css.num}>
                    {chain.filReceived}
                  </div>
                  <div className={css.unit}>WFIL</div>
                </div>
                <div className={css.middle}></div>
                <div className={css.two}>
                  <div className={css.num}>
                    {chain.mmrReceived}
                  </div>
                  <div className={css.unit}>MMR</div>
                </div>
              </div> */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default inject('lang', 'chain')(observer(Gain))
