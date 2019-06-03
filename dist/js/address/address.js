"use strict";

// dom
var Dom = {
    sentType: $("#sentType"),
    receiveType: $("#receiveType"),
    checkedValue: $("input[name='address-type']:checked"),
    intellectIpt: $("#intellectIpt"),
    intellectClearBtn: $("#intellectClearBtn"),
    intellectInputBtn: $("#intellectInputBtn"),
    saveDataBtn: $("#saveDataBtn"),
    positioningDom: $("#positioning"),
    loadingWrap: $(".loading-wrap"),
    locationCoder: $("#locationCoder"),
    receiveBtn: $(".receiveBtn"),
    sentBtn: $(".sentBtn"),
    addressCity: $("#addressCity"),
    addressDetail: $("#addressDetail"),
    addressDoorNumber: $("#addressDoorNumber"),
    addressName: $("#addressName"),
    addressPhone: $("#addressPhone"),
    selectCity: $("#selectCity"),
    valueAddress: $("#valueAddress"),
    value1: $("#value1")
};
// 页面加载完成后执行
$(document).ready(function () {
    getInfor();
    getAddressType();
    $("input[name='address-type']:checked").siblings(".iconfont").removeClass("icon-radio").addClass("icon-radioactive");
});

// 获取地址类型
function getAddressType() {
    var check = Util.LocalStorageGetter("address_search_key");
    if (check === "2") {
        $("#sentType").prop("checked", true);
    } else {
        $("#receiveType").prop("checked", true);
    }
}

// 获取之前录入的地址
function getInfor() {
    var addressPhone = Util.LocalStorageGetter('addressPhone');
    var addressName = Util.LocalStorageGetter('addressName');
    var addressDoorNumber = Util.LocalStorageGetter('addressDoorNumber');
    var addressCity = Util.LocalStorageGetter('addressCity');
    var valueAddress = Util.LocalStorageGetter('valueAddress');
    // 获取 输入提示地址
    var sentAddress = JSON.parse(Util.LocalStorageGetter('sentAddress'));
    var addressSelectDetail = Util.LocalStorageGetter('addressSelectDetail');

    // 手机号
    if (addressPhone != '' && addressPhone != null && addressPhone != undefined) {
        Dom.addressPhone.val(addressPhone);
    }
    // 姓名
    if (addressName != '' && addressName != null && addressName != undefined) {
        Dom.addressName.val(addressName);
    }
    // 门牌号
    if (addressDoorNumber != '' && addressDoorNumber != null && addressDoorNumber != undefined) {
        Dom.addressDoorNumber.val(addressDoorNumber);
    }
    if (addressSelectDetail != '' && addressSelectDetail != null && addressSelectDetail != undefined) {
        Dom.addressDetail.addClass('active');
        Dom.addressDetail.html(addressSelectDetail);
    } else {
        Dom.addressDetail.removeClass('active');
    }
    // 地址（城市&详细）
    if (sentAddress != '' && sentAddress != null && sentAddress != undefined) {
        var city = sentAddress.geocodes[0].city,
            district = sentAddress.geocodes[0].district,
            province = sentAddress.geocodes[0].province;
        getAddressBookIndex(province, city, district);
        var a = province + ' ' + city + ' ' + district;
        Dom.addressCity.addClass('active');
        Dom.addressCity.val(a);
        Dom.addressCity.html(a);
    } else {
        if (addressCity != '' && addressCity != null && addressCity != undefined && addressCity != '请选择') {
            Dom.addressCity.addClass('active');
            Dom.addressCity.html(addressCity);
        } else {
            Dom.addressCity.removeClass('active');
        }
        if (valueAddress != '' && valueAddress != null && valueAddress != undefined) {
            var v = valueAddress.split(',');
            getAddress(v);
        } else {
            getAddress([0, 0, 0]);
        }
    }
}

// 地址类型
$("input[name='address-type']").click(function () {
    var checked = $("input[name='address-type']:checked").siblings(".iconfont"),
        un_checked = $("input[name='address-type']").siblings(".iconfont");
    un_checked.removeClass("icon-radioactive").addClass("icon-radio");
    checked.removeClass("icon-radio").addClass("icon-radioactive");
});

// 定位操作
Dom.positioningDom.click(function () {
    Dom.loadingWrap.show();
    positioning();
});

// 定位功能
function positioning() {
    var map = void 0,
        geolocation = void 0;
    //加载地图，调用浏览器定位服务
    map = new AMap.Map('container', {
        resizeEnable: true
    });
    map.plugin('AMap.Geolocation', function () {
        geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, //是否使用高精度定位，默认:true
            timeout: 10000 //超过10秒后停止定位，默认：无穷大
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
        AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
    });

    //解析定位结果
    function onComplete(data) {
        Dom.loadingWrap.hide();
        var addressArray = data.addressComponent;
        if (addressArray == undefined) {
            layer.open({
                content: '定位失败',
                skin: 'msg',
                time: 2
            });
        } else {
            // 维度
            var lat = data.position.lat;
            // 经度
            var lng = data.position.lng;
            Dom.locationCoder.val(lng + "," + lat);
            console.log(data);
            var address_province_city_district = void 0;
            if (addressArray.city.length === 0) {
                address_province_city_district = addressArray.province + " " + addressArray.province + " " + addressArray.district;
            } else {
                address_province_city_district = addressArray.province + " " + addressArray.city + " " + addressArray.district;
            }
            var address_detail = data.formattedAddress.split("" + addressArray.province + addressArray.city + addressArray.district);
            Dom.receiveAddressCity.val(address_province_city_district);
            Dom.receiveAddressDetail.val(address_detail[1]);
        }
    }

    //解析定位错误信息
    function onError(data) {
        Dom.loadingWrap.hide();
        layer.open({
            content: '定位失败',
            skin: 'msg',
            time: 2
        });
    }
}

//  保存地址操作
loginBtn(Dom.saveDataBtn, function () {
    Dom.saveDataBtn.attr("disabled", "disabled");
    Dom.loadingWrap.show();
    var location_code = Dom.locationCoder.val();
    if (location_code !== "") {
        saveData(location_code, Dom.saveDataBtn);
    } else {
        var addressCity_text = Dom.addressCity.html(),
            done_addressCity_text = addressCity_text.split(" ").join(""),
            addressDetail = Dom.addressDetail.html(),
            addressAll_text = done_addressCity_text + addressDetail;
        if (addressCity_text !== '' && addressCity_text !== '请选择' && addressDetail !== "" && addressDetail !== '请选择') {
            getLocationCode(addressAll_text).then(function (data) {
                var location_code = data.geocodes[0].location;
                saveData(2, location_code, Dom.saveDataBtn);
            }).catch(function (err) {
                Dom.loadingWrap.hide();
                Dom.saveDataBtn.attr("disabled", false);
                layer.open({
                    content: '请填写正确地址哦',
                    btn: '确定'
                });
            });
        } else {
            Dom.loadingWrap.hide();
            Dom.saveDataBtn.attr("disabled", false);
            layer.open({
                content: '请把地址填写完整哦',
                btn: '确定'
            });
        }
    }
});

/**
 * 获取保存的数据 && 请求接口
 * @param type 地址类型 1：发件，2：收件
 * @param data 经纬度
 * @param dom  按钮dom
 */
function saveData(type, data, dom) {
    var addressName_text = Dom.addressName.val(),
        addressPhone_text = Dom.addressPhone.val(),
        checkedValue = $("input[name='address-type']:checked").val(),
        location_code = data,
        location_code_array = location_code.split(","),
        userName = Util.CookiesGetter("userName"),
        addressCity_text = Dom.addressCity.html(),
        done_addressCity_text = addressCity_text.split(" ").join("-"),
        addressDetail = Dom.addressDetail.html() + Dom.addressDoorNumber.val();
    var json_data = {
        "object": {
            "name": addressName_text,
            "phone": addressPhone_text,
            "proviceCityRegionTxt": done_addressCity_text,
            "addrDetail": addressDetail,
            "addrType": checkedValue,
            "longitude": location_code_array[0],
            "latitude": location_code_array[1],
            "addUserType": "1",
            "addUserPhone": userName,
            "active": "1"
        }
    };
    dataCheck(done_addressCity_text, addressDetail, addressName_text, addressPhone_text, dom, json_data);
}

// 数据判断
function dataCheck(address, addressDetail, name, phone, dom, json) {
    if (addressCheckout(address, dom) == undefined) {
        if (addressDetailCheckout(addressDetail, dom) == undefined) {
            if (nameCheckout(name, dom) == undefined) {
                if (phoneCheckout(phone, dom) == undefined) {

                    saveRequest(json, dom);
                }
            }
        }
    }
}

// 获取城市列表
function getAddress(v1) {
    var area1 = new LArea();
    area1.init({
        //触发选择控件的文本框，同时选择完毕后name属性输出到该位置
        'trigger': '#addressCity',
        //选择完毕后id属性输出到该位置
        'valueTo': '#value1',
        // 数据位置
        'valueAddress': '#valueAddress',
        //绑定数据源相关字段 id对应valueTo的value属性输出 name对应trigger的value属性输出
        'keys': {
            id: 'value',
            name: 'label'
        },
        //数据源类型
        'type': 1,
        //数据源
        'data': provinceCityRegions
    });
    //控制初始位置，注意：该方法并不会影响到input的value 例子：[1, 2, 3]
    area1.value = v1;
}

$("#addressPhone").blur(function () {
    var phoneValue = Dom.addressPhone.val();
    var copyphone = clipboardNumber(phoneValue);
    Dom.addressPhone.val(copyphone);
    Util.LocalStorageSetter('addressPhone', copyphone);
});

// 截取12位
Dom.addressPhone.bind('input propertychange', function () {
    var phoneValue = Dom.addressPhone.val();
    Dom.addressPhone.val(phoneValue);
    Util.LocalStorageSetter('addressPhone', phoneValue);
});
// 截取20位
Dom.addressName.bind('change', function () {
    var nameValue = Dom.addressName.val();
    if (nameValue.length > 10) {
        layer.open({
            content: '请输入10个字以内',
            skin: 'msg',
            time: 1
        });
        nameValue = nameValue.slice(0, 10);
        Dom.addressName.val(nameValue);
    }
    Util.LocalStorageSetter('addressName', nameValue);
});

// 存门牌号
Dom.addressDoorNumber.bind('input propertychange', function () {
    var addressDoorNumber = Dom.addressDoorNumber.val();
    Util.LocalStorageSetter('addressDoorNumber', addressDoorNumber);
});
//屏蔽默认键盘弹出；
Dom.addressCity.focus(function () {
    document.activeElement.blur();
});

// 收件按钮
Dom.receiveBtn.click(function () {
    Util.LocalStorageSetter("address_search_key", "2");
});
// 发件按钮
Dom.sentBtn.click(function () {
    Util.LocalStorageSetter("address_search_key", "1");
});

// 获取地址类型
function addressType() {
    var addressType = Util.LocalStorageGetter('address_search_key');
    return addressType;
}

// 获取经纬度
function getLocationCode(text) {
    var address_text = text;
    var key = "38782d2bc8e5e42e210eb8013e17836a";
    var url = "https://restapi.amap.com/v3/geocode/geo?key=" + key + "&address=" + address_text + "&city=";
    return new Promise(function (resolve, reject) {
        ajax(url, "get", "", "jsonp", function (data) {
            resolve(data);
        }, function () {
            Dom.loadingWrap.hide();
            layer.open({
                content: '请检查网络',
                skin: 'msg',
                time: 1
            });
        });
    });
}

// 根据经纬度获取省市区
function getAddressByLocation(data) {
    var key = "38782d2bc8e5e42e210eb8013e17836a";
    var url = "https://restapi.amap.com/v3/geocode/regeo?output=json&location=" + data + "&key=" + key;
    return new Promise(function (resolve, reject) {
        ajax(url, "get", "", "jsonp", function (data) {
            resolve(data.regeocode);
        }, function () {
            Dom.loadingWrap.hide();
            layer.open({
                content: '请检查网络',
                skin: 'msg',
                time: 1
            });
        });
    });
}

// 名字校验
function nameCheckout(data, dom) {
    if (data === "") {
        Dom.loadingWrap.hide();
        dom.attr("disabled", false);
        layer.open({
            content: '请输入您的姓名',
            skin: 'msg',
            time: 2
        });
        return false;
    } else if (!reminderStripScriptTow(data)) {
        Dom.loadingWrap.hide();
        dom.attr("disabled", false);
        layer.open({
            content: '姓名中请不要添加特殊字符',
            skin: 'msg',
            time: 2
        });
        return false;
    }
}

// 手机号校验
function phoneCheckout(data, dom) {
    var phone_first = void 0,
        phone_length = void 0;
    if (data !== "") {
        phone_first = data.slice(0, 1);
        phone_length = data.length;
    } else {
        Dom.loadingWrap.hide();
        dom.attr("disabled", false);
        layer.open({
            content: '请填写正确的联系方式',
            skin: 'msg',
            time: 2
        });
        return false;
    }
    if (phone_first === "1") {
        if (phone_length !== 11) {
            Dom.loadingWrap.hide();
            dom.attr("disabled", false);
            layer.open({
                content: '请填写正确的联系方式',
                skin: 'msg',
                time: 2
            });
            return false;
        }
    } else {
        if (!(phone_length >= 4 && phone_length <= 12)) {
            Dom.loadingWrap.hide();
            dom.attr("disabled", false);
            layer.open({
                content: '请填写正确的联系方式',
                skin: 'msg',
                time: 2
            });
            return false;
        }
    }
}

// 地址校验
function addressCheckout(data, dom) {
    if (data === "" || data === '请选择') {
        Dom.loadingWrap.hide();
        dom.attr("disabled", false);
        layer.open({
            content: '请选择地址',
            skin: 'msg',
            time: 2
        });
        return false;
    } else if (!reminderStripScriptTow(data)) {
        Dom.loadingWrap.hide();
        dom.attr("disabled", false);
        layer.open({
            content: '地址中请不要添加特殊字符',
            skin: 'msg',
            time: 2
        });
        return false;
    }
}

// 详细地址校验
function addressDetailCheckout(data, dom) {
    if (data === "" || data === '请选择') {
        Dom.loadingWrap.hide();
        dom.attr("disabled", false);
        layer.open({
            content: '请选择详细地址',
            skin: 'msg',
            time: 2
        });
        return false;
    } else if (!reminderStripScriptTow(data)) {
        Dom.loadingWrap.hide();
        dom.attr("disabled", false);
        layer.open({
            content: '详细地址中请不要添加特殊字符',
            skin: 'msg',
            time: 2
        });
        return false;
    } else if (data.length > 50) {
        Dom.loadingWrap.hide();
        dom.attr("disabled", false);
        layer.open({
            content: '地址请不要超过30字符',
            skin: 'msg',
            time: 2
        });
        return false;
    }
}

// 门牌号校验
function doorNumberCheckout(data, dom) {
    if (data === "") {
        Dom.loadingWrap.hide();
        dom.attr("disabled", false);
        layer.open({
            content: '请输入门牌号',
            skin: 'msg',
            time: 2
        });
        return false;
    } else if (!reminderStripScriptTow(data)) {
        Dom.loadingWrap.hide();
        dom.attr("disabled", false);
        layer.open({
            content: '门牌号中请不要添加特殊字符',
            skin: 'msg',
            time: 2
        });
        return false;
    }
}

// 保存接口请求
function saveRequest(json_data, dom) {
    ajax("/xilaisender_s/addressBook/create", "post", json_data, "json", function (data) {
        dom.attr("disabled", false);
        Dom.loadingWrap.hide();
        if (data.errCode === ERROR) {
            layer.open({
                content: '增加成功',
                skin: 'msg',
                time: 1
            });
            setTimeout(function () {
                // window.location.href = './my-address.html'
                wx.miniProgram.redirectTo({ url: '../address/my-address' });
                skip.navigateBack();
                Util.LocalStorageRemove('sentAddress');
                Util.LocalStorageRemove('addressName');
                Util.LocalStorageRemove('addressPhone');
                Util.LocalStorageRemove('addressSelectDetail');
                Util.LocalStorageRemove('addressCityCode');
                Util.LocalStorageRemove('addressDoorNumber');
                Util.LocalStorageRemove('addressCity');
                Util.LocalStorageRemove('valueAddress');
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
        Dom.loadingWrap.hide();
        layer.open({
            content: '请检查您的网络',
            skin: 'msg',
            time: 1
        });
        dom.attr("disabled", false);
    });
}

// 跳转
Dom.addressDetail.click(function () {
    skip.navigateTo('/html/address/location.html');
});

// 获取地址库下标
function getAddressBookIndex(v1, v2, v3) {
    var province = 0,
        city = 0,
        area = 0,
        i = void 0,
        j = void 0,
        k = void 0;
    var all = provinceCityRegions;
    for (i in all) {
        if (v1 === all[i].label) {
            province = i;
            for (j in all[i].children) {
                if (v2 === all[i].children[j].label) {
                    city = j;
                    for (k in all[i].children[j].children) {
                        if (v3 === all[i].children[j].children[k].label) {
                            area = k;
                        }
                    }
                }
            }
        }
    }
    var address_index = [];
    address_index.push(province, city, area);
    console.log(address_index);
    getAddress(address_index);
}

// 记录省市区选择
Dom.addressCity.bind('input propertychange', function () {
    var addressCity = Dom.addressCity.html();
    var valueAddress = Dom.valueAddress.val();
    var addressCityCode = Dom.value1.val();
    Util.LocalStorageSetter('valueAddress', valueAddress);
    Util.LocalStorageSetter('addressCity', addressCity);
    Util.LocalStorageSetter('addressCityCode', addressCityCode);
});