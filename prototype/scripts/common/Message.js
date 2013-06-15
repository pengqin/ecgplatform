'use strict';
define(function(require, exports) {
  var messageTemplate = require("./templates/message.html");

  angular.module('ecgMessage', [])
  .controller('MessageController', function ($scope) {
  })
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