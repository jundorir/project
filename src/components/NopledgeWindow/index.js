import React from 'react'
import css from './index.module.less'
import close from '@assets/images/icon/close.png'
import nopledge from '@assets/images/icon/nopledge.png'
import { inject, observer } from 'mobx-react'

function NopledgeWindow(props) {
  const { lang } = props
  const { selectedLang } = lang
  const [language, setLanguage] = React.useState([])
  React.useEffect(() => {
    if (selectedLang.key === 'English') {
      setLanguage(['No pledge'])
    } else if (selectedLang.key === 'TraditionalChinese') {
      setLanguage(['暫無質押'])
    } else if (selectedLang.key === 'SimplifiedChinese') {
      setLanguage(['暂无质押'])
    }
  }, [selectedLang.key])
  const closeWindow = React.useCallback(() => {
    props.closeNopledgeWindow()
  }, [props])
  return (
    <div
      className={css.gainWindow}
      onClick={() => {
        closeWindow()
      }}
    >
      <div
        className={css.gainBox}
        onClick={e => {
          e.stopPropagation()
        }}
      >
        {/* 关闭按钮 */}
        <div className={css.closeImgBox}>
          <img
            onClick={e => {
              e.stopPropagation()
              closeWindow()
            }}
            className={css.closeImg}
            src={close}
            alt=" "
          />
        </div>
        {/* nopledge图 */}
        <div className={css.logImg}>
          <img src={nopledge} alt="" className={css.img} />
        </div>
        {/* 标题 */}
        <div className={css.title}>{language[0]}</div>
      </div>
    </div>
  )
}

export default inject('lang')(observer(NopledgeWindow))
