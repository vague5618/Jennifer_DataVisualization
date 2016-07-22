/**
 * Created by JAY on 2016. 7. 20..
 */

var form_data = new Object();

var token = "1af00d7e-c633-34c8-8b67-e0dcbc2db964";

form_data = {
    appKey : token,
    version : 1,
    page : 1,
    count : 10
};


$(document).ready(function() {

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


    //Click A tag

    $("#inputPost").click(function()
    {
        $('<input type="hidden" name="formData"/>').val(JSON.stringify(form_data)).appendTo('#formPost');

        $('#formPost').submit();
    });

});