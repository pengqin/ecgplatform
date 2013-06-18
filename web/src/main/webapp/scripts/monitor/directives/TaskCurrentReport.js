'use strict';
define(function(require, exports) {

    var template = require("../templates/taskcurrentreport.html");

    angular.module('ecgTaskCurrentReport', [])
    .controller('TaskCurrentReportController', ['$scope', 'TaskService',
    function($scope, TaskService) {
    }])
    .directive("ecgTaskCurrentReport", [ '$location', function($location) {
        return {
            restrict : 'E',
            replace : false,
            template : template,
            controller : "TaskCurrentReportController",
            link : function($scope, $element, $attrs) {
            }
        };
    } ]);
});