'use strict';
define(function(require, exports) {
  var dialogTempalte = require("../templates/replydialog.html");

  angular.module('ecgReplyDialog', [])
  .controller('ReplyDialogController', ['$scope', 'TaskService', function ($scope, TaskService) {
  	$scope.replydialog = {};

    $scope.replydialog.reply = TaskService.getPlainReply();
    $scope.replydialog.tab = 1;
    $scope.replydialog.showconfigs = false;

  	$scope.replydialog.execute = function() {
  		if ($scope.replydialog.handler instanceof Function) {
  			$scope.replydialog.handler($scope.replydialog.reply);
  		}
  	};

    $scope.replydialog.hide = function(opts) {
      $('#ecgReplyDialog').modal('hide');
    };

    $scope.replydialog.show = function(opts) {
      var opts = opts || {};
      $scope.replydialog.handler = opts.handler;
      $('#ecgReplyDialog').modal('show');
    };

  }])
  .directive("ecgReplyDialog", ['$location', function ($location) {
    return {
      restrict: 'A',
      replace: true,
      template: dialogTempalte,
      controller: "ReplyDialogController",
      link: function ($scope, $element, $attrs) {
      }
    };
  }]);

});