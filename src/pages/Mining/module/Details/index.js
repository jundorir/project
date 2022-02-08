import React, { Fragment, useCallback } from 'react'
import css from './index.module.less'
import { Tabs, WhiteSpace, Badge, Toast } from 'antd-mobile'
import { useHistory } from 'react-router-dom'
import TopInfo from './TopInfo'
import GetbackWindow from '@components/GetbackWindow'
import NopledgeWindow from '@components/NopledgeWindow'
import { inject, observer } from 'mobx-react'
import Nonthing from '@assets/images/icon/nothing.svg'
import toright from '@assets/images/icon/toright.png'
import classNames from 'classnames'

function Details(props) {
  const history = useHistory()
  const { lang, chain } = props
  const { selectedLang } = lang
  const { myDeposit, myMMRDeposit } = chain
  const [language, setLanguage] = React.useState([])
  const [getbackDisplay, setGetbackDisplay] = React.useState('none')
  const [nopledgeWindow, setNopledgeWindow] = React.useState('none')
  const closeGetbackWindow = useCallback(() => {
    setGetbackDisplay('none')
  }, [])
  const closeNopledgeWindow = useCallback(() => {
    setNopledgeWindow('none')
  }, [])
  React.useEffect(() => {
    if (selectedLang.key === 'English') {
      setLanguage([
        'single currency',
        'mining',
        'pledged',
        'WFIL hash rate',
        'withdraw',
        'pledge',
        'Coming Soon',
        'details',
        'MMR hash rate',
        'Please bind the inviter to activate the account first'
      ])
    } else if (selectedLang.key === 'TraditionalChinese') {
      setLanguage([
        '單幣',
        '算力挖礦',
        '我的質押',
        '質押獲得的WFIL算力',
        '取回',
        '質押',
        '敬請期待',
        '明細',
        '質押獲得的MMR算力',
        '請先綁定邀請人激活賬號'
      ])
    } else if (selectedLang.key === 'SimplifiedChinese') {
      setLanguage([
        '单币',
        '算力挖矿',
        '我的质押',
        '质押获得的WFIL算力',
        '取回',
        '质押',
        '敬请期待',
        '明细',
        '质押获得的MMR算力',
        '请先绑定邀请人激活账号'
      ])
    }
  }, [selectedLang.key])
  const tabs = [
    { title: <Badge>{language[0]}</Badge> },
    { title: <Badge>{language[1]}</Badge> }
  ]

  const handleclick = () => {
    if (chain.address && chain.isActive) {
      history.push('/pledge')
    } else if (!chain.isActive) {
      Toast.fail(`${language[9]}`)
    }
  }
  // const getback = React.useCallback(() => {
  //   console.log(myDeposit)
  //   if (myDeposit > 0) {
  //     setGetbackDisplay('unset')
  //   } else if (myDeposit === '0') {
  //     setNopledgeWindow('unset')
  //   }
  // }, [myDeposit])
  const toDetails = React.useCallback(() => {
    history.push(`/pledgeDetail/:${chain.address}`)
  }, [chain.address, history])
  function firstInner() {
    return (
      <Fragment>
        <div style={{ display: getbackDisplay }}>
          <GetbackWindow closeGetbackWindow={closeGetbackWindow} />
        </div>
        <div style={{ display: nopledgeWindow }}>
          <NopledgeWindow closeNopledgeWindow={closeNopledgeWindow} />
        </div>
        <div className={css.firstInner}>
          {/* 顶部信息 */}
          <div className={css.top}>
            <TopInfo />
          </div>
          {/* 中间部分 */}
          <div className={css.middle}>
            <div className={css.middleinner}>
              <div className={css.left}>
                <div className={css.title}>
                  <div className={css.titleleft}>{language[2]}</div>
                  <div
                    className={css.right}
                    onClick={e => {
                      e.preventDefault()
                      // getback()
                      toDetails()
                    }}
                  >
                    <div className={css.rightWord}>{language[7]}</div>
                    {/* <img className={css.toright} src={toright} alt="" /> */}
                  </div>
                </div>
                <div className={css.describle}>
                  {myDeposit} <span className={css.unit}>WFIL</span>
                </div>
                <div className={css.line}></div>
                <div className={css.describleThree}>
                  <div>{language[3]}：</div>
                  <div className={css.describleThreeNum}>{myDeposit}</div>
                </div>
                <div className={css.describleThree}>
                  <div>{language[8]}：</div>
                  <div className={css.describleThreeNum}>{myMMRDeposit}</div>
                </div>
              </div>
            </div>
          </div>
          {/* 底部按钮 */}
          <div
            className={classNames(
              css.bottom,
              chain.address && chain.isActive ? '' : css.notAllow
            )}
            onClick={handleclick}
          >
            {language[5]}
          </div>
        </div>
      </Fragment>
    )
  }
  return (
    <div className={css.contain}>
      {/* <Tabs
        tabs={tabs}
        initialPage={0}
        animated={false}
        onChange={(tab, index) => {
          // console.log('onChange', index, tab)
        }}
        onTabClick={(tab, index) => {
          // console.log('onTabClick', index, tab)
        }}
      > */}
      <div className={css.inner}>{firstInner()}</div>
      {/* <div className={css.innerRight}>
          <img className={css.innerRightIMG} src={Nonthing} alt="" />
          <div className={css.innerRightBTM}>{language[6]}</div>
        </div> */}
      {/* </Tabs> */}
      <WhiteSpace />
    </div>
  )
}

export default inject('lang', 'chain')(observer(Details))
