import { Block, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './index.scss'
// pages/sudoku/index.js
var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
var initMatrix = [
  [8, 5, 0, 0, 0, 2, 4, 0, 0],
  [7, 2, 0, 0, 0, 0, 0, 0, 9],
  [0, 0, 4, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 7, 0, 0, 2],
  [3, 0, 5, 0, 0, 0, 9, 0, 0],
  [0, 4, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 8, 0, 0, 7, 0],
  [0, 1, 7, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 3, 6, 0, 4, 0]
]
var matrix = initMatrix.map(row => {
  return row.map(cell => {
    return {
      value: cell,
      origin: !!cell
    }
  })
})

@withWeapp({
  /**
   * 页面的初始数据
   */
  data: {
    matrix,
    validNumbers: numbers.map(item => {
      return { value: item, disabled: false }
    }),
    activeCell: {
      i: null,
      j: null
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},

  onCellTouch: function(e, ownerInstance) {
    // 点击格子，页面下方显示可选数字
    var target = e.target
    // 点击了i行j列
    var i = target.dataset.i,
      j = target.dataset.j
    if (i === undefined || j === undefined) {
      return
    }
    // 当前格子的数字
    var currentNumber = matrix[i][j]
    if (currentNumber.origin) {
      return
    }
    var filledNumbers = new Set()
    var validNumbers

    // 遍历i行找出已填充的数字
    matrix[i].map(item => {
      filledNumbers.add(item.value)
    })
    // 遍历j列找出已填充的数字
    matrix.map(item => {
      filledNumbers.add(item[j].value)
    })
    var validNumbers = numbers.map(item => {
      return {
        value: item,
        disabled: filledNumbers.has(item) && item !== currentNumber.value
      }
    })
    this.setData({
      validNumbers,
      activeCell: {
        i,
        j
      }
    })
  }
})
class _C extends Taro.Component {
  config = {}

  render() {
    const { matrix, validNumbers } = this.data
    return (
      <View className="container">
        <View className="sudoku">
          {matrix.map((row, i) => {
            return (
              <View className="row">
                {row.map((cell, j) => {
                  return (
                    <View
                      className="cell"
                      key={i}
                      data-i={i}
                      data-j={j}
                      onClick={this.onCellTouch}
                    >
                      <View className={cell.origin ? 'origin-cell' : ''}>
                        {cell.value ? cell.value : ''}
                      </View>
                    </View>
                  )
                })}
              </View>
            )
          })}
        </View>
        <View className="footer">
          {validNumbers.map((item, index) => {
            return (
              <View className="cell">
                <View className={item.disabled ? 'disabled' : ''}>
                  {item.value}
                </View>
              </View>
            )
          })}
        </View>
      </View>
    )
  }
}

export default _C
