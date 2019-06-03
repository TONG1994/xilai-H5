'use strict';

var url = 'loc';

/**
 * 清除输入框
 * @param el        元素清空dom
 * @param btn       按钮点击dom
 */
function clearVal(el, btn) {
    var ele = $(el);
    var btn_x = $(btn);
    ele.bind('input propertychange', function () {
        if (ele.val() !== '') {
            btn_x.show();
        } else {
            btn_x.hide();
        }
    });
    btn_x.click(function () {
        ele.val('');
        if (ele.val() === '') {
            btn_x.hide();
        }
    });
}

var Util = function () {
    //读取本地session存储
    var prefix = 'h5';
    var StorageGetter = function StorageGetter(key) {
        return sessionStorage.getItem(prefix + key);
    };
    //获取本地session存储
    var StorageSetter = function StorageSetter(key, value) {
        return sessionStorage.setItem(prefix + key, value);
    };
    //设置本地local存储
    var LocalStorageSetter = function LocalStorageSetter(key, value) {
        return localStorage.setItem(prefix + key, value);
    };
    //获取本地local存储
    var LocalStorageGetter = function LocalStorageGetter(key, value) {
        return localStorage.getItem(prefix + key, value);
    };
    //获取本地local存储
    var LocalStorageRemove = function LocalStorageRemove(key, value) {
        return localStorage.removeItem(prefix + key, value);
    };
    //设置Cookies存储
    var CookiesSetter = function CookiesSetter(name, value, days, place) {
        var d = new Date();
        d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
        var expires = "expires=" + d.toUTCString();
        return document.cookie = name + ' =' + value + ';' + expires + place;
    };
    // 获取Cookies
    var CookiesGetter = function CookiesGetter(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
        }
        return "";
    };
    //暴露下方法
    return {
        StorageGetter: StorageGetter,
        StorageSetter: StorageSetter,
        CookiesSetter: CookiesSetter,
        CookiesGetter: CookiesGetter,
        LocalStorageSetter: LocalStorageSetter,
        LocalStorageGetter: LocalStorageGetter,
        LocalStorageRemove: LocalStorageRemove
    };
}();

/**
 * ajax请求
 * @param url           地址
 * @param type          请求类型post,get
 * @param jsonData      请求数据
 * @param dataType      数据类型
 * @param sucfunc       请求成功回调
 * @param errfunc       失败回调
 */
function ajax(url, type, jsonData, dataType, sucfunc, errfunc) {
    $.ajax({
        url: url,
        type: type,
        contentType: "application/json;charset=utf-8",
        dataType: dataType,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        data: JSON.stringify(jsonData),
        success: sucfunc,
        error: errfunc
    });
}

function check() {
    var ssoToken = document.cookie.indexOf("SSOTOKEN=");
    var userName = document.cookie.indexOf("userName=");
    var f = ssoToken !== -1 && userName !== -1;
    return f;
}

// 防多次点击
function loginBtn(dom, fuc) {
    //  防多次点击
    var clickTag = 0;
    dom.click(function () {
        if (clickTag === 0) {
            clickTag = 1;
            setTimeout(function () {
                clickTag = 0;
            }, 3000);
            fuc();
        } else {
            layer.open({
                content: '请勿频繁点击',
                skin: 'msg',
                time: 2
            });
        }
    });
}

// 实名认证
function checkIdCard() {
    var idCardValue = Util.CookiesGetter("idCard");
    if (idCardValue === "" || idCardValue === "undefined" || idCardValue === "null") {
        return false;
    } else {
        return true;
    }
}

// 用户协议跳转
function rule() {
    wx.miniProgram.navigateTo({ url: '../rule/rule' });
    skip.navigateTo('/html/rule/rule.html');
}

// 与app交互
var skip = function () {
    var navigateTo = function navigateTo(src) {
        if (typeof nativeObj === "undefined") {
            return false;
        } else {
            return nativeObj.navigateTo(src);
        }
    };
    var navigateBack = function navigateBack(src) {
        if (typeof nativeObj === "undefined") {
            return false;
        } else {
            return nativeObj.navigateBack(src);
        }
    };
    var redirectTo = function redirectTo(src) {
        if (typeof nativeObj === "undefined") {
            return false;
        } else {
            return nativeObj.redirectTo(src);
        }
    };
    var reLaunch = function reLaunch(src) {
        if (typeof nativeObj === "undefined") {
            return false;
        } else {
            return nativeObj.reLaunch(src);
        }
    };
    var reLoad = function reLoad() {
        if (typeof nativeObj === "undefined") {
            return false;
        } else {
            return nativeObj.reLoad();
        }
    };
    var onLogin = function onLogin(userUdid) {
        if (typeof nativeObj === "undefined") {
            return false;
        } else {
            return nativeObj.onLogin(userUdid);
        }
    };
    var onLogout = function onLogout(userUdid) {
        if (typeof nativeObj === "undefined") {
            return false;
        } else {
            return nativeObj.onLogout(userUdid);
        }
    };
    var log = function log(text) {
        if (typeof nativeObj === "undefined") {
            return false;
        } else {
            return nativeObj.log(text);
        }
    };
    var getAppUserAgent = function getAppUserAgent() {
        if (typeof nativeObj !== "undefined") {
            if (typeof nativeObj.getAppUserAgent !== 'undefined') {
                return nativeObj.getAppUserAgent();
            } else {
                return false;
            }
        } else {
            Util.LocalStorageSetter("UserAgent", "0");
        }
    };
    var getAppUserAgentWithCallback = function getAppUserAgentWithCallback(fuc) {
        if (typeof nativeObj !== "undefined") {
            if (typeof nativeObj.getAppUserAgentWithCallback !== 'undefined') {
                return nativeObj.getAppUserAgentWithCallback(fuc);
            } else {
                return false;
            }
        } else {
            Util.LocalStorageSetter("UserAgent", "0");
        }
    };
    var call = function call(phone) {
        if (typeof nativeObj !== "undefined") {
            if (typeof nativeObj.call !== 'undefined') {
                return [$(phone).attr("href", "javascript:;"), nativeObj.call(phone)];
            } else {
                return false;
            }
        } else {
            return false;
        }
    };
    return {
        // 普通跳转
        navigateTo: navigateTo,
        // 返回之前页面，并刷新
        navigateBack: navigateBack,
        // 关闭当前页面，跳转到应用内的某个页面。
        redirectTo: redirectTo,
        // 关闭所有页面（保留首页），打开到应用内的某个页面。
        reLaunch: reLaunch,
        // 刷新
        reLoad: reLoad,
        onLogin: onLogin,
        onLogout: onLogout,
        log: log,
        // app给H5传值，判断当前环境。
        getAppUserAgent: getAppUserAgent,
        getAppUserAgentWithCallback: getAppUserAgentWithCallback,
        call: call
    };
}();

function isIphone(iphone, android) {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {} else if (/(Android)/i.test(navigator.userAgent)) {}
}

// 判断 iPhoneX
function isIphoneX(fuc) {
    var isIphoneX = /iphone/gi.test(navigator.userAgent) && screen.height == 812 && screen.width == 375;
    if (isIphoneX) {
        fuc();
    }
}

// 日期格式化
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }return fmt;
};

function clearCookie(name) {
    setCookie(name, "", -1, ";path=/;");
}

//设置cookies
function setCookie(name, value, days, pleace) {
    var d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + pleace;
}

function loginAgain(data) {
    if (data.errCode === "AUTH09") {
        clearCookie("SESSION");
        clearCookie("SSOTOKEN");
        clearCookie("userName");
        clearCookie("idCard");
        clearCookie("userId");
        localStorage.clear();
        skip.reLaunch("/html/login/login.html");
    }
}

// 埋点
function mtac() {
    var _mtac = {};
    (function () {
        var mta = document.createElement("script");
        mta.src = "https://pingjs.qq.com/h5/stats.js?v2.0.2";
        mta.setAttribute("name", "MTAH5");
        mta.setAttribute("sid", "500625451");
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(mta, s);
    })();
}