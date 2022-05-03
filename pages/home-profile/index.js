// pages/home-profile/index.js
import { getUserInfo } from '../../service/api-login'
Page({
  data: {

  },
  async handleGetUser() {
    const userInfo = await getUserInfo()
    console.log(userInfo)
  }
})