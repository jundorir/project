import React, { Fragment, useRef } from 'react'
import css from './index.module.less'
import TopInfo from './TopInfo'
import { inject, observer } from 'mobx-react'
import classNames from 'classnames'
import ReauthorizationWindow from '@components/ReauthorizationWindow'
import TimeWindow from '@components/TimeWindow'
import EnsurePledge from '@components/EnsurePledge'
import { Toast } from 'antd-mobile'
import point from '@assets/images/icon/point.png'
import { checkFloatNumber } from '@utils/common'

function Pledge(props) {
  const { lang, chain } = props
  const { selectedLang } = lang
  const { toPledge, balance, isApprove } = chain
  const [language, setLanguage] = React.useState([])
  const intervalRef = useRef(null)
  // const [isApprove, setisApprove] = React.useState(false)
  const [inputNum, setinputNum] = React.useState(0)
  const [curChecked, setcurChecked] = React.useState(360)
  const [planId, setplanId] = React.useState(3)
  const [curMMR, setcurMMR] = React.useState('300')
  const [reauthorizationDisplay, setreauthorizationDisplay] =
    React.useState('none')
  const [WFIL_APPROVE_AMOUNT, setApprove] = React.useState(0)
  const [ensurePledgeDisplay, setensurePledgeDisplay] = React.useState('none')
  const [timeWindowDisplay, settimeWindowDisplay] = React.useState('-999')
  // 获取最大质押数
  const getMaxNum = React.useCallback(balance => {
    setinputNum(balance)
  }, [])
  // console.log('chain.isActive', chain.isActive)
  async function queryAllowanceAll() {
    const WFILAllowance = await chain.queryAllowanceAsync({
      type: 'AssignToken',
      symbol: 'WFIL'
    })
    setApprove(WFILAllowance)
  }
  React.useEffect(() => {
    if (chain.address) {
      queryAllowanceAll()
    }
  }, [chain.address])
  React.useEffect(() => {
    if (selectedLang.key === 'English') {
      setLanguage([
        'The pledge number',
        'WFIL balance',
        'description：',
        'impower',
        'pledge',
        'Please enter the pledged quantity',
        'pledge failure',
        'pledge success',
        'Pledge time',
        'days',
        `You will get ${curMMR}% MMR computing power`,
        'none'
      ])
    } else if (selectedLang.key === 'TraditionalChinese') {
      setLanguage([
        '質押數量',
        'WFIL余額',
        '說明：',
        '授權',
        '質押',
        '請輸入質押數量',
        '質押失敗',
        '質押成功',
        '質押時間',
        '天',
        `您将获取 ${curMMR}% MMR的算力`,
        '無'
      ])
    } else if (selectedLang.key === 'SimplifiedChinese') {
      setLanguage([
        '质押数量',
        'WFIL余额',
        '说明：',
        '授权',
        '质押',
        '请输入质押数量',
        '质押失败',
        '质押成功',
        '质押时间',
        '天',
        `您将获取 ${curMMR}% MMR的算力`,
        '无'
      ])
    }
  }, [curMMR, selectedLang.key])
  // 授权
  const toApprove = React.useCallback(async () => {
    let symbol = 'WFIL'
    let { status, approveAmount } = await chain.toApprove({
      type: 'AssignToken',
      symbol,
      from: 'pledge'
    })
    setApprove(approveAmount)
  }, [chain])
  // 质押
  async function swap(amount) {
    queryAllowanceAll()
    if (WFIL_APPROVE_AMOUNT >= amount) {
      setensurePledgeDisplay('unset')
    } else {
      setreauthorizationDisplay('unset')
    }
    // try {
    //   if (chain.impowerAmount >= amount) {
    //     const result = await toPledge(amount)
    //     if (result) {
    //       setinputNum('')
    //       Toast.success(`${language[7]}`)
    //       chain.requestChainData()
    //     }
    //   } else {
    //     setreauthorizationDisplay('unset')
    //   }
    // } catch (error) {
    //   Toast.fail(`${language[6]}`)
    // }
  }
  // 重新授权弹窗
  const closeReauthorizationWindow = React.useCallback(() => {
    setreauthorizationDisplay('none')
  }, [])
  //选择时间
  const chooseTime = React.useCallback(days => {
    setcurChecked(days)
    if (days === 30) {
      setcurMMR('100')
      setplanId(0)
    } else if (days === 60) {
      setcurMMR('150')
      setplanId(1)
    } else if (days === 180) {
      setcurMMR('200')
      setplanId(2)
    } else if (days === 360) {
      setcurMMR('300')
      setplanId(3)
    } else if (days === 0) {
      setcurMMR('20')
      setplanId(4)
    }
  }, [])
  // 关闭确定质押弹窗
  const closeEnsurePledgeWindow = React.useCallback(() => {
    setensurePledgeDisplay('none')
  }, [])
  //清空数据
  const callback = React.useCallback(() => {
    setinputNum('')
  }, [])
  // 选择时间弹窗
  const toChoose = React.useCallback(() => {
    settimeWindowDisplay('999')
  }, [])
  // 关闭时间弹窗
  const closeTimeWindow = React.useCallback(state => {
    setTimeout(() => {
      settimeWindowDisplay('-999')
    }, 200)

    // if (!!intervalRef.current) clearTimeout(intervalRef.current)
    // if (state) {
    //   settimeWindowDisplay('999')
    // } else {
    //   intervalRef.current = setTimeout(() => {
    //     settimeWindowDisplay('-999')
    //     clearTimeout(intervalRef.current)
    //   }, 1000)
    // }
  }, [])
  // console.log(
  //   '---------------------->',
  //   !chain.isActive,
  //   !WFIL_APPROVE_AMOUNT,
  //   inputNum === 0,
  //   !inputNum,
  //   !chain.isActive || !WFIL_APPROVE_AMOUNT || inputNum === 0 || !inputNum
  // )
  return (
    <Fragment>
      <div style={{ display: ensurePledgeDisplay }}>
        <EnsurePledge
          closeEnsurePledgeWindow={closeEnsurePledgeWindow}
          pledgeTime={curChecked}
          pledgeNum={inputNum}
          planId={planId}
          computed={curMMR}
          callback={callback}
        />
      </div>
      <div style={{ display: reauthorizationDisplay }}>
        <ReauthorizationWindow
          closeReauthorizationWindow={closeReauthorizationWindow}
        />
      </div>
      <div style={{ zIndex: timeWindowDisplay }}>
        <TimeWindow
          closeTimeWindow={closeTimeWindow}
          curChecked={curChecked}
          chooseTime={chooseTime}
          timeWindowDisplay={timeWindowDisplay}
        />
      </div>
      <div className={css.contain}>
        {/* 顶部信息 */}
        <div className={css.top}>
          <div className={css.inner}>
            <TopInfo curChecked={curChecked} />
          </div>
        </div>
        {/* 底部信息 */}
        <div className={css.bottom}>
          {/* 质押时间 */}
          <div className={css.bottomInner}>
            <div className={css.chooseTimeTitle}>
              <div>{language[8]}</div>
              <div onClick={toChoose}>
                <span className={css.curChecked}>
                  {curChecked ? curChecked : `${language[11]}`}
                  {curChecked ? `${language[9]}` : ''}
                </span>
                <span className={css.curCheckedspan}>
                  <img className={css.curCheckedImg} alt="" src={point} />
                </span>
              </div>
            </div>
            {/* <div className={css.chooseTimeCenter}>
              <div
                className={classNames(
                  css.chooseTimeButton,
                  curChecked === 30 && css.checked
                )}
                onClick={() => {
                  chooseTime(30)
                }}
              >
                30 {language[9]}
              </div>
              <div
                className={classNames(
                  css.chooseTimeButton,
                  curChecked === 60 && css.checked
                )}
                onClick={() => {
                  chooseTime(60)
                }}
              >
                60 {language[9]}
              </div>
              <div
                className={classNames(
                  css.chooseTimeButton,
                  curChecked === 180 && css.checked
                )}
                onClick={() => {
                  chooseTime(180)
                }}
              >
                180 {language[9]}
              </div>
              <div
                className={classNames(
                  css.chooseTimeButton,
                  curChecked === 360 && css.checked
                )}
                onClick={() => {
                  chooseTime(360)
                }}
              >
                360 {language[9]}
              </div>
            </div> */}
            <div className={css.chooseTimeInfo}>{language[10]}</div>
          </div>
          <div className={css.line}></div>
          {/* 质押数量 */}
          <div className={css.bottomInner}>
            <div className={css.number}>{language[0]}</div>
            <div className={css.box}>
              <div className={css.boxInner}>
                <div className={css.boxTop}>
                  <div className={css.boxTopNum}>
                    <input
                      value={inputNum}
                      type="number"
                      className={css.input}
                      onChange={e => {
                        if (e.target.value === '') {
                          setinputNum('')
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
                            setinputNum(number)
                          }
                        }
                      }}
                    />
                  </div>
                  <div
                    className={css.boxTopRight}
                    onClick={() => {
                      getMaxNum(balance)
                    }}
                  >
                    MAX
                  </div>
                </div>
                <div className={css.boxBottom}>
                  <div className={css.boxBottomBalance}>{language[1]}</div>
                  <div className={css.boxBottomNum}>
                    {balance}
                    <span className={css.balanceUnit}> WFIL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 底部按钮 */}
        <div className={css.bottomButton}>
          <div
            className={classNames(
              css.authorizationBTN,
              (inputNum <= 0 ||
                !chain.isActive ||
                chain.impowerAmount ||
                WFIL_APPROVE_AMOUNT) &&
                css.disabled
            )}
            onClick={e => {
              e.preventDefault()
              if (chain.isActive && !WFIL_APPROVE_AMOUNT) {
                toApprove()
              }
            }}
          >
            {language[3]}
          </div>
          <div
            className={classNames(
              css.pledgeBTN,
              (!chain.isActive ||
                !WFIL_APPROVE_AMOUNT ||
                inputNum <= 0 ||
                !inputNum) &&
                css.disabled
            )}
            onClick={e => {
              e.preventDefault()
              if (inputNum > 0 && WFIL_APPROVE_AMOUNT && chain.isActive) {
                swap(inputNum)
              } else if (!(inputNum > 0 && chain.isActive)) {
                Toast.info(`${language[5]}`)
              }
            }}
          >
            {language[4]}
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default inject('lang', 'chain')(observer(Pledge))
