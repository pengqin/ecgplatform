'use strict';
define(function(require, exports) {
  var navTemplate = require("./templates/nav.html");

  angular.module('ecgNav', [])
  .controller('NavController', function ($scope) {
  })
  .directive("ecgNav", ['$location', function ($location) {
    return {
      restrict: 'E',
      replace: true,
      template: navTemplate,
      controller: "NavController",
      link: function ($scope, $element, $attrs) {
      }
    };
  }]);

});