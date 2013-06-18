'use strict';
define(function(require, exports) {
  var headerTemplate = require("./templates/header.html");
  var subheaderTemplate = require("./templates/subheader.html");

  angular.module('ecgHeader', [])
  .controller('HeaderController', function ($scope) {
  })
  .controller('SubHeaderController', function ($scope) {
      $scope.subheader = {
          title: "请选择菜单"
      };
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
  }])
  .directive("ecgSubHeader", ['$location', function ($location) {
    return {
      restrict: 'E',
      replace: false,
      template: subheaderTemplate,
      controller: "SubHeaderController",
      link: function ($scope, $element, $attrs) {
      }
    };
  }]);

});