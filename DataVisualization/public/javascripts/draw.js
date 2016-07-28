/**
 * Created by JAY on 2016. 7. 20..
 */
var time = jui.include("util.time"),
    data = initData(100, domainArray.length),
    colors = ['#ff0000', '#f2ab14', "#4692ca","#5692ca","#1292ca","#1292ca"];

jui.ready(["chart.builder", "util.base"], function (builder, _) {

    data1 = [], data2 = [
        {ie: 70, ff: 11, chrome: 9, safari: 6, other: 4}
    ], data3 = [
        {title: "Overall Visits", value: 192, max: 200, min: 0}
    ];

    $("#chartSection1").draggable();

    $("#chartSection1").resizable({
        stop: function (event, ui) {
            chart.render(true);
        }
    });

    var chart = builder("#chartSection1", {
        padding: 10,
        axis: [{
            x: {
                type: "dateblock",
                realtime: "minutes",
                interval: 1,
                format: "HH:mm:ss"
            },
            y: {
                type: "range",
                domain: function (data) {
                    var ret = -9999;
                    for (var i = 0; i < domainArray.length; i++)
                        ret = Math.max(ret, data[domainArray[i]]);

                    return ret * 1.2;
                },
                step: 4,
                line: "solid"
            },
            padding: {
                left: 50,
                top: 50,
                right: 20,
                bottom: 25
            },
            area: {
                width: "100%",
                height: "100%"
            },

            data: data
        }],

        widget: [{
            type: "title",
            text: "Realtime Chart",
            size: 15,
            axis: 0
        }, {

            type: "cross",
            yFormat: function (d) {
                return Math.round(d);
            },
            axis: 0
        },
            {type: "tooltip", brush : 0}
        ],

        style: {
            axisBorderColor: "#dcdcdc",
            axisBorderWidth: 1.5,
            axisBorderRadius: 5,
            titleFontSize: 12,
            titleFontWeight: 700
        },
        render: false
    });


    chart.addBrush({
        type: "line",
        target: domainArray,
        colors: colors,
        axis: 0
    });

    setTimeout(function () {
        updateData(chart)
    }, 1000);

});

function updateData(chart) {
    var startTime = (new Date()).getTime(),
        endTime,
        tookTime = null;

    $.ajax({
        url: "http://localhost:3000/api",
        data: form_data,
        type: 'POST',
        dataType: "json",
        async: false,
        success: function (arg) {

            if (arg == false)
                console.log("false");

            else {
                var axis = chart.axis(0);

                endTime = (new Date()).getTime();
                tookTime = endTime - startTime;

                try {
                    if (data.length == 100) {

                        data.shift();

                        data.push(getJSONData(arg, pathArray.length, chart));

                        axis.update(data);
                    }

                    axis.updateGrid("x", {
                        domain: [new Date() - time.MINUTE * 5, new Date()]
                    });

                    chart.render();
                }
                catch (e) {
                    console.error(e);
                }
            }

            console.log("take time : " + tookTime);

            setTimeout(function () {
                updateData(chart)
            }, 3000 - tookTime);
        }
    });
}

function initData(countData, countColumn) {

    var data = [];

    for (var i = 0; i < countData; i++) {

        var obj = new Object();

        for (var j = 0; j < countColumn; j++) {

            obj[domainArray[j]] = null;
        }
        data.push(obj);
    }

    return data;
}

function getJSONData(arg, countColumn, chart) {

    var obj = new Object();

    for (var i = 0; i < countColumn; i++) {

        var column = jsonPath(arg, pathArray[i]);

        console.log(column);

        //column이 하나일 때

        if (column.length == 1) {
            obj[domainArray[i]] = column[0];
        }
        //두 개 이상일 때
        else {
            for (var j = 0; j < column.length; j++) {



            }
        }
    }

    console.log(obj);

    return obj;
}
