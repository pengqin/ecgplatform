'use strict';
define(function(require) {
  require("./common/main");
  require("./task/main");
  require("./monitor/main");
  require("./employee/main");

  var undoneTemp = require("./task/templates/undone.html");
  var doneTemp = require("./task/templates/done.html");
  var overviewTemp = require("./monitor/templates/overview.html");
  var chiefTemp = require("./employee/templates/chief.html");
  var chiefNewTemp = require("./employee/templates/chief/new.html");
  var expertTemp = require("./employee/templates/expert.html");
  var operatorTemp = require("./employee/templates/operator.html");

  angular.module('ecgApp', ['ecgCommon', 'ecgTask', 'ecgMonitor', 'ecgEmployee'])
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
      .when('/chief', {
        template: chiefTemp,
        controller: 'ChiefController'
      })
      .when('/chief/new', {
        template: chiefNewTemp,
        controller: 'ChiefNewController'
      })
      .when('/expert', {
        template: expertTemp,
        controller: 'ExpertController'
      })
      .when('/operator', {
        template: operatorTemp,
        controller: 'OperatorController'
      })
      .when('/overview', {
        template: overviewTemp,
        controller: 'OverviewController'
      })
      .otherwise({
        redirectTo: '/undone'
      });
  }])
  .run(function() {
    $("#loadingpage").hide();
  });

  angular.bootstrap(document, ["ecgApp"]);

});