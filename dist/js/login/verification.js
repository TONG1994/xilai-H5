"use strict";

var dom = {
    register_btn: $("#registerBtn"),
    verificationInput: $("#verificationInput"),
    phoneShow: $("#phoneShow")

};
var t = void 0;
var countdown = Util.CookiesGetter("countdownTime") || 59;
$(document).ready(function () {
    // 手机号
    $("#phoneShow").html(Util.LocalStorageGetter("phoneNub"));
    setTime($('#countdownNum'));
    console.log(check());
});

// 发送验证码，倒计时

function setTime(val) {
    if (countdown <= "0") {
        val.attr("disabled", false);
        Util.CookiesSetter("countdownTime", 0, 1 / 1440, ";path=/;");
        val.html("重新发送");
        val.toggleClass("active");
        return false;
    } else {
        val.attr("disabled", true);
        val.html("(" + countdown + ")");
        countdown--;
        Util.CookiesSetter("countdownTime", countdown, 1 / 1440, ";path=/;");
    }
    clearTimeout(t);
    t = setTimeout(function () {
        setTime(val);
    }, 1000);
}

// 获取验证码
$("#countdownNum").click(function () {
    countdown = 60;
    Util.CookiesSetter("countdownTime", 60, 1 / 1440, ";path=/;");
    var jsonData = {
        "object": Util.LocalStorageGetter("phoneNub")
    };
    sentVerification(jsonData);
    setTime($('#countdownNum'));
});

// 验证码校验
dom.verificationInput.bind('input propertychange', function () {
    var verification = dom.verificationInput;
    var verificationCode = verification.val();
    if (verificationCode.length > 4) {
        verificationCode = verificationCode.slice(0, 4);
        verification.val(verificationCode);
    }
    if (verification.val().length === 4) {
        dom.register_btn.attr('disabled', false);
        dom.register_btn.addClass("active");
    } else {
        dom.register_btn.attr('disabled', true);
        dom.register_btn.removeClass("active");
    }
});

// 登录、注册
function loginBtn() {
    //  防多次点击
    var clickTag = 0;
    dom.register_btn.click(function () {
        if (clickTag === 0) {
            clickTag = 1;
            setTimeout(function () {
                clickTag = 0;
            }, 5000);
            // 验证
            var jsonData = {
                "object": {
                    "telephone": dom.phoneShow.html(),
                    "vercode": dom.verificationInput.val()
                },
                "term": "2"
            };
            userLogin(jsonData);
        } else {
            layer.open({
                content: '请勿频繁点击!',
                skin: 'msg',
                time: 2
            });
        }
    });
}

loginBtn();

// 发送验证码
function sentVerification(jsonData) {
    // 发送验证码
    ajax("/xilaisender_s/user/createVerificationCode", "post", jsonData, "json", function (data) {
        if (data.errCode === ERROR) {
            layer.open({
                content: '发送成功',
                skin: 'msg',
                time: 2
            });
        } else {
            layer.open({
                content: data.errDesc,
                btn: '确认'
            });
        }
    }, function () {
        layer.open({
            content: '短信发送失败',
            btn: '确认'
        });
    });
}

// 验证码验证
function userLogin(jsonData) {

    ajax("/xilaisender_s/login/userLogin", "post", jsonData, "json", function (data) {
        if (data.errCode === ERROR) {
            var authUser = data.object.authUser;
            var phoneValue = authUser.userName;
            var sessionId = data.object.sessionId;
            var ssoToken = data.object.ssoToken;
            var staffInfo = data.object.staffInfo;
            var idCard = staffInfo.idCard;
            var perName = staffInfo.perName;
            var userId = authUser.userId;
            var d = new Date();
            d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
            var expires = "expires=" + d.toUTCString();
            // 身份证号
            document.cookie = "idCard=" + idCard + ";" + expires + ";path=/;";
            document.cookie = "userName=" + phoneValue + ";" + expires + ";path=/;";
            document.cookie = "userId=" + userId + ";" + expires + ";path=/;";
            // 给app传userU
            skip.onLogin(userId);
            layer.open({
                content: '验证成功',
                skin: 'msg',
                time: 1
            });
            setTimeout(function () {
                // 判断登录前点击的按钮
                if (Util.LocalStorageGetter("mini-url") !== null) {
                    if (Util.LocalStorageGetter("mini-url") === "../selectRealName/selectRealName" && checkIdCard()) {
                        Util.CookiesSetter("countdownTime", 0, 1 / 1440, ";path=/;");
                        wx.miniProgram.redirectTo({ url: '../home/home' });
                        skip.reLaunch('/');
                    } else {
                        Util.CookiesSetter("countdownTime", 0, 1 / 1440, ";path=/;");
                        wx.miniProgram.redirectTo({ url: Util.LocalStorageGetter("mini-url") });
                        var native_url = Util.LocalStorageGetter("native-url");
                        skip.reLaunch(native_url);
                    }
                } else {
                    // window.location.href = "../index.html"
                    Util.CookiesSetter("countdownTime", 0, 1 / 1440, ";path=/;");
                    wx.miniProgram.reLaunch({ url: '../home/home' });
                    skip.reLaunch('/');
                }
            }, 1500);
        } else {
            layer.open({
                content: data.errDesc,
                btn: '确定'
            });
        }
    }, function () {
        layer.open({
            content: '网络出问题了~',
            btn: '确定'
        });
    });
}