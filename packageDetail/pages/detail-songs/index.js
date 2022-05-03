// pages/detail-songs/index.js
import { rankingStore, playerStore } from '../../../store/index'
import { getSongMenuDetail } from '../../../service/api_music'

Page({
  data: {
    type: "",
    ranking: "",
    songInfo: {}
  },
  onLoad(options) {
    const type = options.type
    this.setData({ type })
    if (type === "menu") {
      const id = options.id
      getSongMenuDetail(id).then(res => {
        this.setData({ songInfo: res.playlist })
      })
    } else if (type === "rank") {
      const ranking = options.ranking
      this.setData({ ranking })
      rankingStore.onState(ranking, this.getRankingDataHandler)
    } 
  },

  handleSongItemClick(event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState("playListSongs", this.data.songInfo.tracks)
    playerStore.setState("playListIndex", index)
  },

  onUnload() {
    if (this.data.ranking) {
      rankingStore.offState(this.data.ranking, this.getRankingDataHandler)
    }
  },
  
  getRankingDataHandler(res) {
    this.setData({ songInfo: res})
  }
})