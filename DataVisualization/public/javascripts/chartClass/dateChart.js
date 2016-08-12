/**
 * Created by JAY on 2016. 7. 29..
 */

function dateChart(builder, time, domId, objSet) {

    var chart = null;
    var chartData = [];

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
            url: "http://localhost:3000/api",
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

        addBrush(chartType, chartKey, chartColors);

        chart.addWidget({type: "tooltip", brush: 0});

        divSet(domId);

        if (updateManage == true) {
            setTimeout(function () {
                update(chartTitle, normalCycle, chartTime);
            }, 5000 - tookTime);
        }
    }

    function update(title, timeForGet, timeColumn) {
        var startTime = (new Date()).getTime(),
            endTime,
            tookTime = null;

        $.ajax({
            url: "http://localhost:3000/api",
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
                    }, 5000 - tookTime);
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

    function addBrush(type, columns, colors) {

        chart.addBrush(
            {
                type: type,
                target: columns,
                clip: true,
                colors: colors,
                axis: 0
            }
        );
    }

    function createObject(timestamp, keyList, valueList, obj) {

        var jsonObject = new Object();
        var pattern  = /\[[0-9]*\]/;

        for (var i = 0; i < keyList.length; i++) {

            if(pattern.test(valueList[i])==false || obj[valueList[i]]!=null)
                jsonObject[keyList[i]] = obj[valueList[i]][0];
            else
            {
                var tempKey = valueList[i].split('[')[0];
                var tempIndex = valueList[i].match(pattern)[0].replace("[","").replace("]","");

                for(var j=0; j<obj[tempKey].length; j++) {
                    if (j == tempIndex)
                        jsonObject[keyList[i]] = obj[tempKey][tempIndex];
                }
            }
        }

        jsonObject['time'] = new Date(timestamp);

        return jsonObject;
    }

    function divSet(domId) {

        $(domId).draggable();

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

    this.init();
}