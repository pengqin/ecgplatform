define(function(require, exports) {
  var dialogTempalte = require("../templates/replyform.html");

  'use strict';
  
  angular.module('ecgReplyForm', [])
  .controller('ReplyFormController', 
  ['$scope', 'EnumService', 'TaskService', 'RuleService', 'ReplyConfigService',
   function ($scope, EnumService, TaskService, RuleService, ReplyConfigService) {
  	$scope.replyform = {};

    // 预设变量
    $scope.replyform.replys = [];
    $scope.replyform.rules = [];
    $scope.replyform.reply = TaskService.getPlainReply();
    $scope.replyform.mannual = false;

    function reset() {
      $scope.replyform.replys = [];
      $scope.replyform.rules = [];
      $scope.replyform.reply = TaskService.getPlainReply();
      $scope.replyform.mannual = false;
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
                            $scope.replyform.replys.push(rule.replyconfig);
                        }
                    });
                }
            });
        }, function() {
            $scope.replyform.rules = null;
        });
    };

     // 监听未完成
     $scope.$watch("todo.current.examination", function() {
         if (!$scope.todo) { return; }
         if (!$scope.todo.current) { return; }
         if (!$scope.todo.current.examination) { return; }
         if ($scope.todo.current.examination) {
             loadRules();
         }
     });
    

    // 保存人工回复
    $scope.replyform.addManual = function() {
      $scope.replyform.replys.push($scope.replyform.reply);
      $scope.replyform.cancelManual();
    };

    // 保存人工回复
    $scope.replyform.cancelManual = function() {
      $scope.replyform.reply = TaskService.getPlainReply();
      $scope.replyform.mannual = false;
    };

    $scope.replyform.submitReplies = function () {
        var len = $scope.replyform.replys.length, count = 0;
        $scope.dialog.showStandby();
        $($scope.replyform.replys).each(function(i, reply) {
            TaskService.reply($scope.todo.current.examination, reply)
            .then(function(flag) {
                $scope.dialog.hideStandby();
                if (flag) {
                    count++;
                } else {
                    $scope.message.error("无法处理该条记录，请联系管理员!");
                }
                if (count === len) {
                    $scope.message.success("该检测请求已处理完毕，如需查询，请点击菜单已办工作!");
                    $scope.todo.current = null;
                    // 刷新
                    window.location.reload();
                }
            }, function() {
                $scope.dialog.hideStandby();
                $scope.message.error("无法处理该条记录，请联系管理员!");
            });
        });
    }

  }])
  .directive("ecgReplyForm", ['$location', function ($location) {
    return {
      restrict: 'A',
      replace: false,
      template: dialogTempalte,
      controller: "ReplyFormController",
      link: function ($scope, $element, $attrs) {
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