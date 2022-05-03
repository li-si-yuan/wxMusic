import lyRequest, { lyLoginRequest } from './index'

export function getLoginCode() {
  return new Promise((resolve, rejecrt) =>{
    wx.login({
      timeout: 2000,
      success: res => {
        const code = res.code
        resolve(code)
      },
      fail: err => {
        rejecrt(err)
      }
    })
  })
}

export function codeToToken(code) {
  return lyLoginRequest.post("/login", { code })
}

export function checkToken() {
  return lyLoginRequest.post("/auth", {}, true)
}

export function postFaverRequest(id) {

}

export function checkSession() {
  return new Promise((resolve) =>{
    wx.checkSession({
      success: () => {
        resolve(true)
      },
      fail: () => {
        resolve(false)
      }
    })
  })
}

export function getUserInfo() {
  return new Promise ((resolve, reject) =>{
    wx.getUserProfile({
      desc: 'lsy',
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}