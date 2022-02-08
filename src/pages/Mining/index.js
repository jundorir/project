import React, { Fragment } from 'react'
import Earnings from './module/Earnings'
import Gain from './module/Gain'
import Details from './module/Details'
import css from './index.module.less'
import { inject, observer } from 'mobx-react'
import FMGain from '../Boardroom/module/FMGain'

function Mining(props) {
  // const { chain } = props
  // React.useEffect(() => {
  //   console.log('总体的')
  //   if (chain.address) {
  //     chain.queryMMRPageInfo()
  //   }
  // }, [chain.address])
  // React.useEffect(() => {
  //   if (chain.address) {
  //     chain.requestChainData()
  //   }
  // }, [chain, chain.address])
  return (
    <Fragment>
      <div className={css.contain}>
        <Earnings />
        <Gain />
        <Details />
        <FMGain />
      </div>
    </Fragment>
  )
}

export default inject('lang', 'chain')(observer(Mining))
