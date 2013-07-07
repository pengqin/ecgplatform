'use strict';
define(function(require, exports) {

    var template = require("../templates/plot.html");

    angular.module('ecgPlot', [])
    .controller('PlotController', ['$scope',
    function($scope) {

    }])
    .directive("ecgPlot", [ '$location', function($location) {
        return {
            restrict : 'A',
            replace : false,
            template : template,
            controller : "PlotController",
            link : function($scope, $element, $attrs) {
            }
        };
    } ]);
});