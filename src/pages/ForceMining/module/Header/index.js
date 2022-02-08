import React from 'react'
import css from './index.module.less'
import { inject, observer } from 'mobx-react'

function Header(props) {
  const { lang } = props
  const { selectedLang } = lang
  const [language, setLanguage] = React.useState([])
  React.useEffect(() => {
    if (selectedLang.key === 'English') {
      setLanguage(['Calculate force subscribe'])
    } else if (selectedLang.key === 'TraditionalChinese') {
      setLanguage(['算力認購'])
    } else if (selectedLang.key === 'SimplifiedChinese') {
      setLanguage(['算力认购'])
    }
  }, [selectedLang.key])
  return (
    <div className={css.contain}>
      <div className={css.inner}>
        <div className={css.left}>
          <div className={css.title}>{language[0]}</div>
          <div className={css.describle}>T/WFIL</div>
        </div>
      </div>
    </div>
  )
}

export default inject('lang')(observer(Header))
