/**
 * Created by JAY on 2016. 7. 26..
 */

function setClass(builder, time, iDiv, chartManage, chartIndex, objSet, howLong, type) {

    if (type == "SnapShot") {

        if(objSet['chartType']=="pie")
            chartManage[iDiv.id] = new pieChart(builder, time, "#" + iDiv.id, objSet,true);

        else if(objSet['chartType']=="equalizerColumn")
            chartManage[iDiv.id] = new snapEqualColumnChart(builder, time, "#" + iDiv.id, objSet,true);

        else if(objSet['chartType']=="equalizerBar")
            chartManage[iDiv.id] = new snapEqualBarChart(builder, time, "#" + iDiv.id, objSet,true);

        else if (howLong == "5minute")
            chartManage[iDiv.id] = new dateChart(builder, time, "#" + iDiv.id, objSet, true);

        else if (howLong == "24hour")
            chartManage[iDiv.id] = new dayChart(builder, time, "#" + iDiv.id, objSet, true);
    }

    else if (type == "Data") {
        chartManage[iDiv.id] = new dataChart(builder, time, "#" + iDiv.id, objSet, true);
    }

    setMoveChart(iDiv, chartManage, chartIndex);
}


function setChart(builder, time, iDiv, objSet, movable, chartManage, chartIndex) {

    console.log(objSet['type']);

    switch(objSet['type'])
    {
        case 'dateChart':
            chartManage[iDiv.id] = new dateChart(builder, time, "#" + iDiv.id, objSet, movable);
            break;
        case 'dayChart':
            chartManage[iDiv.id] = new dayChart(builder, time, "#" + iDiv.id, objSet, movable);
            break;
        case 'dataChart':
            chartManage[iDiv.id] = new dataChart(builder, time, "#" + iDiv.id, objSet, movable);
            break;
        case 'snapEqualBarChart':
            chartManage[iDiv.id] = new snapEqualBarChart(builder, time, "#" + iDiv.id, objSet, movable);
            break;
        case 'snapEqualColumnChart':
            chartManage[iDiv.id] = new snapEqualColumnChart(builder, time, "#" + iDiv.id, objSet, movable);
            break;
        case 'pieChart':
            chartManage[iDiv.id] = new pieChart(builder, time, "#" + iDiv.id, objSet, movable);
            break;
    }

    if(movable==true)
        setMoveChart(iDiv,chartManage,chartIndex);
}


function setMoveChart(iDiv, chartManage, chartIndex)
{
    //close Button Add

    $('#' + iDiv.id).prepend('<div id="divClose" type="button" class="btn-default glyphicon glyphicon-remove pull-right" style=" display: none; width: 10px; height: 10px"></div>');

    document.getElementById("divClose").setAttribute("id", "divClose" + chartIndex);

    var targetDiv = "divClose" + chartIndex;

    $('#' + iDiv.id).mouseover(function () {
        $("#" + targetDiv).show();
    });

    $('#' + iDiv.id).mouseleave(function () {
        $("#" + targetDiv).hide();
    });

    $("#" + targetDiv).click(function () {
        $('#' + iDiv.id).remove();
        chartManage[iDiv.id].destroy();
        delete chartManage[iDiv.id];
    });
}