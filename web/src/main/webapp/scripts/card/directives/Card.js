'use strict';
define(function(require, exports) {

angular.module('ecgCardDirectives', [])
.controller('CardUploadController', ['$scope', '$filter', '$location', 'EnumService', 'CardService', function ($scope, $filter, $location, EnumService, CardService) {
    // 表格头
    $scope.subheader.title = "上传卡号";

    // 命名空间
    $scope.card = {};

}])
.controller('CardQueryController', ['$scope', '$timeout', '$location', 'EnumService', 'CardService',
    function ($scope, $timeout, $location, EnumService, CardService) {
    $scope.subheader.title = "查询卡号";

    $scope.card = {};

    $scope.card.viewobj = {};

    $scope.card.query = function() {
        $scope.dialog.showLoading();
        CardService.get($scope.card.viewobj)
        .then(function(card) {
            $scope.dialog.hideStandby();
            if (card) {
                $scope.card.viewobj = card;
            } else {
                $scope.card.viewobj = {serial: "error card", chargedDate: "some day"};
                $scope.message.error("没有该卡号，如需帮助，请联系管理员!");
            }
        }, function() {
            $scope.dialog.hideStandby();
            $scope.card.viewobj = {serial: "error card", chargedDate: "some day"};
            $scope.message.error("没有该卡号，如需帮助，请联系管理员!");
        });
    };

    $scope.card.reset = function() {
        $scope.card.viewobj = {};
    };
}])
.controller('CardHistoryController', ['$scope', '$filter', '$routeParams', '$timeout', '$location', 'EnumService', 'CardService',
    function ($scope, $filter, $routeParams, $timeout, $location, EnumService, CardService) {
    $scope.subheader.title = "充值历史";

    // 命名空间
    $scope.card = {};

    // 表格展示
    $scope.card.data = null;
    $scope.card.filteredData = null;

    // 刷新功能
    function refreshGrid() {
        $scope.dialog.showLoading();
        CardService.queryAll().then(function(cards) {
            $scope.dialog.hideStandby();
            $scope.card.data = cards;
            $scope.card.filteredData = $scope.card.data;
        }, function() {
            $scope.dialog.hideStandby();
            $scope.message.error("无法加载充值历史!");
        });
    }
    refreshGrid();

    // 过滤功能
    $scope.card.queryChanged = function(query) {
        return $scope.card.filteredData = $filter("filter")($scope.card.data, query);
    };

    $scope.card.refresh = refreshGrid;
}])
.controller('CardChargeController', ['$scope', '$routeParams', '$timeout', '$location', 'EnumService', 'CardService',
    function ($scope, $routeParams, $timeout, $location, EnumService, CardService) {
    $scope.subheader.title = "在线充值";

    // 命名空间
    $scope.card = {};

    $scope.card.chargeinfo = {};

    $('#card-startdate').datetimepicker({
        format: "yyyy-MM-dd",
        language: "zh-CN",
        pickTime: false,
    }).on('changeDate', function(e) {
        $scope.card.chargeinfo.startdate = $('#card-startdate input').val();
        $scope.$apply();
    });

    $('#card-enddate').datetimepicker({
        format: "yyyy-MM-dd",
        language: "zh-CN",
        pickTime: false,
    }).on('changeDate', function(e) {
        $scope.card.chargeinfo.enddate = $('#card-enddate input').val();
        $scope.$apply();
    });

    $scope.card.charge = function() {
        $scope.dialog.confirm({
            text: "您将向手机号为 " + $scope.card.chargeinfo.mobile + " 的用户充值，确定继续?",
            handler: function() {
                $scope.dialog.showStandby();
                CardService.charge($scope.card.chargeinfo)
                .then(function() {
                    $scope.dialog.hideStandby();
                    $scope.message.success("充值成功!");
                }, function() {
                    $scope.dialog.hideStandby();
                    $scope.message.error("充值失败，请联系管理员!");
                });
            }
        });
        
    };

}]);


});