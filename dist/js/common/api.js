"use strict";

var url = "http://10.10.10.166:1882";
var url2 = "http://10.10.10.166:1880";
var ERROR = "000000";
var Api = {
    // 发送验证码
    verification: url + "/user/createVerificationCode",
    // 注册登录
    login: url2 + "/login/userLogin",
    // 通过uuid查询地址
    getByUuid: url2 + "/addressBook/getByUuid",
    // 根据指定条件查询地址
    queryBySearchFilter: url2 + "/addressBook/queryBySearchFilter",
    // 模糊查询
    queryFromApp: url2 + "/addressBook/queryFromApp",
    // 删除地址簿
    remove: url2 + "/addressBook/remove",
    // 修改地址簿
    update: url2 + "/addressBook/update",
    // 查询地址簿
    addressRetrieve: url2 + "/xilaimanager_s/addressBook/retrieveApp",
    // 新增地址
    createAddress: url2 + "/addressBook/create",
    // 发件
    senderOrder: url2 + "/order/senderOrder",
    //实名认证
    realname: url2 + "/idCardAuth/validateUserIdCard",
    //订单详情
    orderDetail: url2 + "/expressOrderDetail/selectByUuid"
};