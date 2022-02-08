import React from 'react'
import css from './index.module.less'
import close from '@assets/images/icon/close.png'
import agree1 from '@assets/images/icon/agree1.png'
import agree2 from '@assets/images/icon/agree2.png'
import { inject, observer } from 'mobx-react'

function Register(props) {
  const { lang } = props
  const { selectedLang } = lang
  const [isAgree, setIsAgree] = React.useState(agree2)
  const [language, setLanguage] = React.useState([])
  React.useEffect(() => {
    if (selectedLang.key === 'English') {
      setLanguage([
        'Registration Agreement',
        'user notice',
        'trading',
        'I agree',
        'inviter',
        'confirm'
      ])
    } else if (selectedLang.key === 'TraditionalChinese') {
      setLanguage([
        '註冊協議',
        '用戶須知',
        '交易',
        '我已閱讀並同意以上聲明',
        '邀請人',
        '確定'
      ])
    } else if (selectedLang.key === 'SimplifiedChinese') {
      setLanguage([
        '注册协议',
        '用户须知',
        '交易',
        '我已阅读并同意以上声明',
        '邀请人',
        '确定'
      ])
    }
  }, [selectedLang.key])
  const closeWindow = React.useCallback(() => {
    props.closeRegister()
  }, [props])
  // 确定按钮
  const handleAgree = React.useCallback(() => {
    if (isAgree === agree1) {
      // console.log('handleAgree')
    } else {
    }
  }, [isAgree])
  return (
    <div
      className={css.registerWindow}
      onClick={() => {
        closeWindow()
      }}
    >
      <div
        className={css.registerBox}
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
        {/* 标题 */}
        <div className={css.title}>{language[0]}</div>
        {/* 用户须知 */}
        <div className={css.info}>
          <div className={css.infoInner}>
            <div className={css.infoTitle}>1.{language[1]}</div>
            <div className={css.infoContent}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              euismod bibendum laoreet. Proin gravida dolor sit amet lacus
              accumsan et viverra justo commodo.
            </div>
            <div className={css.infoTitle}>2.{language[2]}</div>
            <div className={css.infoContent}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              euismod bibendum laoreet.
            </div>
          </div>
        </div>
        {/* 同意声明 */}
        <div
          className={css.agree}
          onClick={e => {
            e.stopPropagation()
            setIsAgree(isAgree === agree2 ? agree1 : agree2)
          }}
        >
          <img src={isAgree} alt="" className={css.agreeImg} />
          <span>{language[3]}</span>
        </div>
        {/* 邀请人 */}
        <div className={css.superior}>
          <div className={css.inviter}>{language[4]}</div>
          <textarea
            className={css.input}
            clos="20"
            rows="3"
            maxLength="100"
          ></textarea>
        </div>
        {/* 确定按钮 */}
        <div className={css.button} onClick={handleAgree}>
          {language[5]}
        </div>
      </div>
    </div>
  )
}

export default inject('lang')(observer(Register))
