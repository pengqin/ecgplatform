'use strict';
define(function(require, exports) {

require("./services/ChiefService");
require("./directives/Chief");
require("./directives/Expert");
require("./directives/Operator");

var chiefTemp = require("./templates/chief.html");
var chiefNewTemp = require("./templates/chief/new.html");
var chiefViewTemp = require("./templates/chief/view.html");

angular.module('ecgEmployee', ['ecgChiefService', 'ecgChief', 'ecgExpert', 'ecgOperator'])
.config(['$routeProvider', function ($routeProvider) {
      $routeProvider
      .when('/chief', {
        template: chiefTemp,
        controller: 'ChiefController'
      })
      .when('/chief/new', {
        template: chiefNewTemp,
        controller: 'ChiefNewController'
      })
      .when('/chief/:id', {
        template: chiefViewTemp,
        controller: 'ChiefViewController'
      });
  }])

});