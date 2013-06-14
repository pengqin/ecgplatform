'use strict';
define(function(require, exports) {
  var headerTemplate = require("./templates/header.html");

  angular.module('ecgHeader', [])
  .controller('HeaderController', function ($scope) {
  })
  .directive("ecgHeader", ['$location', function ($location) {
    return {
      restrict: 'E',
      replace: false,
      template: headerTemplate,
      controller: "HeaderController",
      link: function ($scope, $element, $attrs) {
      }
    };
  }]);

});