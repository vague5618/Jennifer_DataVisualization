/**
 * Created by JAY on 2016. 7. 20..
 */

var form_data = new Object();
var chartIndex = 0;
var token = "ba78f5af5afdf5eabfa4ec02609cbae0";
var chartManage = [];
var chartLayout = 0;


jui.ready(["chart.builder", "util.base", "util.time"], function (builder, _, time) {

    function setDialog(){
        $( "#divDialog" ).dialog({
            modal:true,
            autoOpen: false,
            width: 600,
            height: 'auto',
            show: {
                effect: "blind",
                duration: 1000
            }
        }).prev(".ui-dialog-titlebar").css("background","#00bbbb");
    }

    function setToolTip() {
        $('[data-toggle="tooltip"]').tooltip();
    }

    function setColorpicker() {
        $.each($('div[name=divColorpicker]'), function (index, value) {
            $(value).colorpicker();
        });
    }

    function setDroppable() {
        $('.panel-body').droppable({
            drop: function (event, ui) {

                var id = $(ui.draggable).attr("id");

                $('#' + id).css({
                    height: '100%',
                    width: '100%',
                    top: 0,
                    left: 0
                });

                $("#" + id).prependTo($(this));
            }
        });
    }

    //setting

    setDialog();

    setColorpicker();

    setToolTip();

    $('.dropdown-toggle').dropdown();


    //Setting Chart

    $("#aChart").click(function () {

        $('#selectTitle').empty();

        $('#inputKey').val("");

        var trRow = $('#trRow').clone(false, true);

        trRow.show();

        $('#tbodyChartSet').empty();

        $('#tbodyChartSet').append(trRow);

        setColorpicker();

        var titleList = getTitle(form_data);

        $.each(titleList, function (key, value) {
            $('#selectTitle').append($("<option></option>")
                .attr("value", value)
                .text(value));
        });

        $('#selectTitle').change();
    });


    // Draw chart

    $("#btnSaveChart").click(function () {

        var colorList = [];
        var keyList = [];
        var valueList = [];
        var timeColumn = $('#selectTime').val();
        var brushType = $('#selectChartType').val();
        var targetTitle = $("#selectTitle").val();
        var howLong = $("#selectChartTime").val();
        var type = $("#ulChartTab .active").text();
        var distinct = $("#selectDistinct").val();
        var setMean = $("#inputSetMean").val();
        var chartTitle = $("#inputChartTitle").val();

        $.each($('input[name=inputColor]'), function (index, value) {
            if ($(value).val() == "")
                return
            else
                colorList.push($(value).val());
        });


        if (type == "SnapShot") {

            $.each($('input[name=inputKey]'), function (index, value) {
                if ($(value).val() == "")
                    return
                else
                    keyList.push($(value).val());
            });
        }

        if (type == "Data") {
            $.each($('select[name=selectKey]'), function (index, value) {
                if ($(value).val() == "")
                    return
                else
                    keyList.push($(value).val());
            });
        }

        $.each($('select[name=selectValue]'), function (index, value) {
            if ($(value).val() == "")
                return
            else
                valueList.push($(value).val());
        });

        var iDiv = document.createElement('div');
        iDiv.id = 'chartSection' + chartIndex;
        $("#divChart").prepend(iDiv);
        $('#' + iDiv.id).css('width', 500);
        $('#' + iDiv.id).css('height', 300);
        $('#' + iDiv.id).attr('name', 'divSection');

        var objSet = new Object();

        objSet["targetTitle"] = targetTitle;
        objSet["chartTitle"] = chartTitle;
        objSet["chartKey"] = keyList;
        objSet["chartValue"] = valueList;
        objSet["chartTime"] = timeColumn;
        objSet["chartType"] = brushType;
        objSet["chartColors"] = colorList;
        objSet["chartDistinct"] = distinct;
        objSet["chartSetMean"] = setMean;
        //iDiv, time, chartManage, chartIndex, objSet, howLong

        setClass(builder, time, iDiv, chartManage, chartIndex, objSet, howLong, type);

        $("#" + iDiv.id).css("position", "absolute");
        $("#" + iDiv.id).css("top", "30");
        $("#" + iDiv.id).css("left", "60");

        $("#" + iDiv.id).css("z-index", "2");

        chartIndex++;

    });


    // change Select

    $('#selectTitle').change(function () {
        var obj = getKeys($('#selectTitle').val());

        var trRow = $('#trRow').clone(false, true).show();

        $('#tbodyChartSet').empty();

        $('#tbodyChartSet').append(trRow);

        setColorpicker();

        $('#selectDistinct').empty();
        $('#selectValue').empty();
        $('#selectTime').empty();

        for (var key in obj) {
            if (obj.hasOwnProperty(key) && key != "_id" && key != "ttl" && key != '__v' && key != 'title') {

                if (typeof(obj[key]) == "object") {

                    if (obj[key].length == 1) {
                        var option = document.createElement("option");
                        option.text = key;
                        option.value = key;
                        $('#selectValue').append(option);
                        $('#selectTime').append(option.cloneNode(true));
                        $('#selectDistinct').append(option.cloneNode(true));
                    }
                    else {
                        for (var i = 0; i < obj[key].length; i++) {
                            var option = document.createElement("option");
                            option.text = key + "[" + i + "]";
                            option.value = key + "[" + i + "]";
                            $('#selectValue').append(option);
                            $('#selectTime').append(option.cloneNode(true));
                            $('#selectDistinct').append(option.cloneNode(true));
                        }
                    }
                }
                else {
                    var option = document.createElement("option");
                    option.text = key;
                    option.value = key;
                    $('#selectValue').append(option);
                    $('#selectTime').append(option.cloneNode(true));
                    $('#selectDistinct').append(option.cloneNode(true));
                }
            }
        }


        $('#selectTime').val("time").attr('selected', 'selected');
    });

    //chart Column Add

    $('#btnChartAdd').click(function () {
        $('#tbodyChartSet').append($('#trRow').clone().show());

        setColorpicker();
    });


    //chart Column Minus

    $('#btnChartMinus').click(function () {
        if ($("#tbodyChartSet > tr").length != 1)
            $("#tbodyChartSet > tr:last").remove();

        setColorpicker();
    });

    //tabSnapShot Click

    $('#tabSnapShot').click(function () {
        var trRow = $('#trRow').clone(false, true).show();
        $('#tbodyChartSet').empty();
        $('#tbodyChartSet').append(trRow);
        setColorpicker();
        $('#selectDistinct').hide();
        $('#selectChartTime').show();
        $('#thChange').html('How long');
        $('#inputKey').show();
        $('#selectKey').hide();
        $('#selectChartTime').val("5minute").attr("selected", "selected");
    });

    //tabDataClick

    $('#tabData').click(function () {
        var trRow = $('#trRow').clone(false, true).show();
        $('#inputSetMean').hide();
        $('#tbodyChartSet').empty();
        $('#tbodyChartSet').append(trRow);
        setColorpicker();
        $('#selectChartTime').hide();
        $('#selectDistinct').show();
        $('#thChange').html('Distinct');
        $('#inputKey').hide();
        $('#selectKey').show();
    });


    $('#selectDistinct').change(function () {
        var obj = getField($('#selectDistinct').val());
        $('#selectKey').empty();
        for (var i = 0; i < obj.length; i++) {

            var option = document.createElement("option");
            option.text = obj[i];
            option.value = obj[i];
            $('#selectKey').append(option.cloneNode(true));
        }
    });

    //btnClick Save
    $("#aSave").click(function () {

        BootstrapDialog.show({
            title: 'Dashboard Name',
            message: $('<input id="inputDashboardName" class="form-control" placeholder="Write this"> </input>'),
            buttons: [{
                label: 'Save',
                cssClass: 'btn-primary',
                hotkey: 13, // Enter.
                action: function () {

                    var dashboardName = $('#inputDashboardName').val();

                    var array = [];

                    for (var key in chartManage) {
                        if (chartManage.hasOwnProperty(key)) {

                            var objSet = chartManage[key].getInfo();

                            objSet['left'] = $('#' + key).offset().left;
                            objSet['top'] = $('#' + key).offset().top;
                            objSet['width'] = $('#' + key).width();
                            objSet['height'] = $('#' + key).height();

                            array.push(objSet);
                        }
                    }

                    location.href = saveDashboard(array, chartLayout, location.pathname.split('&')[2], dashboardName);
                }
            }]
        });


    });

    $('#liLayout1').click(function () {

        chartLayout = 1;

        var promise = new Promise(
            function (resolve, reject) {

                $('div[name=divSection]').each(function (index, value) {
                    $('#divChart').prepend(value);
                    $(value).css('width', 500);
                    $(value).css('height', 300);
                });

                resolve(null);
            }
        );

        promise.then(
            function (val){
            $('#divLayout').load('./layout/easyLayout1.html', function () {

                if ($('.panel-body').length < $('div[name=divSection]').length) {
                    alert("배치가능한 수를 초과하였습니다.");
                    $('#divLayout').empty();
                    return;
                }

                var divSections = $('div[name=divSection]');

                $('.panel-body').each(function (index, value) {

                    if (index < $('div[name=divSection]').length) {

                        console.info(index);

                        console.log(divSections);

                        $(divSections[index]).css({
                            height: '100%',
                            width: '100%',
                            top: 0,
                            left: 0
                        });

                        $(divSections[index]).prependTo($($('.panel-body')[index]));

                        chartManage[divSections[index].id].render();
                    }
                });
                setDroppable();

            });
        });
    });

    $('#liLayout2').click(function () {

        chartLayout = 2;

        var promise = new Promise(
            function (resolve, reject) {

                $('div[name=divSection]').each(function (index, value) {
                    $('#divChart').prepend(value);
                    $(value).css('width', 500);
                    $(value).css('height', 300);
                });

                resolve(null);
            }
        );

        promise.then(
            function (val){
                $('#divLayout').load('./layout/easyLayout2.html', function () {

                    if ($('.panel-body').length < $('div[name=divSection]').length) {
                        alert("배치가능한 수를 초과하였습니다.");
                        $('#divLayout').empty();
                        return;
                    }

                    var divSections = $('div[name=divSection]');

                    $('.panel-body').each(function (index, value) {

                        if (index < $('div[name=divSection]').length) {

                            $(divSections[index]).css({
                                height: '100%',
                                width: '100%',
                                top: 0,
                                left: 0
                            });

                            $(divSections[index]).prependTo($($('.panel-body')[index]));

                            chartManage[divSections[index].id].render();
                        }
                    });
                    setDroppable();

                });
            });
    });

    $('#liLayout3').click(function () {

        chartLayout = 3;

        var promise = new Promise(
            function (resolve, reject) {

                $('div[name=divSection]').each(function (index, value) {

                    var position = $(value).offset();

                    $('#divChart').prepend(value);

                    $(value).css('left',position.left);
                    $(value).css('top',position.top);
                    $(value).css('width', 400);
                    $(value).css('height', 300);

                    chartManage[value.id].render();
                });

                resolve(null);
            }
        );

        promise.then(
            function (val) {

                $('#divLayout').empty();

                setDroppable();

            });
    });

    $('#selectChartTime').change(function () {
        var obj = $('#selectChartTime').val();

        if (obj == "24hour") {

            $('#selectChartTime').css('float', 'left');
            $('#selectChartTime').css('width', '50%');
            $('#inputSetMean').show();
        }
        else {
            $('#selectChartTime').css('float', '');
            $('#selectChartTime').css('width', '100%');
            $('#inputSetMean').hide();
        }
    });


    if (location.pathname.split('&').length > 2) {
        var obj = new Object();
        obj['hash'] = location.pathname.split('&')[2];

        var promise = new Promise(
            function (resolve, reject) {

                modifyDashboard(obj, function (result) {
                    resolve(result);
                });
            }
        );

        promise.then(
            function (val) {

                var chartInfo = val['value']['chartInfo'];
                chartLayout = val['value']['chartLayout'];

                drawLayout(chartLayout, function () {
                    for (var i = 0; i < chartInfo.length; i++) {
                        var iDiv = document.createElement('div');
                        iDiv.id = 'chartSection' + chartIndex;

                        $("#divChart").append(iDiv);

                        $("#" + iDiv.id).css("left", chartInfo[i].left);
                        $("#" + iDiv.id).css("top", chartInfo[i].top);
                        $("#" + iDiv.id).width(chartInfo[i].width);
                        $("#" + iDiv.id).height(chartInfo[i].height);
                        $('#' + iDiv.id).attr('name', 'divSection');

                        setChart(builder, time, iDiv, chartInfo[i], true, chartManage, chartIndex);

                        $("#" + iDiv.id).css("position", "absolute");

                        chartIndex++;
                    }
                });
            });

        function drawLayout(target, callback) {
            var html = null;

            switch (target) {
                case "0":
                    callback(null);
                    break;
                case "1":
                    html = './layout/easyLayout1.html';
                    break;
                case "2":
                    html = './layout/easyLayout2.html';
                    break;
                default :
                    callback(null);
                    break;
            }

            $('#divLayout').load(html, function () {
                setDroppable();
                callback(null);
            });
        }
    }


    $('#aLoad').click(function () {

        var obj = new Object();
        obj['type'] = 'dashboardName';

        $('#tbodyDashboardName').empty();

        getDashboardName(obj, function (data) {
            for (var i = 0; i < data.length; i++) {
                var row = "<tr> <td class='text-left'>" +
                    "<a href=/dashboard/" + data[i]._id + " data-toggle='tooltip' data-placement='auto' title='" + new Date(data[i].time) + "'><h5>"
                    + data[i].name + "</h5></a></td>" + "<td class='text-left'><h5>" +
                    data[i]._id + "</h5></td></tr>";

                $('#tbodyDashboardName').append(row);
            }

            setToolTip();
        });
    });

});




