'use strict';
define(function(require, exports) {

    var template = require("../templates/undonetasklist.html");

    angular.module('ecgUndoneTaskList', [])
    .controller('UndoneTaskListController', ['$scope', 'TaskService',
    function($scope, TaskService) {
        $scope.undone.data = TaskService.getAllUndones();
        $scope.undone.selected = null;
    }])
    .directive("ecgUndoneTaskList", [ '$location', function($location) {
        return {
            restrict : 'A',
            replace : false,
            template : template,
            controller : "UndoneTaskListController",
            link : function($scope, $element, $attrs) {
            }
        };
    } ]);
});