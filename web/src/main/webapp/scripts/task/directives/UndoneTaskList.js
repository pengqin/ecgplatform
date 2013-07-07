'use strict';
define(function(require, exports) {

var template = require("../templates/undonetasklist.html");

angular.module('ecgUndoneTaskList', [])
.controller('UndoneTaskListController', ['$scope', 'TaskService',
function($scope, TaskService) {
    $scope.undone.data = null;
    $scope.undone.selected = null;

    function refreshGrid() {
        TaskService.queryAllTaskByEmployee(
            $scope.session.user, 
            {status: 'undone'}
        ).then(function(tasks) {
            $scope.undone.data = tasks;
        });
    };
    refreshGrid();

    $scope.undone.refreshGrid = refreshGrid;
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