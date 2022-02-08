import React from 'react'
import css from './index.module.less'
import close from '@assets/images/icon/close.png'
import { inject, observer } from 'mobx-react'
import classNames from 'classnames'
import { Toast } from 'antd-mobile'

function EnsurePledge(props) {
  const { lang, chain, boardroom } = props
  const { selectedLang } = lang
  const { needUSDTAmount } = boardroom
  const { toPledge } = boardroom
  const [language, setLanguage] = React.useState([])
  React.useEffect(() => {
    if (selectedLang.key === 'English') {
      setLanguage({
        sure: 'Are you sure to pledge?',
        MMR: 'MMR required for pledge',
        USDT: 'USDT required for pledge',
        cancel: 'cancel',
        ensure: 'ensure',
        fail: 'Transaction failure',
        success: 'trade successfully'
      })
    } else if (selectedLang.key === 'TraditionalChinese') {
      setLanguage({
        sure: '確定質押？',
        MMR: '質押需要的MMR',
        USDT: '質押需要的USDT',
        cancel: '取消',
        ensure: '確定',
        fail: '交易失敗',
        success: '交易成功'
      })
    } else if (selectedLang.key === 'SimplifiedChinese') {
      setLanguage({
        sure: '确定质押?',
        MMR: '质押需要的MMR',
        USDT: '质押需要的USDT',
        cancel: '取消',
        ensure: '确定',
        fail: '交易失败',
        success: '交易成功'
      })
    }
  }, [selectedLang.key])
  const closeWindow = React.useCallback(() => {
    props.closeDAOEnsurePledge()
  }, [props])
  // 确定质押
  const handleAgree = React.useCallback(
    async USDT => {
      // console.log('USDT------------>', USDT)
      try {
        const result = await toPledge(chain.address, USDT)
        if (result) {
          // console.log('result', result)
          Toast.success(language.success)
          closeWindow()
          boardroom.requestUpdateData()
          props.callback()
        }
      } catch (error) {
        Toast.fail(language.fail)
      }
    },
    [chain.address, language.fail, toPledge]
  )
  // 取消按钮
  const handleCancle = React.useCallback(() => {
    closeWindow()
  }, [closeWindow])
  return (
    <div
      className={css.ensurePledge}
      onClick={() => {
        closeWindow()
      }}
    >
      <div
        className={css.ensurePledgeBox}
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
        <div className={css.title}>{language.sure}</div>
        {/* 中间部分 */}
        <div className={css.center}>
          <div className={css.pledgeUSDT}>
            <div>{language.USDT}</div>
            <div>{props.USDT}&nbsp;USDT</div>
          </div>
          <div className={css.line}></div>
          <div className={css.pledgeMMR}>
            <div>{language.MMR}</div>
            <div>{props.MMR}&nbsp; MMR</div>
          </div>
        </div>
        {/* 按钮行 */}
        <div className={css.button}>
          <div className={css.cancleButton} onClick={handleCancle}>
            {language.cancel}
          </div>
          <div
            className={classNames(css.ensureButton)}
            onClick={() => {
              handleAgree(props.USDT)
            }}
          >
            {language.ensure}
          </div>
        </div>
      </div>
    </div>
  )
}

export default inject('lang', 'chain', 'boardroom')(observer(EnsurePledge))
