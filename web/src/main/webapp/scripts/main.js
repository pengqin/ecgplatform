'use strict';
define(function(require) {
  require("./common/main");
  require("./task/main");
  require("./monitor/main");
  require("./employee/main");

  var welcomeTemp = require("./common/templates/welcome.html");
  var undoneTemp = require("./task/templates/undone.html");
  var doneTemp = require("./task/templates/done.html");
  var overviewTemp = require("./monitor/templates/overview.html");
  var expertTemp = require("./employee/templates/expert.html");
  var operatorTemp = require("./employee/templates/operator.html");

  angular.module('ecgApp', ['ecgCommon', 'ecgTask', 'ecgMonitor', 'ecgEmployee'])
  .config(['$httpProvider', '$routeProvider',
    function ($httpProvider, $routeProvider) {
      //console.info($cookieStore.get('AiniaOpAuthToken'));
      var token = $.cookie('AiniaOpAuthToken');
      // header头带认证参数
      $httpProvider.defaults.headers.common['Authorization'] ='Basic ' + token;
      // 配置路由
      $routeProvider
      .when('/undone', {
        template: undoneTemp,
        controller: 'UndoneTaskController'
      })
      .when('/done', {
        template: doneTemp,
        controller: 'DoneTaskController'
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
      .when('/welcome', {
        template: welcomeTemp,
        controller: function($scope) {
          $scope.subheader.title = "系统首页";
        }
      })
      .otherwise({
        redirectTo: '/welcome'
      });
  }])
  .run(function() {
    $(document.body).removeClass("noscroll");
    $("#loadingpage").hide();
  });

  angular.bootstrap(document, ["ecgApp"]);

});