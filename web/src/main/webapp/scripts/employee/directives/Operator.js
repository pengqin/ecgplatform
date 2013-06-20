'use strict';
define(function(require, exports) {

    angular.module('ecgOperator', [])
    .controller('OperatorController', ['$scope', function ($scope) {
	    // register the inner namespace
	    $scope.operator = {};
	    $scope.subheader.title = "接线员";
	}]);
});