import lyRequest from './index'

export function getBanners() {
  return lyRequest.get('/banner', {
    type: 2
  })
}

export function getRankings(idx) {
  return lyRequest.get("/top/list", {
    idx
  })
}

export function getSongMenu(cat="全部", limit=6, offset=0) {
  return lyRequest.get("/top/playlist", {
    cat,
    limit,
    offset
  })
}

export function getSongMenuDetail(id) {
  return lyRequest.get("/playlist/detail/dynamic", {
    id
  })
}