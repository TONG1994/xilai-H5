// dom
const dom = {
    list_btn: $("#listBtn"),
    manage_btn: $("#addressManage"),
    adr_edit: $(".adr-edit"),
    adrName: $(".adr-name"),
    adrPhone: $(".adr-phone"),
    adrDetail: $(".adr-detail"),
    addressUuid: $(".address-uuid"),
    addNewAddressBtn: $("#addNewAddressBtn"),
    addressContent: $(".address-content ul"),
    popUpBox: $(".pop-up-box-wrap"),
    popYes: $("#popYes"),
    popNo: $("#popNo"),
    searchAddress: $("#searchAddress"),
    searchWords: $("#searchWords")
};

$(document).ready(function () {
    judgeState();
    //监控界面变化
    let wHeight = window.innerHeight;
    $(window).resize(function () {
        let hh = window.innerHeight;
        if (hh < wHeight) {
            $(".new-add-address").hide();
        } else {
            $(".new-add-address").show();
        }

    });
});

// 导航切换
const li_btn = dom.list_btn.find('li');
li_btn.click(function () {
    const left = $(this).offset().left;
    $(".btn-line .btn-active").css("left", left)
    // 发件地址
    let index = $(this).index();
    if (index === 0) {
        index = "";
        Util.LocalStorageSetter("address_search_key", "");
        getAddressData("");
    }
    if (index === 1) {
        Util.LocalStorageSetter("address_search_key", "2");
        getAddressData("2");
    }
    if (index === 2) {
        Util.LocalStorageSetter("address_search_key", "1");
        getAddressData("1");
    }
});

// 进入页面判断哪个
function judgeState() {
    let address_key = Util.LocalStorageGetter("address_key");
    if (address_key === "" || address_key === null || address_key === undefined) {
        getAddressData("");
    }
    // 1为发件,寄件地址
    if (address_key === "1") {
        const left = dom.list_btn.find('li').eq(2).offset().left;
        $(".btn-line .btn-active").css("left", left);
        getAddressData("1");
    }
    // 2为收件,寄件地址
    if (address_key === "2") {
        const left = dom.list_btn.find('li').eq(1).offset().left;
        $(".btn-line .btn-active").css("left", left);
        getAddressData("2");
    }
}

// 管理
let manage_flag = false;
dom.manage_btn.click(function () {
    manage_flag = !manage_flag;
    if (manage_flag === true) {
        dom.manage_btn.css("color", "#E83F57");
        dom.addressContent.find(".adr-edit").show();
    } else {
        dom.manage_btn.css("color", "#121212");
        dom.addressContent.find(".adr-edit").hide();
    }
});


// 新增地址
dom.addNewAddressBtn.click(function () {
    // window.location.href = './add-address.html';
    wx.miniProgram.navigateTo({url: '../add-address/add-address'});
    skip.navigateTo("/html/address/add-address.html")
});

// 获取地址数据
let address_data;

function getAddressData(index) {
    let jsonData = {
        "object":
            {
                "object": {
                    "addUserPhone": Util.CookiesGetter("userName"),
                    "addUserType": "1",
                    "addrType": index
                }

            }
    };
    console.log(jsonData);
    ajax("/xilaisender_s/addressBook/queryBySearchFilter",
        "post",
        jsonData,
        "json",
        function (data) {
            dom.addressContent.empty();
            address_data = data;
            console.log(data);
            if (data.errCode === ERROR) {
                let list_data = data.object.list;
                if (list_data.length > 0) {
                    for (let i in list_data) {
                        let uuid = list_data[i].uuid,
                            name = list_data[i].name,
                            phone = list_data[i].phone,
                            addrType = list_data[i].addrType,
                            proviceCityRegion = list_data[i].proviceCityRegion,
                            proviceCityRegionTxt = list_data[i].proviceCityRegionTxt,
                            done_proviceCityRegionTxt = proviceCityRegionTxt.split("-").join(""),
                            addrDetail = list_data[i].addrDetail,
                            class_type = addrType === '1' ? "sent-address" : "receive-address",
                            // 判断从哪个页面进来
                            url_flag = Util.LocalStorageGetter("url_flag"),
                            manage_flag_style=manage_flag?"":"display: none",
                            click_fuc = url_flag === "../address/my-address.html" ? "getAddress(this)" : "";

                        let html = `<li class="${class_type}">
                        <input type="hidden" class="address-uuid" value="${uuid}">
                        <div class="content-wrap border-1px-bottom" onclick="${click_fuc}" >
                            <div class="adr-wrap">
                                <div class="adr-name">${name}</div>
                                <div class="adr-phone">${phone}</div>
                            </div>
                            <div class="adr-detail">
                               ${done_proviceCityRegionTxt} ${addrDetail} 
                            </div>
                        </div>
                        <div class="adr-edit" style="${manage_flag_style}">
                            <div class="edit-btn" onclick="editAddress(this)">
                                <span class="iconfont icon-bianji"></span>
                                <span>编辑</span>
                            </div>
                            <div class="detail-btn" onclick="deleteAddress('${uuid}')">
                                <span class="iconfont icon-shanchu"></span>
                                <span>删除</span>
                            </div>
                        </div>
                    </li>`;
                        dom.addressContent.append(html)
                    }
                } else {
                    let html_none = `<li id="addressListNone">
                                        <div>
                                            <img src="../../images/add-none.png" alt="">
                                        </div>
                                        <div>
                                            <p>
                                                您还没有添加过哦～
                                            </p>
                                        </div>
                                    </li>`
                    dom.addressContent.append(html_none)
                }

            }
            else {
                layer.open({
                    content: data.errDesc
                    ,skin: 'msg'
                    ,time: 2 //2秒后自动关闭
                });
                setTimeout(function () {
                    loginAgain(data)
                },2000)
            }
        },
        function (data) {
            console.log("错误", data);
        })
}

// 编辑地址
function editAddress(obj) {
    let index = $(obj).parent(".adr-edit").parent("li").index(),
        edit_data = address_data.object.list[index],
        edit_data_string = JSON.stringify(edit_data);
    Util.LocalStorageSetter("edit_data", edit_data_string);
    Util.LocalStorageRemove('sentAddress');
    wx.miniProgram.redirectTo({url: '../edit-myAddress/edit-myAddress'});
    skip.navigateTo("/html/address/edit-myAddress.html")

}

// 地址跳转
function getAddress(obj) {

    let index = $(obj).parent("li").index(),
        address_data_list = address_data.object.list[index],
        address_data_string = JSON.stringify(address_data_list);
    let uuid = $(obj).siblings(".address-uuid").val();
    let address_key = Util.LocalStorageGetter("address_key");
    if (address_key === "1") {
        Util.LocalStorageSetter("sent-address-data", address_data_string);
        // window.location.href = '../sendExpress/sendExpress.html';
        wx.miniProgram.redirectTo({url: '../sendExpress/sendExpress'});
        skip.navigateBack()
    }
    if (address_key === "2") {
        Util.LocalStorageSetter("receive-address-data", address_data_string);
        // window.location.href = '../sendExpress/sendExpress.html';
        wx.miniProgram.redirectTo({url: '../sendExpress/sendExpress'});
        skip.navigateBack()
    }
}

// 删除地址
let deleted_data;

function deleteAddress(id) {
    deleted_data = id;
    layer.open({
        content: '确定要删除吗？'
        , btn: ['确定', '取消']
        , yes: function () {
            let json_data = {"object": deleted_data}


            ajax("/xilaisender_s/addressBook/remove", "post", json_data, "json", function (data) {
                if (data.errCode === ERROR) {
                    layer.open({
                        content: '删除成功'
                        , skin: 'msg'
                        , time: 1
                    });
                    setTimeout(function () {
                        wx.miniProgram.redirectTo({url: '../address/my-address'});
                        skip.reLoad()
                    }, 1500)
                }
            })
        }
    });
}

// 搜索
dom.searchAddress.submit(function () {
    let searchValue = stripScript(dom.searchWords.val()),
        userName = Util.CookiesGetter("userName"),
        addrType = Util.LocalStorageGetter("address_search_key"),
        jsonData = {
            "object": {
                "object": {
                    "name": searchValue,
                    "phone": searchValue,
                    "proviceCityRegionTxt": searchValue,
                    "addrDetail": searchValue,
                    "addrType": addrType,
                    "addUserPhone": Util.CookiesGetter("userName"),
                    "addUserType": "1",
                    "active": "1"
                }
            }
        };
    ajax("/xilaisender_s/addressBook/queryFromApp", "post", jsonData, "json", function (data) {
        console.log(data);
        if (data.errCode === ERROR) {
            dom.addressContent.empty();
            let list_data = data.object.list;
            for (let i in list_data) {
                let uuid = list_data[i].uuid,
                    name = list_data[i].name,
                    phone = list_data[i].phone,
                    addrType = list_data[i].addrType,
                    proviceCityRegion = list_data[i].proviceCityRegion,
                    proviceCityRegionTxt = list_data[i].proviceCityRegionTxt,
                    done_proviceCityRegionTxt = proviceCityRegionTxt.split("-").join(""),
                    addrDetail = list_data[i].addrDetail,
                    class_type = addrType === '1' ? "sent-address" : "receive-address",
                    // 判断从哪个页面进来
                    url_flag = Util.LocalStorageGetter("url_flag"),
                    click_fuc = url_flag === "../address/my-address.html" ? "getAddress(this)" : "";

                let html = `<li class="${class_type}">
                        <input type="hidden" class="address-uuid" value="${uuid}">
                        <div class="content-wrap border-1px-bottom" onclick="${click_fuc}" >
                            <div class="adr-wrap">
                                <div class="adr-name">${name}</div>
                                <div class="adr-phone">${phone}</div>
                            </div>
                            <div class="adr-detail">
                               ${done_proviceCityRegionTxt} ${addrDetail} 
                            </div>
                        </div>
                        <div class="adr-edit" style="display: none">
                            <div class="edit-btn" onclick="editAddress('${uuid}')">
                                <span class="iconfont icon-bianji"></span>
                                <span>编辑</span>
                            </div>
                            <div class="detail-btn" onclick="deleteAddress('${uuid}')">
                                <span class="iconfont icon-shanchu"></span>
                                <span>删除</span>
                            </div>
                        </div>
                    </li>`;
                dom.addressContent.append(html)
            }
        }
        else {
            layer.open({
                content: data.errDesc,
                skin: 'msg',
                time: 2 //2秒后自动关闭
            });
            setTimeout(function () {
                loginAgain(data);
            }, 2000);
        }
    });
    return false
});