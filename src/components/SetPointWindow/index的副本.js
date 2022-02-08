import React, { useEffect } from 'react'
import css from './index.module.less'
import close from '@assets/images/icon/close.png'
import mark from '@assets/images/icon/mark.png'
import { inject, observer } from 'mobx-react'
import classNames from 'classnames'
import { Toast } from 'antd-mobile'
import { useHistory } from 'react-router-dom'
import { checkFloatNumber } from '@utils/common'

function SetPointWindow(props) {
  const history = useHistory()
  const { lang, chain, pledgeList } = props
  const { selectedLang } = lang
  const { myDeposit } = chain
  const [language, setLanguage] = React.useState({})
  const [inputNum, setInputNum] = React.useState('')
  const [speed, setSpeed] = React.useState('timely')
  const [allowanceOne, setAllowanceOne] = React.useState('')
  const [allowanceTwo, setAllowanceTwo] = React.useState('')
  const [allowanceThree, setAllowanceThree] = React.useState('')
  const [expertMode, setExpertMode] = React.useState(false)
  const [forbidden, setForbidden] = React.useState(true)
  const [tone, setTone] = React.useState(true)
  let balance = 100
  React.useEffect(
    props => {
      if (selectedLang.key === 'English') {
        setLanguage({
          setting: 'Setting',
          global: 'global',
          speed: 'Default transaction speed (GWEI)',
          normal: 'normal(5)',
          fast: 'fast(6)',
          timely: 'timely(7)',
          exchange: 'Exchange and mobility',
          tolerance: 'Slip point tolerance',
          instructions: 'Your transaction may fail',
          closingTime: 'Closing time (minutes)',
          expertMode: 'expert mode',
          forbidden: 'Disable multi hop',
          tone: 'Light prompt tone'
        })
      } else if (selectedLang.key === 'TraditionalChinese') {
        setLanguage({
          setting: '設置',
          global: '全局',
          speed: '默認交易速度（GWEI）',
          normal: '标准(5)',
          fast: '快速(6)',
          timely: '及时(7)',
          exchange: '交換和流動性',
          tolerance: '滑點容差',
          instructions: '您的交易可能會失敗',
          closingTime: '交易截止時間(分鐘)',
          expertMode: '專家模式',
          forbidden: '禁用多跳',
          tone: '輕快提示音'
        })
      } else if (selectedLang.key === 'SimplifiedChinese') {
        setLanguage({
          setting: '设置',
          global: '全局',
          speed: '默认交易速度（GWEI）',
          normal: '标准(5)',
          fast: '快速(6)',
          timely: '及时(7)',
          exchange: '交换和流动性',
          tolerance: '滑点容差',
          instructions: '您的交易可能会失败',
          closingTime: '交易截止时间(分钟)',
          expertMode: '专家模式',
          forbidden: '禁用多跳',
          tone: '轻快提示音'
        })
      }
    },
    [myDeposit, selectedLang.key]
  )
  const closeWindow = React.useCallback(() => {
    props.closeSetPointWindow()
  }, [props])

  // 选择速度
  function checkSpeed(value) {
    setSpeed(value)
  }
  //选择容差
  function chooseOne(value) {
    setAllowanceOne('')
    setAllowanceTwo('')
    setAllowanceThree('')
    if (allowanceOne) {
      setAllowanceOne('')
      setInputNum('')
    } else {
      setAllowanceOne(value)
      setInputNum(value)
    }
  }
  function chooseTwo(value) {
    setAllowanceOne('')
    setAllowanceTwo('')
    setAllowanceThree('')
    if (allowanceTwo) {
      setAllowanceTwo('')
      setInputNum('')
    } else {
      setAllowanceTwo(value)
      setInputNum(value)
    }
  }
  function chooseThree(value) {
    setAllowanceOne('')
    setAllowanceTwo('')
    setAllowanceThree('')
    if (allowanceThree) {
      setAllowanceThree('')
      setInputNum('')
    } else {
      setAllowanceThree(value)
      setInputNum(value)
    }
  }
  //监听容差输入框
  useEffect(() => {
    const num = inputNum - 0
    if (num === 0.1) {
      setAllowanceOne('0.1')
    } else {
      setAllowanceOne()
    }
    if (num === 0.5) {
      setAllowanceTwo('0.5')
    } else {
      setAllowanceTwo()
    }
    if (num === 1) {
      setAllowanceThree('1.0')
    } else {
      setAllowanceThree()
    }
  }, [inputNum])
  //点击打开按钮
  function changeButton(data) {
    if (data === 'expertMode') {
      setExpertMode(!expertMode)
    } else if (data === 'forbidden') {
      setForbidden(!forbidden)
    } else if (data === 'tone') {
      setTone(!tone)
    }
  }
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
        <div className={css.title}>{language.setting}</div>
        {/* 中间部分 */}
        <div className={css.center}>
          <div className={css.global}>{language.global} </div>
          <div className={css.line}> </div>
          <div className={css.speed}>{language.speed} </div>
          <div className={css.speedChoose}>
            <div
              className={classNames(
                css.normal,
                speed === 'normal' && css.speedChecked
              )}
              onClick={() => {
                checkSpeed('normal')
              }}
            >
              {language.normal}
            </div>
            <div
              className={classNames(
                css.fast,
                speed === 'fast' && css.speedChecked
              )}
              onClick={() => {
                checkSpeed('fast')
              }}
            >
              {language.fast}
            </div>
            <div
              className={classNames(
                css.timely,
                speed === 'timely' && css.speedChecked
              )}
              onClick={() => {
                checkSpeed('timely')
              }}
            >
              {language.timely}
            </div>
          </div>
          <div className={css.exchange}>{language.exchange}</div>
          <div className={css.line}> </div>
          <div className={css.tolerance}>
            {language.tolerance}
            <img src={mark} alt="" className={css.mark} />
          </div>
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
                    if (number - balance > 0) {
                      number = balance
                    }
                    if (number.length > 1 && number.startsWith('0')) {
                      number = number.replace(/^[0]+/, '')
                      if (number === '') number = '0'
                      if (number.startsWith('.')) number = '0' + number
                    }
                    setInputNum(number)
                  }
                }
              }}
            />
            <div className={css.percent}>%</div>
          </div>
          <div className={css.checkAllowance}>
            <div
              className={classNames(
                css.options,
                allowanceOne === '0.1' && css.checkoptions
              )}
              onClick={() => {
                chooseOne('0.1')
              }}
            >
              0.1%
            </div>
            <div
              className={classNames(
                css.options,
                allowanceTwo === '0.5' && css.checkoptions
              )}
              onClick={() => {
                chooseTwo('0.5')
              }}
            >
              0.5%
            </div>
            <div
              className={classNames(
                css.options,
                allowanceThree === '1.0' && css.checkoptions
              )}
              onClick={() => {
                chooseThree('1.0')
              }}
            >
              1.0%
            </div>
          </div>
          <div className={css.instructions}>{language.instructions}</div>
          <div className={css.closingTime}>
            <div className={css.closingTimeL}>
              {language.closingTime}
              <img src={mark} alt="" className={css.mark} />
            </div>
            <div className={css.closingTimeR}>20</div>
          </div>
          <div className={css.expertMode}>
            <div className={css.expertModeL}>
              {language.expertMode}
              <img src={mark} alt="" className={css.mark} />
            </div>
            <div
              className={css.expertModeR}
              onClick={() => {
                changeButton('expertMode')
              }}
            >
              <div
                className={classNames(
                  css.expertModeRInner,
                  expertMode && css.open
                )}
              ></div>
            </div>
          </div>
          <div className={css.forbidden}>
            <div className={css.forbiddenL}>
              {language.forbidden}
              <img src={mark} alt="" className={css.mark} />
            </div>
            <div
              className={css.forbiddenR}
              onClick={() => {
                changeButton('forbidden')
              }}
            >
              <div
                className={classNames(
                  css.forbiddenRInner,
                  forbidden && css.open
                )}
              ></div>
            </div>
          </div>
          <div className={css.tone}>
            <div className={css.toneL}>
              {language.tone}
              <img src={mark} alt="" className={css.mark} />
            </div>
            <div
              className={css.toneR}
              onClick={() => {
                changeButton('tone')
              }}
            >
              <div
                className={classNames(css.toneRInner, tone && css.open)}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default inject('lang', 'chain', 'pledgeList')(observer(SetPointWindow))
