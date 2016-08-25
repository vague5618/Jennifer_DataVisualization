/**
 * Created by JAY on 2016. 7. 20..
 */

var form_data = new Object();
var currentPage = "DB";

$(document).ready(function () {

    $('.dropdown-toggle').dropdown();

    $('#aURL').click(function () {

        currentPage="URL";

        $('#divDB').hide();

        $('#divURL').show();
    });

    $('#aDB').click(function () {

        currentPage="DB";

        $('#divURL').hide();

        $('#divDB').show();
    });


    //Minus header
    $("#btnMinus").click(function () {
        $("#tbodyTable > tr:last").remove();
    });


    //Save header

    $("#btnSave").click(function () {

        if ($('#ulTabs .active').text() == "URL")
            setURL();
        else
            setDB();

    });

    //Add JSONPath

    $("#btnJSON").click(function () {

        if ($("#groupJSON input:last-child").val() == "$..path") {
            // skip AddInput
        }

        else {
            var row = '<input type="text" class="form-control" name="inputJSONPath" value="$..path" style="margin-top: 5px">';

            $("#groupJSON").append(row);
        }
    });
    //Struct JSON

    $("#btnREST").click(function () {

        document.getElementById('jsonChart').innerHTML = "";

        var url = $('#inputUrl').val();

        var data = getData(url, form_data);

        var ppTable = prettyPrint(data);

        document.getElementById('jsonChart').appendChild(ppTable);
    });

    // set Collect

    $("#btnCollect").click(function () {

        if(currentPage=='DB')
        {
            setDB();
        }

        if(currentPage=='URL')
        {
            setURL();
        }

        $('#dbTblfoot').empty();
        $('#tbodyTable').empty();
    });


    function setURL() {
        form_data = new Object();

        var checkDup = false;
        var title = $("#inputTitle").val();
        var interVal = $("#inputInterval").val();
        var url = $('#inputUrl').val();
        var timeCheck = $("#inputTimeCheck").is(":checked");
        var collectTarget = new Object();

        var list = getTitle(form_data);

        for(var i=0; i<list.length; i++)
        {
            if(title==list[i])
            {
                alert("title이 중복됩니다.");
                return;
            }
        }

        $("#tbodyTable").children('tr').each(function () {

            var _key, _value = null;

            $(this).children('td').each(function (index, value) {

                if (index == 0)
                    _key = $(value).children('input').val()
                else
                    _value = $(value).children('input').val();
            });

            if (collectTarget[_key] != null) {

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

        if (checkDup == false) {
            if(setRegister(form_data)!=null)
                alert("register Success");
        }
    }

    $('#btnConnectDB').click(function () {

        var obj = new Object();

        obj['url'] = $('#inputDB').val();
        obj['user'] = $('#inputUser').val();
        obj['password'] = $('#inputPassword').val();
        obj['port'] = $('#inputPort').val();
        obj['database'] = $('#inputDatabase').val();
        obj['table'] = $('#inputTable').val();

        var fields = getConnectDB(obj);

        if (fields == null) {
            alert("DB Connection Fail");
        }
        else {
            var row = "<tr id='trDBrow'><th colspan='2'>" +
                "<input id='inputDBKey' name='inputDBKey' class='form-control'/></th>" +
                "<th colspan='2'><select id='selectDBValue' name='selectDBValue' class='form-control'></select></th></tr>";

            $('#dbTblfoot').append(row);

            for (var i = 0; i < fields.length; i++) {
                $('#selectDBValue').append($("<option></option>")
                    .attr("value", fields[i])
                    .text(fields[i]));
            }
        }
    });


    $('#btnDBplus').click(function () {
        $('#dbTblfoot').append($('#trDBrow').clone());
    });


    $('#btnDBminus').click(function () {
        $('#dbTblfoot > tr:last').remove();
    });

    //DB Collect Register

    function setDB() {
        var form_data = new Object();

        var url = $('#inputDB').val();
        var title = $('#inputDBTitle').val();
        var interVal = $("#inputDBInterval").val();
        var timeCheck = $("#inputDBTimeCheck").is(":checked");
        var table = $('#inputTable').val();
        var timeType = $('#selectTimeType').val();

        form_data['type'] = "title";

        var list = getTitle(form_data);

        for(var i=0; i<list.length; i++)
        {
            if(title==list[i])
            {
                alert("title이 중복됩니다.");
                return;
            }
        }

        var collectTarget = new Object();

        var keyList = [];
        var valueList = [];

        $.each($('input[name=inputDBKey]'), function (index, value) {
            keyList.push($(value).val());
        });


        $.each($('select[name=selectDBValue]'), function (index, value) {
            valueList.push($(value).val());
        });

        collectTarget['keyList'] = keyList;
        collectTarget['valueList'] = valueList;

        form_data['url'] = url;
        form_data['title'] = title;
        form_data['interval'] = interVal;
        form_data['timeCheck'] = timeCheck;
        form_data['collectTarget'] = JSON.stringify(collectTarget);
        form_data['table'] = table;
        form_data['type'] = 'DB';
        form_data['timeType'] = timeType;

        if(setRegister(form_data)!=null)
            alert("register Success");
    }
});




