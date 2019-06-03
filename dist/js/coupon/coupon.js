"use strict";

$(document).ready(function () {
    //加载优惠卷
    getCouponData();
});

function getCouponData() {

    ajax("/xilaisender_s/coupon/getByUser", "post", null, "json",
    //请求成功
    function (data) {
        console.log(data.object);
        // 满多少金额
        if (data.errCode === ERROR) {
            if (data.object.length > 0) {
                var new_array1 = [];
                var new_array2 = [];
                var new_array3 = [];
                var new_array4 = [];
                for (var i in data.object) {
                    // 判断是否过期0.未过期，1.已过期
                    if (data.object[i].expire === '0') {
                        //0.未使用，1.使用中，2.已使用
                        if (data.object[i].status === '0') {
                            new_array1.push(data.object[i]);
                        }
                        if (data.object[i].status === '1') {
                            new_array2.push(data.object[i]);
                        }
                        if (data.object[i].status === '2') {
                            new_array3.push(data.object[i]);
                        }
                    } else {
                        new_array4.push(data.object[i]);
                    }
                }
                var new_array = new_array1.concat(new_array2, new_array3, new_array4);
                console.log(new_array);
                for (var _i in new_array) {
                    var status_icon = void 0;
                    if (new_array[_i].expire === '0') {
                        //0.未使用，1.使用中，2.已使用
                        if (new_array[_i].status === '0') {
                            status_icon = '';
                        }
                        if (new_array[_i].status === '1') {
                            status_icon = '../../images/using.png';
                        }
                        if (new_array[_i].status === '2') {
                            status_icon = '../../images/Shape@2x.png';
                        }
                    } else {
                        status_icon = '../../images/Group11@2x.png';
                    }
                    var minimumConsumption = new_array[_i].minimumConsumption;
                    //代金券金额
                    var couponAmount = new_array[_i].couponAmount;
                    //对时间格式进行分离
                    var test = new_array[_i].effectiveFailureTime.split(" ");
                    var time = test[0].split("-").join(".");
                    var userName = Util.CookiesGetter('userName');
                    // 0.未过期，1.已过期
                    var expire_used = new_array[_i].expire === "0" ? "" : "used";
                    //0.未使用，1.使用中，2.已使用
                    var status_used = new_array[_i].status === "0" ? "" : "used";
                    var status_icon_using = new_array[_i].status === "1" ? "../../images/using.png" : "";
                    var html = "<li>\n                <div class=\"coupon-li-wrap " + expire_used + " " + status_used + "\">\n                    <div class=\"li-wrap-top\">\n                        <div class=\"coupon-li-wrap-top\">\n                            <div class=\"wrap-top-price\">\n                                <div class=\"top-price-tit\"><p>\u5FEB\u9012\u4EE3\u91D1\u5238</p></div>\n                                <div class=\"top-price-num\">\n                                    <span class=\"symbol\">\xA5</span>\n                                    <span class=\"num\">" + couponAmount + "</span>\n                                </div>\n                            </div>\n                            <div class=\"wrap-top-date\">\n                                <div class=\"top-date-num\">\u6709\u6548\u671F\u81F3" + time + "</div>\n                                <div class=\"top-data-txt\">\u6EE1\xA5" + minimumConsumption + "\u53EF\u7528</div>\n                            </div>\n                        </div>\n                        <div class=\"bottom-left-corner\"></div>\n                        <div class=\"bottom-right-corner\"></div>\n                    </div>\n                    <div class=\"li-wrap-bottom\">\n                        <div class=\"coupon-li-wrap-bottom\">\n                            <p>\u4EC5\u9650\u624B\u673A\u53F7" + userName + "\u4F7F\u7528</p>\n                        </div>\n                        <div class=\"top-left-corner\"></div>\n                        <div class=\"top-right-corner\"></div>\n                        <div class=\"used-icon\" style=\"display: none\"><img src=\"" + status_icon + "\" alt=\"\"></div>\n                    </div>\n                </div>\n            </li>";
                    $(".coupon ul").append(html);
                }
            } else {
                var html_none = "<li id=\"quanNone\">\n                                    <div>\n                                        <img src=\"../../images/quan.png\" alt=\"\">\n                                    </div>\n                                    <div>\n                                        <p>\u60A8\u5F53\u524D\u6CA1\u6709\u5361\u5238\u54E6\uFF5E</p>\n                                    </div>\n                                </li> ";
                $(".coupon ul").append(html_none);
            }
        } else {
            layer.open({
                content: data.errDesc,
                skin: 'msg',
                time: 2
            });
        }
    },
    //请求失败
    function (data) {
        alert("网络请求失败");
    });
}