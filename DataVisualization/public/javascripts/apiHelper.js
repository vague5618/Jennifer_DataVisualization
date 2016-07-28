/**
 * Created by JAY on 2016. 7. 11..
 */

function getCommentApi() {
    var root = 'http://jsonplaceholder.typicode.com';
    var ret = null;

    $.ajax({
        url: root + '/comments',
        method: 'GET',
        async: false
    }).then(function (data) {
        ret = data;
    });

    return ret;
}


function getMelonInfo() {
    var token = "1af00d7e-c633-34c8-8b67-e0dcbc2db964";

    var form_data = {
        appKey: token,
        version: 1,
        page: 1,
        count: 10
    };

    $.ajax({
        type: 'GET',
        data: form_data,
        contentType: "json",
        url: "http://apis.skplanetx.com/melon/charts/realtime",
        success: function (data) {
            console.log(data);
        }
    });
}

function getData(url, form_data) {
    var ret = null;

    form_data['url'] = url;

    $.ajax({
        url: "http://localhost:3000/data",
        data: form_data,
        method: 'POST',
        dataType: "json",
        async: false
    }).then(function (data) {
        ret = data;
    });

    return ret;
}


