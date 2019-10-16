'use strict'

import { Block, View, Button, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './index.scss'
Object.defineProperty(exports, '__esModule', { value: true })
var app = Taro.getApp()

@withWeapp({
  data: {
    motto: '点击 “编译” 以构建',
    userInfo: {},
    hasUserInfo: false,
    canIUse: Taro.canIUse('button.open-type.getUserInfo')
  },
  bindViewTap: function() {
    Taro.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    var _this = this
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = function(res) {
        _this.setData({
          userInfo: res,
          hasUserInfo: true
        })
      }
    } else {
      Taro.getUserInfo({
        success: function(res) {
          app.globalData.userInfo = res.userInfo
          _this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  startGame: function() {
    Taro.navigateTo({
      url: '../sudoku/index'
    })
  }
})
class _C extends Taro.Component {
  config = {}

  render() {
    const { hasUserInfo, canIUse, userInfo } = this.data
    return (
      <View className="container">
        <View className="userinfo">
          {!hasUserInfo && canIUse ? (
            <Button openType="getUserInfo" onGetuserinfo={this.getUserInfo}>
              获取头像昵称
            </Button>
          ) : (
            <Block>
              <Image
                onClick={this.bindViewTap}
                className="userinfo-avatar"
                src={userInfo.avatarUrl}
                mode="cover"
              ></Image>
              <Text className="userinfo-nickname">{userInfo.nickName}</Text>
            </Block>
          )}
        </View>
        <View className="usermotto">
          {hasUserInfo && <Button openType="getUserInfo">继续游戏</Button>}
          {hasUserInfo && <Button onTap={this.startGame}>新游戏</Button>}
        </View>
      </View>
    )
  }
}

export default _C
