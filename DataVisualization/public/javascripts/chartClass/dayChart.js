/**
 * Created by JAY on 2016. 7. 29..
 */

function dayChart(builder, time, domId, objSet, movable) {

    var chart = null;
    var tpsIndex = getTimeToIndex();
    var chartKey = objSet["chartKey"];
    var chartData = [];
    var chartTime = objSet["chartTime"];
    var chartTitle = objSet["chartTitle"];
    var chartValue = objSet["chartValue"];
    var chartColors = objSet["chartColors"];
    var chartHowlong = objSet["chartHowlong"];

    chartHowlong = 5;
    //var chartType = objSet["chartType"];
    //var initCycle = 5; //5분
    //var normalCycle = 0.05; // 3초
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
                    type: "dateblock",
                    domain: [new Date("2016/01/01"), new Date("2016/01/02")],
                    interval: time.HOUR,
                    format: "HH"
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
                        return 1.3 * ret;
                    },
                    step: 4
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

                data: chartData
            }],

            brush: [{
                type: "splitarea",
                target: chartKey,
                split: tpsIndex,
                colors: chartColors,
                axis: 0
            },
                {
                    type: "pin",
                    split: tpsIndex,
                    axis: 0
                }],

            widget: [{
                type: "title",
                size: 15,
                text: chartTitle
            },
                {
                    type: "cross",
                    yFormat: function (d) {
                        return d.toFixed(2);
                    },
                    axis: 0
                }
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

        if (movable != false)
            divSet(domId);

        initData();
    };

    function initData() {
        $.ajax({
            url: "http://localhost:3000/api",
            data: {title: chartTitle, timeColumn: chartTime, value: chartValue, type: "1day"},
            type: 'GET',
            dataType: "json",
            async: false,
            success: function (arg) {

                console.log(arg);

                var index = getTimeToIndex();

                console.log("length : " + arg.length);
                console.log("index = " + index);

                for (var i = 0; i < arg.length; i++) {
                    var obj = new Object();

                    if (arg[i] == null) {
                        for (var j = 0; j < chartKey.length; j++)
                            obj[chartKey[j]] = null;
                    }
                    else {
                        for (var j = 0; j < chartKey.length; j++)
                            obj[chartKey[j]] = arg[i][j];
                    }

                    chartData.push(obj);
                }

                chart.axis(0).update(chartData);

                chart.updateBrush(0, {split: Math.round(index)});
                chart.updateBrush(1, {split: index});

                chart.render();

                if (updateManage == true) {
                    setTimeout(function () {
                        update();
                    }, chartHowlong * 10000);
                }
            }
        });
    }

    function update() {
        var startTime = (new Date()).getTime(),
            endTime,
            tookTime = null;

        $.ajax({
            url: "http://localhost:3000/api",
            data: {title: chartTitle, timeColumn: chartTime, value: chartValue, type: "minuteMean"},
            type: 'GET',
            dataType: "json",
            async: false,
            success: function (arg) {

                console.log(arg);

                var index = getTimeToIndex();

                endTime = (new Date()).getTime();

                tookTime = endTime - startTime;

                for (var i = 0; i < arg.length; i++) {
                    var obj = new Object();

                    obj[chartKey[i]] = arg[i];

                    chartData[Math.round(index)] = obj;
                }

                chart.axis(0).update(chartData);

                console.log("take time : " + tookTime);

                chart.updateBrush(0, {split: index});
                chart.updateBrush(1, {split: index});

                chart.render();

                if (updateManage == true) {
                    setTimeout(function () {
                        update();
                    }, chartHowlong * 10000 - tookTime);
                }
            }
        });
    }

    function divSet(domId) {

        $(domId).draggable({
            stop: function (event, ui) {
                chart.render(true);
            }
        });

        $(domId).resizable({
            stop: function (event, ui) {
                chart.render(true);
            }
        });
    }

    this.destroy = function () {
        updateManage = false;
    }

    function getTimeToIndex() {
        var now = new Date();
        return now.getHours() * (60 / chartHowlong) + (now.getMinutes() / chartHowlong);
    }

    this.getInfo = function () {

        objSet['type'] = "dayChart";

        return objSet;
    }

    this.init();
}