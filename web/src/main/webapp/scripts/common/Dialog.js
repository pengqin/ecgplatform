'use strict';
define(function(require, exports) {
  var messageTemplate = require("./templates/dialog.html");

  angular.module('ecgDialog', [])
  .controller('DialogController', function ($scope) {
  	$scope.dialog = {};
  	$scope.dialog.OKLabel = '确定';
	$scope.dialog.showHeader = function() {
  		return true;
  	};
  	$scope.dialog.showFooter = function() {
  		if ($scope.dialog.state === 'standby') {
  			return false;
  		}
  		return true;
  	};
	$scope.dialog.showOKButton = function() {
  		if ($scope.dialog.state === 'alert') {
  			return false;
  		}
  		return true;
  	};

  	$scope.dialog.execute = function() {
  		if ($scope.dialog.handler instanceof Function) {
  			$scope.dialog.handler();
  		}
  	};
  	$scope.dialog.alert = function(opts) {
  		var opts = opts || {};
  		$scope.dialog.state = 'alert';
  		$scope.dialog.dialogTitle = opts.title || '提示';
  		$scope.dialog.dialogText = opts.text || '提示';
  		$scope.dialog.OKLabel = opts.OKLabel || '确定';
  		$('#ecgDialog').modal('show');
  	};
  	$scope.dialog.confirm = function(opts) {
  		var opts = opts || {};
  		$scope.dialog.state = 'confirm';
  		$scope.dialog.dialogTitle = opts.title || '请确认';
  		$scope.dialog.dialogText = opts.text || '请确认该操作';
  		$scope.dialog.OKLabel = opts.OKLabel || '确定';
  		$scope.dialog.handler = opts.handler || function() {};
  		$('#ecgDialog').modal('show');
  	};
  	$scope.dialog.showStandby = function(opts) {
  		var opts = opts || {};
  		$scope.dialog.state = 'standby';
  		$scope.dialog.dialogTitle = opts.title || '提示';
  		$scope.dialog.dialogText = opts.text || '操作进行中,请等待.';
  		$('#ecgDialog').modal('show');
  	};
  	$scope.dialog.hideStandby = function() {
  		$scope.dialog.state = 'standby';
  		$('#ecgDialog').modal('hide');
  		$scope.dialog.state = '';
  		$scope.dialog.dialogText = '';
  	};
  })
  .directive("ecgDialog", ['$location', function ($location) {
    return {
      restrict: 'E',
      replace: false,
      template: messageTemplate,
      controller: "DialogController",
      link: function ($scope, $element, $attrs) {
      }
    };
  }]);

});