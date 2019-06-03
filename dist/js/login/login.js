"use strict";

var dom = {
    xl_login: $("#xl-login"),
    register_btn: $("#registerBtn"),
    verificationInput: $("#verificationInput"),
    loadingWrap: $(".loading-wrap")

};

$(document).ready(function () {
    // 清空手机号
    clearVal('#xl-phone', '#clearV');
    // 清空后下一步置灰
    $("#clearV").click(function () {
        $("#xl-login").attr('disabled', true);
        dom.xl_login.removeClass("active");
    });
    // 手机号
    $("#phoneShow").html(Util.LocalStorageGetter("phoneNub"));
});

// 获取手机号
function isPhone(value) {
    return isValid('Phone', value);
}

// 输入时验证手机号合法性
function validatePhone() {
    var phone_dom = $("#xl-phone");
    var phoneValue = phone_dom.val();
    phoneValue = clipboardNumber(phoneValue);
    if (phoneValue.length > 11) {
        phoneValue = phoneValue.slice(0, 11);
    }
    phone_dom.val(phoneValue);
    if (isPhone(phoneValue)) {
        // 下一步按钮激活
        dom.xl_login.attr('disabled', false);
        dom.xl_login.addClass("active");
    } else {
        $("#xl-login").attr('disabled', true);
        dom.xl_login.removeClass("active");
    }
}

var $xlPhone = $('#xl-phone');
$xlPhone.bind('input propertychange', function () {
    validatePhone();
});

// focus时改为text类型再来粘贴
$xlPhone.bind('focus', function () {
    $(this).prop({ 'type': 'text' });
});

// blur时回复原型
$xlPhone.blur(function () {
    $(this).prop({ 'type': 'number' });
});

// 提交手机号
dom.xl_login.click(function () {
    dom.loadingWrap.show();
    var phoneValue = $("#xl-phone").val();
    Util.LocalStorageSetter("phoneNub", phoneValue);
    var jsonDate = {
        "object": phoneValue
    };
    ajax("/xilaisender_s/user/createVerificationCode", "post", jsonDate, "json", function (data) {
        dom.loadingWrap.hide();
        if (data.errCode == ERROR || data.errCode == 50026) {
            layer.open({
                content: '发送成功',
                skin: 'msg',
                time: 1
            });
            // window.location.href = './verification.html';
            dom.xl_login.attr('disabled', true);
            dom.xl_login.removeClass("active");
            setTimeout(function () {
                wx.miniProgram.redirectTo({ url: '../verification/verification' });
                skip.navigateTo("/html/login/verification.html");
            }, 1500);
        } else {
            layer.open({
                content: data.errDesc,
                btn: '确定'
            });
        }
    }, function () {
        dom.loadingWrap.hide();
        layer.open({
            content: '短信发送失败',
            skin: 'msg',
            time: 2
        });
    });
});