"use strict";

var dom = {
    sentAddressName: $("#sentAddressName"),
    sentAddressPhone: $("#sentAddressPhone"),
    sentAddressDetail: $("#sentAddressDetail"),
    receiveAddressName: $("#receiveAddressName"),
    receiveAddressPhone: $("#receiveAddressPhone"),
    receiveAddressDetail: $("#receiveAddressDetail"),
    orderBtn: $("#orderBtn"),
    sentAddressBtn: $("#sentAddressBtn"),
    receiveAddressBtn: $("#receiveAddressBtn"),
    loadingWrap: $(".loading-wrap"),
    closeDate: $("#closeDate"),
    sureDate: $("#sureDate"),
    selectDay: $("#selectDay"),
    selectTime: $("#selectTime"),
    popupWrap: $(".popup-wrap"),
    popupWraps: $(".popup-wraps"),
    popupSection: $(".popup-section"),
    showDate: $("#showDate"),
    showStation: $("#showStation"),
    orgNo: $("#orgNo"),
    orgUuid: $("#orgUuid"),
    owStation: $("#owStation"),
    selectBtn: $(".select-btn"),
    dataShowTime: $(".data-show-time"),
    showWeight: $("#showWeight"),
    showThing: $("#showThing"),
    stationContent: $(".station-content ul"),
    typeBtn: $(".type-btn"),
    sureType: $("#sureType"),
    selectType: $("#selectType"),
    typeValue: $("#typeValue"),
    thingType: $("#thingType")
};
// 同意条款
$("#agree").click(function () {
    if ($(this).is('.icon-webicon202')) {
        $(this).addClass("icon-fangkuangxuanze");
        $(this).removeClass("icon-webicon202");
        dom.orderBtn.attr("disabled", false);
        dom.orderBtn.toggleClass("active");
    } else {
        $(this).removeClass("icon-fangkuangxuanze");
        $(this).addClass("icon-webicon202");
        dom.orderBtn.attr("disabled", true);
        dom.orderBtn.toggleClass("active");
    }
});
var sent_data = void 0,
    sent_name = void 0,
    sent_phone = void 0,
    sent_provinceCityRegion = void 0,
    sent_longitude = void 0,
    sent_latitude = void 0,
    sent_cityCode = void 0,
    sent_provinceCityRegionTxt_line = void 0,
    sent_provinceCityRegionTxt = void 0,
    sent_addressDetail = void 0,
    sent_senderLocation = void 0,
    receive_data = void 0,
    receive_name = void 0,
    receive_phone = void 0,
    receive_provinceCityRegion = void 0,
    receive_longitude = void 0,
    receive_latitude = void 0,
    receive_cityCode = void 0,
    receive_provinceCityRegionTxt_line = void 0,
    receive_provinceCityRegionTxt = void 0,
    receive_addressDetail = void 0;

$(document).ready(function () {
    getUserAdresss();
    getDate();
    var weightWrap = Util.LocalStorageGetter("weight");
    var thingWrap = Util.LocalStorageGetter("thingWrap");
    var stationWrap = Util.LocalStorageGetter("showStation");
    var orgNo = Util.LocalStorageGetter("orgNo");
    var orgUuid = Util.LocalStorageGetter("orgUuid");
    var typeValue = Util.LocalStorageGetter("type_value");
    if (thingWrap !== "" && thingWrap !== undefined && thingWrap !== null) {
        dom.showThing.html(thingWrap);
    }
    if (weightWrap !== "" && weightWrap !== undefined && weightWrap !== null) {
        dom.showWeight.html(weightWrap);
    }
    if (typeValue !== "" && typeValue !== undefined && typeValue !== null) {
        dom.thingType.html(typeValue);
    }
    if (sent_data) {
        var sentJsonData = {
            "object": {
                "longitude": sent_longitude,
                "latitude": sent_latitude,
                "addrDetail": sent_provinceCityRegionTxt_line,
                "cityCode": sent_cityCode,
                "isAlipay": ""
            }
        };

        ajax("/xilaisender_s/user/senderAddressCheck", "post", sentJsonData, "json", function (data) {
            dom.loadingWrap.hide();
            if (data.errCode == "000000") {
                if (data.object.length == 0) {
                    dom.showStation.html("暂无");
                    document.getElementById('tishi').style.display = 'inline';
                    $("#agree").unbind("click");
                } else if (data.object.length == 1) {

                    var stationList = data.object;

                    for (var i in stationList) {
                        var _orgUuid = stationList[i].orgUuid,
                            name = stationList[i].orgName,
                            phone = stationList[i].headTelephone,
                            area = stationList[i].area,
                            address = stationList[i].detailAddress,
                            _orgNo = stationList[i].orgNo;

                        var html = "<li>\n                                    <input type=\"hidden\" class=\"address-uuid\" value=\"" + _orgUuid + "\">\n                                    <div class=\"content-wrap border-1px-bottom\" onclick=\"showStation(this)\">\n                                        <div class=\"fang\"></div>\n                                        <div class=\"adr-wrap\">\n                                            <div class=\"adr-name\">" + name + "</div>\n                                            <div class=\"adr-phone\">" + phone + "</div>\n                                        </div>\n                                        <div class=\"adr-detail\">\n                                            " + address + " \n                                        </div>\n                                        <div class=\"adr-area\">\n                                            " + area + " m\n                                        </div>\n                                        <div class=\"adr-org\" style=\"display: none\">" + _orgNo + "</div>\n                                        <div class=\"adr-uuid\" style=\"display: none\">" + _orgUuid + "</div>\n                                    </div>\n                                </li>";
                        dom.stationContent.append(html);
                    }

                    dom.showStation.html(stationList[0].orgName);
                    dom.orgNo.html(stationList[0].orgNo);
                    dom.orgUuid.html(stationList[0].orgUuid);

                    document.getElementById("jiantou").style.display = "none";
                    document.getElementById("konghang").style.display = "block";
                    $("#showStation").unbind("click");
                } else {
                    $("#showStation").click(function () {
                        $(".popup-wraps").show();
                    });
                    var _stationList = data.object;

                    for (var _i in _stationList) {
                        var _orgUuid2 = _stationList[_i].orgUuid,
                            _name = _stationList[_i].orgName,
                            _phone = _stationList[_i].headTelephone,
                            _area = _stationList[_i].area,
                            _address = _stationList[_i].detailAddress,
                            _orgNo2 = _stationList[_i].orgNo;
                        var areaNum = void 0;
                        if (_area > 999) {
                            areaNum = (_area * 0.001).toFixed(2) + "km";
                        } else {
                            areaNum = _area + "m";
                        }
                        var _html = "<li>\n                                    <input type=\"hidden\" class=\"address-uuid\" value=\"" + _orgUuid2 + "\">\n                                    <div class=\"content-wrap border-1px-bottom\" onclick=\"showStation(this)\">\n                                        <div class=\"fang\"></div>\n                                        <div class=\"adr-wrap\">\n                                            <div class=\"adr-name\">" + _name + "</div>\n                                            <div class=\"adr-phone\">" + _phone + "</div>\n                                        </div>\n                                        <div class=\"adr-detail\">\n                                            " + _address + " \n                                        </div>\n                                        <div class=\"adr-area\">\n                                            " + areaNum + "\n                                        </div>\n                                        <div class=\"adr-org\" style=\"display: none\">" + _orgNo2 + "</div>\n                                        <div class=\"adr-uuid\" style=\"display: none\">" + _orgUuid2 + "</div>\n                                    </div>\n                                </li>";
                        dom.stationContent.append(_html);
                    }
                    if (stationWrap !== "" && stationWrap !== undefined && stationWrap !== null) {
                        dom.showStation.html(stationWrap);
                        dom.orgNo.html(orgNo);
                        dom.orgUuid.html(orgUuid);
                    } else {
                        dom.showStation.html(_stationList[0].orgName);
                        dom.orgNo.html(_stationList[0].orgNo);
                        dom.orgUuid.html(_stationList[0].orgUuid);
                    }

                    document.getElementById("jiantou").style.display = "block";
                    document.getElementById("konghang").style.display = "none";
                }
            } else {
                dom.showStation.html("暂无");
                $("#showStation").unbind("click");
                document.getElementById('tishi').style.display = 'inline';
                $("#agree").unbind("click");
            }
        });
    }
    if (sent_data && receive_data) {
        var receiveJsonData = {
            "object": {
                "longitude": sent_longitude,
                "latitude": sent_latitude,
                "addrDetail": sent_provinceCityRegionTxt_line,
                "cityCode": sent_cityCode,
                "destinationCode": receive_cityCode
            }
        };
        ajax("/xilaisender_s/user/receiverAddressCheck", "post", receiveJsonData, "json", function (data) {
            dom.loadingWrap.hide();
            if (data.object == 0) {
                document.getElementById('tishis').style.display = 'inline';
                $("#agree").unbind("click");
            }
        });
    } else if (receive_data && sent_data == null) {
        var receiveJsonDatas = {
            "object": {
                "longitude": "",
                "latitude": "",
                "addrDetail": "",
                "cityCode": "",
                "destinationCode": receive_cityCode
            }
        };
        ajax("/xilaisender_s/user/receiverAddressCheck", "post", receiveJsonDatas, "json", function (data) {
            dom.loadingWrap.hide();
            if (data.object == 0) {
                document.getElementById('tishis').style.display = 'inline';
                $("#agree").unbind("click");
            }
        });
    }
});

//选择服务站
function showStation(that) {
    var orgName = $(that).find(".adr-name").html();
    var orgNo = $(that).find(".adr-org").html();
    var orgUuid = $(that).find(".adr-uuid").html();
    dom.showStation.html(orgName);
    dom.orgNo.html(orgNo);
    dom.orgUuid.html(orgUuid);
    $(".popup-wraps").hide();
    Util.LocalStorageSetter("showStation", orgName);
    Util.LocalStorageSetter("orgNo", orgNo);
    Util.LocalStorageSetter("orgUuid", orgUuid);
}

// 获取数据
function getUserAdresss() {
    sent_data = Util.LocalStorageGetter("sent-address-data");
    var sent_data_string = JSON.parse(sent_data);
    receive_data = Util.LocalStorageGetter("receive-address-data");
    var receive_data_string = JSON.parse(receive_data);
    // 发件地址
    if (sent_data !== '' && sent_data !== undefined && sent_data !== null) {
        sent_name = sent_data_string.name;
        sent_phone = sent_data_string.phone;
        sent_provinceCityRegion = sent_data_string.proviceCityRegion;
        sent_cityCode = sent_data_string.proviceCityRegion.split('-')[1];
        sent_provinceCityRegionTxt_line = sent_data_string.proviceCityRegionTxt;
        sent_provinceCityRegionTxt = sent_provinceCityRegionTxt_line.split("-").join("");
        sent_addressDetail = sent_data_string.addrDetail;
        sent_longitude = sent_data_string.longitude;
        sent_latitude = sent_data_string.latitude;
        sent_senderLocation = sent_data_string.longitude + "," + sent_data_string.latitude;
        dom.sentAddressName.html(sent_name);
        dom.sentAddressName.css("color", "#121212");
        dom.sentAddressPhone.html(sent_phone);
        dom.sentAddressDetail.html(sent_provinceCityRegionTxt + sent_addressDetail);
    }
    // 收件地址
    if (receive_data !== '' && receive_data !== undefined && receive_data !== null) {
        receive_name = receive_data_string.name;
        receive_phone = receive_data_string.phone;
        receive_provinceCityRegion = receive_data_string.proviceCityRegion;
        receive_cityCode = receive_data_string.proviceCityRegion.split('-')[1];
        receive_provinceCityRegionTxt_line = receive_data_string.proviceCityRegionTxt;
        receive_provinceCityRegionTxt = receive_provinceCityRegionTxt_line.split("-").join("");
        receive_addressDetail = receive_data_string.addrDetail;
        receive_longitude = receive_data_string.longitude;
        receive_latitude = receive_data_string.latitude;
        dom.receiveAddressName.html(receive_name);
        dom.receiveAddressName.css("color", "#121212");
        dom.receiveAddressPhone.html(receive_phone);
        dom.receiveAddressDetail.html(receive_provinceCityRegionTxt + receive_addressDetail);
    }
}

// 选发件地址
dom.sentAddressBtn.click(function () {
    Util.LocalStorageRemove("showStation");
    Util.LocalStorageRemove("orgNo");
    Util.LocalStorageRemove("orgUuid");
    // 1为发件
    Util.LocalStorageSetter("address_key", "1");
    Util.LocalStorageSetter("address_search_key", "1");
    Util.LocalStorageSetter("url_flag", "../address/my-address.html");
    Util.LocalStorageSetter("mini_url_flag", "../address/my-address");
    wx.miniProgram.redirectTo({ url: '../address/my-address' });
    skip.navigateTo("/html/address/my-address.html");
    // window.location.href = "../address/my-address.html";
});
// 选收件地址
dom.receiveAddressBtn.click(function () {
    // 2为收件
    Util.LocalStorageSetter("address_key", "2");
    Util.LocalStorageSetter("address_search_key", "2");
    Util.LocalStorageSetter("url_flag", "../address/my-address.html");
    Util.LocalStorageSetter("mini_url_flag", "../address/my-address");
    wx.miniProgram.redirectTo({ url: '../address/my-address' });
    skip.navigateTo("/html/address/my-address.html");
    // window.location.href = "../address/my-address.html";
});
// 立即下单(防多次点击)
loginBtn(dom.orderBtn, function () {
    var has_sent_data = sent_data !== undefined && sent_data !== null && sent_data !== '',
        has_receive_data = receive_data !== undefined && receive_data !== null && receive_data !== '';
    var thingText = dom.thingType.html();
    console.log(thingText);
    var goodsType = thingType(thingText);
    var goodsRemark = thingText;
    var kg_value = dom.showWeight.html();
    var goodsWeight = void 0;
    if (kg_value !== undefined && kg_value !== "") {
        goodsWeight = kg_value.split("公斤")[0];
    } else {
        layer.open({
            content: '请你选择物品重量',
            skin: 'msg',
            time: 1
        });
        return false;
    }

    var dateArea = dom.showDate.html();
    var bookedFrom = void 0;
    var bookedTo = void 0;
    if (dateArea !== undefined && dateArea !== "") {
        var dataDay = dateArea.split(" ")[0];
        bookedFrom = dataDay + " " + dateArea.split(" ")[1].split("-")[0] + ":00";
        bookedTo = dataDay + " " + dateArea.split(" ")[1].split("-")[1] + ":00";
    } else {
        layer.open({
            content: '请您选择预约时间',
            skin: 'msg',
            time: 1
        });
        return false;
    }
    var orgName = dom.showStation.html();
    var orgNo = dom.orgNo.html();
    var orgUuid = dom.orgUuid.html();

    dom.loadingWrap.show();
    if (has_sent_data && has_receive_data) {
        // 发送地址编码
        var sentProvinceCityRegionArray = sent_provinceCityRegion.split(","),
            sentProvinceCityRegion = sentProvinceCityRegionArray.join("-");
        // 收件地址编码
        var receiveProvinceCityRegionArray = receive_provinceCityRegion.split(","),
            receiveProvinceCityRegion = receiveProvinceCityRegionArray.join("-");
        var jsonData = {
            "object": {
                "senderLocation": sent_senderLocation,
                "senderName": sent_name,
                "senderPhone": sent_phone,
                "senderProvinceCityCountyCode": sentProvinceCityRegion,
                "senderProvinceCityCountyName": sent_provinceCityRegionTxt_line,
                "senderAddressDetail": sent_addressDetail,
                "receiverName": receive_name,
                "receiverPhone": receive_phone,
                "receiverProvinceCityCountyCode": receiveProvinceCityRegion,
                "receiverProvinceCityCountyName": receive_provinceCityRegionTxt_line,
                "receiverAddressDetail": receive_addressDetail,
                "agreementStatus": "1",
                "orderSource": "4",
                "goodsType": goodsType,
                "goodsWeight": goodsWeight,
                "goodsRemark": goodsRemark,
                "bookedFrom": bookedFrom,
                "bookedTo": bookedTo,
                "isSelectService": "1",
                "orgBaseInfoList": [{
                    "orgName": orgName,
                    "orgNo": orgNo,
                    "orgUuid": orgUuid
                }]
            }
        };
        ajax("/xilaisender_s/order/senderOrder", "post", jsonData, "json", function (data) {
            dom.loadingWrap.hide();
            if (data.errCode === ERROR) {
                layer.open({
                    content: '下单成功',
                    skin: 'msg',
                    time: 1
                });
                Util.LocalStorageRemove("sent-address-data");
                Util.LocalStorageRemove("receive-address-data");
                Util.LocalStorageRemove("thingWrap");
                Util.LocalStorageRemove("time_show_value");
                Util.LocalStorageRemove("weight");
                Util.LocalStorageRemove("showStation");
                Util.LocalStorageRemove("orgNo");
                Util.LocalStorageRemove("orgUuid");
                Util.LocalStorageSetter("order_uuid_string", JSON.stringify(data.object.uuid));

                // window.location.href = "../myExpress/myExpress.html";
                setTimeout(function () {
                    wx.miniProgram.redirectTo({ url: '../myExpress/myExpress' });
                    skip.reLaunch("/html/expressDetail/expressDetail.html");
                }, 1500);
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
        }, function () {
            dom.loadingWrap.hide();
            layer.open({
                content: '网络异常',
                skin: 'msg',
                time: 2
            });
        });
    } else {
        dom.loadingWrap.hide();
        layer.open({
            content: '地址请填写完整哦',
            skin: 'msg',
            time: 2
        });
    }
});

function iosSelect() {
    var weightData = [{ 'id': '20001', 'value': '0.5公斤及以下' }];
    var weightValue = 0.5,
        id = 2001,
        weightArray = void 0;
    for (var i = 0; i < 59; i++) {
        weightValue = weightValue + 0.5;
        weightValue.toFixed(1);
        id = parseInt(id + 1);
        weightArray = { 'id': "" + id, 'value': weightValue + "\u516C\u65A4" };
        weightData.push(weightArray);
    }
    var thingData = [{ 'id': '10001', 'value': '日用品' }, { 'id': '10002', 'value': '数码产品' }, { 'id': '10003', 'value': '衣物' }, { 'id': '10004', 'value': '食物' }, { 'id': '10005', 'value': '文件' }, { 'id': '10006', 'value': '其他' }];
    var showThingDom = document.querySelector('#showThing');
    var ThingdDom = document.querySelector('#thingId');
    var showWeightDom = document.querySelector('#showWeight');
    var WeightDom = document.querySelector('#weightId');

    // showThingDom.addEventListener('click', function () {
    //     var thingId = showThingDom.dataset['id'];
    //     var thingName = showThingDom.dataset['value'];
    //     var thingSelect = new IosSelect(1,
    //         [thingData],
    //         {
    //             container: '.thingWrap',
    //             title: '物品选择',
    //             itemHeight: 50,
    //             itemShowCount: 3,
    //             oneLevelId: thingId,
    //             showAnimate: true,
    //             callback: function (selectOneObj) {
    //                 ThingdDom.value = selectOneObj.id;
    //                 showThingDom.innerHTML = selectOneObj.value;
    //                 showThingDom.dataset['id'] = selectOneObj.id;
    //                 showThingDom.dataset['value'] = selectOneObj.value;
    //             }
    //         });
    // });
    showWeightDom.addEventListener('click', function () {
        console.log(weightData);
        var weightId = showWeightDom.dataset['id'];
        var weightName = showWeightDom.dataset['value'];
        var weightSelect = new IosSelect(1, [weightData], {
            container: '#weightWrap',
            title: '重量选择',
            itemHeight: 50,
            itemShowCount: 3,
            oneLevelId: weightId,
            showAnimate: true,
            callback: function callback(selectOneObj) {
                WeightDom.value = selectOneObj.id;
                showWeightDom.innerHTML = selectOneObj.value;
                showWeightDom.dataset['id'] = selectOneObj.id;
                showWeightDom.dataset['value'] = selectOneObj.value;
            }
        });
    });
}

$(".popup-cover,#closeDate,#closeType").click(function () {
    closeSelectTime();
});
dom.showDate.click(function () {
    dom.popupWrap.show();
    judgeTime(0);
    dom.selectBtn.eq(0).addClass("active").siblings().removeClass("active");
});

// $("#showStation").click(function () {
//     $(".popup-wraps").show();
// });
$(".popup-covers,#closeStation").click(function () {
    $(".popup-wraps").hide();
});
dom.selectBtn.click(function () {
    var _selfDom = $(this);
    var index = _selfDom.index();
    var _dateDay = _selfDom.context.children[1].innerHTML;
    judgeTime(index);
    _selfDom.addClass("active").siblings().removeClass("active");
});
dom.dataShowTime.find('button').click(function () {
    var _selfDom = $(this);
    _selfDom.addClass("active").siblings().removeClass("active");
});
$(document).ready(function () {
    iosSelect();
    defaultTime();
});

$("#thingType").click(function () {
    $(".select-type").show();
    dom.typeBtn.eq(0).addClass("active").siblings().removeClass("active");
    $("#typeValue").val("").hide();
});

dom.typeBtn.click(function () {
    var _selfDom = $(this);
    _selfDom.addClass("active").siblings().removeClass("active");
    if (_selfDom.children("span").html() == "其他") {
        $("#typeValue").fadeIn();
    } else {
        $("#typeValue").fadeOut();
        $("#typeValue").val("");
    }
});

//确定选择物品类型
dom.sureType.click(function () {
    var type = dom.selectType.find(".active");
    var type_value = type.find("span").html();
    var regEn = /[`!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
        regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im,
        regEx = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
    if (type_value == "其他") {
        if (dom.typeValue.val() === '') {
            layer.open({
                content: '请您填写物品类型',
                skin: 'msg',
                time: 1
            });
            return false;
        } else if (regEn.test(dom.typeValue.val()) || regCn.test(dom.typeValue.val()) || regEx.test(dom.typeValue.val())) {
            layer.open({
                content: '物品类型不可有特殊字符',
                skin: 'msg',
                time: 1
            });
            return false;
        } else {
            dom.thingType.html(dom.typeValue.val());
            Util.LocalStorageSetter("type_value", dom.typeValue.val());
            closeSelectTime();
        }
    } else {
        dom.thingType.html(type_value);
        Util.LocalStorageSetter("type_value", type_value);
        closeSelectTime();
    }
});

dom.sureDate.click(function () {
    var date = dom.selectDay.find(".active");
    var date_value = date.find("span").eq(1).html();
    var time = dom.selectTime.find(".active");
    var time_value = time.html();
    if (date_value !== undefined && time_value !== undefined) {
        var time_show_value = date_value + " " + time_value;
        dom.showDate.html(time_show_value);
        Util.LocalStorageSetter("time_show_value", time_show_value);
        closeSelectTime();
    } else {
        layer.open({
            content: '请您选择预约时间',
            skin: 'msg',
            time: 1
        });
        return false;
    }
});
function getDate() {
    var date = new Date();
    var todayTimeFormat = date.Format("yyyy-MM-dd");
    var dateTimestamp = Date.parse(date);
    var tomorrowTimestamp = parseInt(dateTimestamp + 86400000);
    var tomorrowTime = new Date(tomorrowTimestamp);
    var tomorrowTimeFormat = tomorrowTime.Format("yyyy-MM-dd");
    var afterTomorrowTimestamp = parseInt(dateTimestamp + 172800000);
    var afterTomorrowTime = new Date(afterTomorrowTimestamp);
    var afterTomorrowFormat = afterTomorrowTime.Format("yyyy-MM-dd");
    $("#todayDate").html(todayTimeFormat);
    $("#tomorrowDate").html(tomorrowTimeFormat);
    $("#afterTomorrowDate").html(afterTomorrowFormat);
}

function judgeTime(index) {
    var dateTime = new Date();
    var todayTimeFormat = dateTime.Format("yyyy-MM-dd hh:mm:ss");
    var todayTime = todayTimeFormat.split(" ")[1];
    var hour = todayTime.split(":")[0] - 0;
    if (index === 0) {
        if (hour < 9) {
            dom.dataShowTime.find('button').removeAttr("disabled").removeClass("banned");
        }
        if (hour < 11 && hour >= 9) {
            dom.dataShowTime.find('button').eq(0).attr("disabled", "disabled").addClass("banned");
            dom.dataShowTime.find('button').eq(1).addClass("active").siblings().removeClass("active");
        }
        if (hour < 13 && hour >= 11) {
            dom.dataShowTime.find('button:lt(2)').attr("disabled", "disabled").addClass("banned");
            dom.dataShowTime.find('button').eq(2).addClass("active").siblings().removeClass("active");
        }
        if (hour < 15 && hour >= 13) {
            dom.dataShowTime.find('button:lt(3)').attr("disabled", "disabled").addClass("banned");
            dom.dataShowTime.find('button').eq(3).addClass("active").siblings().removeClass("active");
        }
        if (hour < 17 && hour >= 15) {
            dom.dataShowTime.find('button:lt(4)').attr("disabled", "disabled").addClass("banned");
            dom.dataShowTime.find('button').eq(4).addClass("active").siblings().removeClass("active");
        }
        if (hour < 19 && hour >= 17) {
            dom.dataShowTime.find('button:lt(5)').attr("disabled", "disabled").addClass("banned");
            dom.dataShowTime.find('button').removeClass("active");
        }
        if (hour >= 19) {
            dom.dataShowTime.find('button').removeClass("active");
        }
    } else {
        dom.dataShowTime.find('button').removeAttr("disabled").removeClass("banned");
        dom.dataShowTime.find('button').eq(0).addClass("active").siblings().removeClass("active");
    }
}

function closeSelectTime() {
    dom.popupSection.addClass("fadeOutDown");
    setTimeout(function () {
        dom.popupWrap.hide();
        $(".select-type").hide();
        dom.popupSection.removeClass("fadeOutDown");
    }, 500);
}

function thingType(val) {
    //"物品类型（0.其它，1.日用品 ，2.数码产品，3.衣物， 4.食物，5.文件）
    // switch (val) {
    //     case "其他":
    //         return 0;
    //         break;
    //     case "日用品":
    //         return 1;
    //         break;
    //     case "数码产品":
    //         return 2;
    //         break;
    //     case "衣物":
    //         return 3;
    //         break;
    //     case "食物":
    //         return 4;
    //         break;
    //     case "文件":
    //         return 5;
    //         break;
    //     default:
    //         return "";
    // }
    if (val == '日用品') {
        return 1;
    } else if (val == '数码产品') {
        return 2;
    } else if (val == '衣物') {
        return 3;
    } else if (val == '食物') {
        return 4;
    } else if (val == '文件') {
        return 5;
    } else {
        return 0;
    }
}

function defaultTime() {
    var time_show_value = Util.LocalStorageGetter("time_show_value");
    if (time_show_value !== "" && time_show_value !== undefined && time_show_value !== null) {
        dom.showDate.html(time_show_value);
    } else {
        var dateTime = new Date();
        var dateTimestamp = Date.parse(dateTime);
        var tomorrowTimestamp = parseInt(dateTimestamp + 86400000);
        var tomorrowTime = new Date(tomorrowTimestamp);
        var tomorrowTimeFormat = tomorrowTime.Format("yyyy-MM-dd");
        var todayTimeFormat = dateTime.Format("yyyy-MM-dd hh:mm:ss");
        var todayTime = todayTimeFormat.split(" ")[1];
        var hour = todayTime.split(":")[0] - 0;
        var tomorrowTimeDay = tomorrowTimeFormat.split(" ")[0];
        var defaultT = void 0;
        if (hour < 9) {
            defaultT = todayTimeFormat.split(" ")[0] + " 9:00-11:00";
        }
        if (hour < 11 && hour >= 9) {
            defaultT = todayTimeFormat.split(" ")[0] + " 11:00-13:00";
        }
        if (hour < 13 && hour >= 11) {
            defaultT = todayTimeFormat.split(" ")[0] + " 13:00-15:00";
        }
        if (hour < 15 && hour >= 13) {
            defaultT = todayTimeFormat.split(" ")[0] + " 15:00-17:00";
        }
        if (hour < 17 && hour >= 15) {
            defaultT = todayTimeFormat.split(" ")[0] + " 17:00-19:00";
        }
        if (hour < 19 && hour >= 17) {
            defaultT = tomorrowTimeDay.split(" ")[0] + " 9:00-11:00";
        }
        if (hour >= 19) {
            defaultT = tomorrowTimeDay.split(" ")[0] + " 9:00-11:00";
        }
        dom.showDate.html(defaultT);
    }
}