import request from '@/utils/request'

// // 获取在线用户列表
// export function getUsers(data) {
//   return request({
//     url: '/monitor/users/',
//     method: 'get',
//     params: data
//   })
// }

// 上传EXCEL
export function price_ExcelToSql(data) {
  return request({
    url: '/monitor/localelectricityprice/',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 查询数据
export function price_getUserData(params) {
  return request({
    url: '/monitor/localelectricityprice/',
    method: 'get',
    params
  })
}
