'use strict';
define(function(require, exports) {

var ruleListTemp = require("../templates/list.html");

angular.module('ecgRuleModules', [])
.controller('RuleController', ['$scope', '$timeout', '$location', 'RuleService', function ($scope, $timeout, $location, RuleService) {
    // 表格头
    $scope.subheader.title = "规则设置";

    // 命名空间
    $scope.rule = {};

}])
.controller('RuleListController', ['$scope', '$timeout', '$location', 'RuleService', function ($scope, $timeout, $location, RuleService) {

    if (!$scope.rule) {
        $scope.rule = {};
    }
    // 当前选择的item
    $scope.rule.selectedItem = null;

    // 规则数据
    $scope.rule.rules = null;
    $scope.rule.sysRules = null;
    $scope.rule.customRules = null;

    // 初始化及刷新功能
    function filteredRules() {
        var sysRules = [], customRules = [], user = $scope.session.user,
            isAdmin = user.isAdmin(), isChief = user.isChief();
        $($scope.rule.rules).each(function(i, rule) {
            rule.editable = false;

            if (rule.employeeId === null) {
                sysRules.push(rule);
            } else {
                if (isAdmin || isChief) {
                    customRules.push(rule);
                } else if (rule.employeeId === user.id) {
                    customRules.push(rule);
                }
            }

            if (isAdmin || isChief) {
                rule.editable = true;
            } else if (rule.employeeId === user.id) {
                rule.editable = true;
            }
        });
        $scope.rule.sysRules = sysRules;
        $scope.rule.customRules = customRules;
    };

    function refreshGrid() {
        RuleService.queryAllGroup().then(function(rules) {
            $scope.rule.rules = rules;
            filteredRules();
        }, function() {
            $scope.message.error("无法加载规则数据!");
        });
    };
    refreshGrid();

    // 编辑功能
    $scope.rule.showPage = function(item) {
        if (!item.editable) { return; }
        $location.path("rule/" + item.id);
    };

    // edit config
    $scope.rule.editReplyConfig = function(item) {
        $location.path("rule/" + item.id + "/replyconfig");
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

                var count = 0, len = 0;
                RuleService.queryAll({code: selectedReplyConfig.code, usage: 'filter'})
                .then(function(filters) {
                    len = filters.length;
                    $(filters).each(function(i, filter) {
                        RuleService.remove(filter.id)
                        .then(function() {
                            count++;
                        }, function() {
                            $scope.dialog.hideStandby();
                            $scope.message.error("无法删除该规则下的检测区间!");
                        });
                    });
                })
                .then(function() {
                    $scope.dialog.hideStandby();
                    RuleService.remove(selectedReplyConfig.id)
                    .then(function() {
                        $scope.rule.selectedItem = null;
                        $scope.message.success("删除规则成功!");
                        // 刷新
                        refreshGrid();
                    }, function() {
                        $scope.dialog.hideStandby();
                        $scope.message.error("无法删除该规则,可能是您的权限不足,请联系管理员!");
                    });
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
.directive("ecgRuleList", [ '$location', function($location) {
    return {
        restrict : 'A',
        replace : false,
        template : ruleListTemp,
        controller : "RuleListController",
        link : function($scope, $element, $attrs) {
        }
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

    // session user
    var user = null;
    $scope.$watch("session.user" , function() {
        user = $scope.session.user;
        if (!user.isAdmin() && !user.isChief()) {
            $scope.rule.newobj.employeeId = user.id;
        }
    });

    // 测试系统级别rule唯一性
    $scope.rule.checkUnique = function() {
        if (!$scope.rule.newobj.code) { return; }
        if (!user.isAdmin() && !user.isChief()) { return; }

        RuleService.queryAll({
            code: $scope.rule.newobj.code,
            usage: 'group', 
            employeeId: null
        }).then(function(rules) {
            if (rules.length > 0) { 
                $scope.rule.isUnique = false;
                $scope.message.warn("指标编码为" + $scope.rule.newobj.code + "的系统规则已存在!");
            } else {
                $scope.rule.isUnique = true;
            }
        }, function() {
            $scope.rule.isUnique = true;
            $scope.message.warn("查询系统规则是否唯一时出错!");
        });
    };

    // 创建函数
    $scope.rule.create = function() {
        if (parseFloat($scope.rule.newobj.min) > parseFloat($scope.rule.newobj.max)) {
            $scope.message.warn("区间范围异常,无法保存。");
            return;
        }

        $scope.dialog.showStandby();
        RuleService.create($scope.rule.newobj)
        .then(function(result) {
            $scope.dialog.hideStandby();
            if (result) {
                $scope.message.success("新增规则成功!");
            } else {
                $scope.message.error("新增规则失败!");
            }
            $location.path("/rule");
        }, function() {
            $scope.dialog.hideStandby();
            $scope.message.error("服务器异常,新增失败!");
        });
    };

}])
.controller('RuleEditController', ['$scope', '$routeParams', 'RuleService', function ($scope, $routeParams, RuleService) {
    // 表格头
    $scope.subheader.title = "编辑规则";

    // 命名空间
    $scope.rule = {};

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

    // 创建函数
    $scope.rule.update = function() {
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
        });
    };

}])
.controller('ReplyConfigController', 
    ['$scope', '$routeParams', 'EnumService', 'RuleService', 'ReplyConfigService', 
    function ($scope, $routeParams, EnumService, RuleService, ReplyConfigService) {
    // 表格头
    $scope.subheader.title = "规则设置-设置该条规则的默认回复";

    // 命名空间
    $scope.replyconfig = {};

    // 是否只读
    $scope.replyconfig.editable = false;
    $scope.$watch("session.user", function() {
        var user = $scope.session.user;
        if (!user.isAdmin) { return; }
        if (user.isAdmin() || user.isChief()) {
            $scope.replyconfig.editable = true;
        }
    });
    
    // 数据范围
    $scope.replyconfig.rules = null; 

    // level名称
    $scope.replyconfig.getLevelLabel = EnumService.getLevelLabel;

    function initFilterRules(rule) {
        var len = 3, count = 0, newobjs = [], groupId = rule.id, low, mid, high;

        delete rule.id;

        low = $.extend({}, rule);
        low.max =low.min;
        low.min = -9999;
        low.usage = "filter";
        low.level = 'outside';
        low.groupId = groupId;
        newobjs.push(low);

        mid = $.extend({}, rule);
        mid.usage = "filter";
        mid.groupId = groupId;
        newobjs.push(mid);

        high = $.extend({}, rule);
        high.min =high.max;
        high.max = 9999;
        high.usage = "filter";
        high.level = 'outside';
        high.groupId = groupId;
        newobjs.push(high);

        $scope.dialog.showStandby({text: '创建初始化检测区间，请稍候......'});
        $(newobjs).each(function(i, newobj) {
            RuleService.create(newobj)
            .then(function(result) {
                $scope.dialog.hideStandby();
                if (result) {
                    count++;
                } else {
                    $scope.message.error("创建初始化检测区间失败!");
                }
                if (len === count) {
                    $scope.dialog.hideStandby();
                    $scope.message.success("创建初始化检测区间成功!");
                    refreshRules();
                }
            }, function() {
                $scope.dialog.hideStandby();
                $scope.message.error("服务器异常，创建初始化检测区间失败!");
            });
        });
    };

    function renderFilterRules(rules) {
        var min = 999999, max = -999999, range = 100;
        $(rules).each(function(i, rule) {
            if (rule.level !== 'outside') {
                rule.min = parseFloat(rule.min);
                rule.max = parseFloat(rule.max);
                if (rule.min < min) {
                    min = rule.min;
                }
                if (rule.max > max) {
                    max = rule.max;
                }
            }
        });
        range = max - min;
        $(rules).each(function(i, rule) {
            if (rule.min === -9999 || rule.max === 9999) {
                rule.percent = '5';
            } else {
                rule.percent = (rule.max - rule.min) / range * 90;
            }
            rule.replyconfigs = [];
            refreshReplyConfigs(rule, i);
        });

        rules.sort(function(a, b) {
            return a.min > b.min ? 1 : -1;
        });

        $(rules).each(function(i, rule) {
            rule.arrayIdx = i;
        });

        $scope.replyconfig.rules = rules;
    };

    function refreshRules() {
        reset();
        $scope.dialog.showStandby({text: '正在加载数据，请稍候......'});
        RuleService.get($routeParams.id)
        .then(function(rule) {
             // 是否readonly
            var user = $scope.session.user;
            $scope.replyconfig.editable = rule.employeeId == user.id;
            if (user.isAdmin() || user.isChief()) {
                $scope.replyconfig.editable = true;
            }

            // 查询该组rule
            RuleService.queryAllFiltersByGroup($routeParams.id)
            .then(function(rules) {
                // 初始化检测区间
                $scope.dialog.hideStandby();
                if (rules.length === 0) {
                    initFilterRules(rule);
                } else {
                    renderFilterRules(rules);
                }
            }, function () {
                $scope.dialog.hideStandby();
                $scope.message.error("加载区间失败!");
            });
        });
    };
    refreshRules();

    // 初始化/更新回复
    function refreshReplyConfigs(rule, i) {
        ReplyConfigService.queryAllbyRule(rule).then(function(replyconfigs) {
            rule.replyconfigs = replyconfigs;
            if (i === 0) {
                $scope.replyconfig.selectedRule = rule;
            }
        });
    };

    // 当前选择中config
    $scope.replyconfig.selectedRule = null;
    $scope.replyconfig.selectedReplyConfig = ReplyConfigService.getPlainObject();

    // 是否显示某个label的区间
    $scope.replyconfig.getRuleText = function(rule) {
        return rule.level === 'outside' ? '' : rule.min + ' - ' + rule.max;
    };

    // 选择某个config
    $scope.replyconfig.onselectrule = function(rule) {
        $scope.replyconfig.newobj = {};
        $scope.replyconfig.selectedRule = rule;
        reset();
    };

    // 选择某个config
    $scope.replyconfig.onselectconfig = function(config) {
        $scope.replyconfig.selectedReplyConfig = config;
    };

    // 新区间
    $scope.replyconfig.newRule = function() {
        var point = parseFloat(prompt("请输入1-1000之间的数字:"), 10);
        if (isNaN(point)) {
            return;
        }

        if (!angular.isNumber(point)) {
            $scope.message.warn("请输入数字!");
            return;
        }

        if (point < 1 || point > 1000) {
            $scope.message.warn("只能输入1-1000之间的数字!");
            return;
        }

        var updateobj = null, newobj;
        $($scope.replyconfig.rules).each(function(i, rule) {
            if (rule.min !== -9999 && rule.max !== 9999) {
                if (rule.min < point && point < rule.max) {
                    updateobj = rule;
                    newobj = $.extend({}, rule);
                }
            }
        });

        if (updateobj) {
            updateobj.max = point;
            newobj.min = point;
            delete newobj.id;
            $scope.dialog.showStandby();
            RuleService.update(updateobj)
            .then(function() {
                RuleService.create(newobj)
                .then(function(flag) {
                    if (flag) {
                        $scope.dialog.hideStandby();
                        $scope.message.success("新增区间成功!");
                        refreshRules();
                    } else {
                        $scope.dialog.hideStandby();
                        $scope.message.error("新增区间失败!");
                    }
                }, function() {
                    $scope.dialog.hideStandby();
                    $scope.message.error("新增区间失败!");
                });
            }, function() {
                $scope.dialog.hideStandby();
                $scope.message.error("修改已有区间失败!");
            });
        } else {
            $scope.message.warn("该点已存在或超出可填范围!");
        }
    };
    
    // 修改level 
    $scope.replyconfig.setLevel = function(level) {
        if (!$scope.replyconfig.editable) { return; }
        if ($scope.replyconfig.selectedRule.level === level) { return; }
        $scope.replyconfig.selectedRule.level = level;
        $scope.dialog.showStandby();
        RuleService.update($scope.replyconfig.selectedRule)
        .then(function() {
            $scope.dialog.hideStandby();
            $scope.message.success("修改级别成功!");
        }, function() {
            $scope.dialog.hideStandby();
            $scope.message.error("修改级别失败!");
            refreshRules();
        });
    };

    // 删除区间
    $scope.replyconfig.confirmDeleteRule = function() {
        var selectedItem = $scope.replyconfig.selectedRule;
        if (selectedItem === null) {
            $scope.dialog.alert({
                text: '请选择一个区间!'
            });
            return;
        }
        if ($scope.replyconfig.rules.length === 3) {
            $scope.dialog.alert({
                text: '至少保留一个区间!'
            });
            return;
        }
        $scope.dialog.confirm({
            text: "请确认删除区间[" + selectedItem.min + "," + selectedItem.max + ")及其相关预设回复, 该操作无法恢复!",
            handler: function() {
                var updateobj;
                if (selectedItem.arrayIdx === 0) {
                    updateobj = $scope.replyconfig.rules[1];
                    updateobj.min = selectedItem.min;
                } else {
                    updateobj = $scope.replyconfig.rules[selectedItem.arrayIdx - 1];
                    updateobj.max = selectedItem.max;
                }
                $scope.dialog.showStandby();
                RuleService.update(updateobj).then(function() {
                    RuleService.remove(selectedItem.id)
                    .then(function() {
                        $scope.dialog.hideStandby();
                        $scope.message.success("删除区间成功!");
                        /// 刷新
                        refreshRules();
                    }, function() {
                        $scope.dialog.hideStandby();
                        $scope.message.error("无法删除该数据,可能是您的权限不足,请联系管理员!");
                        // 刷新
                        refreshRules();
                    });
                }, function() {
                    $scope.message.error("更新相邻区间失败!");
                    // 刷新
                    refreshRules();
                });
                
            }
        });
    };

    // 新增/更新回复
    $scope.replyconfig.save = function() {
        if ($scope.replyconfig.selectedReplyConfig.id) {
            $scope.dialog.showStandby();
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
            $scope.dialog.showStandby();
            ReplyConfigService.create($scope.replyconfig.selectedRule, $scope.replyconfig.selectedReplyConfig)
            .then(function(flag) {
                $scope.dialog.hideStandby();
                if (flag) {
                    $scope.message.success("新增回复设置成功!");
                    reset();
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
    function reset() {
        $scope.replyconfig.selectedReplyConfig = ReplyConfigService.getPlainObject();
    }

    $scope.replyconfig.reset = function() {
        refreshReplyConfigs($scope.replyconfig.selectedRule);
        reset();
    };

    // 删除某条回复
    $scope.replyconfig.remove = function(deletedItem) {
        $scope.dialog.confirm({
            text: "请确认删除, 该操作无法恢复!",
            handler: function() {
                reset();
                $scope.dialog.showStandby();
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

    // 是否显示新增或者修改界面
    $scope.replyconfig.showForm = function() {
        var flag = false;
        if ($scope.replyconfig.selectedRule) {
            if ($scope.replyconfig.selectedReplyConfig.id) {
                flag = true;
            }
            if ($scope.replyconfig.selectedRule.replyconfigs.length < 1) {
                flag = true;
            }
        }
        flag = flag && $scope.replyconfig.editable;
        return flag;
    };

}]);


});