/**
 * Created by JAY on 2016. 7. 26..
 */

function setClass(builder, time, iDiv, chartManage, chartIndex, objSet, howLong) {

    console.log(howLong);


    if (howLong == "5minute")
        chartManage[iDiv.id] = new dateChart(builder, time, "#" + iDiv.id, objSet);

    if (howLong == "24hour")
        chartManage[iDiv.id] = new dayChart(builder, time, "#" + iDiv.id, objSet);

    //close Button Add

        $('#' + iDiv.id).prepend('<div id="divClose" type="button" class="btn-default glyphicon glyphicon-remove pull-right" style=" display: none; width: 10px; height: 10px"></div>');

        document.getElementById("divClose").setAttribute("id", "divClose" + chartIndex);

        var targetDiv = "divClose" + chartIndex;

        $('#' + iDiv.id).children('svg').each(function (index, value) {

            $(value).mouseout(function () {
                $("#" + targetDiv).hide();
            });

            $('#' + iDiv.id).mouseover(function () {
                $("#" + targetDiv).show();
            });
        });

        $("#" + targetDiv).click(function () {
            $('#' + iDiv.id).remove();

            chartManage[iDiv.id].destroy();
        });
}

