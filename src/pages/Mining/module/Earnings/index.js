import React from 'react'
import css from './index.module.less'
import { inject, observer } from 'mobx-react'
import rightimg from '@assets/images/icon/headerLogo.png'

function Earnings(props) {
  const { lang, chain } = props
  const { selectedLang } = lang
  const [language, setLanguage] = React.useState([])
  React.useEffect(() => {
    if (selectedLang.key === 'English') {
      setLanguage([
        'Revenue Area',
        'Low threshold and on demand storage',
        'Current Block number'
      ])
    } else if (selectedLang.key === 'TraditionalChinese') {
      setLanguage(['WFIL挖礦收益區', '參與門檻低、隨取隨存', '當前區塊號'])
    } else if (selectedLang.key === 'SimplifiedChinese') {
      setLanguage(['WFIL挖矿收益区', '参与门槛低、随取随存', '当前区块号'])
    }
  }, [selectedLang.key])
  return (
    <div className={css.contain}>
      <div className={css.inner}>
        <div className={css.left}>
          <div className={css.title}>{language[0]}</div>
          <div className={css.describle}>{language[1]}</div>
        </div>
        <div className={css.right}>
          {/* <img alt="" src={rightimg}  className={css.rightImg}/> */}
          <div className={css.word}>
            {language[2]}：{chain.currentBlockNumber}
          </div>
        </div>
      </div>
    </div>
  )
}

export default inject('lang', 'chain')(observer(Earnings))
