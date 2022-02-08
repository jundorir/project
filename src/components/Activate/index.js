import React, { useRef } from 'react'
import css from './index.module.less'
import close from '@assets/images/icon/close.png'
import agree1 from '@assets/images/icon/agree1.png'
import agree2 from '@assets/images/icon/agree2.png'
import { inject, observer } from 'mobx-react'
import { Toast } from 'antd-mobile'
import { getQueryString } from '@utils/common'
import loading from '@utils/loading'
import classNames from 'classnames'

function Activate(props) {
  const inputEle = useRef()
  const { lang, chain, server } = props
  const { selectedLang } = lang
  const { agreement } = server
  const [language, setLanguage] = React.useState([])
  const [word, setWord] = React.useState('')
  const [isAgree, setIsAgree] = React.useState(agree2)
  React.useEffect(() => {
    if (selectedLang.key === 'English') {
      setLanguage([
        'Registration Agreement',
        'user notice',
        'trading',
        'I agree',
        'Inviter',
        'Are you sure',
        'Binding failure',
        'Binding success',
        'Please agree to the statement first!',
        `Please enter the inviter's address`,
        `Inviter's address is not activated`,
        'Address wrong'
      ])
    } else if (selectedLang.key === 'TraditionalChinese') {
      setLanguage([
        '註冊協議',
        '用戶須知',
        '交易',
        '我已閱讀並同意以上聲明',
        '邀請人',
        '確定',
        '綁定失敗',
        '綁定成功',
        '請先同意聲明!',
        '請輸入邀請人地址',
        '邀請人地址未激活',
        '邀請人地址不存在'
      ])
    } else if (selectedLang.key === 'SimplifiedChinese') {
      setLanguage([
        '注册协议',
        '用户须知',
        '交易',
        '我已阅读并同意以上声明',
        '邀请人',
        '确定',
        '绑定失败',
        '绑定成功',
        '请先同意声明!',
        '请输入邀请人地址',
        '邀请人地址未激活',
        '邀请人地址不存在'
      ])
    }
  }, [selectedLang.key])
  const closeWindow = React.useCallback(() => {
    inputEle.current.value = ''
    props.closeActivate()
  }, [props])
  // 获取上级地址
  React.useEffect(() => {
    const sharer = getQueryString('sharer')
    if (!!sharer) chain.setSharer(sharer)
  }, [])
  //获取用户须知
  React.useEffect(() => {
    server.queryAgreement()
  }, [])
  // 确定按钮
  const handleAgree = React.useCallback(async () => {
    const content = inputEle.current.value.trim()
    try {
      const queryResult = await chain.queryParnetFunction(content)
      if (queryResult === '0x0000000000000000000000000000000000000000') {
        Toast.fail(`${language[10]}`)
      } else {
        try {
          const result = await chain.bindParnetFunction(content)
          if (result) {
            closeWindow()
            chain.queryBindParent()
            Toast.success(language[7])
          }
        } catch (error) {
          Toast.fail(language[6])
          loading.hidden()
        }
      }
    } catch (error) {
      Toast.fail(language[11])
      loading.hidden()
    }
  }, [chain, closeWindow, language])
  function renderAgreement() {
    if (selectedLang.key === 'English') {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: agreement.instructions_en }}
          className={css.content}
        ></div>
      )
    } else if (selectedLang.key === 'TraditionalChinese') {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: agreement.instructions_cnf }}
          className={css.content}
        ></div>
      )
    } else if (selectedLang.key === 'SimplifiedChinese') {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: agreement.instructions_cn }}
          className={css.content}
        ></div>
      )
    }
  }
  return (
    <div
      className={css.activeWindow}
      onClick={() => {
        closeWindow()
      }}
    >
      <div
        className={css.activeBox}
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
            <div className={css.infoTitle}>{language[1]}</div>
            <div className={css.infoContent}>{renderAgreement()}</div>
            {/* <div className={css.infoTitle}>2.{language[2]}</div>
            <div className={css.infoContent}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              euismod bibendum laoreet.
            </div> */}
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
            ref={inputEle}
            defaultValue={chain.sharer}
            disabled={
              chain.sharer && chain.address !== chain.sharer ? true : false
            }
          ></textarea>
        </div>
        {/* 确定按钮 */}
        <div
          className={classNames(css.button)}
          onClick={() => {
            if (
              isAgree === agree1 &&
              inputEle.current.value.trim().length > 0
            ) {
              handleAgree()
            } else if (isAgree === agree2) {
              Toast.info(`${language[8]}`)
            } else if (inputEle.current.value.trim().length === 0) {
              Toast.info(`${language[9]}`)
            }
          }}
        >
          {language[5]}
        </div>
      </div>
    </div>
  )
}

export default inject('lang', 'chain', 'server')(observer(Activate))
