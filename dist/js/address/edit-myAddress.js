"use strict";

// dom
var Dom = {
    sentType: $("#sentType"),
    receiveType: $("#receiveType"),
    checkedValue: $("input[name='address-type']:checked"),
    intellectIpt: $("#intellectIpt"),
    intellectClearBtn: $("#intellectClearBtn"),
    intellectInputBtn: $("#intellectInputBtn"),
    saveBtn: $("#saveBtn"),
    positioningDom: $("#positioning"),
    loadingWrap: $(".loading-wrap"),
    locationCoder: $("#locationCoder"),
    receiveLocationCoder: $("#receiveLocationCoder"),
    receiveBtn: $(".receiveBtn"),
    sentBtn: $(".sentBtn"),
    sentBlock: $("#sentBlock"),
    addressCity: $("#addressCity"),
    addressDetail: $("#addressDetail"),
    addressName: $("#addressName"),
    addressPhone: $("#addressPhone"),
    uuid: $("#uuid"),
    selectCity: $("#selectCity")
};
// 页面加载完成后执行
$(document).ready(function () {
    getaddressData();
    $("input[name='address-type']:checked").siblings(".iconfont").removeClass("icon-radio").addClass("icon-radioactive");
});

// 地址数据
function getaddressData() {
    var address_data_sting = Util.LocalStorageGetter("edit_data"),
        address_json = JSON.parse(address_data_sting),
        check = address_json.addrType,
        addrDetail = address_json.addrDetail,
        name = address_json.name,
        phone = address_json.phone,
        uuid = address_json.uuid,
        proviceCityRegionTxt = address_json.proviceCityRegionTxt,
        sentProviceCityRegionTxt = proviceCityRegionTxt.split('-').join(' '),
        p = proviceCityRegionTxt.split('-')[0],
        city = proviceCityRegionTxt.split('-')[1],
        dr = proviceCityRegionTxt.split('-')[2];
    // radio checked
    $("input[name='address-type']").each(function (index) {
        var input_radio = $("input[name='address-type']");
        if (input_radio.get(index).value === check) {
            input_radio.get(index).checked = true;
        }
    });
    Dom.addressCity.val(sentProviceCityRegionTxt);
    Dom.addressCity.html(sentProviceCityRegionTxt);
    Dom.addressDetail.val(addrDetail);
    Dom.addressName.val(name);
    Dom.addressPhone.val(phone);
    Dom.uuid.val(uuid);
    // getAddressBookIndex(p, city, dr)
    getAddress([0, 0, 0]);
    Dom.addressDetail.addClass('active');
    Dom.addressCity.addClass('active');
}

// 地址类型
$("input[name='address-type']").click(function () {
    var checked = $("input[name='address-type']:checked").siblings(".iconfont"),
        un_checked = $("input[name='address-type']").siblings(".iconfont");
    un_checked.removeClass("icon-radioactive").addClass("icon-radio");
    checked.removeClass("icon-radio").addClass("icon-radioactive");
});

// 地址保存操作
loginBtn(Dom.saveBtn, function () {
    Dom.saveBtn.attr("disabled", "disabled");
    Dom.loadingWrap.show();
    var address = Dom.addressCity.html().split(' ').join('') + Dom.addressDetail.val();
    if (address !== "") {
        getLocationCode(address).then(function (data) {
            var location = data.geocodes[0].location;
            saveData(1, location, Dom.saveBtn);
        }).catch(function (err) {
            layer.open({
                content: '请填写正确地址哦～',
                btn: '确定'
            });
        });
    } else {
        Dom.loadingWrap.hide();
        Dom.saveBtn.attr("disabled", false);
        layer.open({
            content: '请把地址填写完整哦',
            btn: '确定'
        });
    }
});

/**
 * 获取保存的数据 && 请求接口
 * @param type 地址类型 1：发件，2：收件
 * @param data 参数
 * @param dom  按钮dom
 */
function saveData(type, data, dom) {
    var addressName_text = Dom.addressName.val(),
        addressPhone_text = Dom.addressPhone.val(),
        addressCity_text = Dom.addressCity.html().split(' ').join('-'),
        addressDetail = Dom.addressDetail.val(),
        checkedValue = $("input[name='address-type']:checked").val(),
        location_code = data,
        location_code_array = location_code.split(","),
        uuid = Dom.uuid.val(),
        userName = Util.CookiesGetter("userName");

    var json_data = {
        "object": {
            "uuid": uuid,
            "name": addressName_text,
            "phone": addressPhone_text,
            "proviceCityRegionTxt": addressCity_text,
            "addrDetail": addressDetail,
            "addrType": checkedValue,
            "longitude": location_code_array[0],
            "latitude": location_code_array[1],
            "addUserType": "1",
            "addUserPhone": userName,
            "active": "1"
        }
    };

    dataCheck(addressCity_text, addressDetail, addressName_text, addressPhone_text, dom, json_data);
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
});

// 截取10位
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
});

//屏蔽默认键盘弹出；
Dom.addressCity.focus(function () {
    document.activeElement.blur();
});

// 获取地址类型
function addressType() {
    var addressType = Util.LocalStorageGetter('address_search_key');
    return addressType;
}

// 收件信息加载
function receive(data) {
    addressTypeShow(data);
    if (data == 1) {
        var _data = Util.LocalStorageGetter('sentAddress');
        if (_data != null && _data != undefined && _data != '') {
            _data = JSON.parse(_data);
            var address = _data.geocodes[0].formatted_address;
            Dom.selectSentAddress.val(address);
        }
    } else {
        return;
    }
}

// 地址类型样式切换
function addressTypeShow(data) {
    if (data == 1) {
        Dom.receiveBlock.hide();
        Dom.sentBlock.show();
        Dom.sentSaveBtn.show();
        Dom.receiveSaveBtn.hide();
    }
    if (data == 2) {
        Dom.receiveBlock.show();
        Dom.sentBlock.hide();
        Dom.sentSaveBtn.hide();
        Dom.receiveSaveBtn.show();
    }
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
        if (data.length > 10) {
            layer.open({
                content: '姓名不能超过10个字',
                skin: 'msg',
                time: 2
            });
            return false;
        } else {
            layer.open({
                content: '姓名中请不要添加特殊字符',
                skin: 'msg',
                time: 2
            });
            return false;
        }
        dom.attr("disabled", false);
        Dom.loadingWrap.hide();
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
    if (data === "") {
        Dom.loadingWrap.hide();
        dom.attr("disabled", false);
        layer.open({
            content: '请把地址填写完整哦',
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
    ajax("/xilaisender_s/addressBook/update", "post", json_data, "json", function (data) {
        dom.attr("disabled", false);
        Dom.loadingWrap.hide();
        if (data.errCode === ERROR) {
            layer.open({
                content: '编辑成功',
                skin: 'msg',
                time: 1
            });
            setTimeout(function () {
                // window.location.href = './my-address.html'
                wx.miniProgram.redirectTo({ url: '../address/my-address' });
                skip.navigateBack();
                Util.LocalStorageRemove('sentAddress');
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
Dom.selectCity.click(function () {
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