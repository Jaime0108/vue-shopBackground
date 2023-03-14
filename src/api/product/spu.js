import request from '@/utils/request'

// GET /admin/product/{page}/{limit}
// category3Id query
export function getSpuListReq(page, limit, category3Id) {
    return request({
        url: `/admin/product/${page}/${limit}`,
        method: 'GET',
        params: { category3Id }
    })
}

// GET /admin/product/getSpuById/{spuId}
// 获取SPU信息
export function getSpuByIdReq(spuId) {
    return request({
        url: `/admin/product/getSpuById/${spuId}`,
        method: 'GET'
    })
}

// GET /admin/product/baseTrademark/getTrademarkList  
// 获取品牌列表
export function getTrademarkListReq() {
    return request({
        url: '/admin/product/baseTrademark/getTrademarkList',
        method: 'GET'
    })
}

// GET /admin/product/spuImageList/{spuId} 
// 图片列表
export function getSpuImageListReq(spuId) {
    return request({
        url: `/admin/product/spuImageList/${spuId}`,
        method: 'GET'
    })
}

// GET /admin/product/baseSaleAttrList 
// 获取平台销售属性
export function getBaseSaleAttrListReq() {
    return request({
        url: '/admin/product/baseSaleAttrList',
        method: 'GET'
    })
}

// GET /admin/product/spuSaleAttrList/{spuId}
// 获取当个SPU上面的销售属性
export function getSpuSaleAttrListByIdReq(spuId){
    return request({
        url: `/admin/product/spuSaleAttrList/${spuId}`,
        method: 'GET'
    })
}

// POST /admin/product/saveSpuInfo  body
// 添加或修改SPU
export function addOrUpdateSpuInfoReq(data) {
    if (data.id) {
        console.log('更新');
        return request({
            url: '/admin/product/updateSpuInfo',
            method: 'POST',
            data
        })
    } else {
        console.log('添加');
        return request({
            url: '/admin/product/saveSpuInfo',
            method: 'POST',
            data
        })
    }
}

// DELETE /admin/product/deleteSpu/{spuId}
// 删除SPU
export function deleteSpuReq (spuId){
    return request({
        url: `/admin/product/deleteSpu/${spuId}`,
        method: 'DELETE'
    })
}

// POST /admin/product/saveSkuInfo
// 新增SKU
export function addSkuConfirmReq(data){
 return request({
    url: '/admin/product/saveSkuInfo',
    method: 'POST',
    data
 })   
}

// GET /admin/product/findBySpuId/{spuId}
// 查看所有的Sku信息
export function getSkuListBySpuIdReq(spuId){
    return request({
        url: `/admin/product/findBySpuId/${spuId}`,
        method: 'GET'
    })
}