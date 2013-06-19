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
  .controller('MessageController', ['$scope', 'MessageService', function ($scope, MessageService) {
    $scope.message = {};
    $scope.message.msgs = MessageService.all();

    $scope.message.success = function(msg) {
      var message = {
        type: 'success',
        text: msg,
        show: true
      };
      MessageService.create(message);

      setTimeout(function() {
        message.show = false;
      }, 2000);
    };

    $scope.message.hide = function(msg) {
        msg.show = false;
    };

    $scope.$watch("message.msgs", function(msg) {
      console.info(msg);
    }, true);

  }])
  .directive("ecgMessage", ['$location', function ($location) {
    return {
      restrict: 'E',
      replace: false,
      template: messageTemplate,
      controller: "MessageController",
      link: function ($scope, $element, $attrs) {
      }
    };
  }]);

});