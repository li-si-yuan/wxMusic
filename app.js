// app.js
import { getLoginCode, codeToToken, checkToken, checkSession } from './service/api-login'
import { TOKEN_KEY } from './constants/token-const'

App({
  globlaData: {
    screenWidth: 0,
    screenHeight: 0,
    statusBarHeight: 0,
    NavBarHeight: 44,
    deviceRadio: 0
  },
  onLaunch() {
    const info = wx.getSystemInfoSync()
    this.globlaData.screenWidth = info.screenWidth
    this.globlaData.screenHeight = info.screenHeight
    this.globlaData.statusBarHeight = info.statusBarHeight
    this.globlaData.deviceRadio = info.screenHeight / info.screenWidth

    this.handleLogin()
  },
  async handleLogin() {
    const token = wx.getStorageSync(TOKEN_KEY)
    const checkResult = await checkToken() 

    const isSessionExpire = await checkSession()

    if (!token || checkResult.errorCode || !isSessionExpire) {
      this.loginAction()
    }
  },

  async loginAction() {
    const code = await getLoginCode()
    
    const result = await codeToToken(code)
    const token = result.token
    wx.setStorageSync(TOKEN_KEY, token)
  }

})
