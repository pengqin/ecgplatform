'use strict';
define(function(require, exports) {

require("./services/RuleService");
require("./directives/Rule");

var configTemp = require("./templates/rule.html");
var newTemp = require("./templates/new.html");

angular.module('ecgRule', ['ecgRuleService', 'ecgRuleModules'])
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
    .when('/rule', {
        template: configTemp,
        controller: 'RuleConfigController'
    })
    .when('/rule/new', {
        template: newTemp,
        controller: 'RuleNewController'
    });
}]);

});// end of define