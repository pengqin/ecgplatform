'use strict';
define(function(require, exports) {

    var template = require("../templates/plot.html");

    angular.module('ecgPlot', ['ecgPlotService'])
    .controller('PlotController', ['$scope', 'PlotService',
    function($scope, PlotService) {
        function drawPlot() {
            var now = new Date(); 
            var setting = {
                data : [],
                options : {
                    rectangleRatio : 0.2, // the ratio of width/height of the minimum rectangle 
                    axes:{
                        timeformat : "%M:%S",
                    },
                    ecgLineWidth: {
                        bold: 1.5,
                        normal: 0.3
                    },
                    interactive : {
                        enable: true,
                        levelRange: {
                            lower : 5,
                            upper : 7
                        }
                    }
                }
            };

            /*{{{*/function formECGSingleSeg(start_timestamp, data_obj){
                var ecg_test_data_obj_length = data_obj.data.length;
                var ecg_data = [];
                var counter = 0;
                for(var i=0;i < ecg_test_data_obj_length ; i++){
                    // just show 1/5 dataset instead of showing all record
                    var j = 0;
                    // filter out all the resord that marked as status == -1 (indication of package lose)
                    if(data_obj.data[i].status != -1){
                        counter++;
                        var time_index = parseInt(start_timestamp) + 2*(i*5+j);
                        ecg_data.push([time_index , data_obj.data[i].vol[j] ]);
                    }
                }
                return ecg_data;
            }//}}}

            setting.data = formECGSingleSeg(now.getTime() + now.getTimezoneOffset(), PlotService.getPlotData());

            var plot = $('#ecgplot').ECGPlot(setting);
        }

        // watch the selected event
        $scope.$watch('undone.selectedItems',
            function(newVal, oldVal) {
                if (!newVal || newVal.length === 0) { return; }
                drawPlot();
            }, 
            true
        );
    }])
    .directive("ecgPlot", [ '$location', function($location) {
        return {
            restrict : 'E',
            replace : false,
            template : template,
            controller : "PlotController",
            link : function($scope, $element, $attrs) {
            }
        };
    } ]);
});