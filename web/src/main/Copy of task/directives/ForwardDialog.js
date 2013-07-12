
define(function(require, exports) {
  'use strict';
    
  var dialogTempalte = require("../templates/forwarddialog.html");

  angular.module('ecgForwardDialog', [])
  .controller('ForwardDialogController', ['$scope', 'TaskService', function ($scope, TaskService) {
  	$scope.forwarddialog = {};

    $scope.forwarddialog.experts = TaskService.queryExpertsByOperators($scope.session.user);
    $scope.forwarddialog.selected = null;

  	$scope.forwarddialog.execute = function() {
  		if ($scope.forwarddialog.handler instanceof Function) {
  			$scope.forwarddialog.handler($scope.forwarddialog.selected);
  		}
  	};

    $scope.forwarddialog.hide = function(opts) {
      $('#ecgForwardDialog').modal('hide');
    };

    $scope.forwarddialog.show = function(opts) {
      var opts = opts || {};
      $scope.forwarddialog.handler = opts.handler;
      $('#ecgForwardDialog').modal('show');
    };

  }])
  .directive("ecgForwardDialog", ['$location', function ($location) {
    return {
      restrict: 'A',
      replace: true,
      template: dialogTempalte,
      controller: "ForwardDialogController",
      link: function ($scope, $element, $attrs) {
      }
    };
  }]);

});