let module;

$(document).ready(function () {
    let a = Util.LocalStorageGetter('update');
    if (a == 'yes') {
        $(".new-logo").show();
        click();
    }

    module = userAgent()
    if (module == 'Android') {
        $("#versions").html(nativeObj.getVersionName())
    }
    if (module == 'ios') {
        nativeObj.getAppVersionWithCallback(function (data) {
            $("#versions").html(data)

        })
    }
})

// 判断ios还是安卓
function userAgent() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) return 'Android';
    if (isiOS) return 'ios'
}

$(".rule").click(function () {
    skip.navigateTo('/html/rule/rule.html')
});

// 跳转
function click() {
    $(".versions").on('click', function () {
        if (module == 'ios') {
            nativeObj.openURLLink('https://itunes.apple.com/cn/app/id1397647048?mt=8')
        }
        if (module == 'Android') {
            nativeObj.checkUpgrade();
        }
    })
}
