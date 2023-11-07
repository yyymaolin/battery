import axios from 'axios'
import router from '@/router'
import { Message, MessageBox, Notification } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // 跨域请求时发送Cookie
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      // 让每个请求携带自定义token
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    config.headers['Content-Type'] = 'application/json'
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    const code = response.status
    if (code < 200 || code > 300) {
      Message({
        message: response.errors,
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    let code = 0
    let errors = ''
    let errorData = ''
    try {
      code = error.response.status
      errors = error.response.data.errors
      errorData = error.response.data
    } catch (e) {
      if (error.toString().indexOf('timeout')) {
        Message({
          message: '请求超时!',
          type: 'error',
          duration: 3 * 1000
        })
        return Promise.reject(error)
      }
    }
    if (code === 401) {
      MessageBox.confirm(
        '登录状态过期了哦，您可以继续留在该页面，或者重新登录',
        '系统提示',
        {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    } else if (code === 403) {
      router.push({ path: '/401' })
    } else if (code === 400) {
      Message({
        message: errors || errorData || '服务端错误',
        type: 'error',
        duration: 3 * 1000
      })
    } else if (code === 404) {
      Notification.error({
        title: '错误',
        message: '请求接口不存在!'
      })
    } else if (code === 502) {
      Notification.error({
        title: '错误',
        message: errors || errorData || '后端服务器连接失败!'
      })
    } else if (code === 500) {
      Notification.error({
        title: '错误',
        message: errors || errorData || '服务端错误!'
      })
    } else {
      Notification.error({
        title: '错误',
        message: errors || errorData || '服务端未知错误!'
      })
    }
    return Promise.reject(error)
  }
)

export default service
