// pages/music-player/index.js
import { audioContext, playerStore } from '../../../store/index'

const playModeNames = ["order", "repeat", "random"]

Page({
  data: {
    id: 0,
    currentSong: {},
    durationTime: 0,
    lyricInfos: [],

    currentTime: 0,
    currentLyricText: "",
    currentLyricIndex: 0,

    playModeIndex: 0,
    playModeName: "order",
    isPlaying: false,
    playingName: "pause",

    sliderValue: 0,
    isSliderChanging: false,
    currentPage: 0,
    contentHeight: 0,
    isShowLyric: true,
    lyricScrollTop: 0
  },
  onLoad(options) {
    const id = options.id
    this.setData({ id })

    this.setUpPlayerStoreListener()

    const screenHeight = getApp().globlaData.screenHeight
    const statusBarHeight = getApp().globlaData.statusBarHeight
    const NavBarHeight = getApp().globlaData.NavBarHeight
    const deviceRadio = getApp().globlaData.deviceRadio
    const contentHeight = screenHeight - statusBarHeight - NavBarHeight
    this.setData({ contentHeight, isShowLyric: deviceRadio >= 2})

  },

  handleswiperChange(event) {
    const current = event.detail.current
    this.setData({ currentPage: current})
  },
  handleSliderChange(event) {
    const value = event.detail.value
    const currentTime = this.data.durationTime * value / 100

    // audioContext.pause()
    audioContext.seek(currentTime / 1000)

    this.setData({ sliderValue: value, isSliderChanging: false })
  },
  handleSliderChanging(event) {
    const value = event.detail.value
    const currentTime = this.data.durationTime * value / 100
    this.setData({ isSliderChanging: true, currentTime })
  
  },

  handleBackClick() {
    wx.navigateBack()
  },

  handleModeBtnClick() {
    let playModeIndex = this.data.playModeIndex + 1
    if (playModeIndex === 3) {
      playModeIndex = 0
    }
    playerStore.setState("playModeIndex", playModeIndex)
  },

  handlePlayBtnClick() {
    playerStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying)
  },
  handlePrevBtnClick() {
    playerStore.dispatch("changeNewMusicAction", false)
  },
  handleNextBtnClick() {
    playerStore.dispatch("changeNewMusicAction")
  },


  setUpPlayerStoreListener() {
    playerStore.onStates(["currentSong","durationTime","lyricInfos"],
    ({ currentSong, durationTime, lyricInfos }) => {
      if (currentSong) this.setData({ currentSong })
      if (durationTime) this.setData({ durationTime })
      if (lyricInfos) this.setData({ lyricInfos })
    })
    playerStore.onStates(["currentTime", "currentLyricText","currentLyricIndex"],
    ({currentTime, currentLyricText, currentLyricIndex}) =>{
      if (currentTime && !this.data.isSliderChanging) {
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({ currentTime, sliderValue })
      }
      if (currentLyricText) {
        this.setData({ currentLyricText })
      }
      if (currentLyricIndex) {
        this.setData({ currentLyricIndex, lyricScrollTop: currentLyricIndex * 35 })
      }
    })
    playerStore.onStates(["playModeIndex", "isPlaying"], ({playModeIndex, isPlaying}) => {
      if (playModeIndex !== undefined) {
        this.setData({
          playModeIndex,
          playModeName: playModeNames[playModeIndex] })
      }
      if (isPlaying !== undefined) {
        this.setData({
          isPlaying,
          playingName: isPlaying ? "pause" : "resume" })
      }
    })
  },

  onUnload() {
  }
})