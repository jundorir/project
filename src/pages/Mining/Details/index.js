import React, { Fragment } from 'react'
import css from './index.module.less'
import { inject, observer } from 'mobx-react'
import classNames from 'classnames'
import GetbackWindow from '@components/GetbackWindow'
import Nonthing from '@assets/images/icon/nothing.png'
import { computeWeiToSymbol, interception } from '@utils/common'

function Details(props) {
  const { lang, server, pledgeList, chain } = props
  const { selectedLang } = lang
  // const { list } = server
  const { list, page, pagesize, total } = pledgeList
  const [language, setLanguage] = React.useState([])
  const [getbackDisplay, setGetbackDisplay] = React.useState('none')
  const [mid, setmID] = React.useState(0)
  const [wfil, setWfil] = React.useState(0)
  React.useEffect(() => {
    if (chain.address) {
      pledgeList.init()
    }
  }, [chain.address])
  const getback = React.useCallback((mid, wfil) => {
    setmID(mid)
    setWfil(wfil)
    //   console.log(myDeposit)
    //   if (myDeposit > 0) {
    setGetbackDisplay('unset')
    //   } else if (myDeposit === '0') {
    //     setNopledgeWindow('unset')
    //   }
  }, [])
  console.log(list)
  React.useEffect(() => {
    if (total > list.length) {
      // console.log(
      //   '进入',
      //   document.getElementById('loading').getBoundingClientRect().top
      // )
      document.getElementById('content').onscroll = function (e) {
        // console.log('+++++++++++++++++++++++++')
        const loadEle = document.getElementById('loading')
        if (loadEle?.getBoundingClientRect().top < window.innerHeight) {
          // 加载数据
          document.onscroll = null
          pledgeList.setPage(page + 1)
        }
      }
    } else {
      document.getElementById('content').onscroll = null
    }
    return () => {
      document.getElementById('content').onscroll = null
    }
  }, [total, list.length])
  // React.useEffect(()=>{
  //   if(chain.address){
  //     pledgeList.requestPledgeList()
  //   }
  // },[chain.address])
  function timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-'
    var M =
      (date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) + '-'
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
    var h =
      (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
    var m =
      (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
      ':'
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return Y + M + D + h + m + s
  }
  function getEndTime(time, type) {
    if (type > 4 || type < 0) return null
    if (type === 4 || type === '4') {
      return <div className={css.noCost}>{language[7]}</div>
    }
    const base = [30, 60, 180, 360]
    return (
      <>
        <div>{language[3]}</div>
        <div>{timestampToTime(time + base[type] * 24 * 60 * 60)}</div>
      </>
    )
  }
  // 渲染List
  function renderList() {
    if (list.length === 0)
      return (
        <div className={css.nothing}>
          <img className={css.IMG} src={Nonthing} alt="" />
          <div className={css.BTM}>{language[6]}</div>
        </div>
      )
    return list.map(item => (
      <div className={css.content} key={item.id}>
        <div className={css.top}>
          <div className={css.cow}>
            <div>{language[0]}</div>
            <div>
              <span>{computeWeiToSymbol(item.fil, 4)}</span>
              <span className={css.unit}>&nbsp;WFIL</span>
            </div>
          </div>
          <div className={css.cow}>
            <div>WFIL&nbsp;&nbsp;{language[1]}</div>
            <div>{computeWeiToSymbol(item.fil, 4)}</div>
          </div>
          <div className={css.cow}>
            <div>MMR&nbsp;&nbsp;{language[1]}</div>
            <div>{computeWeiToSymbol(item.mmr, 4)}</div>
          </div>
          <div className={classNames(css.cow, css.recow)}>
            <div>{language[2]}</div>
            <div>{timestampToTime(item.creat_time)}</div>
          </div>
          <div className={classNames(css.cow, css.recow)}>
            {
              getEndTime(item.creat_time, item.peroid)
              // <div>{language[3]}</div>
              // <div>{getEndTime(item.creat_time, item.peroid)}</div>
            }
          </div>
        </div>
        <div className={css.line}></div>
        <div className={css.more}>
          <div></div>
          <div
            className={css.redeem}
            onClick={() => {
              getback(item.mid, computeWeiToSymbol(item.fil, 4))
            }}
          >
            {language[5]}
          </div>
        </div>
      </div>
    ))
  }
  React.useEffect(() => {
    if (selectedLang.key === 'English') {
      setLanguage([
        'pledge quantity',
        'computational power',
        'pledge time',
        'Lossless unlock time',
        'see more',
        'redeem',
        'There is no pledge record at present',
        'The pledge can be redeemed at any time'
      ])
    } else if (selectedLang.key === 'TraditionalChinese') {
      setLanguage([
        '質押數量',
        '算力',
        '質押時間',
        '無損解鎖時間',
        '查看更多',
        '贖回',
        '暫無質押記錄',
        '該筆質押可隨時無損贖回'
      ])
    } else if (selectedLang.key === 'SimplifiedChinese') {
      setLanguage([
        '质押数量',
        '算力',
        '质押时间',
        '无损解锁时间',
        '查看更多',
        '赎回',
        '暂无质押记录',
        '该笔质押可随时无损赎回'
      ])
    }
  }, [selectedLang.key])
  const closeGetbackWindow = React.useCallback(() => {
    setGetbackDisplay('none')
  }, [])
  return (
    <Fragment>
      <div style={{ display: getbackDisplay }}>
        <GetbackWindow
          closeGetbackWindow={closeGetbackWindow}
          mid={mid}
          wfil={wfil}
        />
      </div>
      <div className={css.contain}>
        <div className={css.inner}>{renderList()}</div>
      </div>
      <div className={css.loading} id="loading">
        {total > page * pagesize ? 'loading ...' : ''}
      </div>
    </Fragment>
  )
}

export default inject(
  'lang',
  'server',
  'pledgeList',
  'chain'
)(observer(Details))
