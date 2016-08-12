/**
 * Created by JAY on 2016. 7. 26..
 */

function realChart(domId, objSet) {

    this.init = function() {

        var data = initData(100, domainArray.length);

        var chart = builder(domId, {
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

            brush: [{
                type: "line",
                target: domainArray,
                colors: colors,
                axis: 0
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

        setTimeout(function () {
            updateData(chart)
        }, 1000);
    };

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


    this.init();
}

function pieChart() {

    this.getInfo = function() {
        return;
    };
}