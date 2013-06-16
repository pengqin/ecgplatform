'use strict';
define(function(require, exports) {

    var template = require("../templates/employeestatusreport.html");

    angular.module('ecgEmployeeStatusReport', [])
    .controller('EmployeeStatusReportController', ['$scope', 'TaskService',
    function($scope, TaskService) {
    }])
    .directive("ecgEmployeeStatusReport", [ '$location', function($location) {
        return {
            restrict : 'E',
            replace : false,
            template : template,
            controller : "EmployeeStatusReportController",
            link : function($scope, $element, $attrs) {
            }
        };
    } ]);
});