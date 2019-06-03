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
    loadingWrap: $(".loading-wrap"),
    closeDate: $("#closeDate"),
    sureDate: $("#sureDate"),
    selectDay: $("#selectDay"),
    selectTime: $("#selectTime"),
    popupWrap: $(".popup-wrap"),
    popupWraps :$(".popup-wraps"),
    popupSection: $(".popup-section"),
    showDate: $("#showDate"),
    showStation: $("#showStation"),
    orgNo: $("#orgNo"),
    orgUuid:$("#orgUuid"),
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
    thingType: $("#thingType"),
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
let sent_data,
    sent_name,
    sent_phone,
    sent_provinceCityRegion,
    sent_longitude,
    sent_latitude,
    sent_cityCode,
    sent_provinceCityRegionTxt_line,
    sent_provinceCityRegionTxt,
    sent_addressDetail,
    sent_senderLocation,
    receive_data,
    receive_name,
    receive_phone,
    receive_provinceCityRegion,
    receive_longitude,
    receive_latitude,
    receive_cityCode,
    receive_provinceCityRegionTxt_line,
    receive_provinceCityRegionTxt,
    receive_addressDetail;


$(document).ready(function () {
    getUserAdresss();
    getDate();
    let weightWrap = Util.LocalStorageGetter("weight");
    let thingWrap = Util.LocalStorageGetter("thingWrap");
    let stationWrap = Util.LocalStorageGetter("showStation");
    let orgNo = Util.LocalStorageGetter("orgNo");
    let orgUuid = Util.LocalStorageGetter("orgUuid");
    let typeValue = Util.LocalStorageGetter("type_value");
    if(thingWrap!==""&&thingWrap!==undefined&&thingWrap!==null){
        dom.showThing.html(thingWrap);
    }
    if(weightWrap!==""&&weightWrap!==undefined&&weightWrap!==null){
        dom.showWeight.html(weightWrap);
    }
    if(typeValue!==""&&typeValue!==undefined&&typeValue!==null){
        dom.thingType.html(typeValue);
    }
    if(sent_data ){
        let sentJsonData = {
            "object": {
                "longitude":sent_longitude,
                "latitude":sent_latitude,
                "addrDetail":sent_provinceCityRegionTxt_line,
                "cityCode":sent_cityCode,
                "isAlipay":""
            }
        };

        ajax("/xilaisender_s/user/senderAddressCheck", "post", sentJsonData, "json", function (data) {
            dom.loadingWrap.hide();
            if(data.errCode == "000000" ){
                if(data.object.length == 0){
                    dom.showStation.html("暂无");
                    document.getElementById('tishi').style.display='inline';
                    $("#agree").unbind("click");
                } else if(data.object.length == 1){

                    let stationList = data.object;

                    for (let i in stationList) {
                        let orgUuid = stationList[i].orgUuid,
                            name = stationList[i].orgName,
                            phone = stationList[i].headTelephone,
                            area = stationList[i].area,
                            address = stationList[i].detailAddress,
                            orgNo = stationList[i].orgNo;

                        let html = `<li>
                                    <input type="hidden" class="address-uuid" value="${orgUuid}">
                                    <div class="content-wrap border-1px-bottom" onclick="showStation(this)">
                                        <div class="fang"></div>
                                        <div class="adr-wrap">
                                            <div class="adr-name">${name}</div>
                                            <div class="adr-phone">${phone}</div>
                                        </div>
                                        <div class="adr-detail">
                                            ${address} 
                                        </div>
                                        <div class="adr-area">
                                            ${area} m
                                        </div>
                                        <div class="adr-org" style="display: none">${orgNo}</div>
                                        <div class="adr-uuid" style="display: none">${orgUuid}</div>
                                    </div>
                                </li>`;
                        dom.stationContent.append(html)
                    }

                        dom.showStation.html(stationList[0].orgName);
                        dom.orgNo.html(stationList[0].orgNo);
                        dom.orgUuid.html(stationList[0].orgUuid);

                    document.getElementById( "jiantou").style.display= "none";
                    document.getElementById( "konghang").style.display= "block";
                    $("#showStation").unbind("click");
                }else {
                    $("#showStation").click(function () {
                        $(".popup-wraps").show();
                    });
                    let stationList = data.object;

                    for (let i in stationList) {
                        let orgUuid = stationList[i].orgUuid,
                            name = stationList[i].orgName,
                            phone = stationList[i].headTelephone,
                            area = stationList[i].area,
                            address = stationList[i].detailAddress,
                            orgNo = stationList[i].orgNo;
                        let areaNum;
                        if(area > 999){
                            areaNum =(area*0.001).toFixed(2) + "km";
                        }else {
                            areaNum =area + "m";
                        }
                        let html = `<li>
                                    <input type="hidden" class="address-uuid" value="${orgUuid}">
                                    <div class="content-wrap border-1px-bottom" onclick="showStation(this)">
                                        <div class="fang"></div>
                                        <div class="adr-wrap">
                                            <div class="adr-name">${name}</div>
                                            <div class="adr-phone">${phone}</div>
                                        </div>
                                        <div class="adr-detail">
                                            ${address} 
                                        </div>
                                        <div class="adr-area">
                                            ${areaNum}
                                        </div>
                                        <div class="adr-org" style="display: none">${orgNo}</div>
                                        <div class="adr-uuid" style="display: none">${orgUuid}</div>
                                    </div>
                                </li>`;
                        dom.stationContent.append(html);
                    }
                    if(stationWrap!==""&&stationWrap!==undefined&&stationWrap!==null){
                        dom.showStation.html(stationWrap);
                        dom.orgNo.html(orgNo);
                        dom.orgUuid.html(orgUuid);
                    }else{
                        dom.showStation.html(stationList[0].orgName);
                        dom.orgNo.html(stationList[0].orgNo);
                        dom.orgUuid.html(stationList[0].orgUuid);
                    }

                    document.getElementById( "jiantou").style.display= "block";
                    document.getElementById( "konghang").style.display= "none";
                }
            }else{
                dom.showStation.html("暂无");
                $("#showStation").unbind("click");
                document.getElementById('tishi').style.display='inline';
                $("#agree").unbind("click");
            }
        })
    }
    if(sent_data && receive_data){
        let receiveJsonData = {
            "object": {
                "longitude":sent_longitude,
                "latitude":sent_latitude,
                "addrDetail":sent_provinceCityRegionTxt_line,
                "cityCode":sent_cityCode,
                "destinationCode":receive_cityCode
            }
        };
        ajax("/xilaisender_s/user/receiverAddressCheck", "post", receiveJsonData, "json", function (data) {
            dom.loadingWrap.hide();
            if (data.object == 0 ) {
                document.getElementById('tishis').style.display='inline';
                $("#agree").unbind("click");
            }
        })
    } else if(receive_data && sent_data == null){
        let receiveJsonDatas = {
            "object": {
                "longitude":"",
                "latitude":"",
                "addrDetail":"",
                "cityCode":"",
                "destinationCode":receive_cityCode
            }
        };
        ajax("/xilaisender_s/user/receiverAddressCheck", "post", receiveJsonDatas, "json", function (data) {
            dom.loadingWrap.hide();
            if (data.object == 0) {
                document.getElementById('tishis').style.display='inline';
                $("#agree").unbind("click");
            }
        })
    }
});

//选择服务站
function showStation(that) {
    let orgName=$(that).find(".adr-name").html();
    let orgNo = $(that).find(".adr-org").html();
    let orgUuid = $(that).find(".adr-uuid").html();
    dom.showStation.html(orgName);
    dom.orgNo.html(orgNo);
    dom.orgUuid.html(orgUuid);
    $(".popup-wraps").hide();
    Util.LocalStorageSetter("showStation",orgName)
    Util.LocalStorageSetter("orgNo",orgNo)
    Util.LocalStorageSetter("orgUuid",orgUuid)
}

// 获取数据
function getUserAdresss() {
    sent_data = Util.LocalStorageGetter("sent-address-data");
    let sent_data_string = JSON.parse(sent_data);
    receive_data = Util.LocalStorageGetter("receive-address-data");
    let receive_data_string = JSON.parse(receive_data);
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
    wx.miniProgram.redirectTo({url: '../address/my-address'});
    skip.navigateTo("/html/address/my-address.html")
    // window.location.href = "../address/my-address.html";
});
// 选收件地址
dom.receiveAddressBtn.click(function () {
    // 2为收件
    Util.LocalStorageSetter("address_key", "2");
    Util.LocalStorageSetter("address_search_key", "2");
    Util.LocalStorageSetter("url_flag", "../address/my-address.html");
    Util.LocalStorageSetter("mini_url_flag", "../address/my-address");
    wx.miniProgram.redirectTo({url: '../address/my-address'});
    skip.navigateTo("/html/address/my-address.html")
    // window.location.href = "../address/my-address.html";
});
// 立即下单(防多次点击)
loginBtn(dom.orderBtn, function () {
    let has_sent_data = sent_data !== undefined && sent_data !== null && sent_data !== '',
        has_receive_data = receive_data !== undefined && receive_data !== null && receive_data !== '';
    let thingText = dom.thingType.html();
    console.log(thingText);
    let goodsType = thingType(thingText);
    let goodsRemark = thingText;
    let kg_value = dom.showWeight.html();
    let goodsWeight;
    if (kg_value !== undefined && kg_value !== "") {
        goodsWeight = kg_value.split("公斤")[0];
    } else {
        layer.open({
            content: '请你选择物品重量'
            , skin: 'msg'
            , time: 1
        });
        return false
    }

    let dateArea = dom.showDate.html();
    let bookedFrom;
    let bookedTo;
    if (dateArea !== undefined && dateArea !== "") {
        let dataDay = dateArea.split(" ")[0];
        bookedFrom = dataDay + " " + dateArea.split(" ")[1].split("-")[0] + ":00";
        bookedTo = dataDay + " " + dateArea.split(" ")[1].split("-")[1] + ":00";
    } else {
        layer.open({
            content: '请您选择预约时间'
            , skin: 'msg'
            , time: 1
        });
        return false
    }
    let orgName = dom.showStation.html();
    let orgNo = dom.orgNo.html();
    let orgUuid = dom.orgUuid.html();

    dom.loadingWrap.show();
    if (has_sent_data && has_receive_data) {
        // 发送地址编码
        let sentProvinceCityRegionArray = sent_provinceCityRegion.split(","),
            sentProvinceCityRegion = sentProvinceCityRegionArray.join("-");
        // 收件地址编码
        let receiveProvinceCityRegionArray = receive_provinceCityRegion.split(","),
            receiveProvinceCityRegion = receiveProvinceCityRegionArray.join("-");
        let jsonData = {
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
                "isSelectService":"1",
                "orgBaseInfoList":
                    [{
                    "orgName":orgName,
                    "orgNo":orgNo,
                    "orgUuid":orgUuid,
                    }],
            }
        };
        ajax("/xilaisender_s/order/senderOrder", "post", jsonData, "json", function (data) {
            dom.loadingWrap.hide();
            if (data.errCode === ERROR) {
                layer.open({
                    content: '下单成功'
                    , skin: 'msg'
                    , time: 1
                });
                Util.LocalStorageRemove("sent-address-data");
                Util.LocalStorageRemove("receive-address-data");
                Util.LocalStorageRemove("thingWrap");
                Util.LocalStorageRemove("time_show_value");
                Util.LocalStorageRemove("weight");
                Util.LocalStorageRemove("showStation");
                Util.LocalStorageRemove("orgNo");
                Util.LocalStorageRemove("orgUuid");
                Util.LocalStorageSetter("order_uuid_string",JSON.stringify(data.object.uuid));

                // window.location.href = "../myExpress/myExpress.html";
                setTimeout(function () {
                    wx.miniProgram.redirectTo({url: '../myExpress/myExpress'});
                    skip.reLaunch("/html/expressDetail/expressDetail.html")
                }, 1500)
            } else {
                layer.open({
                    content: data.errDesc
                    ,skin: 'msg'
                    ,time: 2 //2秒后自动关闭
                });
                setTimeout(function () {
                    loginAgain(data)
                },2000)
            }

        },function () {
            dom.loadingWrap.hide();
            layer.open({
                content: '网络异常'
                , skin: 'msg'
                , time: 2
            })
        })
    } else {
        dom.loadingWrap.hide();
        layer.open({
            content: '地址请填写完整哦'
            , skin: 'msg'
            , time: 2
        });
    }

});

function iosSelect() {
    var weightData = [{'id': '20001', 'value': '0.5公斤及以下'}];
    let weightValue = 0.5
        , id = 2001
        , weightArray;
    for (let i = 0; i < 59; i++) {
        weightValue = weightValue + 0.5;
        weightValue.toFixed(1);
        id = parseInt(id + 1);
        weightArray = {'id': `${id}`, 'value': `${weightValue}公斤`};
        weightData.push(weightArray)
    }
    var thingData = [
        {'id': '10001', 'value': '日用品'},
        {'id': '10002', 'value': '数码产品'},
        {'id': '10003', 'value': '衣物'},
        {'id': '10004', 'value': '食物'},
        {'id': '10005', 'value': '文件'},
        {'id': '10006', 'value': '其他'}
    ];
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
        console.log(weightData)
        var weightId = showWeightDom.dataset['id'];
        var weightName = showWeightDom.dataset['value'];
        var weightSelect = new IosSelect(1,
            [weightData],
            {
                container: '#weightWrap',
                title: '重量选择',
                itemHeight: 50,
                itemShowCount: 3,
                oneLevelId: weightId,
                showAnimate: true,
                callback: function (selectOneObj) {
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
    let _selfDom = $(this);
    let index = _selfDom.index();
    let _dateDay = _selfDom.context.children[1].innerHTML;
    judgeTime(index);
    _selfDom.addClass("active").siblings().removeClass("active");
});
dom.dataShowTime.find('button').click(function () {
    let _selfDom = $(this);
    _selfDom.addClass("active").siblings().removeClass("active");
});
$(document).ready(function () {
    iosSelect();
    defaultTime();
});

$("#thingType").click(function(){
    $(".select-type").show();
    dom.typeBtn.eq(0).addClass("active").siblings().removeClass("active");
    $("#typeValue").val("").hide();

});

dom.typeBtn.click(function () {
    let _selfDom = $(this);
    _selfDom.addClass("active").siblings().removeClass("active");
    if(_selfDom.children("span").html()=="其他"){
        $("#typeValue").fadeIn();
    }else{
        $("#typeValue").fadeOut();
        $("#typeValue").val("");
    }
});

//确定选择物品类型
dom.sureType.click(function () {
    let type = dom.selectType.find(".active");
    let type_value = type.find("span").html();
    var regEn = /[`!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
        regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im,
        regEx = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
    if(type_value=="其他"){
        if(dom.typeValue.val() === ''){
            layer.open({
                content: '请您填写物品类型'
                , skin: 'msg'
                , time: 1
            });
            return false
        } else if (regEn.test(dom.typeValue.val()) || regCn.test(dom.typeValue.val()) || regEx.test(dom.typeValue.val())) {
            layer.open({
                content: '物品类型不可有特殊字符'
                , skin: 'msg'
                , time: 1
            });
            return false
        }else{
            dom.thingType.html(dom.typeValue.val());
            Util.LocalStorageSetter("type_value", dom.typeValue.val());
            closeSelectTime();
        }
    }else{
        dom.thingType.html(type_value);
        Util.LocalStorageSetter("type_value", type_value);
        closeSelectTime();
    }
});

dom.sureDate.click(function () {
    let date = dom.selectDay.find(".active");
    let date_value = date.find("span").eq(1).html();
    let time = dom.selectTime.find(".active");
    let time_value = time.html();
    if (date_value !== undefined && time_value !== undefined) {
        let time_show_value = date_value + " " + time_value;
        dom.showDate.html(time_show_value);
        Util.LocalStorageSetter("time_show_value", time_show_value);
        closeSelectTime();
    } else {
        layer.open({
            content: '请您选择预约时间'
            , skin: 'msg'
            , time: 1
        });
        return false
    }
});
function getDate() {
    let date = new Date();
    let todayTimeFormat = date.Format("yyyy-MM-dd");
    let dateTimestamp = Date.parse(date);
    let tomorrowTimestamp = parseInt(dateTimestamp + 86400000);
    let tomorrowTime = new Date(tomorrowTimestamp);
    let tomorrowTimeFormat = tomorrowTime.Format("yyyy-MM-dd");
    let afterTomorrowTimestamp = parseInt(dateTimestamp + 172800000);
    let afterTomorrowTime = new Date(afterTomorrowTimestamp);
    let afterTomorrowFormat = afterTomorrowTime.Format("yyyy-MM-dd");
    $("#todayDate").html(todayTimeFormat);
    $("#tomorrowDate").html(tomorrowTimeFormat);
    $("#afterTomorrowDate").html(afterTomorrowFormat);
}

function judgeTime(index) {
    let dateTime = new Date();
    let todayTimeFormat = dateTime.Format("yyyy-MM-dd hh:mm:ss");
    let todayTime = todayTimeFormat.split(" ")[1];
    let hour = todayTime.split(":")[0] - 0;
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
        return 1
    } else if (val == '数码产品') {
        return 2
    } else if (val == '衣物') {
        return 3
    } else if (val == '食物') {
        return 4
    } else if (val == '文件') {
        return 5
    } else{
        return 0
    }
}

function defaultTime() {
    let time_show_value = Util.LocalStorageGetter("time_show_value");
    if (time_show_value !== "" && time_show_value !== undefined && time_show_value !== null) {
        dom.showDate.html(time_show_value);

    } else {
        let dateTime = new Date();
        let dateTimestamp = Date.parse(dateTime);
        let tomorrowTimestamp = parseInt(dateTimestamp + 86400000);
        let tomorrowTime = new Date(tomorrowTimestamp);
        let tomorrowTimeFormat = tomorrowTime.Format("yyyy-MM-dd");
        let todayTimeFormat = dateTime.Format("yyyy-MM-dd hh:mm:ss");
        let todayTime = todayTimeFormat.split(" ")[1];
        let hour = todayTime.split(":")[0] - 0;
        let tomorrowTimeDay = tomorrowTimeFormat.split(" ")[0];
        let defaultT;
        if (hour < 9) {
            defaultT = todayTimeFormat.split(" ")[0] + " 9:00-11:00"
        }
        if (hour < 11 && hour >= 9) {
            defaultT = todayTimeFormat.split(" ")[0] + " 11:00-13:00"
        }
        if (hour < 13 && hour >= 11) {
            defaultT = todayTimeFormat.split(" ")[0] + " 13:00-15:00"
        }
        if (hour < 15 && hour >= 13) {
            defaultT = todayTimeFormat.split(" ")[0] + " 15:00-17:00"
        }
        if (hour < 17 && hour >= 15) {
            defaultT = todayTimeFormat.split(" ")[0] + " 17:00-19:00"
        }
        if (hour < 19 && hour >= 17) {
            defaultT = tomorrowTimeDay.split(" ")[0] + " 9:00-11:00"
        }
        if (hour >= 19) {
            defaultT = tomorrowTimeDay.split(" ")[0] + " 9:00-11:00"
        }
        dom.showDate.html(defaultT);
    }
}
