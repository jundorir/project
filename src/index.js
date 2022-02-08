import React from 'react'
import ReactDOM from 'react-dom'
import './assets/common/normalize.css'
import Router from './router'
import { Provider } from 'mobx-react'
import store from './store'
import { Toast } from 'antd-mobile'
Toast.config({ duration: 2, mask: false })

ReactDOM.render(
  <Provider {...store}>
    <Router />
  </Provider>,
  document.getElementById('root')
)
