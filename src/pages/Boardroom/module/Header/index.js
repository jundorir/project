import React from 'react'
import css from './index.module.less'
import { inject, observer } from 'mobx-react'
import rightimg from '@assets/images/icon/headerLogo.png'

function Header(props) {
  const { lang, chain } = props
  const { selectedLang } = lang
  const [language, setLanguage] = React.useState([])
  React.useEffect(() => {
    if (selectedLang.key === 'English') {
      setLanguage([
        'Pledge',
        `MMR holders enjoy a share in the platform's earnings`,
        'Current Block number'
      ])
    } else if (selectedLang.key === 'TraditionalChinese') {
      setLanguage(['質押', '持有MMR享有平臺收益分紅共同治理平臺', '當前區塊號'])
    } else if (selectedLang.key === 'SimplifiedChinese') {
      setLanguage(['质押', '持有MMR享有平台收益分红共同治理平台', '当前区块号'])
    }
  }, [selectedLang.key])
  return (
    <div className={css.contain}>
      <div className={css.inner}>
        <div className={css.left}>
          <div className={css.title}>{language[0]} MMR/USDT</div>
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

export default inject('lang', 'chain')(observer(Header))
