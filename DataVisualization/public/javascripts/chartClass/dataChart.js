/**
 * Created by JAY on 2016. 8. 16..
 */
function dataChart(builder, time, domId, objSet, movable) {

    var serverIp = "http://"+location.host;
    var chart = null;
    var chartData = [];
    var colors = new Object();
    var chartDistinct = objSet["chartDistinct"];
    var chartColors = objSet["chartColors"];
    var chartTitle = objSet["chartTitle"];
    var chartKey = objSet["chartKey"];
    var chartValue =  objSet["chartValue"];
    var chartTime = objSet["chartTime"];
    var chartType = objSet["chartType"];
    var initCycle = 60*5; //5분
    var normalCycle = 5; // 5초
    var updateManage = true;

    //title
    //keyList jsonPath
    //valueList jsonPath
    //timeForGet 얼마큼가져올것인가
    //timeColumn jsonPath
    //graph 몇분그래프인지

    this.init = function () {

        updateManage = true;

        chart = builder(domId, {
            padding: 10,
            axis: [{
                x: {
                    type: "date",
                    domain: getDomain(),
                    interval: 1000 * 60,
                    format: "hh:mm",
                    key: "time"
                },
                y: {
                    type: "range",
                    domain: function (data) {
                        var ret = 0;

                        for (var key in data) {
                            if (data.hasOwnProperty(key)) {
                                if (typeof(data[key]) == "number" && ret < data[key])
                                    ret = data[key];
                            }
                        }
                        return 1.2 * ret;

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
            }],
            widget: [{
                type: "title",
                text: chartTitle,
                size: 15,
                axis: 0
            }, {
                type: "cross",
                yFormat: function (d) {
                    return d.toFixed(2);
                },
                axis: 0
            }],

            style: {
                axisBorderColor: "#dcdcdc",
                axisBorderWidth: 1.5,
                axisBorderRadius: 5,
                titleFontSize: 12,
                titleFontWeight: 700
            },

            render: false
        });

        settingData();
    };

    function settingData() {

        var startTime = (new Date()).getTime(),
            endTime,
            tookTime = null;

        $.ajax({
            url: serverIp+"/api",
            data: {title: chartTitle, timeColumn: chartTime, time: initCycle, type: "5minute"},
            type: 'GET',
            dataType: "json",
            async: false,
            success: function (arg) {

                console.log(arg);

                endTime = (new Date()).getTime();

                tookTime = endTime - startTime;

                var domain = getDomain();

                for (var i = 0; i < arg.length; i++) {
                    getData(chartData, domain, arg[i]);
                }

                chart.axis(0).update(chartData);

                chart.axis(0).updateGrid("x", {domain: domain});

                console.log("take time : " + tookTime);

                chart.render();
            }
        });


        for(var i=0; i<chartKey.length; i++)
        {
            colors[chartKey[i]] = chartColors[i];
        }

        addBrush(chartType, colors);

        chart.addWidget({type: "tooltip", brush: 0});

        if(movable!=false)
            divSet(domId);

        if (updateManage == true) {
            setTimeout(function () {
                update(chartTitle, normalCycle, chartTime);
            }, 3000 - tookTime);
        }
    }

    function update(title, timeForGet, timeColumn) {
        var startTime = (new Date()).getTime(),
            endTime,
            tookTime = null;

        $.ajax({
            url: serverIp+"/api",
            data: {title: title, timeColumn : timeColumn, time: timeForGet, type: "5minute"},
            type: 'GET',
            dataType: "json",
            async: false,
            success: function (arg) {

                console.log(arg);

                endTime = (new Date()).getTime();

                tookTime = endTime - startTime;

                var domain = getDomain();

                for (var i = 0; i < arg.length; i++) {
                    getData(chartData, domain, arg[i]);
                }

                chart.axis(0).update(chartData);

                chart.axis(0).updateGrid("x", {domain: domain});

                console.log("take time : " + tookTime);

                chart.render();

                if(updateManage==true) {
                    setTimeout(function () {
                        update(title, normalCycle, timeColumn);
                    }, 3000 - tookTime);
                }
            }
        });
    };

    function getDomain() {
        return [new Date(new Date() - time.MINUTE * 5), new Date()];
    }

    function getData(list, domain, obj) {

        for (var i = 0; i < list.length; i++) {
            if (list[i].time.getTime() < domain[0].getTime()) {
                list.shift();
            } else {
                break;
            }
        }

        var timestamp = obj[chartTime];

        list.push(createObject(timestamp, chartKey, chartValue, obj));
    }

    function addBrush(type, colors) {

        chart.addBrush(
            {
                type: "scatter",
                symbol : "cross",
                target: ["value"],
                clip: true,
                colors: function(d)
                {
                    return colors[d.distinct];
                },
                axis: 0
            }
        );
    }

    function createObject(timestamp, keyList, valueList, obj) {

        var jsonObject = new Object();

        jsonObject['time'] = new Date(timestamp);
        jsonObject['value'] = obj[valueList[0]];
        jsonObject['distinct'] = obj[chartDistinct];

        return jsonObject;
    }

    function divSet(domId) {

        $(domId).draggable({
            stop: function( event, ui ) {
                chart.render(true);
            }
        });

        $(domId).resizable({
            stop: function (event, ui) {
                chart.render(true);
            }
        });
    }

    this.destroy = function()
    {
        updateManage = false;
    }

    this.getInfo = function(){

        objSet['type'] = "dataChart";

        return objSet;
    }

    this.init();
}