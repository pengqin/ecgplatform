'use strict';
define(function(require, exports) {

angular.module('ecgRuleModules', [])
.controller('RuleController', ['$scope', '$location', 'RuleService', function ($scope, $location, RuleService) {
    // 表格头
    $scope.subheader.title = "规则设置";

    // 命名空间
    $scope.rule = {};

    // 当前选择的item
    $scope.rule.selectedReplyConfig = null;

    // 规则数据
    $scope.rule.data = null;

    // 初始化及刷新功能
    function refreshGrid() {
        $scope.rule.data = RuleService.queryAll({usage: 'filter'});
    };
    refreshGrid();

    // create
    $scope.rule.save = function() {
        // TODO:
        $($scope.rule.data.$$v).each(function(i, rule) {
            $scope.dialog.showStandby();
            RuleService.update(rule)
            .then(function() {
                $scope.dialog.hideStandby();
                rule.version += 1;
            }, function() {
                $scope.dialog.hideStandby();
            });
        });
    };

    // edit config
    $scope.rule.editReplyConfig = function(item) {
        $location.path("rule/" + item.code + "/replyconfig");
    };

    // 删除功能
    $scope.rule.confirmDelete = function() {
        var selectedReplyConfig = $scope.rule.selectedReplyConfig;
        if (selectedReplyConfig === null) {
            $scope.dialog.alert({
                text: '请选择一条记录!'
            });
            return;
        }
        $scope.dialog.confirm({
            text: "请确认删除针对指标[" + selectedReplyConfig.name + "]的规则, 该操作无法恢复!",
            handler: function() {
                $scope.dialog.showStandby();
                RuleService.remove(selectedReplyConfig.id)
                .then(function() {
                    $scope.dialog.hideStandby();
                    $scope.rule.selectedReplyConfig = null;
                    $scope.message.success("删除成功!");
                    // 刷新
                    refreshGrid();
                }, function() {
                    $scope.dialog.hideStandby();
                    $scope.message.error("无法删除该数据,可能是您的权限不足,请联系管理员!");
                });
            }
        });
    };
}])
.controller('RuleNewController', ['$scope', 'RuleService', function ($scope, RuleService) {
    // 表格头
    $scope.subheader.title = "新增规则";

    // 命名空间
    $scope.rule = {};

    // 规则是否唯一
    $scope.rule.isUnique = true;

    // 当前选择的item
    $scope.rule.newobj = RuleService.getPlainObject();

    // 测试rule唯一性
    $scope.rule.checkUnique = function() {
        if (!$scope.rule.newobj.code) { return; }
        RuleService.queryAll({code: $scope.rule.newobj.code}).then(function(rules) {
            if (rules.length > 0) { 
                $scope.rule.isUnique = false;
                $scope.message.warn("指标编码为" + $scope.rule.newobj.username + "的规则已存在!");
            } else {
                $scope.rule.isUnique = true;
            }
        }, function() {
            $scope.rule.isUnique = true;
            $scope.message.warn("查询规则是否唯一时出错!");
        });
    };

    // 创建函数
    $scope.rule.create = function() {
        $scope.dialog.showStandby();
        RuleService.create($scope.rule.newobj)
        .then(function(result) {
            $scope.dialog.hideStandby();
            if (result) {
                $scope.message.success("新增规则户成功!");
                $location.path("/rule");
            } else {
                $scope.message.error("新增规则失败!");
            }
        }, function() {
            $scope.dialog.hideStandby();
            $scope.message.error("服务器异常,新增失败!");
        });;
    };

}])
.controller('ReplyConfigController', 
    ['$scope', '$routeParams', 'EnumService', 'RuleService', 'ReplyConfigService', 
    function ($scope, $routeParams, EnumService, RuleService, ReplyConfigService) {
    // 表格头
    $scope.subheader.title = "规则设置-设置该条规则的默认回复";

    // 命名空间
    $scope.replyconfig = {};

    // 回复类型
    $scope.replyconfig.results = EnumService.getResults();
    $scope.replyconfig.getResultLabel = function(replyconfig) {
        return EnumService.getResultsLabel(replyconfig.result);
    };

    // 初始化/更新回复
    function refreshReplyConfigs(rule, i) {
        ReplyConfigService.queryAllbyRule(rule).then(function(replyconfigs) {
            rule.replyconfigs = replyconfigs;
            if (i === 0) {
                $scope.replyconfig.selectedRule = rule;
            }
        });
    };

    // 数据范围
    $scope.replyconfig.rules = 
        RuleService.queryAll({code: $routeParams.code, usage: 'reply'})
        .then(function(rules) {
            var min = 999999, max = -999999, range = 100;
            $(rules).each(function(i, rule) {
                if (rule.min < min) {
                    min = rule.min
                }
                if (rule.max > max) {
                    max = rule.max
                }
            });
            range = max - min;
            $(rules).each(function(i, rule) {
                rule.percent = (rule.max - rule.min + 0.64) / range * 100;
                rule.replyconfigs = [];
                refreshReplyConfigs(rule, i);
            });
            return rules;
        });


    // 当前选择中config
    $scope.replyconfig.selectedRule = null;
    $scope.replyconfig.selectedReplyConfig = ReplyConfigService.getPlainObject();

    // 选择某个config
    $scope.replyconfig.onselectrule = function(rule) {
        $scope.replyconfig.newobj = {};
        $scope.replyconfig.selectedRule = rule;
        $scope.replyconfig.reset();
    };

    // 选择某个config
    $scope.replyconfig.onselectconfig = function(config) {
        $scope.replyconfig.selectedReplyConfig = config;
    };

    // 新增/更新回复
    $scope.replyconfig.save = function() {
        if ($scope.replyconfig.selectedReplyConfig.id) {
            ReplyConfigService.update($scope.replyconfig.selectedRule, $scope.replyconfig.selectedReplyConfig)
            .then(function() {
                $scope.dialog.hideStandby();
                $scope.chief.selectedReplyConfig = null;
                $scope.message.success("更新回复设置成功!");
                refreshReplyConfigs($scope.replyconfig.selectedRule);
            }, function() {
                $scope.dialog.hideStandby();
                $scope.message.error("无法新增,可能是您的权限不足,请联系管理员!");
            });
        } else {
            ReplyConfigService.create($scope.replyconfig.selectedRule, $scope.replyconfig.selectedReplyConfig)
            .then(function(flag) {
                $scope.dialog.hideStandby();
                if (flag) {
                    $scope.chief.selectedReplyConfig = null;
                    $scope.message.success("新增回复设置成功!");
                    $scope.replyconfig.reset();
                    refreshReplyConfigs($scope.replyconfig.selectedRule);
                } else {
                    $scope.message.error("无法新增回复设置!");
                }
            }, function() {
                $scope.dialog.hideStandby();
                $scope.message.error("无法新增,可能是您的权限不足,请联系管理员!");
            });
        }
        
    };

    // reset
    $scope.replyconfig.reset = function() {
        $scope.replyconfig.selectedReplyConfig = ReplyConfigService.getPlainObject();
    };

    // 删除某条回复
    $scope.replyconfig.remove = function(deletedItem) {
        $scope.dialog.confirm({
            text: "请确认删除, 该操作无法恢复!",
            handler: function() {
                ReplyConfigService.remove($scope.replyconfig.selectedRule, deletedItem.id)
                .then(function() {
                    $scope.dialog.hideStandby();
                    $scope.chief.selectedReplyConfig = null;
                    $scope.message.success("删除成功!");
                    // 刷新
                    refreshGrid();
                }, function() {
                    $scope.dialog.hideStandby();
                    $scope.message.error("无法删除该数据,可能是您的权限不足,请联系管理员!");
                });
            }
        });
    };

}]);


});