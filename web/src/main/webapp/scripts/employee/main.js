'use strict';
define(function(require, exports) {

require("./services/EmployeeService");
require("./directives/Chief");
require("./directives/Expert");
require("./directives/Operator");

angular.module('ecgEmployee', ['ecgEmployeeService', 'ecgChief', 'ecgExpert', 'ecgOperator'])
.controller('ExpertController', ['$scope', function ($scope) {
    // register the inner namespace
    $scope.expert = {};
    $scope.subheader.title = "专家";
}])
.controller('OperatorController', ['$scope', function ($scope) {
    // register the inner namespace
    $scope.operator = {};
    $scope.subheader.title = "接线员";
}]);
});