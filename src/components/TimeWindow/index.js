import React, { useEffect } from 'react'
import css from './index.module.less'
import { inject, observer } from 'mobx-react'
import classNames from 'classnames'

function TimeWindow(props) {
  const { lang } = props
  const { selectedLang } = lang
  const [language, setLanguage] = React.useState([])
  const [curChecked, setcurChecked] = React.useState(360)
  const [number, setnumber] = React.useState(0)
  React.useEffect(() => {
    if (selectedLang.key === 'English') {
      setLanguage([
        'Success to receive',
        'Pledge time',
        'days',
        'none (In and out,up to you)'
      ])
    } else if (selectedLang.key === 'TraditionalChinese') {
      setLanguage(['領取成功', '質押時間', '天', '無（隨進隨出）'])
    } else if (selectedLang.key === 'SimplifiedChinese') {
      setLanguage(['领取成功', '质押时间', '天', '无（随进随出）'])
    }
  }, [selectedLang.key])
  const closeWindow = React.useCallback(() => {
    props.closeTimeWindow()
  }, [props])
  const chooseThis = React.useCallback(
    number => {
      setcurChecked(number)
      props.chooseTime(number)
    },
    [props]
  )
  useEffect(() => {
    setnumber(props.timeWindowDisplay)
  }, [props.timeWindowDisplay])
  return (
    <div
      className={css.gainWindow}
      onClick={() => {
        closeWindow()
        setnumber(-1)
      }}
    >
      <div
        className={classNames(
          css.gainBox,
          number > 0 ? css.active : css.notactive
        )}
        onClick={e => {
          e.stopPropagation()
        }}
      >
        <div className={css.titile}>
          <span>--------</span>
          <span className={css.titileWord}>{language[1]}</span>
          <span>--------</span>
        </div>
        <div className={css.bottom}>
          <div
            className={classNames(
              css.bottomline,
              curChecked === 30 && css.checked
            )}
            onClick={() => {
              chooseThis(30)
            }}
          >
            30{language[2]}
          </div>
          <div
            className={classNames(
              css.bottomline,
              curChecked === 60 && css.checked
            )}
            onClick={() => {
              chooseThis(60)
            }}
          >
            60{language[2]}
          </div>
          <div
            className={classNames(
              css.bottomline,
              curChecked === 180 && css.checked
            )}
            onClick={() => {
              chooseThis(180)
            }}
          >
            180{language[2]}
          </div>
          <div
            className={classNames(
              css.bottomline,
              curChecked === 360 && css.checked
            )}
            onClick={() => {
              chooseThis(360)
            }}
          >
            360{language[2]}
          </div>
          <div
            className={classNames(
              css.bottomline,
              curChecked === 0 && css.checked
            )}
            onClick={() => {
              chooseThis(0)
            }}
          >
            {language[3]}
          </div>
        </div>
      </div>
    </div>
  )
}

export default inject('lang')(observer(TimeWindow))
