'use strict';
define(function(require, exports) {

    angular.module('ecgExpert', [])
    .controller('ExpertController', ['$scope', function ($scope) {
	    // register the inner namespace
	    $scope.expert = {};
	    $scope.subheader.title = "专家";
	}]);
});