$(document).ready(function () {
    //加载优惠卷
    getCouponData();

});

function getCouponData() {

    ajax("/xilaisender_s/coupon/getByUser", "post", null, "json",
        //请求成功
        function (data) {
            console.log(data.object);
            // 满多少金额
            if (data.errCode === ERROR) {
                if (data.object.length > 0) {
                    let new_array1 = [];
                    let new_array2 = [];
                    let new_array3 = [];
                    let new_array4 = [];
                    for (let i in data.object) {
                        // 判断是否过期0.未过期，1.已过期
                        if (data.object[i].expire === '0') {
                            //0.未使用，1.使用中，2.已使用
                            if (data.object[i].status === '0') {
                                new_array1.push(data.object[i]);
                            }
                            if (data.object[i].status === '1') {
                                new_array2.push(data.object[i]);
                            }
                            if (data.object[i].status === '2') {
                                new_array3.push(data.object[i]);
                            }

                        } else {
                            new_array4.push(data.object[i]);
                        }

                    }
                    let new_array = new_array1.concat(new_array2, new_array3, new_array4);
                    console.log(new_array);
                    for (let i in new_array) {
                        let status_icon;
                        if (new_array[i].expire === '0') {
                            //0.未使用，1.使用中，2.已使用
                            if (new_array[i].status === '0') {
                                status_icon='';
                            }
                            if (new_array[i].status === '1') {
                                status_icon = '../../images/using.png'
                            }
                            if (new_array[i].status === '2') {
                                status_icon = '../../images/Shape@2x.png'
                            }
                        } else {
                            status_icon = '../../images/Group11@2x.png'
                        }
                        let minimumConsumption = new_array[i].minimumConsumption;
                        //代金券金额
                        let couponAmount = new_array[i].couponAmount;
                        //对时间格式进行分离
                        let test = new_array[i].effectiveFailureTime.split(" ");
                        let time = test[0].split("-").join(".");
                        let userName = Util.CookiesGetter('userName');
                        // 0.未过期，1.已过期
                        let expire_used = (new_array[i].expire) === "0" ? "" : "used";
                        //0.未使用，1.使用中，2.已使用
                        let status_used = (new_array[i].status) === "0" ? "" : "used";
                        let status_icon_using = (new_array[i].status) === "1" ? "../../images/using.png" : "";
                        let html = `<li>
                <div class="coupon-li-wrap ${expire_used} ${status_used}">
                    <div class="li-wrap-top">
                        <div class="coupon-li-wrap-top">
                            <div class="wrap-top-price">
                                <div class="top-price-tit"><p>快递代金券</p></div>
                                <div class="top-price-num">
                                    <span class="symbol">¥</span>
                                    <span class="num">${couponAmount}</span>
                                </div>
                            </div>
                            <div class="wrap-top-date">
                                <div class="top-date-num">有效期至${time}</div>
                                <div class="top-data-txt">满¥${minimumConsumption}可用</div>
                            </div>
                        </div>
                        <div class="bottom-left-corner"></div>
                        <div class="bottom-right-corner"></div>
                    </div>
                    <div class="li-wrap-bottom">
                        <div class="coupon-li-wrap-bottom">
                            <p>仅限手机号${userName}使用</p>
                        </div>
                        <div class="top-left-corner"></div>
                        <div class="top-right-corner"></div>
                        <div class="used-icon" style="display: none"><img src="${status_icon}" alt=""></div>
                    </div>
                </div>
            </li>`;
                        $(".coupon ul").append(html);
                    }
                } else {
                    let html_none = `<li id="quanNone">
                                    <div>
                                        <img src="../../images/quan.png" alt="">
                                    </div>
                                    <div>
                                        <p>您当前没有卡券哦～</p>
                                    </div>
                                </li> `;
                    $(".coupon ul").append(html_none);
                }
            } else {
                layer.open({
                    content: data.errDesc
                    , skin: 'msg'
                    , time: 2
                });
            }
        },
        //请求失败
        function (data) {
            alert("网络请求失败")
        });


}