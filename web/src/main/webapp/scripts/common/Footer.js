'use strict';
define(function(require, exports) {
  var footerTemplate = require("./templates/footer.html");

  angular.module('ecgFooter', [])
  .controller('FooterController', function ($scope) {
  })
  .directive("ecgFooter", ['$location', function ($location) {
    return {
      restrict: 'A',
      replace: true,
      template: footerTemplate,
      controller: "FooterController",
      link: function ($scope, $element, $attrs) {
      }
    };
  }]);

});