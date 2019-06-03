"use strict";

// dom
var dom = {
    jumpRealName: $("#jumpRealName"),
    idCard: $("#idCard"),
    loadingWrap: $(".loading-wrap"),
    loadingFather: $(".schedule")
};
$(document).ready(function () {
    capture();
});
dom.jumpRealName.click(function () {
    Util.LocalStorageRemove('idCardName');
    Util.LocalStorageRemove('idCardNo');
    skip.navigateTo('/html/realname/realname.html');
});

// 调用摄像头
function capture() {
    var file = $("#idCard");
    if (getIos()) {
        file.removeAttr("capture");
    }

    function getIos() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/iPhone\sOS/i) == "iphone os") {
            return true;
        } else {
            return false;
        }
    }
}

dom.idCard.on("change", function (e) {
    var file = this.files[0];
    //创建读取文件的对象
    var reader = new FileReader();
    //创建文件读取相关的变量
    var imgFile = void 0;
    //为文件读取成功设置事件
    reader.onload = function (e) {
        // alert('文件读取完成');
        dom.loadingFather.show();
        updateLoading(0, 0, 1);
        imgFile = e.target.result;
        var data = imgFile.split(',')[1];
        var data_encode = encodeURI(data);
        getAccessToken().then(function (res) {
            idCard(data_encode, res.object);
        });
    };

    //正式读取文件
    reader.readAsDataURL(file);
});

// 获取access_token
function getAccessToken() {
    return new Promise(function (resolve, reject) {
        ajax('/xilaisender_s/user/getAuthToken', 'POST', '', 'json', function (res) {
            resolve(res);
            //用延迟  模拟加载文件需要的时间
            updateLoading(0, 90, 10);
        }, function (e) {
            setTimeout(function () {
                updateLoading(90, 100, 1);
                dom.loadingFather.hide();
            }, 1000);
            layer.open({
                content: '请求失败',
                skin: 'msg',
                time: 2
            });
        });
    });
}

// 百度ocr

function idCard(image_base64, access_token) {
    var url = 'https://aip.baidubce.com/rest/2.0/ocr/v1/idcard;';
    $.ajax({
        type: "post",
        contentType: "application/x-www-form-urlencoded",
        url: "https://aip.baidubce.com/rest/2.0/ocr/v1/idcard",
        async: true,
        data: {
            access_token: access_token,
            id_card_side: "front",
            image: image_base64
        },
        dataType: "json",
        timeout: 30000,
        success: function success(data) {
            updateLoading(90, 100, 1);
            if (data.words_result) {
                var name = data.words_result.姓名.words;
                var id_card = data.words_result.公民身份号码.words;

                if (name == '' || id_card == '') {
                    dom.loadingFather.hide();
                    layer.open({
                        content: '上传失败，请重新上传',
                        skin: 'msg',
                        time: 2
                    });
                } else {
                    Util.LocalStorageSetter('idCardName', name);
                    Util.LocalStorageSetter('idCardNo', id_card);
                    setTimeout(function () {
                        layer.open({
                            content: '解析成功',
                            skin: 'msg',
                            time: 2
                        });
                        dom.loadingFather.hide();
                    }, 1000);

                    setTimeout(function () {
                        skip.navigateTo('/html/realname/realname.html');
                    }, 1500);
                }
            } else {
                setTimeout(function () {
                    layer.open({
                        content: '上传失败，请重新上传',
                        skin: 'msg',
                        time: 1
                    });
                    dom.loadingFather.hide();
                }, 1000);
            }
            console.log(data);
        },
        error: function error(xhr) {
            updateLoading(90, 100, 1);
            setTimeout(function () {
                layer.open({
                    content: '上传失败，请重新上传',
                    skin: 'msg',
                    time: 1
                });
                dom.loadingFather.hide();
            }, 1000);
        }
    });
}

/**
 * 更新进度条
 * @param {Object} before_num :电话开始时候的百分比
 * @param {Object} after_num ：更新进度条数字百分比 （10）
 * @param {Object} millisecond :动画执行毫秒数
 */
var bfb = document.getElementsByClassName('bfb')[0];

function updateLoading(before_num, after_num, millisecond) {
    bfb.innerHTML = before_num;
    document.getElementsByClassName('loading')[0].style.cssText = 'width: ' + before_num;
    document.getElementsByClassName('loading')[0].style.cssText = 'width: ' + after_num + '%;transition-duration:' + millisecond + 's;';
    var load_Interval = setInterval(function () {
        if (bfb.innerHTML < after_num) {
            bfb.innerHTML = parseInt(bfb.innerHTML) + 1;
        } else {
            clearInterval(load_Interval);
        }
    }, millisecond * 1000 / after_num);
}