'use strict';
define(function(require, exports) {

    var template = require("../templates/taskprocessreport.html");

    angular.module('ecgTaskProcessReport', [])
    .controller('TaskProcessReportController', ['$scope', 'TaskService',
    function($scope, TaskService) {
    }])
    .directive("ecgTaskProcessReport", [ '$location', function($location) {
        return {
            restrict : 'E',
            replace : false,
            template : template,
            controller : "TaskProcessReportController",
            link : function($scope, $element, $attrs) {
            }
        };
    } ]);
});