import React, { Fragment } from 'react'
import css from './index.module.less'
import { inject, observer } from 'mobx-react'
import DAOEnsurePledge from '@components/DAOEnsurePledge'
import { checkFloatNumber, interception } from '@utils/common'
import chain from '../../../store/chain'
import { Toast } from 'antd-mobile'
import DAOPledgeAuthorizationWindow from '@components/DAOPledgeAuthorizationWindow'

function Details(props) {
  const { lang, boardroom, server } = props
  const { selectedLang } = lang
  const { tvl_director, apr_director } = server
  const { needMMRAmount } = boardroom
  const [language, setLanguage] = React.useState([])
  const [pledgeDisplay, setPledgeDisplay] = React.useState('none')
  const [inputNum, setInputNum] = React.useState(0)
  const [MMR_APPROVE_AMOUNT, setMMRApprove] = React.useState(0)
  const [USDT_APPROVE_AMOUNT, setUSDTApprove] = React.useState(0)
  const [authorizationDisplay, setAuthorizationDisplay] = React.useState('none')

  async function queryAllowanceAll() {
    const MMRAllowance = await chain.queryAllowanceAsync({
      type: 'Board',
      symbol: 'MMR'
    })
    const USDTAllowance = await chain.queryAllowanceAsync({
      type: 'Board',
      symbol: 'USDT'
    })
    setMMRApprove(MMRAllowance)
    setUSDTApprove(USDTAllowance)
  }
  React.useEffect(() => {
    if (selectedLang.key === 'English') {
      setLanguage({
        boardroom: 'boardroom',
        gain: 'gain',
        amount: 'pledge amount (USDT)',
        balance: 'balance',
        need: 'need',
        pledge: 'pledge',
        description: 'Description: ',
        proportion: 'Proportion of board pledge 80% of the MMR',
        proportion2: '20% of the MMR',
        error: 'Please enter the amount of pledge',
        noBalance: 'The MMR balance is insufficient'
      })
    } else if (selectedLang.key === 'TraditionalChinese') {
      setLanguage({
        boardroom: '董事会',
        gain: '收獲',
        amount: '質押量(USDT)',
        balance: '余額',
        need: '需要',
        pledge: '質押',
        description: '說明：',
        proportion: '董事會質押比例80%的MMR',
        proportion2: '20%的USDT',
        error: '請輸入質押數量',
        noBalance: 'MMR余額不足'
      })
    } else if (selectedLang.key === 'SimplifiedChinese') {
      setLanguage({
        boardroom: '董事会',
        gain: '收获',
        amount: '质押量(USDT)',
        balance: '余额',
        need: '需要',
        pledge: '质押',
        description: '说明：',
        proportion: '董事会质押比例80%的MMR',
        proportion2: '20%的USDT',
        error: '请输入质押数量',
        noBalance: 'MMR余额不足'
      })
    }
  }, [selectedLang.key])
  const closeDAOEnsurePledge = React.useCallback(() => {
    setPledgeDisplay('none')
  }, [])
  function handlePledge(USDTAmount, MMRAmount) {
    queryAllowanceAll()
    if (MMR_APPROVE_AMOUNT >= MMRAmount && USDT_APPROVE_AMOUNT >= USDTAmount) {
      setPledgeDisplay('unset')
    } else {
      setAuthorizationDisplay('unset')
    }
  }

  React.useEffect(() => {
    if (chain.address) {
      // boardroom.getEthBalanceAsync()
      boardroom.getBalanceAsync()
    }
  }, [chain.address])
  //重新进入页面不需要再次授权
  React.useEffect(() => {
    if (chain.address) {
      queryAllowanceAll()
    }
  }, [chain.address])
  // 关闭授权弹窗
  const closeAuthorizationWindow = React.useCallback(() => {
    setAuthorizationDisplay('none')
  }, [])
  //监听inputNum的变化
  React.useEffect(() => {
    if (inputNum > 0) {
      boardroom.getNeedUSDT(inputNum)
    } else {
      boardroom.init()
    }
  }, [inputNum])
  // 质押成功后清除输入框
  function clearInput() {
    setInputNum(0)
  }
  return (
    <Fragment>
      <div style={{ display: pledgeDisplay }}>
        <DAOEnsurePledge
          closeDAOEnsurePledge={closeDAOEnsurePledge}
          USDT={inputNum}
          MMR={needMMRAmount}
          callback={clearInput}
        />
      </div>
      <div style={{ display: authorizationDisplay }}>
        <DAOPledgeAuthorizationWindow
          closeAuthorizationWindow={closeAuthorizationWindow}
          MMRApprove={MMR_APPROVE_AMOUNT >= needMMRAmount}
          USDTApprove={USDT_APPROVE_AMOUNT >= inputNum}
          updateData={queryAllowanceAll}
        />
      </div>
      <div className={css.contain}>
        <div className={css.top}>
          <div className={css.topInner}>
            <div className={css.boardroom}>
              <div className={css.boardroomL}>{language.boardroom}</div>
              <div className={css.boardroomR}>{language.gain} MMR</div>
            </div>
            <div className={css.line}></div>
            <div className={css.APR}>
              <div className={css.left}>APR</div>
              <div className={css.right}>{interception(apr_director)}%</div>
            </div>
            <div className={css.line}></div>
            <div className={css.TVL}>
              <div className={css.left}>TVL</div>
              <div className={css.right}>{interception(tvl_director)}</div>
            </div>
          </div>
        </div>
        <div className={css.buttom}>
          <div className={css.buttomInner}>
            <div className={css.title}>{language.amount}</div>
            <div className={css.inputBox}>
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
                      if (number - boardroom.USDTBalance > 0) {
                        number = boardroom.USDTBalance
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
                  setInputNum(interception(boardroom.USDTBalance, 4))
                }}
              >
                MAX
              </div>
            </div>
            <div className={css.balace}>
              USDT {language.balance}：
              <span className={css.balaceNum}>
                {interception(boardroom.USDTBalance)}
              </span>
            </div>
            <div className={css.info}>
              <div className={css.infoInner}>
                <div className={css.infoLine}>
                  <div className={css.infoLeft}>{language.need} MMR：</div>
                  <div className={css.infoRight}>
                    {interception(needMMRAmount)} MMR
                  </div>
                </div>
                <div className={css.infoLine}>
                  <div className={css.infoLeft}>MMR {language.balance}：</div>
                  <div className={css.infoRight}>
                    {interception(boardroom.MMRBalance)} MMR
                  </div>
                </div>
              </div>
            </div>
            <div
              className={css.button}
              onClick={() => {
                if (inputNum > 0 && needMMRAmount <= boardroom.MMRBalance) {
                  handlePledge(inputNum, needMMRAmount)
                } else if (needMMRAmount > boardroom.MMRBalance) {
                  // console.log(needMMRAmount, boardroom.MMRBalance)
                  Toast.info(language.noBalance)
                } else {
                  Toast.info(language.error)
                }
              }}
            >
              {language.pledge}
            </div>
            {/* <div className={css.instructions}>
              <div>{language.description}</div>
              <div>
                <div>{language.proportion}</div>
                <div>{language.proportion2}</div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default inject('lang', 'boardroom', 'server')(observer(Details))
