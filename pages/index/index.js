// index.js
import QQMapWX from '~/utils/qqmap-wx-jssdk';
import { key } from '~/utils/key';
import { getXuyunPoints, getXuyunSessions, getXuyunLines } from '~/api/index';
const qqmapsdk = new QQMapWX({
  key // 必填
});
Page({
  data: {
    mapDataList: [
      {
        label: '徐云流浪中国',
        value: '/xuyun-data',
        color: '#0074cc',
      },
      {
        label: '十三要和拳头',
        value: '/shisanyaoshitou-data',
        color: '#ffdcb6',
      },
    ],
    key,
    location: {
      latitude: 31.06,
      longitude: 83
    },
    showMarkerList: false,
    minScale: 1,
    maxScale: 16,
    scale: 4,
    features: [],
    featuresOfLine: [],
    markers: [],
    polyline: [],
    sessions: [],
    dataId: '/xuyun-data',
    sessionId: -1,
    videoId: -1,
    videoList: [],
    mapControlPaddingBottom: 36,
  },
  _includePoints() {
    const points = this.data.markers.map(m => ({
      latitude: m.latitude,
      longitude: m.longitude
    }))
    const mapCtx = wx.createMapContext('map', this);
    mapCtx.includePoints({
      points,
      padding: [36, 36, this.data.mapControlPaddingBottom, 36]
    })
  },
  _setLocation(latitude, longitude) {
    this.setData({
      location: {
        latitude,
        longitude
      }
    });
  },
  getLocation(cb) {
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        const { latitude, longitude } = res;
        this._setLocation(latitude, longitude)
        cb()
      }
    })
  },
  setMapData(e) {
    const { currentTarget } = e
    const { id } = currentTarget
    this.setData({
      dataId: id
    })
    this.fetchData()
  },
  setVideo(e) {
    const { currentTarget } = e
    const { id } = currentTarget
    // console.log(id);
    this.setData({
      videoId: id
    })
    this.setMarkers()
    this._includePoints()
  },
  setSession(e) {
    const { currentTarget } = e
    const { id } = currentTarget
    const videoList = this.data.sessions.find(item => item.id == id).videoList
    this.setData({
      sessionId: id, videoList
    })
    this.setMarkers()
    this._includePoints()
  },
  async fetchPoints() {
    const res = await getXuyunPoints(this.data.dataId)
    const featureCollection = res.data
    const { features } = featureCollection
    this.setData({
      features
    })
    this.setMarkers()
  },
  // async fetchLines() {
  //   const res = await getXuyunLines()
  //   const featureCollection = res.data
  //   const { features } = featureCollection
  //   this.setData({
  //     featuresOfLine: features
  //   })
  //   // this.setMarkers()
  // },
  async setMarkers() {
    const markers = this.data.features.filter(item => item.properties.sessionId == this.data.sessionId).filter(item => {
      if (this.data.videoId == -1) {
        return true
      } else {
        // console.log(item.properties.videoId, this.data.videoId);
        return item.properties.videoId == this.data.videoId
      }
    }).map((item, idx) => {
      return {
        // title: item.properties.description,
        // label: item.properties.description,
        iconPath: '/xuyun-map/map-point.png',
        id: idx,
        width: 18,
        height: 18,
        latitude: +item.geometry.coordinates[1],
        longitude: +item.geometry.coordinates[0],
        callout: {
          content: item.properties.description,
          fontSize: 16,
          textAlign: 'center',
          color: '#555'
        }
        // label: {
        //   content: item.properties.description,
        //   fontSize: 8,
        //   textAlign: 'center',
        //   color: '#555'
        // }
      }
    })
    this.setData({
      markers: markers
    })
  },
  async fetchSessions() {
    const res = await getXuyunSessions(this.data.dataId)
    const sessions = res.data
    if (sessions.length > 0) {
      const sessionId = sessions[0].id
      const videoList = sessions[0].videoList
      this.setData({
        sessions,
        sessionId,
        videoList
      })
    }
  },
  async fetchData() {
    await this.fetchSessions()
    await this.fetchPoints()
    this._includePoints()
    // this.fetchLines()

  },
  onLoad() {
    this.getLocation(() => {
      this.fetchData()
    })
  }
})
