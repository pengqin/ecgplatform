'use strict';
define(function(require) {
  require("./common/main");
  require("./task/main");
  require("./monitor/main")

  var undoneTemp = require("./task/templates/undone.html");
  var doneTemp = require("./task/templates/done.html");
  var overviewTemp = require("./monitor/templates/overview.html");

  angular.module('ecgApp', ['ecgCommon', 'ecgTask', 'ecgMonitor'])
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
      .when('/overview', {
        template: overviewTemp,
        controller: 'OverviewController'
      })
      .otherwise({
        redirectTo: '/undone'
      });
  }])
  .run(function() {});

  angular.bootstrap(document, ["ecgApp"]);

});