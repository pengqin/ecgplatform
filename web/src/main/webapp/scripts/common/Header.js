'use strict';
define(function(require, exports) {
  var headerTemplate = require("./templates/header.html");
  var subheaderTemplate = require("./templates/subheader.html");

  angular.module('ecgHeader', [])
  .controller('HeaderController', function ($scope) {
    $scope.logout = function() {
      window.location.href = "login.html";
    };
  })
  .controller('SubHeaderController', function ($scope) {
      $scope.subheader = {
          title: "请选择菜单"
      };
  })
  .directive("ecgHeader", ['$location', function ($location) {
    return {
      restrict: 'A',
      replace: true,
      template: headerTemplate,
      controller: "HeaderController",
      link: function ($scope, $element, $attrs) {
      }
    };
  }])
  .directive("ecgSubHeader", ['$location', function ($location) {
    return {
      restrict: 'A',
      replace: true,
      template: subheaderTemplate,
      controller: "SubHeaderController",
      link: function ($scope, $element, $attrs) {
      }
    };
  }]);

});