
define(function(require, exports) {

    'use strict';

    var template = require("../templates/undonetaskview.html");

    angular.module('ecgUndoneTaskView', ['ecgUserCard', 'ecgExaminationView', 'ecgPlot'])
    .controller('UndoneTaskViewController', ['$scope', 'TaskService',
    function($scope, TaskService) {
        $scope.showView = function() {
            return $scope.undone.selected !== null;
        };
    }])
    .directive("ecgUndoneTaskView", [ '$location', function($location) {
        return {
            restrict : 'A',
            replace : false,
            template : template,
            controller : "UndoneTaskViewController",
            link : function($scope, $element, $attrs) {
            }
        };
    } ]);
});