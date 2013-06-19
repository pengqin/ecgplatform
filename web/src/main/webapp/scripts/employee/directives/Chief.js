'use strict';
define(function(require, exports) {

    angular.module('ecgChief', [])
    .controller('ChiefController', ['$scope', 'EmployeeService', function ($scope, EmployeeService) {
        // register the inner namespace
        $scope.chief = {};
        $scope.subheader.title = "健康中心管理主任";

        $scope.chief.data = EmployeeService.getChief();
        $scope.chief.selectedItems = [];

        // init the grid
        var cols = [ {
            field : 'name',
            displayName : '姓名'
        }];
        $scope.$watch('chief.pagingOptions',
            function(newVal, oldVal) {
                if (newVal !== oldVal && 
                    newVal.currentPage !== oldVal.currentPage) {
                }
            }, 
            true
        );
        $scope.$watch('chief.selectedItems',
            function(newVal, oldVal) {
                if (!newVal || newVal.length === 0) { return; }
                console.info(newVal);
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
            enablePaging : false,
            showFooter : false,
            multiSelect : false,
            selectedItems : $scope.chief.selectedItems,
            pagingOptions : $scope.chief.pagingOptions,
            i18n : 'zh-cn'
        };
    }]);
});