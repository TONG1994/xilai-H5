"use strict";

var regular = {
    // 手机号验证
    phone: /^1[3456789]\d{9}$/,
    email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    specialCharacter: "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）—|{}【】‘；：”“'。，、？]",
    comma: ",|、|，|\\s+",
    letter: "^[a-zA-Z]+$",
    nub: "^[0-9]+$",
    chinaText: "^[\\\u4E00-\\\u9FA5]+$",
    all: "^[\\\u4E00-\\\u9FA5a-zA-Z0-9-\\s()\uFF08\uFF09#/|\uFF0C,\u3007\xB7]+$",
    specialCount: "[* /\\:|\"?<>]",
    allNub: /^[\d]+$/
};

/**
 * 是否合法
 * @param type
 * @param value
 * @returns {boolean}
 */
function isValid(type, value) {
    //判断该类型
    switch (type) {
        case 'Phone':
            return regular.phone.test(value);
            break;
        case 'Email':
            return regular.email.test(value);
            break;
    }
}

// 匹配掉特殊字符
function stripScript(s) {
    var pattern = new RegExp(regular.specialCharacter);
    var rs = "";
    for (var i = 0; i < s.length; i++) {
        rs = rs + s.substr(i, 1).replace(pattern, '');
    }
    return rs;
}

// 提示特殊字符（方法1）
function reminderStripScript(s) {
    var pattern = new RegExp(regular.specialCharacter);
    return pattern.test(s);
}

// 提示特殊字符（方法2）
function reminderStripScriptTow(s) {
    var pattern = new RegExp(regular.all);
    return pattern.test(s);
}

// 提示特殊字符（方法3）
function reminderStripScriptThree(s) {
    var pattern = new RegExp(regular.specialCount);
    return pattern.test(s);
}

// 是否为数字
function ifNumber(s) {
    var pattern = new RegExp(regular.allNub);
    return pattern.test(s);
}

function comma(s) {
    var pattern = new RegExp(regular.comma);
    var rs = "";
    for (var i = 0; i < s.length; i++) {
        rs = rs + s.substr(i, 1).replace(pattern, ' ');
    }
    return rs;
}
//匹配剪切板上的电话，返回正常手机号或座机号
function clipboardNumber(s) {
    //去除空格
    var data = s.replace(/\s*/g, "");
    var data1 = data.replace(/[^0-9]/ig, "");
    var test = data1.substring(2, 0);
    if (test == "86") {
        if (data.substring(2).length >= 12) {
            var phone = data1.substring(2).slice(0, 12);
            return phone;
        }
        return data1.substring(2);
    } else {
        if (data.substring(2).length >= 12) {
            var _phone = data1.slice(0, 12);
            return _phone;
        }
        return data1;
    }
}