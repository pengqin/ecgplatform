'use strict';
define(function(require, exports) {

    var template = require("../templates/taskcard.html");

    angular.module('ecgTaskCard', [])
    .controller('TaskCardController', ['$scope', 'TaskService',
    function($scope, TaskService) {
        $scope.undone.task = {};
        $scope.$watch('undone.selectedItems',
            function(newVal, oldVal) {
                if (!newVal || newVal.length === 0) { return; }
                $scope.undone.task = {
                    name: 'test'
                };
            }, 
            true
        );
    }])
    .directive("ecgTaskCard", [ '$location', function($location) {
        return {
            restrict : 'E',
            replace : false,
            template : template,
            controller : "TaskCardController",
            link : function($scope, $element, $attrs) {
            }
        };
    } ]);
});