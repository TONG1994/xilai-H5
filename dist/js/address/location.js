"use strict";

var dom = {
    searchAddress: $("#searchAddress"),
    cityName: $("#cityName"),
    cityCode: $("#cityCode"),
    addressList: $("#addressList"),
    cityText: $("#cityText"),
    loadingWrap: $(".loading-wrap")
};
$(document).ready(function () {
    var address = Util.LocalStorageGetter('selectCity');
    var all = Util.LocalStorageGetter('addressCity');
    if (address != null && address != undefined && address != '') {
        getCityByCitybook();
    } else {
        if (all !== "请选择") {
            getLocationCity();
        } else {
            getCityByCitybook();
        }
        getLocationCity();
    }
});

// 获取城市（从地址选择页面）
function getCityByCitybook() {
    dom.loadingWrap.show();
    var address = Util.LocalStorageGetter('selectCity');
    var cityinfo = void 0,
        cityCode = void 0;
    if (address != null && address != undefined && address != '') {
        var addressjson = JSON.parse(address);
        cityinfo = addressjson.name;
        cityCode = addressjson.code;
        dom.cityName.text(cityinfo);
        dom.cityCode.val(cityCode);
    } else {
        // showCityInfo()
        positioning();
    }
    dom.loadingWrap.hide();
}

// 获取城市(从新增地址页面)

function getLocationCity() {
    var all = Util.LocalStorageGetter('addressCity'),
        citye_code = Util.LocalStorageGetter('addressCityCode'),
        city = void 0,
        citycode_val = void 0;
    if (all !== '' && all !== undefined && all !== null) {
        if (citye_code !== '' && citye_code !== undefined && citye_code !== null) {
            citycode_val = citye_code.split(',')[1];
            if (citycode_val != undefined) {
                dom.cityCode.val(citycode_val);
            } else {
                dom.cityCode.val(citye_code);
            }
        } else {}
        city = all.split(' ')[1];
        dom.cityName.text(city);
    } else {
        // showCityInfo()
        positioning();
    }
}

// 搜索提示
var searchTimeout = void 0,
    searchDelay = 300;
dom.searchAddress.bind('input propertychange', function () {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(function () {
        var value = dom.searchAddress.val();
        var cityCode = dom.cityCode.val();
        var key = "99ac58bd67cbfb7ddd6d787ccfa8ae9e";
        var url = "https://restapi.amap.com/v3/assistant/inputtips?output=json&city=" + cityCode + "&citylimit=true&keywords=" + value + "&key=" + key;
        ajax(url, 'get', '', 'jsonp', function (data) {
            var html = '';
            dom.addressList.empty();
            if (data.status == 1) {
                for (var i in data.tips) {
                    var name = data.tips[i].name.toString();
                    var district = data.tips[i].district.toString();
                    var location = data.tips[i].location;
                    var adcode = data.tips[i].adcode;
                    if (location != '') {
                        var dataP = {
                            district: district,
                            name: name,
                            adcode: adcode,
                            location: location
                        };
                        var jsondata = JSON.stringify(dataP);
                        html += "<li>\n                                <div class=\"content\" onclick='jump(" + jsondata + ")'>\n                                   <img src=\"../../images/dingwei.png\" alt=\"\" class=\"position-img\">\n                                    <span class=\"text\">" + district + name + "</span>\n                                </div>\n                            </li>";
                    }
                }
                dom.addressList.append(html);
            }
        });
    }, searchDelay);
});

// 定位
function showCityInfo() {
    //实例化城市查询类
    var citysearch = new AMap.CitySearch();
    //自动获取用户IP，返回当前城市
    citysearch.getLocalCity(function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
            if (result && result.city && result.bounds) {
                var cityinfo = result.city;
                var cityCode = result.adcode;
                dom.cityName.text(cityinfo);
                dom.cityCode.val(cityCode);
            }
        } else {
            console.log(result.info);
        }
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
            dom.loadingWrap.hide();
            layer.open({
                content: '请检查网络',
                skin: 'msg',
                time: 1
            });
        });
    });
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
            dom.loadingWrap.hide();
            layer.open({
                content: '请检查网络',
                skin: 'msg',
                time: 1
            });
        });
    });
}

// 跳转
function jump(v) {
    var jsondata = void 0;
    var location = v.district + v.name;
    getLocationCode(location).then(function (data) {
        jsondata = JSON.stringify(data);
        Util.LocalStorageSetter('sentAddress', jsondata);
        var city = data.geocodes[0].city,
            district = data.geocodes[0].district,
            province = data.geocodes[0].province,
            _val = province + ' ' + city + ' ' + district;
        Util.LocalStorageSetter('addressCity', _val);
        Util.LocalStorageSetter('addressSelectDetail', v.name);
        Util.LocalStorageSetter('addressCityCode', data.geocodes[0].adcode);
        Util.LocalStorageRemove('selectCity');
        skip.navigateBack();
    }).catch(function (err) {
        alert(err);
    });
}

dom.cityText.click(function () {
    skip.navigateTo('html/address/city.html');
});

// 定位功能
function positioning() {
    dom.loadingWrap.show();
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
        dom.loadingWrap.hide();
        var addressArray = data.addressComponent;
        if (addressArray == undefined) {
            layer.open({
                content: '推荐地址定位失败',
                skin: 'msg',
                time: 2
            });
        } else {
            var addressjson = data.addressComponent,
                cityinfo = addressjson.city;
            cityCode = addressjson.adcode;
            dom.cityName.text(cityinfo);
            dom.cityCode.val(cityCode);
            var value = '';
            if (addressArray.street != '' && addressArray.street != null && addressArray.street != undefined) {
                value = addressArray.street;
            } else if (addressArray.district != '' && addressArray.district != null && addressArray.district != undefined) {
                value = addressArray.district;
            } else {
                value = addressArray.city;
            }
            var cityCode = dom.cityCode.val();
            var key = "99ac58bd67cbfb7ddd6d787ccfa8ae9e";
            var url = "https://restapi.amap.com/v3/assistant/inputtips?output=json&city=" + cityCode + "&keywords=" + value + "&key=" + key;
            ajax(url, 'get', '', 'jsonp', function (data) {
                var html = '';
                dom.addressList.empty();
                if (data.status == 1) {
                    for (var i in data.tips) {
                        var name = data.tips[i].name.toString();
                        var district = data.tips[i].district.toString();
                        var location = data.tips[i].location;
                        var adcode = data.tips[i].adcode;
                        if (district != '') {
                            var dataP = {
                                district: district,
                                name: name,
                                adcode: adcode,
                                location: location
                            };
                            var jsondata = JSON.stringify(dataP);
                            html += "<li>\n                                <div class=\"content\" onclick='jump(" + jsondata + ")'>\n                                   <img src=\"../../images/dingwei.png\" alt=\"\" class=\"position-img\">\n                                    <span class=\"text\">" + district + name + "</span>\n                                </div>\n                            </li>";
                        }
                    }
                    dom.addressList.append(html);
                }
            });
        }
    }

    //解析定位错误信息
    function onError(data) {
        dom.loadingWrap.hide();
        // layer.open({
        //     content: '定位失败'
        //     , skin: 'msg'
        //     , time: 2
        // });
    }
}