define(function(require, exports) {

'use strict';
    
require("./services/TaskService");
require("./directives/UndoneTaskList");
require("./directives/UndoneTaskView");
require("./directives/UserCard");
require("./directives/ExaminationView");
require("./directives/Plot");
require("./directives/ReplyDialog");
require("./directives/ForwardDialog");
require("./directives/DoneTaskList");
require("./directives/DoneTaskView");
require("./directives/ExaminationReply");

var todoTemp = require("./templates/todo.html");
var taskTemp = require("./templates/done.html");

angular.module('ecgTask', ['ecgTaskService', 'ecgUndoneTaskList', 'ecgUndoneTaskView', 'ecgReplyDialog', 'ecgForwardDialog', 'ecgDoneTaskList', 'ecgDoneTaskView', 'ecgExaminationReply'])
.controller('TodoTaskController', ['$scope', 'TaskService', function ($scope, TaskService) {
    $scope.undone = {};
    $scope.subheader.title = "待办工作";

    // 回复
    $scope.undone.reply = function() {
        $scope.replydialog.show({examination: $scope.undone.selected.examination, handler: function(replys) {
            var len = replys.length, count = 0;
            $scope.replydialog.hide();
            $scope.dialog.showStandby();
            $(replys).each(function(i, reply) {
                TaskService.reply($scope.undone.selected.examination, reply)
                .then(function(flag) {
                    $scope.dialog.hideStandby();
                    if (flag) {
                        count++;
                    } else {
                        $scope.message.error("无法处理该条记录，请联系管理员!");
                    }
                    if (count === len) {
                        $scope.message.success("该检测请求已处理完毕，如需查询，请点击菜单已办工作!");
                        $scope.undone.selected = null;
                        // 刷新
                        $scope.undone.refreshGrid();
                    }
                }, function() {
                    $scope.dialog.hideStandby();
                    $scope.message.error("无法处理该条记录，请联系管理员!");
                });
            });
        }});
    };

    // 转发
    $scope.undone.forward = function() {
        TaskService.forward($scope.undone.selected)
        .then(function(flag) {
            $scope.dialog.hideStandby();
            if (flag) {
                $scope.message.success("该检测请求已转交给专家处理!");
                $scope.undone.selected = null;
            } else {
                $scope.message.error("无法转交该任务，请联系管理员!");
            }
            // 刷新
            $scope.undone.refreshGrid();
        }, function() {
            $scope.dialog.hideStandby();
            $scope.message.error("无法转交该任务，请联系管理员!");
        });
    };
}])
.controller('TaskController', ['$scope', function ($scope) {
    $scope.done = {};
    $scope.subheader.title = "工作清单";
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