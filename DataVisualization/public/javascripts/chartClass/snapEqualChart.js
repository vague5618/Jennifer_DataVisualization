/**
 * Created by JAY on 2016. 8. 22..
 */
/**
 * Created by JAY on 2016. 7. 29..
 */

function snapEqualChart(builder, time, domId, objSet, movable) {

    var chart = null;
    var chartData = [];

    var chartColors = objSet["chartColors"];
    var chartTitle = objSet["chartTitle"];
    var chartKey = objSet["chartKey"];
    var chartValue = objSet["chartValue"];
    var chartTime = objSet["chartTime"];
    var chartType = objSet["chartType"];
    var initCycle = 60 * 6; //5분
    var normalCycle = 3; // 5초
    var updateManage = true;

    this.init = function () {

        updateManage = true;

        chart = builder(domId, {
            axis: [{
                x: {
                    type: "range",
                    domain: function (data) {
                        var sum = 0;

                        for (var key in data) {
                            if (data.hasOwnProperty(key)) {
                                if (typeof(data[key]) == "number")
                                    sum+= data[key];
                            }
                        }

                        return sum;
                    },

                    step: 5,
                    line: true
                },
                y: {
                    domain: [""],
                    line: true
                }
            }]
        });

        settingData();
    };

    function settingData() {

        var startTime = (new Date()).getTime(),
            endTime,
            tookTime = null;

        addBrush(chartType, chartKey, chartColors);

        chart.addWidget({
            type: "title",
            text: chartTitle,
            align: "end"
        });

        chart.addWidget({
            type: "tooltip"
        });

        chart.addWidget({
            type: "legend",
            filter : true
        });


        $.ajax({
            url: "http://localhost:3000/api",
            data: {title: chartTitle, timeColumn: chartTime, time: startTime, type: "snapEqual"},
            type: 'GET',
            dataType: "json",
            async: false,
            success: function (arg) {

                console.log(arg);

                endTime = (new Date()).getTime();

                tookTime = endTime - startTime;

                getData(chartData, arg);

                chart.axis(0).update(chartData);

                console.log("take time : " + tookTime);

                chart.render(true);
            }
        });

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
            url: "http://localhost:3000/api",
            data: {title: title, timeColumn: timeColumn, time: startTime, type: "snapEqual"},
            type: 'GET',
            dataType: "json",
            async: false,
            success: function (arg) {

                console.log(arg);

                endTime = (new Date()).getTime();

                tookTime = endTime - startTime;

                getData(chartData, arg);

                chart.axis(0).update(chartData);

                console.log("take time : " + tookTime);

                chart.render();

                if (updateManage == true) {
                    setTimeout(function () {
                        update(title, normalCycle, timeColumn);
                    }, 3000 - tookTime);
                }
            }
        });
    };

    function getData(list, obj) {

        if (list.length == 1)
            list.shift();

        list.push(createObject(chartKey, chartValue, obj));
    }

    function addBrush(type, columns, colors) {

        chart.addBrush(
            {
                type: "equalizerbar",
                target: columns,
                unit: 10,
                clip: true,
                colors: colors,
                axis: 0
            }
        );
    }

    function createObject(keyList, valueList, obj) {

        var jsonObject = new Object();
        var pattern = /\[[0-9]*\]/;

        for (var i = 0; i < keyList.length; i++) {

            if (pattern.test(valueList[i]) == false || obj[valueList[i]] != null) {

                if (typeof(obj[valueList[i]]) == 'number')
                    jsonObject[keyList[i]] = obj[valueList[i]];
                else
                    jsonObject[keyList[i]] = obj[valueList[i]][0];
            } else {
                var tempKey = valueList[i].split('[')[0];
                var tempIndex = valueList[i].match(pattern)[0].replace("[", "").replace("]", "");

                for (var j = 0; j < obj[tempKey].length; j++) {
                    if (j == tempIndex)
                        jsonObject[keyList[i]] = obj[tempKey][tempIndex];
                }
            }
        }

        console.log(jsonObject);

        return jsonObject;
    }

    function divSet(domId) {

        $(domId).draggable({
            stop: function (event, ui) {
                chart.render();
            }
        });

        $(domId).resizable({
            stop: function (event, ui) {
                chart.render();
            }
        });
    }

    this.destroy = function () {
        updateManage = false;
    }

    this.getInfo = function(){

        objSet['type'] = "snapEqualChart";

        return objSet;
    }

    this.init();
}