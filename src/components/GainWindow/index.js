import React from 'react'
import css from './index.module.less'
import close from '@assets/images/icon/close.png'
import getsuccess from '@assets/images/icon/getsuccess.png'
import { inject, observer } from 'mobx-react'

function GainWindow(props) {
  const { lang } = props
  const { selectedLang } = lang
  const [language, setLanguage] = React.useState([])
  React.useEffect(() => {
    if (selectedLang.key === 'English') {
      setLanguage(['Success to receive'])
    } else if (selectedLang.key === 'TraditionalChinese') {
      setLanguage(['領取成功'])
    } else if (selectedLang.key === 'SimplifiedChinese') {
      setLanguage(['领取成功'])
    }
  }, [selectedLang.key])
  const closeWindow = React.useCallback(() => {
    props.closeGainWindow()
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
        {/* getsuccess图 */}
        <div className={css.logImg}>
          <img src={getsuccess} alt="" className={css.img} />
        </div>
        {/* 标题 */}
        <div className={css.title}>{language[0]}</div>
      </div>
    </div>
  )
}

export default inject('lang')(observer(GainWindow))
