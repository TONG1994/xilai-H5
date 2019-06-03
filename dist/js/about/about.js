'use strict';

var _module = void 0;

$(document).ready(function () {
    var a = Util.LocalStorageGetter('update');
    if (a == 'yes') {
        $(".new-logo").show();
        click();
    }

    _module = userAgent();
    if (_module == 'Android') {
        $("#versions").html(nativeObj.getVersionName());
    }
    if (_module == 'ios') {
        nativeObj.getAppVersionWithCallback(function (data) {
            $("#versions").html(data);
        });
    }
});

// 判断ios还是安卓
function userAgent() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) return 'Android';
    if (isiOS) return 'ios';
}

$(".rule").click(function () {
    skip.navigateTo('/html/rule/rule.html');
});

// 跳转
function click() {
    $(".versions").on('click', function () {
        if (_module == 'ios') {
            nativeObj.openURLLink('https://itunes.apple.com/cn/app/id1397647048?mt=8');
        }
        if (_module == 'Android') {
            nativeObj.checkUpgrade();
        }
    });
}