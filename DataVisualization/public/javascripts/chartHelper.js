/**
 * Created by JAY on 2016. 7. 26..
 */

function setClass(builder, time, iDiv, chartManage, chartIndex, objSet, howLong, type) {

    if (type == "SnapShot") {

        if(objSet['chartType']=="equalizerBar")
            chartManage[iDiv.id] = new snapEqualChart(builder, time, "#" + iDiv.id, objSet,true);

        else if (howLong == "5minute")
            chartManage[iDiv.id] = new dateChart(builder, time, "#" + iDiv.id, objSet, true);

        else if (howLong == "24hour")
            chartManage[iDiv.id] = new dayChart(builder, time, "#" + iDiv.id, objSet, true);
    }

    else if (type == "Data") {
        chartManage[iDiv.id] = new dataChart(builder, time, "#" + iDiv.id, objSet, true);
    }

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


function setChart(builder, time, iDiv, objSet) {

    console.log(objSet['type']);

    switch(objSet['type'])
    {
        case 'dateChart':
            new dateChart(builder, time, "#" + iDiv.id, objSet, false);
            break;
        case 'dayChart':
            new dayChart(builder, time, "#" + iDiv.id, objSet, false);
            break;
        case 'dataChart':
            new dataChart(builder, time, "#" + iDiv.id, objSet, false);
            break;
        case 'snapEqualChart':
            new snapEqualChart(builder, time, "#" + iDiv.id, objSet, false);
            break;
    }
}
