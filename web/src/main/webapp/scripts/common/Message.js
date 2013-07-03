'use strict';
define(function(require, exports) {
  var messageTemplate = require("./templates/message.html");

  angular.module('ecgMessage', [])
  .factory("MessageService", function() {
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
  .controller('MessageController', ['$scope', '$filter', 'MessageService', function ($scope, $filter, MessageService) {
    $scope.message = {};
    $scope.message.total = 0;
    $scope.message.msgs = MessageService.all();

    // show the message
    $scope.message.show = function(message) {
      var alertClass = 'alert-' + message.type || 'info', date = new Date();
      date.setTime(message.id);
      $("#ecgMessage").append(
        '<div id="message' + message.id + '" class="alert ' + alertClass + '">' +
        '<button type="button" class="close" data-dismiss="alert">×</button>' +
        '[' + $filter('date')(date, 'HH:mm:ss') + '] ' + message.text || '操作完成.' + 
        '</div>'
      );
      if (message.type === 'success' || message.type === 'info') {
        setTimeout(function() {
          $('#message' + message.id + ' button').trigger("click");
        }, 5000);
      }
      
    };
    // show a success message
    $scope.message.success = function(msg) {
      var message = {
        id: (new Date()).getTime(),
        type: 'success',
        text: msg,
        show: true
      };
      MessageService.create(message);
      $scope.message.show(message);
    };
    // show a info message
    $scope.message.info = function(msg) {
      var message = {
        id: (new Date()).getTime(),
        type: 'info',
        text: msg,
        show: true
      };
      MessageService.create(message);
      $scope.message.show(message);
    };
    // show a error message
    $scope.message.error = function(msg) {
      var message = {
        id: (new Date()).getTime(),
        type: 'error',
        text: msg,
        show: true
      };
      MessageService.create(message);
      $scope.message.show(message);
    };
    // show a warn message
    $scope.message.warn = function(msg) {
      var message = {
        id: (new Date()).getTime(),
        type: 'block',
        text: msg,
        show: true
      };
      MessageService.create(message);
      $scope.message.show(message);
    };
    /*
    $scope.message.success(1111);
    $scope.message.info(1111);
    $scope.message.error(1111);
    $scope.message.warn(1111);
    */
  }])
  .directive("ecgMessage", ['$location', function ($location) {
    return {
      restrict: 'A',
      replace: true,
      template: messageTemplate,
      controller: "MessageController",
      link: function ($scope, $element, $attrs) {
      }
    };
  }]);

});