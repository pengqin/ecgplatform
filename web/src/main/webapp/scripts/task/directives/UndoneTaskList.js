'use strict';
define(function(require, exports) {

var template = require("../templates/undonetasklist.html");

angular.module('ecgUndoneTaskList', [])
.controller('UndoneTaskListController', ['$scope', 'ProfileService', 'TaskService',
function($scope, ProfileService, TaskService) {
    $scope.undone.data = null;
    $scope.undone.selected = null;

    function refreshGrid() {
        var username = $.cookie("AiniaOpUsername");

        ProfileService.get(username)
        .then(function(user) {
            return user;
        }, function() {
            return null;
        })
        .then(function(user) {
            if (user) {
                TaskService.queryAllTaskByEmployee(
                    user, 
                    {status: 'undone'}
                ).then(function(tasks) {
                    $scope.undone.data = tasks;
                });
            } else {
                $scope.message.error("无法加载用户数据");
            }
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