'use strict';
define(function(require, exports) {

require("./services/RuleService");
require("./services/ReplyConfigService");
require("./directives/Rule");

var ruleTemp = require("./templates/rule.html");
var newTemp = require("./templates/new.html");
var editTemp = require("./templates/edit.html");
var replyconfigTemp = require("./templates/replyconfig.html");

angular.module('ecgRule', ['ecgRuleService', 'ecgReplyConfigService', 'ecgRuleModules'])
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
    .when('/rule', {
        template: ruleTemp,
        controller: 'RuleController'
    })
    .when('/rule/new', {
        template: newTemp,
        controller: 'RuleNewController'
    })
    .when('/rule/:id', {
        template: editTemp,
        controller: 'RuleEditController'
    })
    .when('/rule/:code/replyconfig', {
        template: replyconfigTemp,
        controller: 'ReplyConfigController'
    });
}]);

});// end of define