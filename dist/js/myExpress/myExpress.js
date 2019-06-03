"use strict";

var p = 1;
var dataList = void 0;
var maxpage = void 0; //最大页数
var dom = {
    list_btn: $("#listBtn"),
    manage_btn: $("#addressManage")
};
$(document).ready(function () {
    judgeState();
    // dom

    // 导航切换
    var li_btn = dom.list_btn.find('li');
    var index = 0;
    li_btn.click(function () {
        $("#logisticsContent ul").each(function () {
            $(this).hide();
        });
        var i = $(this).index();
        Util.LocalStorageSetter("listNo", i);
        var left = $(this).offset().left;
        $(".btn-line .btn-active").css("left", left);
        $("#logisticsContent ul").eq(i).show();
        index = i;
        getlist(index, 1);
    });

    // //页面加载时，直接获取第一次请求
    // getlist(0, 1);

    //滑动的的时候加载
    $(window).scroll(function () {
        if ($(window).scrollTop() >= $(document).height() - $(window).height()) {
            p++;
            getlist(index, p);
            /* alert("scrollTop" + $(window).scrollTop());
             alert("document" + $(document).height());
             alert("window" + $(window).height());*/
        }
    });
});

function getlist(index, page) {
    var jsondata = {
        "object": {
            "pageRow": 10,
            "startPage": 1,
            "object": {}
        }
    };
    jsondata.object.startPage = page;
    if (index === 1 && page === 1) {
        $("#lanshoulist").empty();
        p = 1;
        jsondata.object.object.orderStatus = "0";
    } else if (index === 2 && page === 1) {
        $("#qianshoulist").empty();
        p = 1;
        jsondata.object.object.orderStatus = "4";
    } else if (index === 0 && page === 1) {
        $("#alllist").empty();
        p = 1;
    }
    console.log(page);
    if (page === 1 || page <= maxpage) {

        ajax("/xilaisender_s/expressOrderDetail/queryUserOrderList", 'post', jsondata, 'json',
        //成功返回
        function (alldata) {
            if (alldata.errCode === ERROR) {
                if (alldata.object.totalRow > 0) {
                    var data = alldata.object;
                    maxpage = Math.ceil(alldata.object.totalRow / 10);
                    for (var i in data.list) {
                        console.log(data.list[i]);
                        //地名解析，剥离出市级
                        //寄件方
                        var senderProvinceCityCountyName = data.list[i].senderProvinceCityCountyName;
                        var senderProvinceCityCountyName1 = senderProvinceCityCountyName.split("-");
                        var senderProvinceCityCountyName2 = senderProvinceCityCountyName1[1].split("市");
                        //收件方
                        var receiverProvinceCityCountyName = data.list[i].receiverProvinceCityCountyName;
                        var receiverProvinceCityCountyName1 = receiverProvinceCityCountyName.split("-");
                        var receiverProvinceCityCountyName2 = receiverProvinceCityCountyName1[1].split("市");

                        //订单号
                        var orderNo = data.list[i].orderNo;
                        var uuid = data.list[i].uuid;
                        var orderStatus = data.list[i].orderStatus;
                        var senderName = data.list[i].senderName;
                        var receiverName = data.list[i].receiverName;
                        //使用创建时间
                        var createTime = data.list[i].createTime;
                        var orderstate = void 0;
                        var state = data.list[i].orderStatus;
                        dataList = data.list;

                        if (data.list[i].orderStatus == 0) {
                            orderstate = "待接单";
                        } else if (data.list[i].orderStatus == 1) {
                            orderstate = "待取件";
                        } else if (data.list[i].orderStatus == 2) {
                            orderstate = "未付款";
                        } else if (data.list[i].orderStatus == 3) {
                            orderstate = "待发件";
                        } else if (data.list[i].orderStatus == 4) {
                            orderstate = "待签收";
                        } else if (data.list[i].orderStatus == 5) {
                            orderstate = "已签收";
                        } else if (data.list[i].orderStatus == 6) {
                            orderstate = "已取消";
                        }
                        var myorderDetail = "\n                            <li onclick=\"jump('" + uuid + "','" + orderStatus + "')\"><div class=\"expressNo\">\n                            <div class=\"orderN\"><span>\u8BA2\u5355\u53F7:</span><span><i>" + orderNo + "</i></span></div><div class=\"orderstate\">" + orderstate + "</div></div>\n                            <div class=\"fromto\">\n                            <div class=\"from\">\n                                <p class=\"place\">" + senderProvinceCityCountyName2[0] + "</p>\n                                <p class=\"name\">" + senderName + "</p>\n                            </div>\n                            <div class=\"expressState\">\n                                <div class=\"line\"></div>\n                                <div class=\"icon\">\n                                    <img src=\"../../images/kuaidi2.png\" alt=\"\">\n                                </div>\n                                <div class=\"line\"></div>\n                            </div>\n                            <div class=\"to\">\n                                <p class=\"place\">" + receiverProvinceCityCountyName2[0] + "</p>\n                                <p class=\"name\">" + receiverName + "</p>\n                            </div>\n                            </div>\n                            <div class=\"orderTime\">\n                            <span>\u4E0B\u5355\u65F6\u95F4\uFF1A</span>\n                                <i>" + createTime + "</i>\n                            </div></li>";
                        $(".myExpresslist").eq(index).append(myorderDetail);
                    }
                } else {
                    //没有获取到数据，显示图片
                    var html_none = "<li id=\"sendNone\">\n                                    <div>\n                                        <img src=\"../../images/send-none.png\" alt=\"\">\n                                    </div>\n                                    <div>\n                                        <p>\u76EE\u524D\u6CA1\u6709\u8FD9\u4E2A\u8BB0\u5F55\u54E6\uFF5E</p>\n                                    </div>\n                                </li> ";
                    $(".myExpresslist").append(html_none);
                }
            } else {
                layer.open({
                    content: alldata.errDesc,
                    skin: 'msg',
                    time: 2 //2秒后自动关闭
                });
                setTimeout(function () {
                    loginAgain(alldata);
                }, 2000);
            }
        },
        //失败返回
        function (data) {
            console.log("返回失败", data);
        });
    } else {
        // alert("已加载完毕。")
    }
}

function jump(data, orderStatus) {
    var order_uuid_string = JSON.stringify(data);
    Util.LocalStorageSetter("order_uuid_string", order_uuid_string);
    if (orderStatus === "0" || orderStatus === "1" || orderStatus === "6") {
        skip.navigateTo('/html/expressDetail/expressDetail.html');
    } else {
        wx.miniProgram.navigateTo({ url: '../orderDetail/orderDetail' });
        skip.navigateTo('/html/orderDetail/orderDetail.html');
    }
}

// 进入页面判断哪个
function judgeState() {
    var listNo = Util.LocalStorageGetter("listNo");
    if (listNo === "" || listNo === null || listNo === undefined) {
        getlist(0, 1);
        return;
    }
    // 待揽收
    if (listNo === "1") {
        var left = dom.list_btn.find('li').eq(1).offset().left;
        $(".btn-line .btn-active").css("left", left);
        getlist(1, 1);
        $("#logisticsContent ul").eq(1).show().siblings('ul').hide();
        return;
    }
    // 代签收
    if (listNo === "2") {
        var _left = dom.list_btn.find('li').eq(2).offset().left;
        $(".btn-line .btn-active").css("left", _left);
        getlist(2, 1);
        $("#logisticsContent ul").eq(2).show().siblings('ul').hide();
        return;
    }
    // 全部
    if (listNo === "0") {
        var _left2 = dom.list_btn.find('li').eq(0).offset().left;
        $(".btn-line .btn-active").css("left", _left2);
        getlist(0, 1);
        $("#logisticsContent ul").eq(3).show().siblings('ul').hide();
    }
}