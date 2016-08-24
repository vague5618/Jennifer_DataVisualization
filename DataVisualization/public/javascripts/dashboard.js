/**
 * Created by JAY on 2016. 8. 23..
 */
jui.ready(["chart.builder", "util.base", "util.time"], function (builder, _, time) {

    var chartIndex = 0;

    $.get(window.location.href+"?type=getChartInfo", function( data ) {

        //builder, time, iDiv, objSet

        for(var i=0; i<data.length; i++)
        {
            var iDiv = document.createElement('div');
            iDiv.id = 'chartSection' + chartIndex++;

            $("#divChart").append(iDiv);

            $("#"+iDiv.id).css("left",data[i].left);
            $("#"+iDiv.id).css("top",data[i].top);
            $("#"+iDiv.id).width(data[i].width);
            $("#"+iDiv.id).height(data[i].height);

            console.log("left : "+data[i].left);
            console.log("top : "+data[i].top);

            setChart(builder, time, iDiv, data[i], false);

            $("#"+iDiv.id).css("position","absolute");

        }
    });

});
