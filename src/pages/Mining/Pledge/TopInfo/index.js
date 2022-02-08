import React from 'react'
import css from './index.module.less'
import WFIL from '@assets/images/icon/backup.png'
import { inject, observer } from 'mobx-react'
import { getCurPerUintReward } from '@utils/web3utils_future'
import { computeWeiToSymbol } from '@utils/common'

function TopInfo(props) {
  const { lang, server, chain } = props
  const { selectedLang } = lang
  const [language, setLanguage] = React.useState([])
  const [reward, setReward] = React.useState(0)
  React.useEffect(() => {
    if (chain.address) {
      chain.requestChainData()
    }
  }, [chain.address])
  React.useEffect(() => {
    if (selectedLang.key === 'English') {
      setLanguage([
        'GAIN',
        'yield rate',
        'Total pledge',
        'Each block award',
        'yield'
      ])
    } else if (selectedLang.key === 'TraditionalChinese') {
      setLanguage(['收獲', '收益率', '總質押量', '每塊區塊獎勵', '收益率'])
    } else if (selectedLang.key === 'SimplifiedChinese') {
      setLanguage(['收获', '收益率', '总质押量', '每块区块奖励', '收益率'])
    }
  }, [selectedLang.key])
  React.useEffect(() => {
    if (chain.address) {
      async function requestCurPerUintReward() {
        try {
          const result = await getCurPerUintReward()
          // console.log('result', result)
          setReward(result)
        } catch {}
      }
      requestCurPerUintReward()
    }
  }, [])
  function renderYiled() {
    if (props.curChecked === 30) {
      return (
        parseInt((server.ratio_mmr - 0 + (server.ratio_fil - 0)) * 10000) /
        10000
      ).toFixed(4)
    } else if (props.curChecked === 60) {
      return (
        parseInt(
          ((server.ratio_mmr - 0) * 1.5 + (server.ratio_fil - 0)) * 10000
        ) / 10000
      ).toFixed(4)
    } else if (props.curChecked === 180) {
      return (
        parseInt(
          ((server.ratio_mmr - 0) * 2 + (server.ratio_fil - 0)) * 10000
        ) / 10000
      ).toFixed(4)
    } else if (props.curChecked === 360) {
      return (
        parseInt(
          ((server.ratio_mmr - 0) * 3 + (server.ratio_fil - 0)) * 10000
        ) / 10000
      ).toFixed(4)
    } else if (props.curChecked === 0) {
      return (
        parseInt(
          ((server.ratio_mmr - 0) * 0.2 + (server.ratio_fil - 0)) * 10000
        ) / 10000
      ).toFixed(4)
    }
  }
  return (
    <>
      <div className={css.one}>
        <div className={css.lefttitle}>
          <img src={WFIL} className={css.circle} alt="" />
          <span className={css.WFIL}>WFIL</span>
        </div>
        <div className={css.righttitle}>{language[0]}&nbsp;&nbsp;WFIL、MMR</div>
      </div>
      <div className={css.line}></div>
      <div className={css.two}>
        <div className={css.topleft}>{language[1]}（APR）</div>
        <div className={css.topright}>{renderYiled()}&nbsp;&nbsp;%</div>
      </div>
      {/* <div className={css.three}>
        <div className={css.topleft}>WFIL&nbsp;&nbsp;{language[4]}</div>
        <div className={css.topright}>{server.ratio_fil}&nbsp;&nbsp;%</div>
      </div>
      <div className={css.four}>
        <div className={css.topleft}>MMR&nbsp;{language[4]}</div>
        <div className={css.topright}>{server.ratio_mmr}&nbsp;&nbsp;%</div>
      </div> */}
    </>
  )
}

export default inject('lang', 'server', 'chain')(observer(TopInfo))
