// pages/detail-video/index.js
import { getMvUrl, getMvDetaill, getRelatedVideo} from '../../../service/api_video'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvUrlInfo: {},
    mvDetail: {},
    relateVideos: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const id = options.id
    this.getPageData(id)
  },

  getPageData(id) {
    getMvUrl(id).then(res => {
      this.setData({ mvUrlInfo: res.data})
    })

    getMvDetaill(id).then(res =>{
      this.setData({ mvDetail: res.data})
      console.log(res.data)
    })

    getRelatedVideo(id).then(res => {
      this.setData({ relateVideos: res.data})
    })
  }
})