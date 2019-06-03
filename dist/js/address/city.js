'use strict';

var dom = {
    content: $('.content'),
    entrance: $('.entrance'),
    city: $('.city'),
    searchCity: $('#searchCity'),
    searchContent: $('#searchContent')
};
// 获取数据，数组排序
$(document).ready(function () {
    var data = cityList();
    var hot = ['上海市', '重庆市', '天津市', '北京市', '深圳市', '广州市'];
    var hotdata = [];
    for (var i in hot) {
        for (var j in data) {
            for (var k in data[j].cityInfo) {
                if (hot[i] == data[j].cityInfo[k].city) {
                    hotdata.push(data[j].cityInfo[k]);
                }
            }
        }
    }
    var obj = [{
        initial: '\u2605',
        cityInfo: []
    }];
    for (var _i in hotdata) {
        obj[0].cityInfo.push(hotdata[_i]);
    }
    obj = obj.concat(data);

    dataShow(obj);
    entrance(obj);
    onShortcutTouchStart();
});

// 城市数据展示
function dataShow(data) {
    var title = '';
    var name = '';
    for (var i in data) {
        for (var j in data[i].cityInfo) {

            var dataP = {
                name: data[i].cityInfo[j].city,
                code: data[i].cityInfo[j].code
            };
            var jsondata = JSON.stringify(dataP);

            name += '<div class="text" onclick=\'selectCity(' + jsondata + ')\'>' + data[i].cityInfo[j].city + '</div>';
        }
        title += '<li>\n                <div class="title">\n                <span class="' + (i == 0 ? 'blue' : '') + '">' + data[i].initial + '</span>\n                   ' + (i == 0 ? '热门城市' : '') + '\n                </div>\n               ' + name + '\n               <div class="mar"></div>\n            </li>';
        name = '';
    }
    dom.content.find('ul').append(title);
}

// 快速入口展示
function entrance(data) {
    var entrance = '';
    data.map(function (group) {
        entrance += '<li>' + group.initial + '</li>';
    });
    dom.entrance.find('ul').append(entrance);
}

// 选择城市
function selectCity(data) {
    var jsondata = JSON.stringify(data);
    Util.LocalStorageSetter('selectCity', jsondata);
    skip.navigateBack();
}

// 右侧快速入口
function onShortcutTouchStart() {
    $('.entrance ul').on('click', 'li', function () {
        var index = $(this).index();
        //获取所有高度
        var a = new Array();
        var sign = $(".content li");
        var height1 = 0;
        a.push(height1);
        sign.each(function () {
            var height = $(this).outerHeight();
            height1 += height;
            a.push(height1);
        });
        //滚动到指定高度
        dom.city.scroll(0, 1000);
        $("body,html").animate({
            scrollTop: a[index]
        }, 300);
    });
}

var searchTimeout = void 0,
    searchDelay = 300;

dom.searchCity.bind('input propertychange', function () {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(function () {
        var data = dom.searchCity.val(),
            json_data = {
            "object": data
        };
        if (data == '') {
            dom.content.show();
            dom.entrance.show();
            dom.searchContent.hide();
            dom.city.css({ "width": "100%", "position": "" });
        } else {
            ajax("/xilaisender_s/addressBook/getCityNames", "post", json_data, "json", function (data) {
                var html = '';
                if (data.errCode === ERROR) {
                    dom.searchContent.find('ul').empty();
                    dom.searchContent.show();
                    dom.content.hide();
                    dom.city.css({ "width": "100%", "position": "fixed" });
                    dom.entrance.hide();
                    for (var i in data.object.list) {
                        var dataP = {
                            name: data.object.list[i].city,
                            code: data.object.list[i].code
                        };
                        var jsondata = JSON.stringify(dataP);
                        html += '<li><div class="text" onclick=\'selectCity(' + jsondata + ')\'>' + data.object.list[i].city + '</div></li>';
                    }
                    dom.searchContent.find('ul').append(html);
                    $("html,body").scrollTop(0);
                } else {
                    layer.open({
                        content: data.errDesc,
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    setTimeout(function () {
                        loginAgain(data);
                    }, 2000);
                }
            }, function () {
                Dom.loadingWrap.hide();
                layer.open({
                    content: '请检查您的网络',
                    skin: 'msg',
                    time: 1
                });
            });
        }
    }, searchDelay);
});