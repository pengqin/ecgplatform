'use strict';
define(function(require, exports) {

    var template = require("../templates/usercard.html");

    angular.module('ecgUserCard', [])
    .controller('UserCardController', ['$scope', 'TaskService',
    function($scope, TaskService) {
    }])
    .directive("ecgUserCard", [ '$location', function($location) {
        return {
            restrict : 'E',
            replace : false,
            template : template,
            controller : "UserCardController",
            link : function($scope, $element, $attrs) {
            }
        };
    } ]);
});