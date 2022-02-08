import React from 'react'
import css from './index.module.less'
import close from '@assets/images/icon/close.png'
import { inject, observer } from 'mobx-react'
import classNames from 'classnames'
import { Toast } from 'antd-mobile'
import { useHistory } from 'react-router-dom'
import { interception,checkFloatNumber } from '@utils/common'

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
        setLanguage({
          retrieve: '取回',
          pledged: '已质押',
          redemptionRatio: '赎回比例',
          ensure: '确定',
          fail: '提取失败',
          success: '取回成功'
        })
      } else if (selectedLang.key === 'TraditionalChinese') {
        setLanguage({
          retrieve: '取回',
          pledged: '已质押',
          redemptionRatio: '赎回比例',
          ensure: '确定',
          fail: '提取失败',
          success: '取回成功'
        })
      } else if (selectedLang.key === 'SimplifiedChinese') {
        setLanguage({
          retrieve: '赎回',
          pledged: '已质押',
          redemptionRatio: '赎回比例',
          ensure: '确定',
          fail: '赎回失败',
          success: '赎回成功'
        })
      }
    },
    [myDeposit, selectedLang.key]
  )
  const closeWindow = React.useCallback(() => {
    props.closeForceMiningGetbackWindow()
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
        <div className={css.title}>{language.retrieve}</div>
        {/* 中间部分 */}
        <div className={css.center}>
          <div className={css.hasPledged}>{language.pledged}</div>
          <div className={css.line}></div>
          <div className={css.hasPledgedT}>
            <div className={css.left}>1.</div>
            <div className={css.right}>1T</div>
          </div>
          <div className={css.line}></div>
          <div className={css.hasPledgedF}>
            <div className={css.left}>2.</div>
            <div className={css.right}>10.22WFIL</div>
          </div>
          <div className={css.line}></div>
          <div className={css.redemptionRatio}>{language.redemptionRatio}</div>
          <div className={css.inputbox}>
            <input
              className={css.input}
              value={inputNum}
              type="number"
              onChange={e => {
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
                    if(number.length > 1 && number.includes('.')){
                      number = number.substring(0,number.length-2)
                      number = number<=100?number:100
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
          <div className={css.button}>{language.ensure}</div>
        </div>
      </div>
    </div>
  )
}

export default inject('lang', 'chain', 'pledgeList')(observer(GetbackWindow))
