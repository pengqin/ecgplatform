'use strict';
define(function(require, exports) {

    var template = require("../templates/undonetaskview.html");

    angular.module('ecgUndoneTaskView', ['ecgUserCard', 'ecgTaskCard', 'ecgPlot'])
    .controller('UndoneTaskViewController', ['$scope', 'TaskService',
    function($scope, TaskService) {
        $scope.showView = function() {
            return $scope.undone.selectedItems && $scope.undone.selectedItems.length > 0;
        }
    }])
    .directive("ecgUndoneTaskView", [ '$location', function($location) {
        return {
            restrict : 'E',
            replace : false,
            template : template,
            controller : "UndoneTaskViewController",
            link : function($scope, $element, $attrs) {
            }
        };
    } ]);
});