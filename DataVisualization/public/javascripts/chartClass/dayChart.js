/**
 * Created by JAY on 2016. 7. 29..
 */

function dayChart(builder, time, domId, objSet, movable) {

    var serverIp = "http://" + location.host;
    var chart = null;
    var callNumber = 0;
    var tpsIndex = getTimeToIndex();
    var chartKey = objSet["chartKey"];
    var chartData = [];
    var chartTime = objSet["chartTime"];
    var targetTitle = objSet["targetTitle"];
    var chartTitle = objSet["chartTitle"];
    var chartValue = objSet["chartValue"];
    var chartColors = objSet["chartColors"];
    var chartSetMean = objSet["chartSetMean"];
    var chartType = objSet["chartType"];
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
                        return 1.2 * ret;
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

            widget: [{
                type: "title",
                size: 15,
                dy: 20,
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
                titleFontWeight: 700,
                lineSplitBorderColor: "#929292"

            },

            render: false

        });

        divSet(domId);

        initData();
    };

    function initData() {

        tpsIndex = getTimeToIndex();

        addBrush(chartType, Math.round(tpsIndex), 0);

        $.ajax({
            url: serverIp + "/api",
            data: {title: targetTitle, timeColumn: chartTime, value: chartValue, type: "1day", setMean: chartSetMean},
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

                updateBrush(chartType, index);

                chart.render();

                if (updateManage == true) {
                    setTimeout(function () {
                        update();
                    }, chartSetMean * 1000 * 60);
                }
            }
        });
    }

    function update() {
        var startTime = (new Date()).getTime(),
            endTime,
            tookTime = null;

        $.ajax({
            url: serverIp + "/api",
            data: {
                title: targetTitle,
                timeColumn: chartTime,
                value: chartValue,
                type: "minuteMean",
                setMean: chartSetMean
            },
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

                updateBrush(chartType, index);

                console.log("take time : " + tookTime);

                chart.render();

                if (updateManage == true) {
                    setTimeout(function () {
                        update();
                    }, chartSetMean * 1000 * 60 - tookTime);
                }
            }
        });
    }


    function addBrush(type, index) {

        if (type == 'line') {

            chart.addBrush(
                {
                    type: "splitarea",
                    target: chartKey,
                    split: index,
                    colors: chartColors,
                    axis: 0
                }
            );

            chart.addBrush(
                {
                    type: "pin",
                    split: index,
                    axis: 0
                }
            );
        }

        if (type == 'column') {

            chart.addBrush(
                {
                    type: type,
                    target: chartKey,
                    colors: chartColors,
                    axis: 0,
                    display: "max",
                    animate: true
                }
            );
            chart.addBrush(
                {
                    type: "focus",
                    start: index - 1,
                    end: index
                }
            );


        }
    }

    function updateBrush(type, index) {

        if (type == 'line') {
            chart.updateBrush(0, {split: Math.round(index)});
            chart.updateBrush(1, {split: Math.round(index)});
        }

        if (type == 'column') {

            callNumber = 0;

        }
    }

    function divSet(domId) {

        $(domId).contextmenu(function () {
            $('#tbodyChartInfo').empty();
            $('#hChartTitle').html(chartTitle);
            for (var i = 0; i < chartKey.length; i++) {
                var row = '<tr><th>' + chartColors[i] + '</th>' +
                    '<th>' + chartValue[i] + '</th>' +
                    '<th>' + chartKey[i] + '</th></tr>';

                $("#tbodyChartInfo").append(row);
            }

            $("#divDialog").dialog("open");
        });


        if (movable == true) {

            $(domId).draggable({
                stop: function (event, ui) {
                    chart.render(true);
                }
            });

            $(domId).resizable({
                maxHeight: 600,
                maxWidth: 1000,
                minHeight: 200,
                minWidth: 300,
                stop: function (event, ui) {
                    chart.render(true);
                }
            });
        }
    }

    this.destroy = function () {
        updateManage = false;
    }

    this.render = function () {
        chart.render(true);
    }

    function getTimeToIndex() {
        var now = new Date();
        return now.getHours() * (60 / chartSetMean) + (now.getMinutes() / chartSetMean);
    }

    this.getInfo = function () {

        objSet['type'] = "dayChart";

        return objSet;
    }

    this.init();
}