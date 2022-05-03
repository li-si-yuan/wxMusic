// pages/home-video/index.js
import { getTopMv } from '../../service/api_video'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topMvs: [],
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getTopMvData(0)
  },

  async getTopMvData(offect){
    if (!this.data.hasMore && offect !== 0) return

    wx.showNavigationBarLoading()
    const res = await getTopMv(offect)
    var newData = this.data.topMvs
    if (offect === 0) {
      newData = res.data
    } else {
      newData = newData.concat(res.data)
    }
    this.setData({ topMvs: newData})
    this.setData({ hasMore: res.hasMore})
    wx.hideNavigationBarLoading()
    if (offect === 0) {
      wx.stopPullDownRefresh()
    }
  },

  handleVideoItemClick(event) {
    const id = event.currentTarget.dataset.item.id
    wx.navigateTo({
      url: '/packageDetail/pages/detail-video/index?id=' + id,
    })
  },

  async onPullDownRefresh() {
    this.getTopMvData(0)
  },

  async onReachBottom() {
    this.getTopMvData(this.data.topMvs.length)
  }
})