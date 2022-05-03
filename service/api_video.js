import lyRequest from './index'

export function getTopMv(offset, limit = 10) {
  return lyRequest.get("/top/mv", { offset, limit })
}

export function getMvUrl(id) {
  return lyRequest.get("/mv/url", {id})
}

export function getMvDetaill(mvid) {
  return lyRequest.get("/mv/detail", {mvid})
}

export function getRelatedVideo(id) {
  return lyRequest.get("/related/allvideo", {id})
}