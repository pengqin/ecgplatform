define(function(require, exports) {
  var dialogTempalte = require("../templates/replydialog.html");

  'use strict';
  
  angular.module('ecgReplyDialog', [])
  .controller('ReplyDialogController', 
  ['$scope', 'EnumService', 'TaskService', 'RuleService', 'ReplyConfigService',
   function ($scope, EnumService, TaskService, RuleService, ReplyConfigService) {
  	$scope.replydialog = {};

    // 预设变量
    $scope.replydialog.replys = [];
    $scope.replydialog.tab = 1;
    $scope.replydialog.rules = null;
    $scope.replydialog.norules = false;
    $scope.replydialog.reply = TaskService.getPlainReply();

    function reset() {
      $scope.replydialog.replys = [];
      $scope.replydialog.tab = 1;
      $scope.replydialog.rules = null;
      $scope.replydialog.norules = false;
      $scope.replydialog.reply = TaskService.getPlainReply();
    };

    // 删除已选回复
    $scope.replydialog.remove = function(idx) {
      var reply = $scope.replydialog.replys[idx];
      if (reply && reply.rule) {
        reply.rule.used = false;
      }
      $scope.replydialog.replys.splice(idx, 1);
    };

    // 使用某个预设回复
    $scope.replydialog.usereply = function(rule) {
      if (rule.used) { return; }
      rule.used = true;
      $scope.replydialog.replys.push({
        result: rule.replyconfig.result,
        content: rule.replyconfig.content,
        rule: rule
      });
    };

    // 使用全部预设回复
    $scope.replydialog.useallreply = function(rule) {
      $($scope.replydialog.rules).each(function(i, rule) {
        $scope.replydialog.usereply(rule);
      });
    };
    
    // 保存人工回复
    $scope.replydialog.save = function() {
      $scope.replydialog.replys.push($scope.replydialog.reply);
      $scope.replydialog.reply = TaskService.getPlainReply();
    };

    // 提交回复
  	$scope.replydialog.execute = function() {
  		if ($scope.replydialog.handler instanceof Function) {
  			$scope.replydialog.handler($scope.replydialog.replys);
  		}
  	};

    // 加载预设回复
    function loadRules() {
        var codes = EnumService.getCodes(),
            examination = $scope.replydialog.examination;
        RuleService.queryAll({usage: 'filter'}).then(function(rules) {
            $(rules).each(function(i, rule) {
                var val = parseFloat(examination[codes[rule.code].col]),
                    min = parseFloat(rule.min),
                    max = parseFloat(rule.max);
                if (codes[rule.code] && min <= val && val < max) {
                    if (!$scope.replydialog.rules) {
                      $scope.replydialog.rules = [];
                    }
                    rule.val = val;
                    ReplyConfigService.queryAllbyRule(rule)
                    .then(function(replyconfigs) {
                        if (replyconfigs.length > 0) {
                            rule.replyconfig = replyconfigs[0];
                            $scope.replydialog.rules.push(rule);
                        }
                    });
                }
            });
        }, function() {
            $scope.replydialog.rules = null;
        });
    };

    $scope.replydialog.hide = function(opts) {
      $('#ecgReplyDialog').modal('hide');
    };

    $scope.replydialog.show = function(opts) {
      var opts = opts || {};
      $scope.replydialog.examination = opts.examination;
      $scope.replydialog.handler = opts.handler;
      reset();
      $('#ecgReplyDialog').modal('show');
      loadRules();
    };

  }])
  .directive("ecgReplyDialog", ['$location', function ($location) {
    return {
      restrict: 'A',
      replace: true,
      template: dialogTempalte,
      controller: "ReplyDialogController",
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