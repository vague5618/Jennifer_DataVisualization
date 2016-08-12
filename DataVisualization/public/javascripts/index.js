/**
 * Created by JAY on 2016. 7. 20..
 */

var form_data = new Object();
var chartIndex = 0;
//var token = "1af00d7e-c633-34c8-8b67-e0dcbc2db964";
var token = "ba78f5af5afdf5eabfa4ec02609cbae0";
var chartManage = [];

form_data = {
    title : "Jennifer",
    interval: 1000,
    timeCheck: false,
    apiKey: token,
    version: 1,
    lat :  37.5714000000,
    lon : 126.9658000000,
    q : "Seoul"
};


jui.ready(["chart.builder", "util.base", "util.time"], function (builder, _, time) {

    //setting colorpicker

    setColorpicker();

    function setColorpicker()
    {
        $.each($('div[name=divColorpicker]'),function(index, value)
        {
            $(value).colorpicker();
        });
    }

    //Add header

    $("#btnAdd").click(function () {
        if ($("#inputKey").val() != "" && $("inputValue").val() != "") {
            var row = '<tr><td>' + $("#inputKey").val() + '</td><td>' + $("#inputValue").val() + '</td></tr>';

            $("#tbodyTable").prepend(row);

            $("#inputKey").val("");
            $("#inputValue").val("");
        }

        else {
            alert("입력 값에 공백이 들어갈 수 없습니다.");
        }
    });

    //Minus header

    $("#btnMinus").click(function () {
        $("#tbodyTable > tr:first").remove();
    });


    //Save header

    $("#btnSave").click(function () {

       if($('#ulTabs .active').text()=="URL")
           setURL();
       else
           setDB();

    });

    //Add JSONPath

    $("#btnJSON").click(function () {

        if ($("#groupJSON input:last-child").val()=="$..path")
        {
            // skip AddInput
        }

        else
        {
            var row = '<input type="text" class="form-control" name="inputJSONPath" value="$..path" style="margin-top: 5px">';

            $("#groupJSON").append(row);
        }
    });

    //Submit Draw

    //$("#inputPost").click(function () {
    //
    //    $('<input type="hidden" name="formData"/>').val(JSON.stringify(form_data)).appendTo('#formPost');
    //
    //    $('#formPost').submit();
    //});


    //Setting Chart

    $("#aChart").click(function () {

        $('#selectTitle').empty();

        $('#inputKey').val("");

        var trRow = $('#trRow').clone(false ,true);

        $('#tbodyChartSet').empty();

        $('#tbodyChartSet').append(trRow);

        setColorpicker();

        var titleList = getTitle(form_data);

        $.each(titleList, function(key, value) {
            $('#selectTitle').append($("<option></option>")
                    .attr("value",value)
                    .text(value));
        });

        $('#selectTitle').change();
    });


    //Struct JSON

    $("#btnREST").click(function () {

        document.getElementById('jsonChart').innerHTML = "";

        var url = $('#inputUrl').val();

        var data = getData(url, form_data);

        var ppTable = prettyPrint(data);

        document.getElementById('jsonChart').appendChild(ppTable);
    });


    // Draw chart

    $("#btnSaveChart").click(function(){

        var colorList = [];
        var keyList = [];
        var valueList = [];
        var timeColumn = $('#selectTime').val();
        var brushType = $('#selectChartType').val();
        var title = $("#selectTitle").val();
        var howLong = $("#selectChartTime").val();

        $.each($('input[name=inputColor]'),function(index, value)
        {
            colorList.push($(value).val());
        });

        $.each($('input[name=inputKey]'),function(index, value)
        {
            keyList.push($(value).val());
        });


        $.each($('select[name=selectValue]'),function(index, value)
        {
            valueList.push($(value).val());
        });

        var iDiv = document.createElement('div');

        iDiv.id = 'chartSection' + chartIndex;

        $("#divChart").append(iDiv);

        var objSet = new Object();

        objSet["chartTitle"] = title;
        objSet["chartKey"] = keyList;
        objSet["chartValue"] = valueList;
        objSet["chartTime"] = timeColumn;
        objSet["chartType"] = brushType;
        objSet["chartColors"] = colorList;


        //iDiv, time, chartManage, chartIndex, objSet, howLong

        setClass(builder, time, iDiv,chartManage, chartIndex, objSet, howLong);

        chartIndex++;
    });


    // set Register

    $("#btnRegister").click(function(){

        document.getElementById('tblFoot').innerHTML = "";

        $('#dbTblfoot').empty();

        $.each($("#groupJSON input"), function(index, value) {

            if(value.value=="$..path")
                return;

            var row =
            "<tr><td><input type='text' placeholder='Key' class='form-control'onClick='this.setSelectionRange(0, this.value.length)'/>"+
            "<td><input type='text' placeholder='Key' class='form-control' onClick='this.setSelectionRange(0, this.value.length)'"
                +" value = " + value.value+ " /></td></tr>";

            $("#tblFoot").append(row);
        });

    });


    // change Select

    $('#selectTitle').change(function()
    {
        var obj = getKeys($('#selectTitle').val());

        var trRow = $('#trRow').clone(false ,true);

        $('#tbodyChartSet').empty();

        $('#tbodyChartSet').append(trRow);

        setColorpicker();

        $('#selectValue').empty();
        $('#selectTime').empty();

        for (var key in obj) {
            if (obj.hasOwnProperty(key) && key!="_id" && key!="ttl" && key!='__v' && key!='title') {

                if(typeof(obj[key])=="object") {

                    if(obj[key].length==1) {
                        var option = document.createElement("option");
                        option.text = key;
                        option.value = key;

                        $('#selectValue').append(option);
                        $('#selectTime').append(option.cloneNode(true));
                    }
                    else
                    {
                        for(var i=0; i<obj[key].length; i++) {
                            var option = document.createElement("option");
                            option.text = key+"["+i+"]";
                            option.value = key+"["+i+"]";
                            $('#selectValue').append(option);
                            $('#selectTime').append(option.cloneNode(true));
                        }
                    }
                }
                else
                {
                    var option = document.createElement("option");
                    option.text = key;
                    option.value = key;
                    $('#selectValue').append(option);
                    $('#selectTime').append(option.cloneNode(true));
                }
            }
        }
    });

     //chart Column Add

    $('#btnChartAdd').click(function()
    {
        $('#tbodyChartSet').append($('#trRow').clone());

        setColorpicker();
    });


    //chart Column Minus

    $('#btnChartMinus').click(function()
    {
        if($("#tbodyChartSet > tr").length!=1)
            $("#tbodyChartSet > tr:last").remove();

        setColorpicker();
    });


    function setURL()
    {
        form_data = new Object();

        var checkDup = false;
        var title = $("#inputTitle").val();
        var interVal = $("#inputInterval").val();
        var url = $('#inputUrl').val();
        var timeCheck = $("#inputTimeCheck").is(":checked");
        var collectTarget = new Object();

        $("#tblFoot").children('tr').each(function () {

            var _key, _value = null;

            $(this).children('td').each(function (index, value) {

                if (index == 0)
                    _key = $(value).children('input').val()
                else
                    _value = $(value).children('input').val();
            });

            if(collectTarget[_key]!=null) {

                alert("key중복 다시 설정해주세요");
                checkDup = true;
            }
            else {
                collectTarget[_key] = _value;
            }
        });

        form_data['url'] = url;
        form_data['title'] = title;
        form_data['interval'] = interVal;
        form_data['timeCheck'] = timeCheck;
        form_data['collectTarget'] = JSON.stringify(collectTarget);
        form_data['type'] = 'URL';

        if(checkDup == false) {
            setRegister(form_data);
        }
    }

    $('#btnConnectDB').click(function(){

        var obj = new Object();

        obj['url'] = $('#inputUrl').val();
        obj['user'] = $('#inputUser').val();
        obj['password'] = $('#inputPassword').val();
        obj['port'] = $('#inputPort').val();
        obj['database'] = $('#inputDatabase').val();
        obj['table'] = $('#inputTable').val();

        var fields = getConnectDB(obj);

        var row = "<tr id='trDBrow'><th colspan='2'>" +
            "<input id='inputDBKey' name='inputDBKey' class='form-control'/></th>"+
            "<th colspan='2'><select id='selectDBValue' name='selectDBValue' class='form-control'></select></th></tr>";


        $('#dbTblfoot').append(row);

        for(var i=0; i<fields.length; i++) {
            $('#selectDBValue').append($("<option></option>")
                .attr("value", fields[i])
                .text(fields[i]));
        }
    });


    $('#btnDBplus').click(function()
    {
        $('#dbTblfoot').append($('#trDBrow').clone());
    });


    $('#btnDBminus').click(function()
    {
        $('#dbTblfoot > tr:last').remove();
    });

    function setDB()
    {
        var form_data = new Object();

        var url = $('#inputUrl').val();
        var title = $('#inputDBTitle').val();
        var interVal = $("#inputDBInterval").val();
        var timeCheck = $("#inputDBTimeCheck").is(":checked");
        var table = $('#inputTable').val();

        var collectTarget = new Object();

        var keyList = [];
        var valueList = [];

        $.each($('input[name=inputDBKey]'),function(index, value)
        {
            keyList.push($(value).val());
        });


        $.each($('select[name=selectDBValue]'),function(index, value)
        {
            valueList.push($(value).val());
        });

        collectTarget['keyList'] = keyList;
        collectTarget['valueList'] = valueList;

        form_data['url'] = url;
        form_data['title'] = title;
        form_data['interval'] = interVal;
        form_data['timeCheck'] = timeCheck
        form_data['collectTarget'] = JSON.stringify(collectTarget);
        form_data['table'] = table;
        form_data['type'] = 'DB';

        setRegister(form_data);
    }
});

