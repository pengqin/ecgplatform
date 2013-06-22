'use strict';
define(function(require, exports) {

angular.module('ecgPlotService', [])
    .factory("PlotService", function() {
        return {
            getPlotData: function() {
                return test_data;
            }
        };
    });
});