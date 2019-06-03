const dom = {
    sentAddressName: $("#sentAddressName"),
    sentAddressPhone: $("#sentAddressPhone"),
    sentAddressDetail: $("#sentAddressDetail"),
    receiveAddressName: $("#receiveAddressName"),
    receiveAddressPhone: $("#receiveAddressPhone"),
    receiveAddressDetail: $("#receiveAddressDetail"),
    orderBtn: $("#orderBtn"),
    sentAddressBtn: $("#sentAddressBtn"),
    receiveAddressBtn: $("#receiveAddressBtn"),
    orderStatus: $("#orderState"),
    orderNo: $("#orderNo"),
    cancelBtn: $("#cancelBtn"),
    orderNub: $("#orderNub"),
    goodType: $("#goodType"),
    goodWeight: $("#goodWeight"),
    subscribeTime: $("#subscribeTime"),
    courierName: $("#courierName"),
    courierServe: $("#courierServe"),
    courierAddress: $("#courierAddress"),
    courierWrap: $(".courier-wrap"),
    courierPhone: $("#courierPhone"),
    courierIcon: $(".courier-icon"),
    orgName: $("#orgName"),
    detailAddress: $("#detailAddress"),
    headTelephone: $("#headTelephone")
};
let uuid;
$(document).ready(function () {
    uuid = Util.LocalStorageGetter("order_uuid_string");
    let json_uuid = JSON.parse(uuid);
    let data_json = {
        "object": json_uuid
    };
    getData(data_json);
});

function getData(jsonData) {
    ajax("/xilaisender_s/expressOrderDetail/selectByUuid", "post", jsonData, "json", function (data) {
        if (data.errCode === ERROR && data.object !== null) {
            let data_json = data.object,
                sent_name = data_json.senderName,
                sent_phone = data_json.senderPhone,
                orderNo = data_json.orderNo,
                orderStatus = data_json.orderStatus,
                good_type = data_json.goodsType,
                good_Remark = data_json.goodsRemark,
                good_weight = data_json.goodsWeight,
                bookedFrom = data_json.bookedFrom,
                bookedTo = data_json.bookedTo,
                courierUuid = data_json.courierUuid,
                courierUuidJson = {
                    "object": courierUuid
                },
                // 省市区
                sent_ProvinceCityCountyName = data_json.senderProvinceCityCountyName.split("-").join(""),
                // 详细
                sent_provinceCityRegionTxt = data_json.senderAddressDetail,
                receive_name = data_json.receiverName,
                receive_phone = data_json.receiverPhone,
                receive_receiverProvinceCityCountyName = data_json.receiverProvinceCityCountyName.split("-").join(""),
                receive_receiverAddressDetail = data_json.receiverAddressDetail,
                orgName = data_json.orgName == ('' || null || undefined) ? '无' : data_json.orgName,
                detailAddress = data_json.detailAddress == ('' || null || undefined) ? '无' : data_json.detailAddress,
                headTelephone = data_json.headTelephone == ('' || null || undefined) ? '无' : data_json.headTelephone;
            let orderState, bookedArea;
            if (bookedFrom !== null) {
                bookedArea = bookedFrom.substring(0, bookedFrom.length - 3) + "-" + bookedTo.split(" ")[1].substring(0, bookedTo.length - 3);
            } else {
                bookedArea = "无"
            }
            if (good_type === null) {
                good_type = "无"
            }
            if (good_weight === null) {
                good_weight = "无"
            }
            if (orderStatus === "0") {
                orderState = "待接单";
                dom.cancelBtn.show();
            } else if (orderStatus === "1") {
                orderState = "待取件";
                dom.courierWrap.show()
                getCourier(courierUuidJson)
            } else if (orderStatus === "2") {
                orderState = "未付款";
            } else if (orderStatus === "3") {
                orderState = "待发件";
            } else if (orderStatus === "4") {
                orderState = "代签收";
            } else if (orderStatus === "5") {
                orderState = "已签收";
            } else if (orderStatus === "6") {
                orderState = "已取消";
            }
            let goodsTypeText;
            if(good_type > 1){
                goodsTypeText = goodsType(good_type);
            }else{
                goodsTypeText = good_Remark;
            }

            dom.orderNub.html(orderNo);
            dom.orderStatus.html("订单" + orderState);
            dom.sentAddressName.html(sent_name);
            dom.sentAddressPhone.html(sent_phone);
            dom.goodType.html(goodsTypeText);
            if (good_weight === "无") {
                dom.goodWeight.html(good_weight);
            } else if (good_weight === "0.5") {
                dom.goodWeight.html(good_weight + "公斤及以下");
            }
            else {
                dom.goodWeight.html(good_weight + "公斤");
            }
            dom.sentAddressDetail.html(sent_ProvinceCityCountyName + sent_provinceCityRegionTxt);
            dom.subscribeTime.html(bookedArea);
            dom.receiveAddressName.html(receive_name);
            dom.receiveAddressPhone.html(receive_phone);
            dom.receiveAddressDetail.html(receive_receiverProvinceCityCountyName + receive_receiverAddressDetail);
            dom.orgName.html(orgName);
            dom.receiveAddressPhone.html(receive_phone);
            dom.detailAddress.html(detailAddress);
            dom.headTelephone.html(headTelephone);
        }

    })

}

$(".buttoncheck").click();
$(".buttoncancel").click(function () {
    console.log("取消");
    $(".deleteorder").hide();
});

//0.其它，1.日用品 ，2.数码产品，3.衣物， 4.食物，5.文件
function goodsType(no) {
    switch (no) {
        case "0":
            return "其他";
            break;
        case "1":
            return "日用品";
            break;
        case "2":
            return "数码产品";
            break;
        case "3":
            return "衣物";
            break;
        case "4":
            return "食物";
            break;
        case "5":
            return "文件";
            break;
        default:
            return "无";
    }
}

function getCourier(jsondata) {

    ajax("/xilaisender_s/user/findCourierByUuid", "post", jsondata, "json", function (res) {
        if (res.errCode === ERROR) {
            let data = res.object,
                courierName = data.userName,
                orgName = data.orgName,
                detailAddress = data.detailAddress,
                phone = data.phone,
                photo = data.photo;
            if (photo !== '' && photo !== undefined && photo !== null) {
                dom.courierIcon.find('img').attr('src', photo)
            } else {
                dom.courierIcon.find('img').attr('src', '../../images/kuaidiyuan.png')
            }
            dom.courierPhone.attr("href", "tel:" + phone)
            dom.courierName.html(courierName);
            dom.courierServe.html(orgName);
            dom.courierAddress.html(detailAddress);
        } else {
            return
        }

    })
}


dom.cancelBtn.click(function () {
    $(".popup-wrap").show();
});

function cancelOrder(text) {
    let json_uuid = JSON.parse(uuid);
    let jsondata = {
        "object": {
            "uuid": json_uuid,
            "orderCancelRemark": text
        }
    };
    ajax("/xilaisender_s/order/userCancelOrder", "post", jsondata, "json", function (data) {
        $(".popup-wrap").hide();
        if (data.errCode === ERROR) {
            layer.open({
                content: '取消成功'
                , skin: 'msg'
                , time: 1
            });
            // window.location.href = "../myExpress/myExpress.html";
            setTimeout(function () {
                wx.miniProgram.navigateTo({url: '../myExpress/myExpress'});
                skip.navigateBack();
            }, 1500)
        } else {
            layer.open({
                content: data.errDesc
                , btn: '确定'
            });
        }
    });
}

$("#popup-btn-no").click(function () {
    cancelOrder("不想发了")
});
$("#popup-btn-other").click(function () {
    cancelOrder("其他原因")
});
$(".popup-cancel,.popup-cover").click(function () {
    $(".popup-wrap").hide();
});