import request from '@/utils/request'

// // 获取在线用户列表
// export function getUsers(data) {
//   return request({
//     url: '/monitor/disassembleinfo/',
//     method: 'get',
//     params: data
//   })
// }

// 上传EXCEL
export function deal_ExcelToSql(data) {
  return request({
    url: '/monitor/externaltransactiondata/',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 查询数据
export function deal_getUserData(params) {
  return request({
    url: '/monitor/externaltransactiondata/',
    method: 'get',
    params
  })
}
