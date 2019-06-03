"use strict";

var dom = {
    indexBtn: $("#indexBtn"),
    myBtn: $("#myBtn")
};
$(document).ready(function () {
    //检验其是否登陆
    if (check()) {
        //登陆了则显示userName
        // console.log(Util.CookiesGetter('userName'));
        $(".logintext").text(Util.CookiesGetter('userName'));
        if (checkIdCard()) {
            $(".approvetext").text("已认证");
        }
    }
    isIphoneX(function () {
        $("footer").css("background-color", "#f7f7f7");
    });
    /*$(".foottext").click(function () {
        alert(1);
    })*/
    todoVersionsUpdate();
});

$(".buttonlogin").click(function () {
    if (check()) {} else {
        //未登录
        // window.location.href = '../login/login.html';
        wx.miniProgram.navigateTo({ url: '../login/login' });
        skip.navigateTo('/html/login/login.html', '注册登录');
    }
});

$(".buttonapprove").click(function () {
    if (check()) {
        if ($(".approvetext").text() == '未认证') {
            // window.location.href = '../realname/realname.html';
            wx.miniProgram.navigateTo({ url: '../selectRealName/selectRealName' });
            skip.navigateTo('/html/selectRealName/selectRealName.html');
        }
    } else {
        wx.miniProgram.navigateTo({ url: '../login/login' });
        skip.navigateTo('/html/login/login.html');
    }
});

$(".buttonkd").click(function () {
    if (check()) {
        // window.location.href = '../myExpress/myExpress.html';
        wx.miniProgram.navigateTo({ url: '../myExpress/myExpress' });
        skip.navigateTo('/html/myExpress/myExpress.html');
    } else {
        //未登录
        // window.location.href = '../login/login.html';
        wx.miniProgram.navigateTo({ url: '../login/login' });
        skip.navigateTo('/html/login/login.html');
    }
});
$(".buttondz").click(function () {
    if (check()) {
        Util.LocalStorageSetter("address_key", "");
        Util.LocalStorageSetter("url_flag", "");
        // window.location.href = '../address/my-address.html';
        wx.miniProgram.navigateTo({ url: '../address/my-address' });
        skip.navigateTo('/html/address/my-address.html');
    } else {
        //未登录
        // window.location.href = '../login/login.html';
        wx.miniProgram.navigateTo({ url: '../login/login' });
        skip.navigateTo('/html/login/login.html');
    }
});
$(".buttonyh").click(function () {
    if (check()) {
        // window.location.href = '../coupon/coupon.html';
        wx.miniProgram.navigateTo({ url: '../coupon/coupon' });
        skip.navigateTo('/html/coupon/coupon.html');
    } else {
        //未登录
        // window.location.href = '../login/login.html';
        wx.miniProgram.navigateTo({ url: '../login/login' });
        skip.navigateTo('/html/login/login.html');
    }
});
$(".buttonsz").click(function () {
    if (check()) {
        // window.location.href = '../setting/setting.html';
        wx.miniProgram.navigateTo({ url: '../setting/setting' });
        skip.navigateTo('/html/setting/setting.html');
    } else {
        //未登录
        // window.location.href = '../login/login.html';
        wx.miniProgram.navigateTo({ url: '../login/login' });
        skip.navigateTo('/html/login/login.html');
    }
});
$(".buttonsz-about").click(function () {
    skip.navigateTo('/html/about/about.html');
});

dom.indexBtn.click(function () {
    // window.location.href = "../index.html";
    wx.miniProgram.redirectTo({ url: '../home/home' });
    skip.redirectTo('/');
});
dom.myBtn.click(function () {
    // window.location.href = "./my.html";
    wx.miniProgram.redirectTo({ url: '../my/my' });
    skip.redirectTo("/html/my/my.html");
});

// 判断ios还是安卓
function userAgent() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) return 'Android';
    if (isiOS) return 'IOS';
}

// 执行版本判断
function todoVersionsUpdate() {
    var module = userAgent();
    try {
        if (module == 'Android') {
            if (nativeObj.getUpgradeInfo() != '' && nativeObj.getUpgradeInfo() != undefined && nativeObj.getUpgradeInfo() != null) {
                $(".about-update").find(".red").show();
                Util.LocalStorageSetter("update", "yes");
            }
        }
        if (module == 'IOS') {
            iosVersions().then(function (res) {
                var appStoreVersion = res,
                    _first = parseInt(appStoreVersion.split('.')[0]),
                    _second = parseInt(appStoreVersion.split('.')[1]);
                nativeObj.getAppVersionWithCallback(function (data) {
                    var locationVersion = data,
                        location_firse = parseInt(locationVersion.split('.')[0]),
                        location_second = parseInt(locationVersion.split('.')[1]);
                    if (_first > location_firse) {
                        $(".about-update").find(".red").show();
                        Util.LocalStorageSetter("update", "yes");
                    }
                    if (_first == location_firse) {
                        if (_second > location_second) {
                            $(".about-update").find(".red").show();
                            Util.LocalStorageSetter("update", "yes");
                        }
                    }
                });
            }).catch(function (e) {
                console.log(e);
            });
        }
    } catch (e) {
        console.log(e);
    }
}

// ios获取线上版本号
function iosVersions() {
    var appStoreVersionsUrl = 'https://itunes.apple.com/lookup?id=1397647048';
    return new Promise(function (resolve, reject) {
        ajax(appStoreVersionsUrl, 'post', '', 'json', function (res) {
            if (res != '' && res != undefined && res != null) {
                resolve(res.results[0].version);
            }
        }, function () {
            layer.open({
                content: '请检查网络',
                skin: 'msg',
                time: 1
            });
        });
    });
}