import React, { Fragment } from 'react'
import css from './index.module.less'

function Vip() {
  return (
    <Fragment>
      <div className={css.contain}>
        <div className={css.bottom}>
          <div className={css.bottomInner}></div>
        </div>
      </div>
    </Fragment>
  )
}

export default Vip
