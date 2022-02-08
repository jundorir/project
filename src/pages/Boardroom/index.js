import React from 'react'
import Header from './module/Header'
import Gain from './module/Gain'
import Details from './module/Details'
import FMGain from './module/FMGain'
import css from './index.module.less'

function DAO() {
  return (
    <div className={css.contain}>
      <Header />
      <Gain />
      <Details />
      <FMGain />

    </div>
  )
}

export default DAO
