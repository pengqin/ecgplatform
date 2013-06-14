'use strict';
define(function(require, exports) {

require("./services/TaskService");
require("./directives/UndoneTask");

angular.module('ecgTask', ['ecgTaskService', 'ecgUndoneTask'])
.controller('UndoneTaskController', ['$scope', function ($scope) {
    // register the inner namespace
    $scope.undone = {};
}])
.controller('DoneTaskController', ['$scope', function ($scope) {
    // register the inner namespace
    $scope.done = {};
}]);
});