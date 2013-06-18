'use strict';
define(function(require, exports) {

    var template = require("../templates/operatorstaskreport.html");

    angular.module('ecgOperatorsTaskReport', [])
    .controller('OperatorsTaskReportController', ['$scope', 'TaskService',
    function($scope, TaskService) {
    }])
    .directive("ecgOperatorsTaskReport", [ '$location', function($location) {
        return {
            restrict : 'E',
            replace : false,
            template : template,
            controller : "OperatorsTaskReportController",
            link : function($scope, $element, $attrs) {
            }
        };
    } ]);
});