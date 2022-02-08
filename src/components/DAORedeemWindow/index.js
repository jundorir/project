import React from 'react'
import css from './index.module.less'
import close from '@assets/images/icon/close.png'
import { inject, observer } from 'mobx-react'
import classNames from 'classnames'
import { Toast } from 'antd-mobile'
import { interception, checkFloatNumber } from '@utils/common'

function DAORedeemWindow(props) {
  const { lang, chain, hasPledged, boardroom } = props
  const { selectedLang } = lang
  const {
    MMRRedeemable,
    USDTRedeemable,
    USDThasPledged,
    MMRhasPledged,
    MMRForce,
    unclaimedIncome,
    totalIncome
  } = boardroom
  const [language, setLanguage] = React.useState({})
  const [inputNum, setInputNum] = React.useState('')
  React.useEffect(
    props => {
      if (selectedLang.key === 'English') {
        setLanguage({
          redemption: 'Redemption of the MMR',
          pledged: 'pledged',
          number: 'Redemption ratio',
          cancel: 'cancel',
          ensure: 'ensure',
          fail: 'Redemption of failure',
          success: 'Redemption of success',
          empty: 'Please enter the redemption number',
          MMRRedeemable: 'Residual callable MMR',
          USDTRedeemable: 'Residual callable USDT',
          MMRForce: 'Total force in MMR terms',
          totalRewards: 'Rewards that have been generated（MMR)',
          none: 'The MMR is not redeemable at this time',
          note: 'Subject to confirmation of on-chain transaction',
          word1: `1、50% of the value of the board's static award MMR will be deducted upon redemption`,
          word2: '2、Permanent board member after doubling principal return',
          word3: '3、MMR deducts 5/6 MMR of 50% of the static yield',
          word4:
            '4、USDT is priced at the price at the time of pledge minus 1/6 of 50% of the static output',
          word5:
            '5、The actual amount received at redemption is based on the output generated when the on-chain transaction is packaged'
        })
      } else if (selectedLang.key === 'TraditionalChinese') {
        setLanguage({
          redemption: '贖回MMR',
          pledged: '已质押',
          number: '贖回比例',
          cancel: '取消',
          ensure: '確定',
          fail: '贖回失敗',
          success: '贖回成功',
          empty: '請輸入贖回數量',
          MMRRedeemable: '可贖回的MMR',
          USDTRedeemable: '可贖回的USDT',
          MMRForce: '以MMR計價的總算力',
          totalRewards: '已產生的靜態獎勵（MMR)',
          none: '暫無可贖回MMR',
          note: '實際贖回數量以鏈上交易確認時為準',
          word1: '1、贖回時會扣掉董事會靜態獎勵MMR價值的50%',
          word2: '2、即二倍本金收益後為永久董事會成員',
          word3: '3、MMR扣除靜態產量的50%的5/6的MMR',
          word4: '4、USDT按質押時價格計價扣除靜態產量的50%的1/6的USDT',
          word5: '5、贖回時實際獲得的數量以鏈上交易打包時的產出為準'
        })
      } else if (selectedLang.key === 'SimplifiedChinese') {
        setLanguage({
          redemption: '赎回MMR',
          pledged: '已质押',
          number: '赎回比例',
          cancel: '取消',
          ensure: '确定',
          fail: '赎回失败',
          success: '赎回成功',
          empty: '请输入赎回数量',
          MMRRedeemable: '可赎回MMR',
          USDTRedeemable: '可赎回USDT',
          MMRForce: 'MMR本金',
          totalRewards: '已产生的静态奖励（MMR)',
          none: '暂无可赎回MMR',
          note: '实际赎回数量以链上交易确认时为准',
          word1: '1、赎回时会扣掉董事会静态奖励MMR价值的50%',
          word2: '2、即二倍本金收益后为永久董事会成员',
          word3: '3、MMR扣除静态产量的50%的5/6的MMR',
          word4: '4、USDT按质押时价格计价扣除静态产量的50%的1/6的USDT',
          word5: '5、赎回时实际获得的数量以链上交易打包时的产出为准'
        })
      }
    },
    [selectedLang.key]
  )
  const closeWindow = React.useCallback(() => {
    props.closeDAORedeemWindow()
    setInputNum('')
  }, [props])
  //获取董事会当前用户可赎回MMR,已质押的MMR
  React.useEffect(() => {
    if (chain.address) {
      boardroom.getMMRHasPledged()
      boardroom.getMMRRedeemable()
    }
  }, [chain.address])
  // 确定取回
  const handleAgree = React.useCallback(
    async num => {
      if (chain.address) {
        try {
          const result = await boardroom.DAORedeem(chain.address, num)
          if (result) {
            closeWindow()
            Toast.success(language.success)
            setInputNum('')
            boardroom.getbackRrfesh()
          }
        } catch (error) {
          Toast.fail(language.fail)
        }
      }
    },
    [chain.address, language]
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
        <div className={css.title}>{language.redemption}</div>
        {/* 中间部分 */}
        <div className={css.center}>
          {/* 已质押USDT/MMR */}
          <div className={css.hasPledged}>
            <div className={css.hasPledgedUSDT}>
              <div>{language.pledged} USDT </div>
              <div>{USDThasPledged} </div>
            </div>
            <div className={css.hasPledgedMMR}>
              <div>{language.pledged} MMR </div>
              <div>{MMRhasPledged} </div>
            </div>
          </div>
          {/* 以MMR计价的总算力 */}
          {/* <div className={css.MMRForce}>{language.MMRForce} </div>
          <div className={css.pledgedShow}>
            <span className={css.pledgedShowNum}>{MMRForce}</span>
          </div> */}
          {/* 已产生的奖励 */}
          <div className={css.totalRewards}>{language.totalRewards} </div>
          <div className={css.pledgedShow}>
            <span className={css.pledgedShowNum}>
              {interception(unclaimedIncome + totalIncome, 4)}
            </span>
          </div>
          {/* 剩余可赎回的MMR */}
          {/* <div className={css.MMRRedeemable}>{language.MMRRedeemable} </div>
          <div className={css.MMRRedeemableShow}>
            <span className={css.MMRRedeemableShowNum}>
              {interception(MMRRedeemable)}
            </span>
          </div> */}
          {/* 可赎回的USDT */}
          {/* <div className={css.MMRRedeemable}>{language.USDTRedeemable} </div>
          <div className={css.MMRRedeemableShow}>
            <span className={css.MMRRedeemableShowNum}>
              {interception(USDTRedeemable)}
            </span>
          </div> */}
          {/* 备注 */}
          <div className={css.note}>{language.word1}</div>
          <div className={css.note}>{language.word2}</div>
          <div className={css.note}>{language.word3}</div>
          <div className={css.note}>{language.word4}</div>
          <div className={css.note}>{language.word5}</div>
          {/* 赎回数量 */}
          <div className={css.getscale}>{language.number}</div>
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
            {language.cancel}
          </div>
          <div
            className={classNames(
              css.ensureButton,
              (inputNum <= 0 || MMRRedeemable <= 0) && css.disabled
            )}
            onClick={() => {
              if (inputNum > 0 && MMRRedeemable > 0) {
                handleAgree(inputNum)
              } else if (MMRRedeemable <= 0) {
                Toast.info(language.none)
              } else {
                Toast.info(language.empty)
              }
            }}
          >
            {language.ensure}
          </div>
        </div>
      </div>
    </div>
  )
}

export default inject(
  'lang',
  'chain',
  'pledgeList',
  'boardroom'
)(observer(DAORedeemWindow))
