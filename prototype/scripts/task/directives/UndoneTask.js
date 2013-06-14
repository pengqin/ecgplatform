'use strict';
define(function(require, exports) {

    var template = require("../templates/undonetask.html");

    angular.module('ecgUndoneTask', [])
    .controller('UndoneViewController', ['$scope', 'TaskService',
        function($scope, TaskService) {
            $scope.undone.data = TaskService.getAllUndones();

            // init the grid
            var cols = [ {
                field : 'guest',
                displayName : '客户'
            }, {
                field : 'checkState',
                displayName : '健康状态'
            }, {
                field : 'processState',
                displayName : '处理状态'
            } ];
            $scope.undone.selectedItems = [];
            $scope.$watch('undone.pagingOptions',
                function(newVal, oldVal) {
                    if (newVal !== oldVal
                            && newVal.currentPage !== oldVal.currentPage) {
                    }
                }, 
                true
            );
            $scope.undone.pagingOptions = {
                pageSizes : [ 10, 20, 50 ],
                pageSize : 10,
                currentPage : 1,
                totalServerItems : TaskService.getAllUndonesTotal()
            };
            $scope.undone.gridOptions = {
                data : 'undone.data',
                columnDefs : cols,
                enablePaging : false,
                showFooter : false,
                multiSelect : false,
                selectedItems : $scope.undone.selectedItems,
                pagingOptions : $scope.undone.pagingOptions,
                i18n : 'zh-cn'
            };
    }])
    .directive("ecgUndoneView", [ '$location', function($location) {
        return {
            restrict : 'E',
            replace : false,
            template : template,
            controller : "UndoneViewController",
            link : function($scope, $element, $attrs) {
            }
        };
    } ]);
});