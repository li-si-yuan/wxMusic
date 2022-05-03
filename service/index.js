import { TOKEN_KEY } from '../constants/token-const'

const BASE_URL = "http://123.207.32.32:9001"

const LOGIN_BASE_URL = "http://123.207.32.32:3000"

const token = wx.getStorageSync(TOKEN_KEY)
class LYRequest {
  constructor(baseURL, authHeader = {}) {
    this.baseURL = baseURL
    this.authHeader = authHeader
  }

  request(url, method, params, isAuth = false, header = {}) {
    const finalHeader = isAuth ? { ...this.authHeader, ...header } : header
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.baseURL + url,
        method: method,
        header: finalHeader,
        data: params,
        success:function(res) {
          resolve(res.data)
        },
        fail: reject
      })
    })
  }
  get(url, params, isAuth = false, header) {
    return this.request(url, "GET", params, isAuth, header)
  }
  post(url, data, isAuth = false, header) {
    return this.request(url, "POST", data, isAuth, header)
  }
}

const lyRequest = new LYRequest(BASE_URL)

const lyLoginRequest = new LYRequest(LOGIN_BASE_URL, {
  token
})

export default lyRequest

export {
  lyLoginRequest
}