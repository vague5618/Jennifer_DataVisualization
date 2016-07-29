/**
 * Created by JAY on 2016. 7. 20..
 */

var form_data = new Object();

var token = "1af00d7e-c633-34c8-8b67-e0dcbc2db964";

form_data = {
    title : "Sample",
    interval: 300,
    timeCheck: true,
    appKey: token,
    version: 1,
    page: 1,
    count: 10
};


$(document).ready(function () {

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

        form_data = new Object();

        var title = $("#inputTitle").val();
        var interVal = $("#inputInterval").val();
        var timeCheck = $("#inputTimeCheck").is(":checked");

        form_data['title'] = title;
        form_data['interval'] = interVal;
        form_data['timeCheck'] = timeCheck;

        $("#tbodyTable").children('tr').each(function () {

            var _key, _value = null;

            $(this).children('td').each(function (index, value) {
                if (index == 0)
                    _key = $(value).text();
                else
                    _value = $(value).text();
            });

            form_data[_key] = _value;
        });
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

    $("#inputPost").click(function () {

        $('<input type="hidden" name="formData"/>').val(JSON.stringify(form_data)).appendTo('#formPost');

        $('#formPost').submit();
    });


    //Setting Chart

    $("#aChart").click(function () {
        $('#modalChart .modal-body').html($('#groupJSON').clone());
    });


    //Struct JSON

    $("#btnREST").click(function () {

        document.getElementById('jsonChart').innerHTML = "";

        var url = $('#inputUrl').val();

        var data = getData(url, form_data);

        var ppTable = prettyPrint(data);

        document.getElementById('jsonChart').appendChild(ppTable);
    });
});