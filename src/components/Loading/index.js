import React from 'react'
import css from './index.module.less'
import loading from '@assets/images/icon/loading.png'

function Loading(props) {
  // console.log('props------------->', props)
  const [language, setLanguage] = React.useState([])
  React.useEffect(() => {
    if (props.language === 'English') {
      setLanguage(['Querying results on the chain, please wait...'])
    } else if (props.language === 'TraditionalChinese') {
      setLanguage(['正在查詢鏈上結果，請稍後…'])
    } else if (props.language === 'SimplifiedChinese') {
      setLanguage(['正在查询链上结果，请稍后…'])
    }
  }, [props.language])

  return (
    <div className={css.gainWindow}>
      <div className={css.gainBox}>
        {/* nopledge图 */}
        <div className={css.logImg}>
          <img src={loading} alt="" className={css.img} />
        </div>
        {/* 标题 */}
        <div className={css.title}>{language}</div>
      </div>
    </div>
  )
}

export default Loading
