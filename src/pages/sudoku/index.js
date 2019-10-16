import { Block, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import classnames from 'classnames'
import getQuestion from './questions'
import './index.scss'

// pages/sudoku/index.js
var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
var mata = getQuestion()
var initMatrix = () => mata.map(row => {
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
    matrix: initMatrix(),
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
  onLoad: function(options) {
    this.setData({
      matrix: initMatrix(),
    })
  },

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
    var target = e.currentTarget
    // 点击了i行j列
    var i = target.dataset.i,
      j = target.dataset.j
    if (i === undefined || j === undefined) {
      return
    }
    var matrix = this.data.matrix
    // 当前格子的数字
    var currentNumber = matrix[i][j]
    if (currentNumber.origin) {
      this.setData({
        activeCell: { i: null, j: null },
        validNumbers: numbers.map(item => ({ value: item, disabled: true }))
      })
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
    // 遍历小宫格
    numbers.map((item, idx) => {
      var row = 3*Math.floor(i/3) + Math.floor(idx/3)
      var col = 3*Math.floor(j/3) + idx%3
      filledNumbers.add(matrix[row][col].value)
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
  },
  // 填入数字
  handleFillNumber: function(e) {
    var cell = e.target.dataset.v
    var { i, j } = this.data.activeCell
    if (cell.disabled || i === null || j === null) {
      return
    }
    var matrix = this.data.matrix.slice()
    matrix[i][j] = {
      value: cell.value,
    }
    this.setData({
      matrix,
    })
    if (this.sudokuFinished()) {
      const success = this.resultJudge()
      Taro.showModal({
        title: success ? '成功' : '失败',
        content: success ? '你真棒' : '什么地方填错了',
        confirmText: '清空',
      }).then(res => res.confirm ? this.clearCell() : null)
    }
  },
  sudokuFinished: function () {
    var { matrix } = this.data
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        if (!matrix[i][j].value) {
          return false
        }
      }
    }
    return true
  },
  // 判定是否完成
  resultJudge: function () {
    var { matrix } = this.data
    for (var i = 0; i < 9; i++) {
      var rowSet = new Set()
      var colSet = new Set()
      var subSet = new Set()
      for (var j = 0; j < 9; j++) {
        if (rowSet.has(matrix[i][j].value)) {
          return false
        } else {
          rowSet.add(matrix[i][j].value)
        }
        if (colSet.has(matrix[j][i].value)) {
          return false
        } else {
          colSet.add(matrix[j][i].value)
        }
        var row = 3*Math.floor(i/3) + Math.floor(j/3)
        var col = 3*(i%3) + j%3
        if (subSet.has(matrix[row][col].value)) {
          return false
        } else {
          subSet.add(matrix[row][col].value)
        }
      }
    }
    return true
  },
  clearCell: function () {
    var { i, j } = this.data.activeCell
    if (i === null || j === null) {
      return
    }
    var { matrix } = this.data
    matrix[i][j] = {
      value: 0,
    }
    this.setData({
      matrix: matrix.slice(),
    })
  },
  clearAll: function () {
    this.setData({
      matrix: initMatrix(),
    })
  },
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
                      className={classnames('cell', {
                        'origin-cell': cell.origin,
                      })}
                      key={i}
                      dataI={i}
                      dataJ={j}
                      onClick={this.onCellTouch}
                    >
                      {cell.value ? cell.value : ''}
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
              <View
                className={classnames('cell', {
                  disabled: item.disabled,
                })}
                dataV={item}
                onClick={this.handleFillNumber}
              >
                {item.value}
              </View>
            )
          })}
        </View>
        <View className="footer">
          <Button onClick={this.clearCell}>删除</Button>
          <Button onClick={this.clearAll}>全部清空</Button>
        </View>
      </View>
    )
  }
}

export default _C
