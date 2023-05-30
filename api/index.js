import axios from 'axios'
import mpAdapter from 'axios-miniprogram-adapter'
axios.defaults.adapter = mpAdapter

export function getXuyunSessions(dataSource) {
  return axios.get('https://jihulab.com/data1355712' + dataSource + '/-/raw/main/json/allSessions.json')
}
export function getXuyunPoints(dataSource) {
  return axios.get('https://jihulab.com/data1355712' + dataSource + '/-/raw/main/geojson/allPoints.geojson')
}

export function getXuyunLines(dataSource) {
  return axios.get('https://jihulab.com/data1355712' + dataSource + '/-/raw/main/geojson/track.geojson')
}