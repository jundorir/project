import React from 'react'
import css from './index.module.less'
import close from '@assets/images/icon/close.png'
import { inject, observer } from 'mobx-react'
import classNames from 'classnames'
import { Toast } from 'antd-mobile'
import { checkFloatNumber } from '@utils/common'

function BuyLotteryWindow(props) {
  const { lang, chain, mobility } = props
  const { selectedLang } = lang
  const [language, setLanguage] = React.useState({})
  const [inputNum, setInputNum] = React.useState('')
  let balance = mobility.quiteLPAmount

  React.useEffect(
    props => {
      const globalLanguage = {
        English: {
          title: 'pledge',
          balance: 'balance',
          buy: 'buy',
          empty: 'Please enter the quantity'
        },
        TraditionalChinese: {
          title: '質押',
          balance: '余額',
          buy: '購買',
          empty: '請輸入數量'
        },
        SimplifiedChinese: {
          title: '质押',
          balance: '余额',
          buy: '购买',
          empty: '请输入数量'
        }
      }
      setLanguage(globalLanguage[selectedLang.key])
    },
    [selectedLang.key]
  )

  const closeWindow = React.useCallback(() => {
    props.closeForceMiningPledgeWindow()
  }, [props])

  function handleClick() {
    // console.log('点击启用')
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
        <div className={css.title}>{language.title}</div>
        {/* 中间部分 */}
        <div className={css.center}>
          <div className={css.inputbox}>
            <div className={css.inputboxInner}>
              <div className={css.inputboxInnerT}>
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
                <div
                  className={css.max}
                  onClick={() => {
                    setInputNum(balance)
                  }}
                >
                  MAX
                </div>
              </div>
              <div className={css.divider}></div>
              <div className={css.inputboxInnerB}>
                <div className={css.balance}>T {language.balance}：</div>
                <div className={css.balanceNum}>{balance}</div>
              </div>
            </div>
          </div>
          <div className={css.center}>
            <div className={css.addIMG}></div>
          </div>
          <div className={css.inputbox}>
            <div className={css.inputboxInner}>
              <div className={css.inputboxInnerT}>
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
                <div
                  className={css.max}
                  onClick={() => {
                    setInputNum(balance)
                  }}
                >
                  MAX
                </div>
              </div>
              <div className={css.divider}></div>
              <div className={css.inputboxInnerB}>
                <div className={css.balance}>FIL {language.balance}：</div>
                <div className={css.balanceNum}>{balance}</div>
              </div>
            </div>
          </div>
          {/* 启用按钮 */}
          <div
            className={css.buy}
            onClick={() => {
              if (inputNum > 0) {
                handleClick()
              } else if (inputNum <= 0) {
                Toast.info(language.empty)
              }
            }}
          >
            {language.buy}
          </div>
        </div>
      </div>
    </div>
  )
}

export default inject('lang', 'chain', 'mobility')(observer(BuyLotteryWindow))
