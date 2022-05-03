import { HYEventStore } from 'hy-event-store'
import { getSongDeatil, getSongLyric } from '../service/api_player'
import { parseLyric } from '../utils/parse-lyric'

// const audioContext = wx.createInnerAudioContext()
const audioContext = wx.getBackgroundAudioManager()

const playerStore = new HYEventStore({
  state: {
    isFirstPlay: true,
    id: 0,
    currentSong: {},
    durationTime: 0,
    lyricInfos: [],

    currentTime: 0,
    currentLyricText: "",
    currentLyricIndex: 0,

    playModeIndex: 0,  //0:循环播放 1:单曲循环 2:随机播放
    isPlaying: false,
    isStoping: false,
    playListSongs: [],
    playListIndex: 0
  },
  actions: {
    playMusicWithSongIdAction(ctx, { id, isRefresh = false }) {
      if (ctx.id == id && !isRefresh) {
        this.dispatch("changeMusicPlayStatusAction")
        return
      }
      ctx.id = id

      ctx.isPlaying = true
      ctx.currentSong = {}
      ctx.durationTime = 0
      ctx.lyricInfos = []
      ctx.currentTime = 0
      ctx.currentLyricText =  ""
      ctx.currentLyricIndex = 0

      getSongDeatil(id).then(res => {
        ctx.currentSong = res.songs[0]
        ctx.durationTime = res.songs[0].dt
        audioContext.title = res.songs[0].name
      })
      getSongLyric(id).then(res => {
        const lyricString = res.lrc.lyric
        const lyricInfos = parseLyric(lyricString)
        ctx.lyricInfos = lyricInfos
      })

      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.title = id
      audioContext.autoplay = true

      if (ctx.isFirstPlay) {
        this.dispatch("setupAudioContextListenerAction")
        ctx.isFirstPlay = false
      }
    },
    setupAudioContextListenerAction(ctx) {
      audioContext.onCanplay(() => {
        audioContext.play()
      })
      audioContext.onTimeUpdate(() => {
        const currentTime = audioContext.currentTime * 1000
  
        ctx.currentTime = currentTime
        
        if (!ctx.lyricInfos.length) return
        for (let i = 0; i < ctx.lyricInfos.length; i++) {
          const lyricInfo = ctx.lyricInfos[i]
          if (currentTime < lyricInfo.time) {
            const currentIndex = i -1
            if (ctx.currentLyricIndex !== currentIndex) {
              const currentLyricInfo = ctx.lyricInfos[currentIndex]
              ctx.currentLyricText = currentLyricInfo.text
              ctx.currentLyricIndex = currentIndex
            }
            break
          }
        }
      })
      audioContext.onEnded(() => {
        this.dispatch("changeNewMusicAction")
      })

      audioContext.onPlay(() => {
        ctx.isPlaying = true
      })
      audioContext.onPause(() => {
        ctx.isPlaying = false
      })
      audioContext.onStop(() => {
        ctx.isPlaying = false
        ctx.isStoping = true
      })
    },
    changeMusicPlayStatusAction(ctx, isPlaying = true) {
      ctx.isPlaying = isPlaying
      if (ctx.isPlaying && ctx.isStoping) {
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
        audioContext.title = ctx.currentSong.name
        // audioContext.seek(ctx.currentTime)
        ctx.isStoping = false
      }
      ctx.isPlaying ? audioContext.play() : audioContext.pause()
    },
    changeNewMusicAction(ctx, isNext = true) {
      let index = ctx.playListIndex
      switch(ctx.playModeIndex) {
        case 0:
          index = isNext ? index + 1 : index - 1
          if(index === ctx.playListSongs.length) index = 0
          if(index === -1) index = ctx.playListSongs.length - 1
          break
        case 1:
          break
        case 2:
          let newIndex = 0
          while (newIndex <= index) {
            newIndex =  Math.floor(Math.random() * ctx.playListSongs.length)
          }
          index = newIndex
          break
      }

      let currentSong = ctx.playListSongs[index]
      if (!currentSong) {
        currentSong = ctx.currentSong
      } else {
        ctx.playListIndex = index
      }
      this.dispatch("playMusicWithSongIdAction", { id: currentSong.id, isRefresh: true })
    }
  }
})

export {
  audioContext,
  playerStore
}