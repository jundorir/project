import React from 'react'
import css from './index.module.less'
import close from '@assets/images/icon/close.png'
import { inject, observer } from 'mobx-react'
import classNames from 'classnames'
import { Toast } from 'antd-mobile'
import { useHistory } from 'react-router-dom'
import { interception, checkFloatNumber } from '@utils/common'

function GetbackWindow(props) {
  const history = useHistory()
  const { lang, chain, pledgeList } = props
  const { selectedLang } = lang
  const { myDeposit } = chain
  const [language, setLanguage] = React.useState([])
  const [inputNum, setInputNum] = React.useState('')
  React.useEffect(
    props => {
      if (selectedLang.key === 'English') {
        setLanguage([
          'retrieve',
          'pledged',
          'hashrate',
          'The number of fetches',
          `Note: Early redemption will be charged 20% commission.`,
          'cancel',
          'ensure',
          'Extraction of failure',
          'successful'
        ])
      } else if (selectedLang.key === 'TraditionalChinese') {
        setLanguage([
          '取回',
          '已质押',
          '總算力',
          '取回數量',
          `說明：提前贖回會收取20%手續費。`,
          '取消',
          '確定',
          '提取失敗',
          '取回成功'
        ])
      } else if (selectedLang.key === 'SimplifiedChinese') {
        setLanguage([
          '取回',
          '已质押',
          '总算力',
          '取回数量',
          `说明：提前赎回会收取20%手续费。`,
          '取消',
          '确定',
          '提取失败',
          '取回成功'
        ])
      }
    },
    [myDeposit, selectedLang.key]
  )
  const closeWindow = React.useCallback(() => {
    props.closeGetbackWindow()
  }, [props])
  // 确定取回
  const handleAgree = React.useCallback(
    async num => {
      if (num > 0) {
        try {
          const result = await chain.withDraw(num, props.mid)
          if (result) {
            closeWindow()
            Toast.success(`${language[8]}`, 1, () => {
              history.push('/mining')
            })
            setInputNum('')
            chain.requestChainData()
            // setTimeout(() => {
            //   pledgeList.requestFresh()
            // }, 2500)
          }
        } catch (error) {
          Toast.fail(`${language[7]}`)
        }
      }
    },
    [chain, closeWindow, language, pledgeList, props.mid]
  )
  // 取消按钮
  const handleCancle = React.useCallback(() => {
    closeWindow()
  }, [closeWindow])
  return (
    <div
      className={css.getbackWindow}
      onClick={() => {
        closeWindow()
      }}
    >
      <div
        className={css.getbackBox}
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
        {/* 中间部分 */}
        <div className={css.center}>
          <div className={css.hasPledged}>{language[1]}</div>
          <div className={css.pledgedShow}>
            <span className={css.pledgedShowNum}>
              {interception(props.wfil, 4)}
            </span>
            <span className={css.pledgedShowUnit}>WFIL</span>
          </div>
          <div className={css.hashrate}>
            {language[2]}：{interception(props.wfil, 4)}
          </div>
          <div className={css.getscale}>{language[3]}</div>
          <div className={css.inputbox}>
            <input
              className={css.input}
              value={inputNum}
              type="number"
              onChange={e => {
                // setInputNum(e.target.value)
                // if (e.target.value < 0) {
                //   setInputNum(1)
                // } else if (e.target.value > 100) {
                //   setInputNum(100)
                // }
                if (e.target.value === '') {
                  setInputNum('')
                } else {
                  if (checkFloatNumber(e.target.value)) {
                    let number = e.target.value
                    if (number - 100 > 0) {
                      number = 100
                    }
                    if (number.length > 1 && number.startsWith('0')) {
                      number = number.replace(/^[0]+/, '')
                      if (number === '') number = '0'
                      if (number.startsWith('.')) number = '0' + number
                    }
                    if (number.length > 1 && number.includes('.')) {
                      number = number.substring(0, number.length - 2)
                      number = number <= 100 ? number : 100
                    }
                    setInputNum(number)
                  }
                }
              }}
            />
            <div className={css.percent}>%</div>
            <div
              className={css.max}
              onClick={() => {
                setInputNum(100)
              }}
            >
              MAX
            </div>
          </div>
          <div className={css.instructions}>{language[4]}</div>
        </div>
        {/* 按钮行 */}
        <div className={css.button}>
          <div className={css.cancleButton} onClick={handleCancle}>
            {language[5]}
          </div>
          <div
            className={classNames(
              css.ensureButton,
              inputNum <= 0 && css.disabled
            )}
            onClick={() => {
              handleAgree(inputNum)
            }}
          >
            {language[6]}
          </div>
        </div>
      </div>
    </div>
  )
}

export default inject('lang', 'chain', 'pledgeList')(observer(GetbackWindow))
