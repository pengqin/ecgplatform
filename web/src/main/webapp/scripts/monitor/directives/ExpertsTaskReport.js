'use strict';
define(function(require, exports) {

    var template = require("../templates/expertstaskreport.html");

    angular.module('ecgExpertsTaskReport', [])
    .controller('ExpertsTaskReportController', ['$scope', 'TaskService',
    function($scope, TaskService) {
    }])
    .directive("ecgExpertsTaskReport", [ '$location', function($location) {
        return {
            restrict : 'E',
            replace : false,
            template : template,
            controller : "ExpertsTaskReportController",
            link : function($scope, $element, $attrs) {
            }
        };
    } ]);
});