/**
 * Created by JAY on 2016. 8. 22..
 */
/**
 * Created by JAY on 2016. 7. 29..
 */

function pieChart(builder, time, domId, objSet, movable) {

    var serverIp = "http://" + location.host;
    var chart = null;
    var chartData = [];
    var chartColors = objSet["chartColors"];
    var chartTitle = objSet["chartTitle"];
    var targetTitle = objSet["targetTitle"];
    var chartKey = objSet["chartKey"];
    var chartValue = objSet["chartValue"];
    var chartTime = objSet["chartTime"];
    var chartType = objSet["chartType"];
    var initCycle = 60 * 6; //5분
    var normalCycle = 2; // 5초
    var updateManage = true;
    var chartSum = 0;

    this.init = function () {

        updateManage = true;

        chart = builder(domId, {
            padding: {
                left: 10,
                top: 10,
                right: 10,
                bottom: 0
            },
            axis: [{
                data : chartData,

                padding: {
                    left: 50,
                    top: 50,
                    right: 20,
                    bottom: 50
                },

                area: {
                    width: "100%",
                    height: "100%"
                },

            }],

            style: {
                axisBorderColor: "#dcdcdc",
                axisBorderWidth: 1.5,
                axisBorderRadius: 5,
                titleFontSize: 12,
                titleFontWeight: 700
            }
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
            size: 15,
            dy: 20
        });

        chart.addWidget({
            type: "tooltip",
            orient : "left",
            format : function(data, k) {
                return {
                    key: k,
                    value: data[k]
                }
            }
        });

        chart.addWidget({
            type : "legend",
            format : function(k) {
                return k;
            },
            dx : 30
        });


        $.ajax({
            url: serverIp + "/api",
            data: {title: targetTitle, timeColumn: chartTime, time: startTime, type: "snapPie"},
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

        divSet(domId);

        if (updateManage == true) {
            setTimeout(function () {
                update(targetTitle, normalCycle, chartTime);
            }, 3000 - tookTime);
        }
    }

    function update(title, timeForGet, timeColumn) {

        var startTime = (new Date()).getTime(),
            endTime,
            tookTime = null;

        $.ajax({
            url: serverIp + "/api",
            data: {title: title, timeColumn: timeColumn, time: startTime, type: "snapPie"},
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

        var obj = createObject(chartKey, chartValue, obj);

        chartSum = 0;

        for(var key in obj)
        {
            chartSum += obj[key];
        }

        list.push(obj);
    }

    function addBrush(type, columns, colors) {

        chart.addBrush(
            {
                type : "pie",
                showText : "inside",
                format : function(k, v) {
                    return ((v/chartSum).toFixed(2))*100 + "%";
                },
                colors: colors
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

        return jsonObject;
    }

    function divSet(domId) {

        $(domId).contextmenu(function()
        {
            $('#tbodyChartInfo').empty();
            $('#hChartTitle').html(chartTitle);
            for(var i=0; i<chartKey.length; i++)
            {
                var row = '<tr><th>'+chartColors[i]+'</th>'+
                    '<th>'+chartValue[i]+'</th>'+
                    '<th>'+chartKey[i]+'</th></tr>';

                $("#tbodyChartInfo").append(row);
            }

            $( "#divDialog" ).dialog( "open" );
        });


        if(movable==true) {

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

    this.getInfo = function () {

        objSet['type'] = "pieChart";

        return objSet;
    }

    this.init();
}