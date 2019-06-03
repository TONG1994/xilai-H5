$(document).ready(function () {
    getIdCard()
    //监控界面变化
    let wHeight = window.innerHeight;
    $(window).resize(function () {
        let hh = window.innerHeight;
        if (hh < wHeight) {
            $(".footdiv").hide();
        } else {
            $(".footdiv").show();
        }

    });
});

// 获取身份证信息
function getIdCard() {
    let name = Util.LocalStorageGetter('idCardName');
    let idCardNo = Util.LocalStorageGetter('idCardNo');
    $(".inputname").val(name);
    $(".inputid").val(idCardNo);
    if (name != '' && name != undefined && name != null) {
        $("input").attr('readonly', 'readonly').css("color","#989898");
        $(".buttondiv").removeClass("disbutton");
        $(".buttondiv button").attr("disabled", false);
        // $(".buttondiv button").html('提交');
        $("#ftext").show();
    }
}

//获取name的val判断button的变化
$(".inputname").bind('input propertychange', function () {
    if ($(".inputname").val() != '' && $(".inputid").val() != '') {
        //分开判断，做当输入的格式不对的时候红字提示
        if (reg.test($(".inputid").val()) === true) {
            $(".buttondiv").removeClass("disbutton");
            $(".buttondiv button").attr("disabled", false);
            $(".foottext").show();
        } else {
            $(".buttondiv").addClass("disbutton");
            $(".buttondiv button").attr("disabled", true);
        }
    } else {
        //有一项input没有填完
        $(".foottext").hide();
        $(".buttondiv").addClass("disbutton");
    }
});

//获取id的val判断button的变化
$(".inputid").bind('input propertychange', function () {
    if ($(".inputname").val() != '' && $(".inputid").val() != '') {
        //分开判断，做当输入的格式不对的时候红字提示
        if (reg.test($(".inputid").val()) === true) {
            $(".buttondiv").removeClass("disbutton");
            $(".buttondiv button").attr("disabled", false);
            $(".foottext").show();
        } else {
            $(".buttondiv").addClass("disbutton");
            $(".buttondiv button").attr("disabled", true);
        }

    } else {
        //有一项input没有填完，button上面字会消失，button也会变色
        $(".foottext").hide();
        $(".buttondiv").addClass("disbutton");
    }
});


//身份证的正则判断
var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

$("button").click(function () {
    if ($(".buttondiv").css("background-color") != 'rgb(155, 155, 155)' && reg.test($(".inputid").val()) === true) {
        //当按钮不是灰色则可以进行操作
        //使用ajax返回所需要的值（true/false）
        var jsondata = {
            "object": {
                "idCardNo": $(".inputid").val(),
                "realName": $(".inputname").val()
            }
        };
        console.log(jsondata);
        ajax("/xilaisender_s/idCardAuth/validateUserIdCard", "post", jsondata, "json",
            //请求成功
            function (data) {
                console.log(data);
                if (data.errCode === ERROR) {
                    //身份证正确时调取
                    isright(data);
                } else {
                    //身份证不对时调用
                    iserror(data);
                }


            },
            //请求失败
            function (data) {
                console.log("请求失败", data);
                $(".re").show();
                $(".reerror").show();
                $("#errortext").text("网络请求失败");

                setTimeout(funB, 3000);

                function funB() {
                    $(".re").hide();
                    $(".reerror").hide();
                }
            });

    } else {
        //身份证格式错误，button不可点击状态
        //按钮为灰色不设置事件
        $(".re").show();
        $(".reerror").show();
        $("#errortext").text("请输入正确的身份证号");
        setTimeout(funB, 3000);

        function funB() {
            $(".re").hide();
            $(".reerror").hide();
        }

    }
});

//能验证，且身份证名字正确
function isright(data) {
    if (data.object === true) {
        $(".re").show();
        $(".reright").show();
        setTimeout(funA, 3000);

        function funA() {
            $(".re").hide();
            $(".reright").hide();
            wx.miniProgram.redirectTo({url: '../home/home'});
            skip.navigateTo('/')
        }
        //验证成功后跳转至首页
        let d = new Date();
        d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = `idCard=1;${expires};path=/;`;

    } else {
        $(".re").show();
        $(".reerror").show();
        $("#errortext").text("姓名和身份证号码不一致");
        setTimeout(funB, 3000);

        function funB() {
            $(".re").hide();
            $(".reerror").hide();
        }
    }

}

//能验证，但是身份证名字不对
function iserror(data) {
    $(".re").show();
    $(".reerror").show();
    $("#errortext").text(data.errDesc);
    setTimeout(funB, 2000);

    function funB() {
        $(".re").hide();
        $(".reerror").hide();
    }

    setTimeout(function () {
        loginAgain(data);
    }, 2000);
}

