import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { isNumber } from 'lodash'
import { sessionStorageService } from 'uiSrc/services'
import { BrowserStorageItem } from 'uiSrc/constants'
import { CustomHeaders } from 'uiSrc/constants/api'

const { apiPort } = window.app?.config || { apiPort: process.env.RI_APP_PORT }
const baseApiUrl = process.env.RI_BASE_API_URL
const isDevelopment = process.env.NODE_ENV === 'development'
const isWebApp = process.env.RI_APP_TYPE === 'web'
const hostedApiBaseUrl = process.env.RI_HOSTED_API_BASE_URL

let mutableAxiosInstance: AxiosInstance

if (hostedApiBaseUrl) {
  mutableAxiosInstance = axios.create({
    baseURL: hostedApiBaseUrl,
  })
} else {
  let apiPrefix = process.env.RI_API_PREFIX

  if (window.__RI_PROXY_PATH__) {
    apiPrefix = `${window.__RI_PROXY_PATH__}/${apiPrefix}`
  }

  mutableAxiosInstance = axios.create({
    baseURL:
      !isDevelopment && isWebApp
        ? `${window.location.origin}/${apiPrefix}/`
        : `${baseApiUrl}:${apiPort}/${apiPrefix}/`,
  })
}

export const requestInterceptor = (config: AxiosRequestConfig) => {
  if (config?.headers) {
    const instanceId = /databases\/([\w-]+)\/?.*/.exec(config.url || '')?.[1]

    if (instanceId) {
      const dbIndex = sessionStorageService.get(`${BrowserStorageItem.dbIndex}${instanceId}`)

      if (isNumber(dbIndex)) {
        config.headers[CustomHeaders.DbIndex] = dbIndex
      }
    }

    if (window.windowId) {
      config.headers[CustomHeaders.WindowId] = window.windowId
    }

    // TODO: [USER_CONTEXT] Where should these come from?
    config.headers['session-id'] = 'session-id'
    config.headers['user-id'] = 'user-id'
    config.headers['unique-id'] = 'unique-id'
  }

  return config
}

mutableAxiosInstance.interceptors.request.use(
  requestInterceptor,
  (error) => Promise.reject(error)
)

const axiosInstance = mutableAxiosInstance

export default axiosInstance
