'use strict';
define(function(require, exports) {

angular.module('ecgRuleModules', [])
.controller('RuleController', ['$scope', '$timeout', '$location', 'RuleService', function ($scope, $timeout, $location, RuleService) {
    // 表格头
    $scope.subheader.title = "规则设置";

    // 命名空间
    $scope.rule = {};

    // 当前选择的item
    $scope.rule.selectedItem = null;

    // 规则数据
    $scope.rule.data = null;

    // 初始化及刷新功能
    function refreshGrid() {
        $scope.rule.data = RuleService.queryAll({usage: 'filter'});
    };
    refreshGrid();

    // save
    $scope.rule.save = function() {
        var length = $scope.rule.data.$$v.length, count = 0, editable = true;
        $($scope.rule.data.$$v).each(function(i, rule) {
            if (rule.min > rule.max) {
                $scope.message.warn("规则:" + rule.name + '区间范围异常,无法保存。');
                editable = false;
            }
        });

        if (!editable) { return; }

        $($scope.rule.data.$$v).each(function(i, rule) {
            $scope.dialog.showStandby();
            RuleService.update(rule)
            .then(function() {  
                $scope.dialog.hideStandby();
                count ++;
                if (count === length) {
                    $scope.message.success("快速保存区间成功!");
                    // 刷新
                    refreshGrid();
                }
            }, function() {
                $scope.dialog.hideStandby();
                $scope.message.success("快速保存区间失败!");
            });
        });
    };

    // 编辑功能
    $scope.rule.showPage = function(item) {
        $location.path("rule/" + item.id);
    };

    // edit config
    $scope.rule.editReplyConfig = function(item) {
        $location.path("rule/" + item.code + "/replyconfig");
    };

    // 删除功能
    $scope.rule.confirmDelete = function() {
        var selectedReplyConfig = $scope.rule.selectedItem;
        if (selectedReplyConfig === null) {
            $scope.dialog.alert({
                text: '请选择一条记录!'
            });
            return;
        }
        $scope.dialog.confirm({
            text: "请确认删除[" + selectedReplyConfig.name + "]的规则, 该操作无法恢复!",
            handler: function() {
                $scope.dialog.showStandby();
                RuleService.remove(selectedReplyConfig.id)
                .then(function() {
                    $scope.dialog.hideStandby();
                    $scope.rule.selectedItem = null;
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

    // 设置上下限,主要是为了清除selectedItem
    $scope.rule.setRange = function(item, range, value) {
        item[range] = value;
        $timeout(function() {
            $scope.rule.selectedItem = null;
        }, 0);
    };
}])
.controller('RuleNewController', ['$scope', '$location', 'RuleService', function ($scope, $location, RuleService) {
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
        RuleService.queryAll({code: $scope.rule.newobj.code, usage: 'filter'}).then(function(rules) {
            if (rules.length > 0) { 
                $scope.rule.isUnique = false;
                $scope.message.warn("指标编码为" + $scope.rule.newobj.code + "的规则已存在!");
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
        if ($scope.rule.newobj.min > $scope.rule.newobj.max) {
            $scope.message.warn("区间范围异常,无法保存。");
            return;
        }

        $scope.dialog.showStandby();
        RuleService.create($scope.rule.newobj)
        .then(function(result) {
            $scope.dialog.hideStandby();
            if (result) {
                $scope.message.success("新增规则成功!");
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
.controller('RuleEditController', ['$scope', '$routeParams', 'RuleService', function ($scope, $routeParams, RuleService) {
    // 表格头
    $scope.subheader.title = "编辑规则";

    // 命名空间
    $scope.rule = {};

    // 规则是否唯一
    $scope.rule.isUnique = true;

    // 当前编辑的item
    $scope.rule.updateobj = null;
        // 初始化界面,并获得最新version
    function refresh() {
        RuleService.get($routeParams.id).then(function(rule) {
            $scope.rule.updateobj = rule;
        }, function() {
            $scope.message.error("加载规则数据失败.");
        });
    };
    refresh();

    // 测试rule唯一性
    $scope.rule.checkUnique = function() {
        if (!$scope.rule.updateobj.code) { return; }
        RuleService.queryAll({code: $scope.rule.updateobj.code, usage: 'filter'}).then(function(rules) {
            if (rules.length > 0) { 
                $scope.rule.isUnique = false;
                $scope.message.warn("指标编码为" + $scope.rule.updateobj.code + "的规则已存在!");
            } else {
                $scope.rule.isUnique = true;
            }
        }, function() {
            $scope.rule.isUnique = true;
            $scope.message.warn("查询规则是否唯一时出错!");
        });
    };

    // 创建函数
    $scope.rule.update = function() {
        if ($scope.rule.updateobj.min > $scope.rule.updateobj.max) {
            $scope.message.warn("区间范围异常,无法保存。");
            return;
        }
        
        $scope.dialog.showStandby();
        RuleService.update($scope.rule.updateobj)
        .then(function(result) {
            $scope.dialog.hideStandby();
            if (result) {
                $scope.message.success("编辑规则成功!");
                refresh();
            } else {
                $scope.message.error("编辑规则失败!");
            }
        }, function() {
            $scope.dialog.hideStandby();
            $scope.message.error("服务器异常,编辑规则失败!");
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
        console.info(replyconfig);
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
                    min = rule.min;
                }
                if (rule.max > max) {
                    max = rule.max;
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
                $scope.replyconfig.reset();
                ReplyConfigService.remove($scope.replyconfig.selectedRule, deletedItem.id)
                .then(function() {
                    $scope.dialog.hideStandby();
                    $scope.message.success("删除成功!");
                    // 刷新
                    refreshReplyConfigs($scope.replyconfig.selectedRule);
                }, function() {
                    $scope.dialog.hideStandby();
                    $scope.message.error("无法删除该数据,可能是您的权限不足,请联系管理员!");
                });
            }
        });
    };

}]);


});