import React, { Fragment, useCallback } from 'react'
import css from './index.module.less'
import { inject, observer } from 'mobx-react'
import { useHistory } from 'react-router-dom'
import DAORedeemWindow from '@components/DAORedeemWindow'
import { interception } from '@utils/common'
import { Toast } from 'antd-mobile'
import classNames from 'classnames'

function Details(props) {
  const history = useHistory()
  const { lang, chain, boardroom, server } = props
  const { selectedLang } = lang
  const { tvl_director, apr_director } = server
  const { hasPledged, totalHasPledged } = boardroom
  const [language, setLanguage] = React.useState([])
  const [redeemDisplay, setRedeemDisplay] = React.useState('none')
  React.useEffect(() => {
    if (selectedLang.key === 'English') {
      setLanguage([
        'boardroom',
        'Your pledge',
        'Share of surplus value',
        'pledge',
        'redeem',
        'Please bind the inviter to activate the account first'
      ])
    } else if (selectedLang.key === 'TraditionalChinese') {
      setLanguage([
        '董事會',
        '您的質押',
        '剩余價值份額',
        '質押',
        '贖回',
        '請先綁定邀請人激活賬號'
      ])
    } else if (selectedLang.key === 'SimplifiedChinese') {
      setLanguage([
        '董事会',
        '您的质押',
        '剩余价值份额',
        '质押',
        '赎回',
        '请先绑定邀请人激活账号'
      ])
    }
  }, [selectedLang.key])
  function toPledge() {
    if (chain.address && chain.isActive) {
      history.push('/boardroomPledge')
    } else if (!chain.isActive) {
      Toast.fail(`${language[5]}`)
    }
  }
  function toRedeem() {
    if (chain.address && chain.isActive) {
      setRedeemDisplay('unset')
    } else if (!chain.isActive) {
      Toast.fail(`${language[5]}`)
    }
  }
  const closeDAORedeemWindow = useCallback(() => {
    setRedeemDisplay('none')
  }, [])
  React.useEffect(() => {
    if (chain.address) {
      boardroom.getHasPledged()
      boardroom.getTotalPledged()
    }
  }, [chain.address])
  return (
    <Fragment>
      <div style={{ display: redeemDisplay }}>
        <DAORedeemWindow
          closeDAORedeemWindow={closeDAORedeemWindow}
          hasPledged={hasPledged}
        />
      </div>
      <div className={css.contain}>
        <div className={css.inner}>
          <div className={css.lineone}>
            <div className={css.lineoneL}>{language[0]}</div>
            <div className={css.lineoneR}>
              <div className={css.picOne}></div>
              <div className={css.picTwo}></div>
            </div>
          </div>
          <div className={css.line}></div>
          <div className={css.linetwo}>
            <div className={css.linetwoL}>APR</div>
            <div className={css.linetwoR}>{apr_director}%</div>
          </div>
          <div className={css.line}></div>
          <div className={css.linethree}>
            <div className={css.linethreeL}>TVL</div>
            <div className={css.linethreeR}>${tvl_director}</div>
          </div>
          <div className={css.linefour}>
            <div className={css.linefourInner}>
              <div className={css.linefourL}>
                <div>{language[1]}</div>
                <div>{language[2]}</div>
              </div>
              <div className={css.linefourR}>
                {hasPledged > 0 && totalHasPledged > 0
                  ? interception((hasPledged / totalHasPledged) * 100, 4) > 100
                    ? '100.0000'
                    : interception((hasPledged / totalHasPledged) * 100, 4)
                  : 0}
                %
              </div>
            </div>
          </div>
          <div className={css.linefive}>
            <div
              className={classNames(
                css.buttonL,
                chain.address && chain.isActive ? '' : css.notAllow
              )}
              onClick={toPledge}
            >
              {language[3]}
            </div>
            <div
              className={classNames(
                css.buttonR,
                chain.address && chain.isActive ? '' : css.notAllow
              )}
              onClick={toRedeem}
            >
              {language[4]}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default inject('lang', 'chain', 'boardroom', 'server')(observer(Details))
