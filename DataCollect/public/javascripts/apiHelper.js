/**
 * Created by JAY on 2016. 7. 11..
 */

var serverIp = "http://"+location.host;

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


function saveDashboard(chartArray) {

    var ret = null;

    $.ajax({
        url: serverIp+"/dashboard/create",
        data :{
            chartArray : JSON.stringify(chartArray)},
        method: 'POST',
        dataType: "json",
        async: false
    }).then(function (data) {
        ret = data;

    });

    return ret;
}