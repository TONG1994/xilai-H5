const dom = {
    sentBtn: $("#sentBtn"),
    realNameBtn: $("#realNameBtn"),
    sentRecord: $("#sentRecord"),
    indexBtn: $("#indexBtn"),
    myBtn: $("#myBtn")

};
$(document).ready(function () {
    let UserAgent = skip.getAppUserAgent();
    if (UserAgent === "Android") {
        Util.LocalStorageSetter("UserAgent", "4")
    }
    skip.getAppUserAgentWithCallback(function (data) {
        if(data==="iOS"){
            Util.LocalStorageSetter("UserAgent", "4")
        }
    });

    let checkC = checkIdCard();
    if (!check()) {
        dom.realNameBtn.show()
    }
    if (check() && !checkC) {
        dom.realNameBtn.show()
    }
    isIphoneX(function () {
        $("footer").css("background-color", "#f7f7f7");
    })
});
document.body.addEventListener('touchstart', function () {
});

dom.sentBtn.click(function () {

    if (check()) {
        if (!checkIdCard()) {
            // window.location.href = "./realname/realname.html"
            wx.miniProgram.navigateTo({url: '../selectRealName/selectRealName'});
            skip.navigateTo('/html/selectRealName/selectRealName.html')

        } else {
            // window.location.href = "./sendExpress/sendExpress.html"
            wx.miniProgram.navigateTo({url: '../sendExpress/sendExpress'});
            skip.navigateTo('/html/sendExpress/sendExpress.html')
        }
    } else {
        // Util.LocalStorageSetter("loginBackUrl", "../index.html");
        Util.LocalStorageSetter("mini-url", "../home/home");
        Util.LocalStorageSetter("native-url", "/");
        // window.location.href = "./login/login.html";
        wx.miniProgram.navigateTo({url: '../login/login'});
        skip.navigateTo('/html/login/login.html')

    }
});
dom.realNameBtn.click(function () {
    if (check()) {
        // window.location.href = "./realname/realname.html";
        Util.LocalStorageSetter("mini-url", "../selectRealName/selectRealName");
        Util.LocalStorageSetter("native-url", "/html/selectRealName/selectRealName.html");
        wx.miniProgram.navigateTo({url: '../selectRealName/selectRealName'});
        skip.navigateTo('/html/selectRealName/selectRealName.html')

    } else {
        // window.location.href = "./login/login.html";
        Util.LocalStorageSetter("mini-url", "../selectRealName/selectRealName");
        Util.LocalStorageSetter("native-url", "/html/selectRealName/selectRealName.html");
        wx.miniProgram.navigateTo({url: '../login/login'});
        skip.navigateTo('/html/login/login.html')
    }
});
dom.sentRecord.click(function () {
    if (check()) {
        // window.location.href = "./myExpress/myExpress.html";
        wx.miniProgram.navigateTo({url: '../myExpress/myExpress'});
        skip.navigateTo('/html/myExpress/myExpress.html')
    } else {
        // Util.LocalStorageSetter("loginBackUrl", "../myExpress/myExpress.html");
        Util.LocalStorageSetter("mini-url", "../myExpress/myExpress");
        Util.LocalStorageSetter("native-url", "/html/myExpress/myExpress.html");
        // window.location.href = "./login/login.html";
        wx.miniProgram.navigateTo({url: '../login/login'});
        skip.navigateTo('/html/login/login.html')
    }
});
dom.indexBtn.click(function () {
    // window.location.href = "index.html";
    wx.miniProgram.redirectTo({url: '../home/home'});
    skip.redirectTo('/')
});
dom.myBtn.click(function () {
    // window.location.href = "./my/my.html";
    wx.miniProgram.redirectTo({url: '../my/my'});
    skip.redirectTo("/html/my/my.html")
});