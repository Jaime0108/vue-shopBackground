import request from '@/utils/request'

// GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
// 获取平台属性、属性值列表
export function getAttrInfoListReq(category1Id, category2Id, category3Id){
    return request({
        url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
        method: 'GET'
    })
}

// POST /admin/product/saveAttrInfo
// 保存 添加、修改的属性名、属性值列表
export function saveAttrInfoReq (data){
    return request({
        url: `/admin/product/saveAttrInfo`,
        method: 'POST',
        data
    })
}

// DELETE /admin/product/deleteAttr/{attrId}
// 移除商品属性
export function deleteAttrReq(attrId){
    return request({
        url: `/admin/product/deleteAttr/${attrId}`,
        method: 'DELETE'
    })
}