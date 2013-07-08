'use strict';
define(function(require, exports) {

var template = require("../templates/donetasklist.html");

angular.module('ecgDoneTaskList', [])
.controller('DoneTaskListController', ['$scope', 'ProfileService', 'TaskService',
function($scope, ProfileService, TaskService) {
    $scope.done.data = null;
    $scope.done.selected = null;

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
                    {status: 'done'}
                ).then(function(tasks) {
                    $scope.done.data = tasks;
                });
            } else {
                $scope.message.error("无法加载用户数据");
            }
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