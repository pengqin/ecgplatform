'use strict';
define(function(require, exports) {

angular.module('ecgFilterModules', [])
.controller('FilterConfigController', ['$scope', 'FilterService', function ($scope, FilterService) {
    // 表格头
    $scope.subheader.title = "规则设置";

    // 命名空间
    $scope.filter = {};

    // 规则数据
    $scope.filter.data = [{
    	id: 1,
    	type: 11,
    	code: 1,
    	name: '舒张压',
    	min: 60,
    	max: 89,
    	desc: '血压的舒张压（毫米汞柱）'
    }, {
    	id: 2,
    	type: 11,
    	code: 2,
    	name: '收缩压',
    	min: 89,
    	max: 139,
    	desc: '血压的收缩压（毫米汞柱）'
    }, {
    	id: 3,
    	type: 11,
    	code: 3,
    	name: '心率',
    	min: 60,
    	max: 100,
    	desc: '次/分钟'
    }, {
    	id: 4,
    	type: 11,
    	code: 4,
    	name: '血氧饱和度',
    	min: 94,
    	max: 100,
    	desc: '百分比'
    }];

    // create
    $scope.filter.save = function() {
        $scope.dialog.showStandby();
        $scope.dialog.hideStandby();
        $scope.message.success("保存成功!");
    }

}]);


});