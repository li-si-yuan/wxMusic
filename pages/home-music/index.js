// pages/home-music/index.js
import { rankingStore, rankingMap, playerStore } from '../../store/index'
import { getBanners, getSongMenu } from '../../service/api_music'
import queryRect from '../../utils/query-rect'
import throttle from '../../utils/throttle'

const throttleQueryRect = throttle(queryRect, 1000, { trailing: true } )

Page({
  data: {
    banners: [],
    hotSongMenu: [],
    recommendSongMenu: [],
    swiperHeight: 0,
    recommendSongs: [],
    rankings: { 0: {}, 2: {}, 3: {}},

    currentSong: {},
    isPlaying: false,
    PlayAnimState: "paused"
  },
  onLoad(options) {
    // playerStore.dispatch("playMusicWithSongIdAction", { id: 1842025914 })
    this.getPageData()

    rankingStore.dispatch("getRankingDataAction")

    rankingStore.onState("hotRanking", (res) => {
      if(!res.tracks) return        
      const recommendSongs = res.tracks.slice(0, 6)
      this.setData({ recommendSongs })
    })
    rankingStore.onState("newRanking", this.getRankingHandler(0))
    rankingStore.onState("originRanking", this.getRankingHandler(2))
    rankingStore.onState("upRanking", this.getRankingHandler(3))

    playerStore.onStates(["currentSong", "isPlaying"], ({currentSong, isPlaying}) => {
      if (currentSong) this.setData({ currentSong })
      if (isPlaying !== undefined) this.setData({ isPlaying, PlayAnimState: isPlaying ? "running" : "paused" })
    })
  },

  getPageData() {
    getBanners().then(res => {
      this.setData({ banners: res.banners})
    }),
    getSongMenu().then(res => {
      this.setData({ hotSongMenu: res.playlists})
    })
    getSongMenu("华语").then(res => {
      this.setData({ recommendSongMenu: res.playlists})
    })
  },

  handleSearchClick() {
    wx.navigateTo({ 
      url: '/packageDetail/pages/detail-search/index',
    })
  },

  handleSwiperImageLoaded() {
    throttleQueryRect(".swiper-image").then(res => {
      const rect = res[0]
      this.setData({ swiperHeight: rect.height})
    })
  },

  handleMoreClick() {
    this.navigateToDetailSongsPage("hotRanking")
  },
  handleRankingItemClick(event){
    const idx = event.currentTarget.dataset.idx
    const rankingName = rankingMap[idx]
    this.navigateToDetailSongsPage(rankingName)
  },

  navigateToDetailSongsPage(rankingName) {
    wx.navigateTo({
      url: `/packageDetail/pages/detail-songs/index?ranking=${rankingName}&type=rank`,
    })
  },

  handleSongItemClick(event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState("playListSongs", this.data.recommendSongs)
    playerStore.setState("playListIndex", index)
  },
  handlePlayBtnClick() {
    playerStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying)
  },
  handlePlayBarClick(event) {
    wx.navigateTo({
      url: '/packagePlayer/pages/music-player/index?id=' + this.data.currentSong.id,
    })
  },
  onUnload() {
  },

  getRankingHandler(idx) {
    return (res) => {
      if (Object.keys(res).length === 0) return
      const name = res.name
      const coverImgUrl = res.coverImgUrl
      const playCount = res.playCount 
      const songList = res.tracks.slice(0, 3)
      const rankingObj = {name, coverImgUrl, playCount, songList,}
      const newRankings = { ...this.data.rankings, [idx]:rankingObj }
      this.setData({ rankings: newRankings})
    }
  }
})