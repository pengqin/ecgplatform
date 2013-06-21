'use strict';
define(function(require, exports) {

require("./services/ChiefService");
require("./directives/Chief");
require("./directives/Expert");
require("./directives/Operator");

var chiefTemp = require("./templates/chief.html");
var chiefNewTemp = require("./templates/chief/new.html");
var chiefViewTemp = require("./templates/chief/view.html");

angular.module('ecgEmployee', ['ecgChiefService', 'ecgChief', 'ecgExpert', 'ecgOperator'])
.controller('ChiefController', ['$scope', '$timeout', '$location', 'EnumService', 'ChiefService', function ($scope, $timeout, $location, EnumService, ChiefService) {
    // 表格头
    $scope.subheader.title = "健康中心管理主任";

    // 命名空间
    $scope.chief = {};

    // 表格展示
    $scope.chief.data = ChiefService.queryAll();
    $scope.chief.selectedItems = [];
    // 定义表头
    var cols = [{
        field : 'id',
        displayName : '编号',
        cellTemplate: '<div class="ngCellText ecgGridLik" ng-click="chief.showPage(row.entity)">{{row.getProperty(col.field)}}</div>'
    }, {
        field : 'name',
        displayName : '姓名',
    }, {
        field : 'gender.label',
        displayName : '性别',
        cellTemplate: '<div class="ngCellText">{{chief.getGenderLabel(row.entity)}}</div>'
    }, {
        field : 'dissmissed',
        displayName : '是否在职',
        cellTemplate: '<div class="ngCellText">{{chief.getWorkStateLabel(row.entity)}}</div>'
    }, {
        field : 'tel',
        displayName : '电话'
    }, {
        field : 'hospital',
        displayName : '所在医院'
    }];
    // 显示label
    $scope.chief.getGenderLabel = function(chief) {
    	return EnumService.getGenderLabel(chief.gender);
    };
    $scope.chief.getWorkStateLabel = function(chief) {
    	return EnumService.getWorkStateLabel(chief.dismissed);
    };
   	// 分页功能
    $scope.$watch('chief.pagingOptions',
        function(newVal, oldVal) {
            if (newVal !== oldVal && 
                newVal.currentPage !== oldVal.currentPage) {
            }
        }, 
        true
    );

    $scope.chief.pagingOptions = {
        pageSizes : [ 10, 20, 50 ],
        pageSize : 10,
        currentPage : 1,
        totalServerItems : ChiefService.getTotal()
    };
    $scope.chief.gridOptions = {
        data : 'chief.data',
        columnDefs : cols,
        enablePaging : true,
        showFooter : true,
        multiSelect : false,
        selectedItems : $scope.chief.selectedItems,
        pagingOptions : $scope.chief.pagingOptions,
        i18n : 'zh-cn'
    };

    // 删除功能
    $scope.chief.confirmDelete = function() {
        var items = $scope.chief.selectedItems, chief;
        if (items.length === 0) {
            $scope.dialog.alert({
                text: '请选择一条记录!'
            });
            return;
        }
        chief = items[0];
        $scope.dialog.confirm({
            text: "请确认删除主任:" + chief.name + ", 该操作无法恢复!",
            handler: function() {
                $scope.dialog.showStandby();
                ChiefService.remove(chief.id);
                $timeout(function() {
                    $scope.dialog.hideStandby();
                    $scope.popup.success("删除成功!");
                }, 2000);
            }
        });
    };

    // 编辑功能
    $scope.chief.showPage = function(chief) {
        $location.path("chief/" + chief.id);
    };

}])
.controller('ChiefNewController', ['$scope', '$timeout', '$location', 'EnumService', 'ChiefService',
    function ($scope, $timeout, $location, EnumService, ChiefService) {
    $scope.subheader.title = "新增主任";

    $scope.chief = {};
    $scope.chief.newobj = ChiefService.getPlainObject();
    $scope.chief.genders = EnumService.getGenders();
    $scope.chief.workstates = EnumService.getWorkStates();

    $('#chief-birthday').datetimepicker({
        format: "yyyy-MM-dd",
        language: "zh-CN",
        pickTime: false
    });

    $scope.chief.showDatePicker = function() {
        $('#chief-birthday').datetimepicker('show');
    };

    $scope.chief.create = function() {
        $scope.dialog.showStandby();
        ChiefService.create($scope.chief.newobj);
        $timeout(function() {
            $scope.dialog.hideStandby();
            $scope.popup.success("新增成功!");
            $location.path("/chief");
        }, 2000);
    };
}])
.controller('ChiefViewController', ['$scope', '$routeParams', '$timeout', '$location', 'EnumService', 'ChiefService',
    function ($scope, $routeParams, $timeout, $location, EnumService, ChiefService) {
    $scope.subheader.title = "编辑主任";

    $scope.chief = {};
    $scope.chief.tab = 1; // 默认第一页

}])
.config(['$routeProvider', function ($routeProvider) {
      $routeProvider
      .when('/chief', {
        template: chiefTemp,
        controller: 'ChiefController'
      })
      .when('/chief/new', {
        template: chiefNewTemp,
        controller: 'ChiefNewController'
      })
      .when('/chief/:id', {
        template: chiefViewTemp,
        controller: 'ChiefViewController'
      });
  }]);
});