'use strict';
define(function(require, exports) {
  var popupTemplate = require("./templates/popup.html");

  angular.module('ecgPopup', [])
  .factory("PopupService", function() {
        var items = [];
        return {
          all: function() {
            return items;
          },
          create: function() {
            items.push(arguments[0]);
          }
        };
    }
  )
  .controller('PopupController', ['$scope', '$filter', 'PopupService', function ($scope, $filter, PopupService) {
    $scope.popup = {};
    $scope.popup.total = 0;
    $scope.popup.msgs = PopupService.all();

    // show the message
    $scope.popup.show = function(popup) {
      var alertClass = 'alert-' + popup.type || 'info', date = new Date();
      date.setTime(popup.id);
      $("#ecgPopup").append(
        '<div id="popup' + popup.id + '" class="alert ' + alertClass + '">' +
        '<button type="button" class="close" data-dismiss="alert">×</button>' +
        '[' + $filter('date')(date, 'HH:mm:ss') + '] ' + popup.text || '操作完成.' + 
        '</div>'
      );
      setTimeout(function() {
        $('#popup' + popup.id + ' button').trigger("click");
      }, 5000);
    };
    // show a success message
    $scope.popup.success = function(msg) {
      var popup = {
        id: (new Date()).getTime(),
        type: 'success',
        text: msg,
        show: true
      };
      PopupService.create(popup);
      $scope.popup.show(popup);
    };
    // show a info message
    $scope.popup.info = function(msg) {
      var popup = {
        id: (new Date()).getTime(),
        type: 'info',
        text: msg,
        show: true
      };
      PopupService.create(popup);
      $scope.popup.show(popup);
    };
    // show a error message
    $scope.popup.error = function(msg) {
      var popup = {
        id: (new Date()).getTime(),
        type: 'error',
        text: msg,
        show: true
      };
      PopupService.create(popup);
      $scope.popup.show(popup);
    };
    // show a warn message
    $scope.popup.warn = function(msg) {
      var popup = {
        id: (new Date()).getTime(),
        type: 'block',
        text: msg,
        show: true
      };
      PopupService.create(popup);
      $scope.popup.show(popup);
    };
    /*
    $scope.popup.success(1111);
    $scope.popup.info(1111);
    $scope.popup.error(1111);
    $scope.popup.warn(1111);
    */
  }])
  .directive("ecgPopup", ['$location', function ($location) {
    return {
      restrict: 'A',
      replace: true,
      template: popupTemplate,
      controller: "PopupController",
      link: function ($scope, $element, $attrs) {
      }
    };
  }]);

});