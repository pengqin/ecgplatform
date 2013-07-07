'use strict';
define(function(require, exports) {

var template = require("../templates/donetasklist.html");

angular.module('ecgDoneTaskList', [])
.controller('DoneTaskListController', ['$scope', 'TaskService',
function($scope, TaskService) {
    $scope.done.data = null;
    $scope.done.selected = null;

    function refreshGrid() {
        TaskService.queryAllTaskByEmployee(
            $scope.session.user, 
            {status: 'done'}
        ).then(function(tasks) {
            $scope.done.data = tasks;
        });
    };
    refreshGrid();

    $scope.done.refreshGrid = refreshGrid;
}])
.directive("ecgDoneTaskList", [ '$location', function($location) {
    return {
        restrict : 'A',
        replace : false,
        template : template,
        controller : "DoneTaskListController",
        link : function($scope, $element, $attrs) {
        }
    };
} ]);

});