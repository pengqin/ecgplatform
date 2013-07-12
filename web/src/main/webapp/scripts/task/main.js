define(function(require, exports) {

'use strict';
    
require("./services/TaskService");

require("./directives/TaskView");
require("./directives/ReplyForm");

var todoTemp = require("./templates/todo.html");
var taskTemp = require("./templates/list.html");

angular.module('ecgTask', ['ecgTaskService', 'ecgTaskView', 'ecgReplyForm'])
.controller('TodoTaskController', ['$scope', 'ProfileService', 'TaskService', function ($scope, ProfileService, TaskService) {
    $scope.subheader.title = "待办工作";

    // 基本变量
    $scope.todo = {};    
    $scope.todo.tasks = null;
    $scope.todo.current = null;
    $scope.todo.replyform = 'hidden';

    // 加载未完成任务
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
                    {status: 'undone'}
                ).then(function(tasks) {
                    $scope.dialog.hideStandby();
                    $scope.todo.tasks = tasks;
                    selectTask();
                });
            } else {
                $scope.message.error("无法加载用户数据");
            }
        });
    };
    refreshGrid();
 
    // 将第一个作为当前选中view
    function selectTask() {
        if ($scope.todo.tasks.length == 0) { return; }
        $scope.todo.current = $scope.todo.tasks[0];
    };

    // 展开/收缩窗口
    $scope.todo.reply = function(position) {
        if ($scope.todo.replyform == position) {
            $scope.todo.replyform = 'hidden';
        } else {
            $scope.todo.replyform = position;
        }
    };

    // 移动到下一个
    $scope.todo.shift = function() {
        $scope.todo.current = null;
        $scope.todo.tasks.splice(0, 1);
        $scope.todo.replyform = 'hidden';
        selectTask();
    };
}])
.controller('TaskController', ['$scope', 'EnumService', 'ProfileService', 'TaskService', function ($scope, EnumService, ProfileService, TaskService) {
    $scope.subheader.title = "工作清单";

    $scope.task = {};
    $scope.task.data = null;
    $scope.task.selected = null;

    // level名称
    $scope.task.getLevelLabel = EnumService.getLevelLabel;
    // level名称
    $scope.task.getWorkStatusLabel = EnumService.getWorkStatusLabel;

    $scope.task.translateLevel = function(level) {
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
                TaskService.queryAllTaskByEmployee(user).then(function(tasks) {
                    $scope.dialog.hideStandby();
                    $scope.task.data = tasks;
                });
            } else {
                $scope.message.error("无法加载用户数据");
            }
        });
    };
    refreshGrid();

    $scope.task.refreshGrid = refreshGrid;
}])
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
    .when('/todo', {
        template: todoTemp,
        controller: 'TodoTaskController'
    })
    .when('/task', {
        template: taskTemp,
        controller: 'TaskController'
    });
}]);

});// end of define