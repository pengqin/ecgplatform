define(function(require, exports) {

'use strict';
 
var template = require("../templates/donetasklist.html");

angular.module('ecgDoneTaskList', [])
.controller('DoneTaskListController', ['$scope', 'EnumService', 'ProfileService', 'TaskService',
function($scope, EnumService, ProfileService, TaskService) {
    $scope.done.data = null;
    $scope.done.selected = null;

    // level名称
    $scope.done.getLevelLabel = EnumService.getLevelLabel;
    // level名称
    $scope.done.getWorkStatusLabel = EnumService.getWorkStatusLabel;

    $scope.done.translateLevel = function(level) {
        switch(level) {
        case 'danger':
            return 'important';
        break;
        case 'success':
            return 'success';
        break;
        case 'warning':
            return 'warning';
        break;
        case 'outside':
            return 'inverse';
        break;
        }
    };
    
    function refreshGrid() {
        var username = $.cookie("AiniaOpUsername");

        $scope.dialog.showLoading();
        ProfileService.get(username)
        .then(function(user) {
            $scope.dialog.hideStandby();
            return user;
        }, function() {
            $scope.dialog.hideStandby();
            return null;
        })
        .then(function(user) {
            if (user) {
                $scope.dialog.showLoading();
                TaskService.queryAllTaskByEmployee(
                    user, 
                    {status: 'done'}
                ).then(function(tasks) {
                    $scope.dialog.hideStandby();
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