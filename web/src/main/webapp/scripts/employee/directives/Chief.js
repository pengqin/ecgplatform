'use strict';
define(function(require, exports) {

var chiefEditTemp = require("../templates/chief/edit.html");
var chiefRulesTemp = require("../templates/chief/rules.html");
var chiefOperatorsTemp = require("../templates/chief/operators.html");

angular.module('ecgChief', [])
// 基本信息
.controller('ChiefEditController', ['$scope', '$routeParams', '$timeout', '$location', 'EnumService', 'ChiefService',
    function ($scope, $routeParams, $timeout, $location, EnumService, ChiefService) {
    $scope.chief.updateobj = ChiefService.get($routeParams.id);
    $scope.chief.genders = EnumService.getGenders();
    $scope.chief.workstates = EnumService.getWorkStates();

    $('#chief-birthday').datetimepicker({
        format: "yyyy-MM-dd",
        language: "zh-CN",
        pickTime: false,
    });

    $scope.chief.showDatePicker = function() {
        $('#chief-birthday').datetimepicker('show');
    };

    $scope.chief.update = function() {
        $scope.dialog.showStandby();
        ChiefService.update($scope.chief.updateobj);
        $timeout(function() {
            $scope.dialog.hideStandby();
            $scope.popup.success("编辑主任基本信息成功!");
        }, 2000);
    };
}])
.directive("ecgChiefEdit", [ '$location', function($location) {
    return {
        restrict : 'E',
        replace : false,
        template : chiefEditTemp,
        controller : "ChiefEditController",
        link : function($scope, $element, $attrs) {
        }
    };
} ])
// 自定义规则
.controller('ChiefRulesController', ['$scope', '$routeParams', '$timeout', '$location', 'EnumService', 'ChiefService',
    function ($scope, $routeParams, $timeout, $location, EnumService, ChiefService) {
    $scope.chief.rules = ChiefService.getRules($routeParams.id);

    $scope.chief.updateRules = function() {
        $scope.dialog.showStandby();
        /* TODO: */
        // ChiefService.update($scope.chief.updateobj);
        $timeout(function() {
            $scope.dialog.hideStandby();
            $scope.popup.success("修改自定义规则成功!");
        }, 2000);
    };
}])
.directive("ecgChiefRules", [ '$location', function($location) {
    return {
        restrict : 'E',
        replace : false,
        template : chiefRulesTemp,
        controller : "ChiefRulesController",
        link : function($scope, $element, $attrs) {
        }
    };
} ])
// 配置接线员
.controller('ChiefOperatorsController', ['$scope', '$routeParams', '$timeout', '$location', 'EnumService', 'ChiefService',
    function ($scope, $routeParams, $timeout, $location, EnumService, ChiefService) {
    $scope.chief.operators = ChiefService.getOperators($routeParams.id);

    $scope.chief.updateOperators = function() {
        $scope.dialog.showStandby();
        /* TODO: */
        // ChiefService.update($scope.chief.updateobj);
        $timeout(function() {
            $scope.dialog.hideStandby();
            $scope.popup.success("配置接线员成功!");
        }, 2000);
    };
}])
.directive("ecgChiefOperators", [ '$location', function($location) {
    return {
        restrict : 'E',
        replace : false,
        template : chiefOperatorsTemp,
        controller : "ChiefOperatorsController",
        link : function($scope, $element, $attrs) {
        }
    };
} ]);


});