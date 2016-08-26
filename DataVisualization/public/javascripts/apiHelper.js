/**
 * Created by JAY on 2016. 7. 11..
 */

var serverIp = "http://"+location.host;


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

function getData(url, formData) {
    var ret = null;

    form_data['url'] = url;

    $.ajax({
        url: serverIp+"/data",
        data: formData,
        method: 'POST',
        dataType: "json",
        async: false
    }).then(function (data) {
        ret = data;
    });

    return ret;
}

function getTitle(formData) {

    var ret = null;

    form_data['type'] = "title";

    $.ajax({
        url: serverIp+"/find",
        data: formData,
        method: 'POST',
        dataType: "json",
        async: false
    }).then(function (data) {
        ret = data;
    });

    return ret;
}


function setRegister(formData) {

    var ret = null;

    $.ajax({
        url: serverIp+"/register",
        data: formData,
        method: 'POST',
        dataType: "json",
        async: false
    }).then(function (data) {
        ret = data;
    });

    return ret;
}


function getKeys(title) {

    var ret = null;

    form_data['title'] = title;
    form_data['type'] = "keys";

    $.ajax({
        url: serverIp+"/find",
        data : form_data,
        method: 'POST',
        dataType: "json",
        async: false
    }).then(function (data) {
        ret = data;
    });

    return ret;
}

function getConnectDB(form_data) {

    var ret = null;

    $.ajax({
        url: serverIp+"/db",
        data : form_data,
        method: 'POST',
        dataType: "json",
        async: false
    }).then(function (data) {
        ret = data;
    });

    return ret;
}


function getField(field) {

    var ret = null;
    form_data['field'] = field;
    form_data['type'] = "distinct";

    $.ajax({
        url: serverIp+"/find",
        data : form_data,
        method: 'POST',
        dataType: "json",
        async: false
    }).then(function (data) {
        ret = data;
    });

    return ret;
}


function saveDashboard(chartArray, chartLayout, chartHash, dashboardName) {

    var ret = null;

    $.ajax({
        url: serverIp+"/dashboard/create",
        data :{
            chartArray : JSON.stringify(chartArray),
            chartLayout : chartLayout,
            chartHash : chartHash,
            dashboardName : dashboardName
        },
        method: 'POST',
        dataType: "json",
        async: false
    }).then(function (data) {
        ret = data;

    });

    return ret;
}


function modifyDashboard(formData, callback) {

    var ret = null;

    $.ajax({
        url: serverIp+"/",
        data :formData,
        method: 'POST',
        dataType: "json",
        async: false
    }).then(function (data) {
        ret = data;
        callback(data);
    });

    //return ret;
}

function getDashboardName(formData, callback)
{
    $.ajax({
        url: serverIp+"/find",
        data :formData,
        method: 'POST',
        dataType: "json",
        async: false
    }).then(function (data) {
        callback(data);
    });
}


