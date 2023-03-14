import request from '@/utils/request'

// GET /admin/product/getCategory1
// 获取一级分类
export function getCategory1ListReq (){
    return request({
        url: '/admin/product/getCategory1',
        method: 'GET'
    })
}

// GET /admin/product/getCategory2/{category1Id}
// 获取二级分类
export function getCategory2ListReq (category1Id){
    return request({
        url: `/admin/product/getCategory2/${category1Id}`,
        method: 'GET'
    })
}
// GET /admin/product/getCategory3/{category2Id}
// 获取三级分类
export function getCategory3ListReq (category2Id){
    return request({
        url: `/admin/product/getCategory3/${category2Id}`,
        method: 'GET'
    })
}