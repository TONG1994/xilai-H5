$(document).ready(function () {
    //假判断，登陆即是已经认证
    if (checkIdCard()) {
        $(".approvetext").text("已认证");
    } else {
    }
});

$(".buttonapprove").click(function () {
    if (checkIdCard()) {
        //已认证不进入实名验证页面
    } else {
        // window.location.href = '../realname/realname.html'
        wx.miniProgram.navigateTo({url: '../selectRealName/selectRealName'});
        skip.navigateTo("/html/selectRealName/selectRealName.html")
    }
});

$(".buttondiv").click(function () {
    let userId = Util.CookiesGetter("userId");
    skip.onLogout(userId);
    //清除用户登陆状态的cookies
    deleteCookie();
    //点击退出返回到登陆界面
    // window.location.href = '../index.html';
    wx.miniProgram.navigateTo({url: '../home/home'});
    skip.reLaunch("/")
});

//删除cookies
function deleteCookie() {
    clearCookie("SESSION");
    clearCookie("SSOTOKEN");
    clearCookie("userName");
    clearCookie("idCard");
    clearCookie("countdownTime");
    localStorage.clear();
}

function clearCookie(name) {
    setCookie(name, "", -1, ";path=/;");
}


//设置cookies
function setCookie(name, value, days, pleace) {
    var d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + pleace;
}
