// pages/detail-search/index.js
import { getSearchHot, getSearchSuggest, getSearchResult } from '../../../service/api-search'
import debounce from '../../../utils/debounce'

const debounceGetSearchSuggest = debounce(getSearchSuggest)
Page({
  data: {
    hotKeywords: [],
    suggestSongs: [],
    suggestSongsNodes: [],
    resultSongs: [],
    searchValue: ""
  },
  onLoad(options) {
    this.getPageData()
  },
  getPageData() {
    getSearchHot().then(res => {
      this.setData({ hotKeywords: res.result.hots })
    })
  },

  handleSearchChange(event) {
    const searchValue = event.detail
    this.setData({ searchValue })
    if (!searchValue.length) {
      this.setData({ suggestSongs: [], resultSongs: [] })
      debounceGetSearchSuggest.cancel()
      return
    }
    debounceGetSearchSuggest(searchValue).then(res => {
      const suggestSongs = res.result.allMatch
      this.setData({ suggestSongs })
      if (!suggestSongs) return
      const suggestKeywords = suggestSongs.map(item => item.keyword)
      const suggestSongsNodes = []
      for (const keyword of suggestKeywords) {
        const nodes = []
        if (keyword.toUpperCase().startsWith(searchValue.toUpperCase())) {
          const key1 = keyword.slice(0, searchValue.length)
          const node1 = {
            name: "span",
            attrs: { style: "color: #26ce8a; font-size: 20rpx"},
            children: [{ type: "text", text: key1 }]
          }
          nodes.push(node1)
          const key2 = keyword.slice(searchValue.length)
          const node2 = {
            name: "span",
            attrs: { style: "color: #000000; font-size: 20rpx"},
            children: [{ type: "text", text: key2 }]
          }
          nodes.push(node2)
        } else {
          const node = {
            name: "span",
            attrs: { style: "color: #000000; font-size: 20rpx"},
            children: [{ type: "text", text: keyword }]
          }
          nodes.push(node)
        }
        suggestSongsNodes.push(nodes)
      }
      this.setData({ suggestSongsNodes })
    })
  },
  handleSearchAction() {
    const searchValue = this.data.searchValue
    getSearchResult(searchValue).then(res => {
      this.setData({ resultSongs: res.result.songs})
    })
  },
  handleKeywordItemClick(event) {
    const keyword = event.currentTarget.dataset.keyword
    this.setData({ searchValue: keyword })

    this.handleSearchAction()
  }
})