'use strict';

define(function(require, exports) {

var formTemplate = require("../templates/replyform.html");
var dialogTemplate = require("../templates/replydialog.html");

angular.module('ecgReplyForm', [])
.controller('ReplyFormController',  ['$scope', 'EnumService', 'TaskService', 'RuleService', 'ReplyConfigService',
    function ($scope, EnumService, TaskService, RuleService, ReplyConfigService) {
    
    if ($scope.replyform) { return; }
    $scope.replyform = {};

    // 预设变量
    $scope.replyform.replys = [];
    $scope.replyform.rules = [];

    $scope.replyform.reset = function() {
        $scope.replyform.replys = [];
        $scope.replyform.rules = [];
        loadRules();
    };

    // 删除已选回复
    $scope.replyform.remove = function(idx) {
        var reply = $scope.replyform.replys[idx];
        if (reply && reply.rule) {
            reply.rule.used = false;
        }
        $scope.replyform.replys.splice(idx, 1);
    };

    // 加载预设回复
    function loadRules() {
        var codes = EnumService.getCodes(),
            examination = $scope.todo.current.examination;

        $scope.replyform.replys = [];
        RuleService.queryAll({usage: 'filter'}).then(function(rules) {
        $(rules).each(function(i, rule) {
            var val = parseFloat(examination[codes[rule.code].col]),
                min = parseFloat(rule.min),
                max = parseFloat(rule.max);
            if (codes[rule.code] && min <= val && val < max) {
                if (!$scope.replyform.rules) {
                  $scope.replyform.rules = [];
                }
                rule.val = val;
                ReplyConfigService.queryAllbyRule(rule)
                .then(function(replyconfigs) {
                    if (replyconfigs.length > 0) {
                        rule.replyconfig = replyconfigs[0];
                        $scope.replyform.rules.push(rule);
                        $scope.replyform.replys.push({
                            result: rule.replyconfig.result,
                            title: rule.replyconfig.title,
                            content: rule.replyconfig.content
                        });
                    }
                });
            }
            });
        }, function() {
            scope.replyform.rules = null;
        });
    };

    // 监听未完成
    $scope.$watch("todo.current.examination", function() {
        if (!$scope.todo) { return; }
        if (!$scope.todo.current) { return; }
        if (!$scope.todo.current.examination) { return; }
        loadRules();
    });

    // 弹出人工回复窗口
    $scope.replyform.addManual = function() {
        $scope.replydialog.show({
            handler: function(reply) {
                $scope.replyform.replys.push(reply);
            }
        });
    };

    // 转发
    $scope.replyform.forward = function() {
        $scope.dialog.showStandby();
        TaskService.replyInBatch($scope.todo.current.examination, $scope.replyform.replys)
        .then(function(flag) {
            $scope.dialog.hideStandby();
            if (flag) {
                $scope.dialog.showStandby();
                TaskService.forward($scope.todo.current)
                .then(function(flag) {
                    $scope.dialog.hideStandby();
                    if (flag) {
                        $scope.message.success("该检测请求已转交给专家处理!");
                        $scope.todo.shift();
                    } else {
                        $scope.message.error("无法转交该任务，可能尚未配置相应专家，请联系管理员!");
                    }
                }, function() {
                    $scope.dialog.hideStandby();
                    $scope.message.error("无法转交该任务，可能尚未配置相应专家，请联系管理员!");
                });
            } else {
                $scope.message.error("保存新的回复内容时出错，请联系管理员!");
            }
        });
    };

    // 设置完成
    $scope.replyform.complete = function() {
        $scope.dialog.showStandby();
        TaskService.replyInBatch($scope.todo.current.examination, $scope.replyform.replys)
        .then(function(flag) {
            $scope.dialog.hideStandby();
            if (flag) {
                $scope.dialog.showStandby();
                TaskService.complete($scope.todo.current)
                .then(function(flag) {
                    $scope.dialog.hideStandby();
                    if (flag) {
                        $scope.message.success("该检测请求已回复!");
                        $scope.todo.shift();
                    } else {
                        $scope.message.error("回复失败，请联系管理员!");
                    }
                }, function() {
                    $scope.dialog.hideStandby();
                    $scope.message.error("回复失败，请联系管理员!");
                });
            } else {
                $scope.message.error("保存新的回复内容时出错，请联系管理员!");
            }
        });
    };
}])
.directive("ecgReplyForm", ['$location', function ($location) {
    return {
        restrict: 'A',
        replace: false,
        template: formTemplate,
        controller: "ReplyFormController",
        link: function ($scope, $element, $attrs) {}
    };
}])
.controller('ReplyDialogController', 
    ['$scope', '$filter', '$timeout', '$location', 'EnumService', 'TaskService', 
    function ($scope, $filter, $timeout, $location, EnumService, TaskService) {

    // 命名空间
    $scope.replydialog = {};

    // 表格展示
    $scope.replydialog.reply = TaskService.getPlainReply();


    $scope.replydialog.execute = function() {
        var selecteds = [];
        $scope.replydialog.hide();
        if ($scope.replydialog.handler instanceof Function) {
            $scope.replydialog.handler($scope.replydialog.reply);
        }
    };

    $scope.replydialog.hide = function(opts) {
      $('#ecgReplyDialog').modal('hide');
    };

    $scope.replydialog.show = function(opts) {
      var opts = opts || {};
      $scope.replydialog.handler = opts.handler;
      $('#ecgReplyDialog').modal('show');
    };

}])
.directive("ecgReplyDialog", [ '$location', function($location) {
    return {
        restrict : 'A',
        replace : false,
        template : dialogTemplate,
        controller : "ReplyDialogController",
        link : function($scope, $element, $attrs) {
        }
    };
}]);

});

/*
设备类型  指标编号  指标名称  正常下限  正常上限  指标说明
11  1 舒张压 60  89  血压的舒张压（毫米汞柱）
11  2 收缩压 89  139 血压的收缩压（毫米汞柱）
11  3 心率  60  100 次/分钟
11  4 血氧饱和度 94  100 百分比
11  5 呼吸  16  20  次/分钟
11  6 体温  36  37  ℃（腋下温度）
11  7 脉率  60  100 次/分钟

10-手机（内置检测硬件的手机）
设备类型  指标编号  指标名称  正常下限  正常上限  指标说明
10  3 心率  60  100 次/分钟
10  6 体温  36  37  ℃（腋下温度）

*/