'use strict';
define(function(require, exports) {

    var template = require("../templates/taskcard.html");

    angular.module('ecgTaskCard', [])
    .controller('TaskCardController', ['$scope', 'TaskService',
    function($scope, TaskService) {
        $scope.taskcard = {};
        $scope.taskcard.task = null;
        $scope.$watch('undone.selected',function() {
            if(!$scope.undone.selected) { return; }
            $scope.taskcard.task = $scope.undone.selected;
        });
    }])
    .directive("ecgTaskCard", [ '$location', function($location) {
        return {
            restrict : 'A',
            replace : false,
            template : template,
            controller : "TaskCardController",
            link : function($scope, $element, $attrs) {
            }
        };
    } ]);
});