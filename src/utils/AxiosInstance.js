import axios from 'axios'
import { removeRequestPending, addRequestPending, clearRequestPending } from './CancelToken'

const defaultConfig = {
  timeOut: 50000,
  baseURL: import.meta.env.VITE_BASE_URL ? import.meta.env.VITE_BASE_URL : 'http://110.42.184.111'
}

const Cancel = axios.CancelToken

const axiosInstance = axios.create(defaultConfig)

// 請求攔截
axiosInstance.interceptors.request.use((config) => {
  console.log('請求攔截測試')
  removeRequestPending(config)

  config.cancelToken = new Cancel((cancel) => {
    const requestItem = {
      uuid: `${config.url}&${config.method}`,
      cancel
    }
    addRequestPending(requestItem)
  })

  return config
}, err => {
  return Promise.reject(err)
})

// 回應攔截
axiosInstance.interceptors.response.use((res) => {
  console.log('回應攔截測試')
  clearRequestPending(res.config)

  return res
}, err => {
  return Promise.reject(err)
})

export const httpRequestGet = (url, params) => {
  return axiosInstance.get(url, params).then((res) => res.data).catch()
}

export const httpRequestPost = (url, params) => {
  return axiosInstance.post(url, params).then((res) => res.data).catch()
}
