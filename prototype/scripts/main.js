'use strict';
define(function(require) {
  require("./common/main");
  require("./task/main");

  var undoneTemp = require("./task/templates/undone.html");
  var doneTemp = require("./task/templates/done.html");

  angular.module('ecgApp', ['ecgCommon', 'ecgTask'])
  .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
      .when('/undone', {
        template: undoneTemp,
        controller: 'UndoneTaskController'
      })
      .when('/done', {
        template: doneTemp,
        controller: 'DoneTaskController'
      })
      .otherwise({
        redirectTo: '/undone'
      });
  }])
  .run(function() {});

  angular.bootstrap(document, ["ecgApp"]);

});