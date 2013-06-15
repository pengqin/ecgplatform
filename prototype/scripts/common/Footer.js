'use strict';
define(function(require, exports) {
  var messageTemplate = require("./templates/footer.html");

  angular.module('ecgFooter', [])
  .controller('FooterController', function ($scope) {
  })
  .directive("ecgFooter", ['$location', function ($location) {
    return {
      restrict: 'E',
      replace: false,
      template: messageTemplate,
      controller: "FooterController",
      link: function ($scope, $element, $attrs) {
      }
    };
  }]);

});