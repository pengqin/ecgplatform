'use strict';
define(function(require, exports) {

    var template = require("../templates/examinationview.html");

    angular.module('ecgExaminationView', [])
    .controller('ExaminationViewController', ['$scope', 'TaskService',
    function($scope, TaskService) {
        $scope.examinationview = {};
        $scope.examinationview.examination = null;
        $scope.$watch('undone.selected',function() {
            if(!$scope.undone.selected) { return; }
            if($scope.undone.selected.examination) { return; }

            $scope.examinationview.examination = TaskService.getExamination($scope.undone.selected.examinationId);
            $scope.undone.selected.examination = $scope.examinationview.examination;

            return;

            $scope.examinationview.examination = null;
            TaskService.getExamination($scope.undone.selected.examinationId)
            .then(function(examination) {
                $scope.examinationview.examination = examination;
                $scope.undone.selected.examination = examination;
            });
        });
    }])
    .directive("ecgExaminationView", [ '$location', function($location) {
        return {
            restrict : 'A',
            replace : false,
            template : template,
            controller : "ExaminationViewController",
            link : function($scope, $element, $attrs) {
            }
        };
    } ]);
});