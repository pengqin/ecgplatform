'use strict';
define(function(require, exports) {

    angular.module('ecgChief', [])
    .controller('ChiefController', ['$scope', '$timeout', '$location', 'EmployeeService', function ($scope, $timeout, $location, EmployeeService) {
        // register the inner namespace
        $scope.chief = {};
        $scope.subheader.title = "健康中心管理主任";

        $scope.chief.data = EmployeeService.getChiefs();
        $scope.chief.selectedItems = [];

        // init the grid
        var cols = [{
            field : 'id',
            displayName : '编号'
        }, {
            field : 'name',
            displayName : '姓名',
            cellTemplate: '<div class="ngCellText ecgGridLik" ng-click="chief.showPage(row.entity)">{{row.getProperty(col.field)}}</div>'
        }, {
            field : 'gender.label',
            displayName : '性别'
        }, {
            field : 'phone',
            displayName : '电话'
        }, {
            field : 'hospital',
            displayName : '所在医院'
        }];
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
            totalServerItems : EmployeeService.getChiefTotal()
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
                    EmployeeService.removeChief(chief.id);
                    $timeout(function() {
                        $scope.dialog.hideStandby();
                        $scope.popup.success("删除成功!");
                    }, 2000);
                }
            });
        };

        $scope.chief.showPage = function(chief) {
            console.info(chief);
        }

    }])
    .controller('ChiefNewController', ['$scope', '$timeout', '$location', 'EmployeeService', function ($scope, $timeout, $location, EmployeeService) {
        $scope.chief = {};
        $scope.chief.newobj = EmployeeService.getPlainChief();
        $scope.subheader.title = "新增主任";

        $scope.chief.create = function() {
            $scope.dialog.showStandby();
            EmployeeService.createChief($scope.chief.newobj);
            $timeout(function() {
                $scope.dialog.hideStandby();
                $scope.popup.success("新增成功!");
                $location.path("/chief");
            }, 2000);
        }
    }]);
});