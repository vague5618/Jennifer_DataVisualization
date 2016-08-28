/**
 * Created by JAY on 2016. 8. 23..
 */
jui.ready(["chart.builder", "util.base", "util.time"], function (builder, _, time) {

    var chartManage = [];
    var chartIndex = 0;
    var chartData = null;
    var pathArray = window.location.pathname.split( '/' );
    var chartLayout = null;

    function setDialog(){
        $( "#divDialog" ).dialog({
            modal: true,
            autoOpen: false,
            width: 600,
            height: 'auto',
            show: {
                effect: "blind",
                duration: 1000
            }
        }).prev(".ui-dialog-titlebar").css("background","#00bbbb");
    }

    $.get(window.location.href+"?type=getChartInfo", function( result ) {

        chartData = result;

        //builder, time, iDiv, objSet

        switch(result.chartLayout)
        {
            case "0":
                chartLayout = null;
                break;
            case "1":
                chartLayout = '../layout/easyLayout1.html';
                break;
            case "2":
                chartLayout = '../layout/easyLayout2.html';
                break;
        }


        if(chartLayout!=null) {

            $('#divChart').load(chartLayout, function () {

                var data = result.chartInfo;

                for (var i = 0; i < data.length; i++) {
                    var iDiv = document.createElement('div');
                    iDiv.id = 'chartSection' + chartIndex++;

                    $("#divChart").append(iDiv);

                    $("#" + iDiv.id).css("left", data[i].left);
                    $("#" + iDiv.id).css("top", data[i].top);
                    $("#" + iDiv.id).width(data[i].width);
                    $("#" + iDiv.id).height(data[i].height);

                    setChart(builder, time, iDiv, data[i], false, chartManage, chartIndex);

                    $("#" + iDiv.id).css("position", "absolute");

                    setDialog();
                }
            });
        }
        else
        {
            var data = result.chartInfo;

            for (var i = 0; i < data.length; i++) {
                var iDiv = document.createElement('div');
                iDiv.id = 'chartSection' + chartIndex;

                $("#divChart").append(iDiv);

                $("#" + iDiv.id).css("left", data[i].left);
                $("#" + iDiv.id).css("top", data[i].top);
                $("#" + iDiv.id).width(data[i].width);
                $("#" + iDiv.id).height(data[i].height);

                setChart(builder, time, iDiv, data[i], false, chartManage, chartIndex);

                chartIndex++;

                $("#" + iDiv.id).css("position", "absolute");

                setDialog();

            }
        }
    });


    //modified Chart

    $('#aModified').click(function(){
        location.href = "/&modify&"+pathArray[2];
    });

});
