let p = 1;
let dataList;
let maxpage;//最大页数
const dom = {
    list_btn: $("#listBtn"),
    manage_btn: $("#addressManage")
};
$(document).ready(function () {
    judgeState();
    // dom

    // 导航切换
    const li_btn = dom.list_btn.find('li');
    let index = 0;
    li_btn.click(function () {
        $("#logisticsContent ul").each(function () {
            $(this).hide();
        });
        const i = $(this).index();
        Util.LocalStorageSetter("listNo", i);
        const left = $(this).offset().left;
        $(".btn-line .btn-active").css("left", left);
        $("#logisticsContent ul").eq(i).show();
        index = i;
        getlist(index, 1);
    });

    // //页面加载时，直接获取第一次请求
    // getlist(0, 1);

    //滑动的的时候加载
    $(window).scroll(function () {
        if (($(window).scrollTop()) >= ($(document).height() - $(window).height())) {
            p++;
            getlist(index, p);
            /* alert("scrollTop" + $(window).scrollTop());
             alert("document" + $(document).height());
             alert("window" + $(window).height());*/
        }
    });

});


function getlist(index, page) {
    let jsondata = {
        "object": {
            "pageRow": 10,
            "startPage": 1,
            "object": {}
        }
    };
    jsondata.object.startPage = page;
    if (index === 1 && page === 1) {
        $("#lanshoulist").empty();
        p = 1;
        jsondata.object.object.orderStatus = "0";
    } else if (index === 2 && page === 1) {
        $("#qianshoulist").empty();
        p = 1;
        jsondata.object.object.orderStatus = "4";
    } else if (index === 0 && page === 1) {
        $("#alllist").empty();
        p = 1;
    }
    console.log(page);
    if (page === 1 || page <= maxpage) {


        ajax("/xilaisender_s/expressOrderDetail/queryUserOrderList", 'post', jsondata, 'json',
            //成功返回
            function (alldata) {
                if (alldata.errCode === ERROR) {
                    if (alldata.object.totalRow > 0) {
                        let data = alldata.object;
                        maxpage = Math.ceil(alldata.object.totalRow / 10);
                        for (let i in data.list) {
                            console.log(data.list[i]);
                            //地名解析，剥离出市级
                            //寄件方
                            var senderProvinceCityCountyName = data.list[i].senderProvinceCityCountyName;
                            var senderProvinceCityCountyName1 = senderProvinceCityCountyName.split("-");
                            var senderProvinceCityCountyName2 = senderProvinceCityCountyName1[1].split("市");
                            //收件方
                            var receiverProvinceCityCountyName = data.list[i].receiverProvinceCityCountyName;
                            var receiverProvinceCityCountyName1 = receiverProvinceCityCountyName.split("-");
                            var receiverProvinceCityCountyName2 = receiverProvinceCityCountyName1[1].split("市");

                            //订单号
                            let orderNo = data.list[i].orderNo;
                            let uuid = data.list[i].uuid;
                            let orderStatus = data.list[i].orderStatus;
                            let senderName = data.list[i].senderName;
                            let receiverName = data.list[i].receiverName;
                            //使用创建时间
                            let createTime = data.list[i].createTime;
                            let orderstate;
                            let state = data.list[i].orderStatus;
                            dataList = data.list;

                            if (data.list[i].orderStatus == 0) {
                                orderstate = "待接单";
                            } else if (data.list[i].orderStatus == 1) {
                                orderstate = "待取件";
                            } else if (data.list[i].orderStatus == 2) {
                                orderstate = "未付款";
                            } else if (data.list[i].orderStatus == 3) {
                                orderstate = "待发件";
                            } else if (data.list[i].orderStatus == 4) {
                                orderstate = "待签收";
                            } else if (data.list[i].orderStatus == 5) {
                                orderstate = "已签收";
                            } else if (data.list[i].orderStatus == 6) {
                                orderstate = "已取消";
                            }
                            const myorderDetail = `
                            <li onclick="jump('${uuid}','${orderStatus}')"><div class="expressNo">
                            <div class="orderN"><span>订单号:</span><span><i>${orderNo}</i></span></div><div class="orderstate">${orderstate}</div></div>
                            <div class="fromto">
                            <div class="from">
                                <p class="place">${senderProvinceCityCountyName2[0]}</p>
                                <p class="name">${senderName}</p>
                            </div>
                            <div class="expressState">
                                <div class="line"></div>
                                <div class="icon">
                                    <img src="../../images/kuaidi2.png" alt="">
                                </div>
                                <div class="line"></div>
                            </div>
                            <div class="to">
                                <p class="place">${receiverProvinceCityCountyName2[0]}</p>
                                <p class="name">${receiverName}</p>
                            </div>
                            </div>
                            <div class="orderTime">
                            <span>下单时间：</span>
                                <i>${createTime}</i>
                            </div></li>`;
                            $(".myExpresslist").eq(index).append(myorderDetail);
                        }
                    } else {
                        //没有获取到数据，显示图片
                        let html_none = `<li id="sendNone">
                                    <div>
                                        <img src="../../images/send-none.png" alt="">
                                    </div>
                                    <div>
                                        <p>目前没有这个记录哦～</p>
                                    </div>
                                </li> `;
                        $(".myExpresslist").append(html_none);
                    }
                } else {
                    layer.open({
                        content: alldata.errDesc,
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    setTimeout(function () {
                        loginAgain(alldata);
                    }, 2000);
                }
            },
            //失败返回
            function (data) {
                console.log("返回失败", data);
            });
    } else {
        // alert("已加载完毕。")
    }

}

function jump(data, orderStatus) {
    let order_uuid_string = JSON.stringify(data);
    Util.LocalStorageSetter("order_uuid_string", order_uuid_string);
    if (orderStatus === "0" || orderStatus === "1" || orderStatus === "6") {
        skip.navigateTo('/html/expressDetail/expressDetail.html')
    } else {
        wx.miniProgram.navigateTo({url: '../orderDetail/orderDetail'});
        skip.navigateTo('/html/orderDetail/orderDetail.html')
    }

}

// 进入页面判断哪个
function judgeState() {
    let listNo = Util.LocalStorageGetter("listNo");
    if (listNo === "" || listNo === null || listNo === undefined) {
        getlist(0, 1);
        return
    }
    // 待揽收
    if (listNo === "1") {
        const left = dom.list_btn.find('li').eq(1).offset().left;
        $(".btn-line .btn-active").css("left", left);
        getlist(1, 1);
        $("#logisticsContent ul").eq(1).show().siblings('ul').hide();
        return
    }
    // 代签收
    if (listNo === "2") {
        const left = dom.list_btn.find('li').eq(2).offset().left;
        $(".btn-line .btn-active").css("left", left);
        getlist(2, 1);
        $("#logisticsContent ul").eq(2).show().siblings('ul').hide();
        return
    }
    // 全部
    if (listNo === "0") {
        const left = dom.list_btn.find('li').eq(0).offset().left;
        $(".btn-line .btn-active").css("left", left);
        getlist(0, 1);
        $("#logisticsContent ul").eq(3).show().siblings('ul').hide();
    }
}
