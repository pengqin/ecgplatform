'use strict';
define(function(require, exports) {

require("./services/TaskService");
require("./directives/UndoneTask");

angular.module('ecgTask', ['ecgTaskService', 'ecgUndoneTask'])
.controller('UndoneTaskController', ['$scope', function ($scope) {
    // register the inner namespace
    $scope.undone = {};
    $scope.subheader.title = "待办工作";
}])
.controller('DoneTaskController', ['$scope', function ($scope) {
    // register the inner namespace
    $scope.done = {};
    $scope.subheader.title = "已办工作";
}]);
});