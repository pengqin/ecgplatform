'use strict';
define(function(require, exports) {

    var template = require("../templates/usercard.html");

    angular.module('ecgUserCard', [])
    .controller('UserCardController', ['$scope', 'TaskService',
    function($scope, TaskService) {
        $scope.undone.user = {};
        $scope.$watch('undone.selectedItems',
            function(newVal, oldVal) {
                if (!newVal || newVal.length === 0) { return; }
                $scope.undone.user = {
                    name: newVal[0].guest
                };
            }, 
            true
        );
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