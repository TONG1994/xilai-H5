"use strict";

// dom
var dom = {
    list_btn: $("#listBtn"),
    manage_btn: $("#addressManage"),
    logisticsContent: $("#logisticsContent").find("ul"),
    sentCity: $("#sentCity"),
    receiveCity: $("#receiveCity"),
    logisticsDetail: $(".logisticsDetail"),
    orderNo: $(".orderNo")
};
var uuid = void 0;
$(document).ready(function () {
    uuid = Util.LocalStorageGetter("order_uuid_string");
    var json_uuid = JSON.parse(uuid);
    var data_json = {
        "object": json_uuid
    };

    importdata(data_json);
});

//判断IOS版本
var ver = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
try {
    ver = parseInt(ver[1], 10);
    if (ver < 10) {
        $(".mycopy").css("display", "none");
    } else {
        $(".mycopy").css("display", "block");
    }
} catch (e) {
    console.log(e);
}

//一键复制单号
function copy() {
    var input = document.createElement("input");
    input.setAttribute('readonly', 'readonly');
    // $("input").css("opacity", "0");
    $("input").css("z-index", "-1");
    input.value = $("#companyId").html();
    document.body.appendChild(input);
    input.select();
    input.setSelectionRange(0, input.value.length), document.execCommand('Copy');
    document.body.removeChild(input);
    layer.open({
        content: '物流单号复制成功',
        skin: 'msg',
        time: 1
    });
    //屏蔽默认键盘弹出；
    $('input').focus(function () {
        document.activeElement.blur();
    });
}

// 导航切换
var li_btn = dom.list_btn.find('li');
li_btn.click(function () {
    dom.logisticsContent.each(function () {
        $(this).hide();
    });
    var i = $(this).index();
    if (i === 1) {
        logisticsDetails(logisticsNo);
    }
    var left = $(this).offset().left;
    $(".btn-line .btn-active").css("left", left);
    dom.logisticsContent.eq(i).show();
});

//物流详情
function logisticsDetails(id) {
    var jsonData = {
        "object": id
    };
    dom.logisticsDetail.empty();
    if (id === null) {
        var html = "<li class=\"logistics-No\">\n                       <p>\u6682\u65E0\u7269\u6D41\u8BE6\u60C5</p>\n                    </li>";
        dom.logisticsDetail.append(html);
    } else {
        ajax("/xilaisender_s/route/getByLogisticsNo", "post", jsonData, "json", function (data) {
            if (data.errCode === ERROR) {
                var data_json = data.object;
                for (var i in data_json.routes) {
                    var firstIcon = i === "0" ? "firstIcon" : "";
                    var _html = "<li>\n                        <i class=\"grayIcon " + firstIcon + "\"></i>\n                        <div class=\"logsiticsPath\">\n                            <p class=\"mess\">" + data_json.routes[i].desc + "</p>\n                            <p class=\"time\">" + data_json.routes[i].createTime + "\n</p>\n                        </div>\n                    </li>";
                    dom.logisticsDetail.append(_html);
                }
            } else {
                layer.open({
                    content: data.errDesc,
                    skin: 'msg',
                    time: 2 //2秒后自动关闭
                });
                setTimeout(function () {
                    loginAgain(data);
                }, 2000);
            }
        });
    }
}

// 运单详情
var logisticsNo = void 0;

function importdata(data) {
    ajax("/xilaisender_s/expressOrderDetail/selectByUuid", "post", data, "json", function (data) {
        if (data.errCode === ERROR && data.object !== null) {
            //寄件方l
            var data_ob = data.object;
            logisticsNo = data_ob.logisticsNo;
            var senderProvinceCityCountyName = data_ob.senderProvinceCityCountyName;
            //地名拆分
            var senderProvinceCityCountyName1 = senderProvinceCityCountyName.split("-");
            //通过市拆分
            var senderProvinceCityCountyName2 = senderProvinceCityCountyName1[1];
            var senderProvinceCityCountyName3 = senderProvinceCityCountyName1.join("") + data_ob.senderAddressDetail;
            //收件方
            var receiverProvinceCityCountyName = data_ob.receiverProvinceCityCountyName;
            //地名拆分
            var receiverProvinceCityCountyName1 = receiverProvinceCityCountyName.split("-");
            //通过市拆分
            var receiverProvinceCityCountyName2 = receiverProvinceCityCountyName1[1];
            var receiverProvinceCityCountyName3 = receiverProvinceCityCountyName1.join("") + data_ob.receiverAddressDetail;

            var stateText = void 0;
            $(".orderNo").text(data_ob.orderNo);
            if (data_ob.orderStatus === "0") {
                stateText = "待接单";
                $(".cancel-li").show();
            } else if (data_ob.orderStatus === "1") {
                stateText = "待取件";
            } else if (data_ob.orderStatus === "2") {
                stateText = "未付款";
            } else if (data_ob.orderStatus === "3") {
                stateText = "待发件";
            } else if (data_ob.orderStatus === "4") {
                stateText = "待签收";
            } else if (data_ob.orderStatus === "5") {
                stateText = "已签收";
            } else if (data_ob.orderStatus === "6") {
                stateText = "已取消";
            }
            $("#stateText").text("订单" + stateText);
            //快递公司、物流单号
            if (data_ob.logisticsCompanyName === null) {
                $("#companyName").text("无");
            } else {
                $("#companyName").text(data_ob.logisticsCompanyName);
            }
            if (data_ob.logisticsNo === null) {
                $("#companyId").text("无");
            } else {
                $("#companyId").text(data_ob.logisticsNo);
            }
            if (data_ob.logisticsCompanyUuid === "deppon") {
                $(".companyImg img").attr("src", "../../images/deppon.png");
            } else if (data_ob.logisticsCompanyUuid === "zto") {
                $(".companyImg img").attr("src", "../../images/zto.png");
            } else if (data_ob.logisticsCompanyUuid === "zjs") {
                $(".companyImg img").attr("src", "../../images/zhaijisong.png");
            }

            //寄件人地址
            $(".start").text(senderProvinceCityCountyName2);

            //收件人地址
            $(".destination").text(receiverProvinceCityCountyName2);

            //喜来单号
            if (data_ob.xlLogisticsNo === null) {
                $(".sheetNo").text("无");
            } else {
                $(".sheetNo").text(data_ob.xlLogisticsNo);
            }

            //寄件方
            $("#senderName").text(data_ob.senderName);
            $("#senderTel").text(data_ob.senderPhone);
            $("#senderAddress").text(senderProvinceCityCountyName3);

            //收件方
            $("#receiverName").text(data_ob.receiverName);
            $("#receiverTel").text(data_ob.receiverPhone);
            $("#receiverAddress").text(receiverProvinceCityCountyName3);

            // 物品类型
            if (data_ob.goodsType === null) {
                $("#tableGoods").text("无");
            } else {
                //0.其它，1.日用品 ，2.数码产品，3.衣物， 4.食物，5.文件
                var type_text = void 0;
                if (data_ob.goodsType === "0") {
                    type_text = data_ob.goodsRemark;
                }
                if (data_ob.goodsType === "1") {
                    type_text = "日用品";
                }
                if (data_ob.goodsType === "2") {
                    type_text = "数码产品";
                }
                if (data_ob.goodsType === "3") {
                    type_text = "衣物";
                }
                if (data_ob.goodsType === "4") {
                    type_text = "食物";
                }
                if (data_ob.goodsType === "5") {
                    type_text = "文件";
                }
                $("#tableGoods").text(type_text);
            }
            // 运输方式
            if (data_ob.transportTypeName === null) {
                $("#tableType").text("无");
            } else {
                $("#tableType").text(data_ob.transportTypeName);
            }
            // 重量
            if (data_ob.goodsWeight === null) {
                $("#tableWeight").text("无");
            } else if (data_ob.goodsWeight === "0.5") {
                $("#tableWeight").text(data_ob.goodsWeight + "公斤及以下");
            } else {
                $("#tableWeight").text(data_ob.goodsWeight + "公斤");
            }
            // 付款方式
            if (data_ob.payType === null && data_ob.orderStatus !== "2") {
                $("#payMethod").text("无");
            } else if (data_ob.payType === null && data_ob.orderStatus === "2") {
                $("#payMethod").text("未付款");
            } else {
                //0,支付宝支付;1,快递员代付;2,支付宝我的快递支付
                var _type_text = void 0;
                if (data_ob.payType === "0") {
                    _type_text = "支付宝支付";
                }
                if (data_ob.payType === "1") {
                    _type_text = "快递员代付";
                }
                if (data_ob.payType === "2") {
                    _type_text = "支付宝我的快递支付";
                }
                $("#payMethod").text(_type_text);
            }
            // 总金额
            if (data_ob.originalPrice === null) {
                $("#moneyAll").text("无");
            } else {
                $("#moneyAll").text(data_ob.originalPrice + "元");
            }
            // 优惠金额
            if (data_ob.couponAmount === null) {
                $("#moneyDiscount").text("无");
            } else {
                $("#moneyDiscount").text(data_ob.couponAmount + "元");
            }
            // 实际付款金额
            if (data_ob.orderAmount === null) {
                $("#moneyActual").text("无");
            } else {
                var orderAmount = data_ob.payType === null ? "0" : data_ob.orderAmount;
                $("#moneyActual").text(orderAmount + "元");
            }
            // 收件员姓名
            if (data_ob.courierName === null) {
                $(".staffName").text("无");
            } else {
                $(".staffName").text(data_ob.courierName);
            }
            //收件员编号
            if (data_ob.courierNo === null) {
                $(".staffNo").text("无");
            } else {
                $(".staffNo").text(data_ob.courierNo);
            }
            //收件时间（字段中没有这个，但是有接单时间、发件时间、签收时间、支付时间）
            if (data_ob.receiptTime === null) {
                $(".sheettime").text("无");
            } else {
                $(".sheettime").text(data_ob.receiptTime);
            }
        } else {
            layer.open({
                content: JSON.stringify(data.object),
                skin: 'msg',
                time: 1
            });
        }
    });
}

$(".cancel").click(function () {
    $(".popup-wrap").show();
});

function cancelOrder(text) {
    var json_uuid = JSON.parse(uuid);
    var jsondata = {
        "object": {
            "uuid": json_uuid,
            "orderCancelRemark": text
        }
    };
    ajax("/xilaisender_s/order/userCancelOrder", "post", jsondata, "json", function (data) {
        $(".popup-wrap").hide();
        if (data.errCode === ERROR) {
            layer.open({
                content: '取消成功',
                skin: 'msg',
                time: 1
            });
            // window.location.href = "../myExpress/myExpress.html";
            setTimeout(function () {
                wx.miniProgram.navigateTo({ url: '../myExpress/myExpress' });
                skip.navigateBack();
            }, 1500);
        } else {
            layer.open({
                content: data.errDesc,
                btn: '确定'
            });
        }
    });
}

$("#popup-btn-no").click(function () {
    cancelOrder("不想发了");
});
$("#popup-btn-other").click(function () {
    cancelOrder("其他原因");
});
$(".popup-cancel,.popup-cover").click(function () {
    $(".popup-wrap").hide();
});