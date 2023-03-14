import request from '@/utils/request'

// GET /admin/product/list/{page}/{limit}
// 获取所有的sku
export function getSkuListReq(page, limit){
    return request({
        url: `/admin/product/list/${page}/${limit}`,
        method: 'GET'
    })
}

// GET /admin/product/onSale/{skuId} 上架
export function skuChangeToOnSale(skuId){
    return request({
        url: `/admin/product/onSale/${skuId}`,
        method: 'GET'
    })
}

// GET /admin/product/cancelSale/{skuId} 下架
export function skuChangeToCancelSale(skuId){
    return request({
        url: `/admin/product/cancelSale/${skuId}`,
        method: 'GET'
    })
}

// GET /admin/product/getSkuById/{skuId}
// 查看Sku的详细信息
export function getSkuInfoById(skuId){
    return request({
        url: `/admin/product/getSkuById/${skuId}`,
        method: 'GET'
    })
}

// DELETE /admin/product/deleteSku/{skuId} 删除
// 删除Sku
export function deleteSkuReq (skuId){
    return request({
        url: `/admin/product/deleteSku/${skuId}`,
        method: 'DELETE'
    })
}