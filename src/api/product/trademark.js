import request from '@/utils/request'

// 获取品牌信息列表
export function getTradeMarkListReq(page, limit) {
  return request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: 'GET',
  })
}

// 添加或者更新品牌信息
export function addOrUpdateTradeMarkInfoReq(trademarkInfo){
  if(trademarkInfo.id){
    // PUT /admin/product/baseTrademark/update
    return request({
      url: '/admin/product/baseTrademark/update',
      method: 'PUT',
      data: trademarkInfo
    })
  }else{
    // POST /admin/product/baseTrademark/save
    return request({
      url: '/admin/product/baseTrademark/save',
      method: 'POST',
      data: trademarkInfo
    })
  }
}

// 删除品牌
export function deleteTradeMarkByIdReq(id){
  return request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: 'DELETE'
  })
}
