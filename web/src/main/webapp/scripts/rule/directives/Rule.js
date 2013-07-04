'use strict';
define(function(require, exports) {

angular.module('ecgRuleModules', [])
.controller('RuleConfigController', ['$scope', 'RuleService', function ($scope, RuleService) {
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

    // 删除功能
    $scope.rule.confirmDelete = function() {
        var selectedItem = $scope.rule.selectedItem;
        if (selectedItem === null) {
            $scope.dialog.alert({
                text: '请选择一条记录!'
            });
            return;
        }
        $scope.dialog.confirm({
            text: "请确认删除针对指标[" + selectedItem.name + "]的规则, 该操作无法恢复!",
            handler: function() {
                $scope.dialog.showStandby();
                RuleService.remove(selectedItem.id)
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

}]);


});