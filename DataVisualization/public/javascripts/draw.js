/**
 * Created by JAY on 2016. 7. 20..
 */
var time = jui.include("util.time"),
    data = initData(100);

jui.ready([ "chart.builder", "util.base" ], function(builder, _) {


        data1 = [], data2 = [
        { ie : 70, ff : 11, chrome : 9, safari : 6, other : 4 }
        ], data3 = [
            { title : "Overall Visits", value : 192, max : 200, min : 0 }
        ];

    //var chart1= chart("#chartSection2", {
    //    padding : 10,
    //    axis : [{
    //        x : {
    //            type : "fullblock",
    //            domain : [ "Q1", "Q2", "Q3", "Q4" ],
    //            line : true
    //        },
    //        y : {
    //            type: "range",
    //            domain : function(d) {
    //                return Math.max(d.sales, d.profit, d.dept);
    //            },
    //            step: 10
    //        },
    //        padding : {
    //            left : 50,
    //            top : 50,
    //            right : 20,
    //            bottom : 25
    //        },
    //        area : {
    //            width : "45%",
    //            height : "45%"
    //        },
    //        data : data1
    //    }, {
    //        extend : 0,
    //        area : {
    //            x : "50%"
    //        },
    //        data : data1
    //    }, {
    //        padding : {
    //            top : 100,
    //            left : 70,
    //            right : 50,
    //            bottom : 50
    //        },
    //        area : {
    //            width : "45%",
    //            height : "50%",
    //            y : "50%"
    //        },
    //        data : data2
    //    }, {
    //        extend : 2,
    //        padding : {
    //            top : 70,
    //            left : 30,
    //            right : 30,
    //            bottom : 30
    //        },
    //        area : {
    //            x : "50%"
    //        },
    //        data : data3
    //    }],
    //    brush : [{
    //        type : "area",
    //        target : [ "sales", "profit" ],
    //        axis : 0
    //    }, {
    //        type : "scatter",
    //        symbol : "triangle",
    //        target : [ "dept" ],
    //        colors : [ 2 ],
    //        size : 10,
    //        axis : 1
    //    }, {
    //        type : "pie",
    //        axis : 2,
    //        showText : true
    //    }, {
    //        type : "fullgauge",
    //        startAngle : 0,
    //        size : 20,
    //        titleY : 40,
    //        showText : true,
    //        format : function(value) {
    //            return value + "k";
    //        },
    //        axis : 3
    //    }],
    //    widget : [{
    //        type : "title",
    //        text : "Area Chart",
    //        axis : 0
    //    }, {
    //        type : "title",
    //        text : "Scatter Chart",
    //        axis : 1
    //    }, {
    //        type : "title",
    //        text : "Pie Chart",
    //        axis : 2
    //    }, {
    //        type : "title",
    //        text : "Gauge Chart",
    //        axis : 3
    //    }],
    //    style : {
    //        axisBorderColor : "#dcdcdc",
    //        axisBorderWidth : 1.5,
    //        axisBorderRadius : 5,
    //        titleFontSize : 12,
    //        titleFontWeight : 700
    //    }
    //});


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
                domain: "column",
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
                width: "45%",
                height: "45%"
            },
            data: data
        }, {
            extend: 0,
            area: {
                x: "50%"
            },
            data: data1
        }],

        brush: [{
            type: "line",
            target: ["column"],
            colors: [1, "#9228E4"],
            axis: 0
        }, {
            type: "scatter",
            symbol: "triangle",
            target: ["dept"],
            colors: [2],
            size: 10,
            axis: 1
        }],
        widget: [{
            type: "title",
            text: "Realtime Chart",
            axis: 0
        }, {
            type: "title",
            text: "Scatter Chart",
            axis: 1
        }, {
            type : "cross",
            yFormat : function(d) {
                return Math.round(d);
            },
            axis : 0
        }],
        style : {
            axisBorderColor : "#dcdcdc",
            axisBorderWidth : 1.5,
            axisBorderRadius : 5,
            titleFontSize : 12,
            titleFontWeight : 700
        },
        render : false
    });







    setTimeout(function(){updateData(chart)},1000);

});

function updateData(chart)
{
    var startTime = (new Date()).getTime(),
        endTime,
        tookTime = null;

    $.ajax({
        url: "http://localhost:3000/api",
        data : form_data,
        type:'POST',
        dataType : "json",
        async: false,
        success : function(arg) {

            if(arg==false)
                console.log("false");

            else {

                var axis = chart.axis(0);

                endTime = (new Date()).getTime();
                tookTime = endTime - startTime;

                try {

                    var column = jsonPath(arg, path)[0];

                    console.log(column);

                    if (data.length == 100) {
                        data.shift();

                        data.push({column: column});

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

            console.log("take time : "+tookTime);

            setTimeout(function(){updateData(chart)}, 3000-tookTime);
        }
    });
}

function initData(count)
{
    var data = [];

    for(var i=0; i<count; i++) {
        data.push({column :null});
    }

    return data;
}
