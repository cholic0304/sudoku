'use strict'

import { Block } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './app.scss'
Object.defineProperty(exports, '__esModule', { value: true })

@withWeapp({
  onLaunch: function() {
    var _this = this
    var logs = Taro.getStorageSync('logs') || []
    logs.unshift(Date.now())
    Taro.setStorageSync('logs', logs)
    Taro.login({
      success: function(_res) {}
    })
    Taro.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          Taro.getUserInfo({
            success: function(res) {
              _this.globalData.userInfo = res.userInfo
              if (_this.userInfoReadyCallback) {
                _this.userInfoReadyCallback(res.userInfo)
              }
            }
          })
        }
      }
    })
  },
  globalData: {}
})
class App extends Taro.Component {
  config = {
    pages: ['pages/index/index', 'pages/logs/logs', 'pages/sudoku/index'],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#eee',
      navigationBarTitleText: '钧睿数独',
      navigationBarTextStyle: 'black'
    },
    sitemapLocation: 'sitemap15.json'
  }

  render() {
    return null
  }
}

export default App
Taro.render(<App />, document.getElementById('app'))
