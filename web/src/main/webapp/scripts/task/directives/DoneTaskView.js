'use strict';
define(function(require, exports) {

    var template = require("../templates/donetaskview.html");

    angular.module('ecgDoneTaskView', ['ecgUserCard', 'ecgExaminationView', 'ecgPlot'])
    .controller('DoneTaskViewController', ['$scope', 'TaskService',
    function($scope, TaskService) {
        $scope.showView = function() {
            return $scope.done.selected !== null;
        };
    }])
    .directive("ecgDoneTaskView", [ '$location', function($location) {
        return {
            restrict : 'A',
            replace : false,
            template : template,
            controller : "DoneTaskViewController",
            link : function($scope, $element, $attrs) {
            }
        };
    } ]);
});