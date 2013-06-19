'use strict';
define(function(require, exports) {
  var messageTemplate = require("./templates/message.html");

  angular.module('ecgMessage', [])
  .controller('MessageController', ['$scope', function ($scope) {
    $scope.message = {};
    $scope.message.items = [];
    
    $scope.message.success = function(msg) {
      var message = {
        type: 'success',
        text: msg,
        show: true
      };
      $scope.message.items.push(message);

      setTimeout(function() {
        message.show = false;
      }, 2000);
    };

    $scope.message.hide = function(msg) {
        msg.show = false;
    };

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