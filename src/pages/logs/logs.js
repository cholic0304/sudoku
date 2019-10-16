'use strict'

import { Block, View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './logs.scss'
Object.defineProperty(exports, '__esModule', { value: true })
var util_1 = require('../../utils/util.js')

@withWeapp({
  data: {
    logs: []
  },
  onLoad: function() {
    this.setData({
      logs: (Taro.getStorageSync('logs') || []).map(function(log) {
        return util_1.formatTime(new Date(log))
      })
    })
  }
})
class _C extends Taro.Component {
  config = {
    navigationBarTitleText: '查看启动日志'
  }

  render() {
    const { logs } = this.data
    return (
      <View className="container log-list">
        {logs.map((log, index) => {
          return (
            <Block>
              <Text className="log-item">{index + 1 + '. ' + log}</Text>
            </Block>
          )
        })}
      </View>
    )
  }
}

export default _C
