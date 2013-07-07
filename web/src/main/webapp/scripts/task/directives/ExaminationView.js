'use strict';
define(function(require, exports) {

    var template = require("../templates/examinationview.html");

    angular.module('ecgExaminationView', [])
    .controller('ExaminationViewController', ['$scope', 'TaskService',
    function($scope, TaskService) {
        $scope.examinationview = {};
        $scope.examinationview.examination = null;

        // 监听未完成
        $scope.$watch('undone.selected',function() {
            $scope.examinationview.readonly = false;
            
            if (!$scope.undone) { return; }
            if(!$scope.undone.selected) { return; }
            if($scope.undone.selected.examination) { return; }

            $scope.examinationview.examination = null;
            TaskService.getExamination($scope.undone.selected.examinationId)
            .then(function(examination) {
                $scope.examinationview.examination = examination;
                $scope.undone.selected.examination = examination;
            });
        });

        // 监听已完成
        $scope.$watch('done.selected',function() {
            $scope.examinationview.readonly = true;

            if (!$scope.done) { return; }
            if(!$scope.done.selected) { return; }
            if($scope.done.selected.examination) { return; }

            $scope.examinationview.examination = null;
            TaskService.getExamination($scope.done.selected.examinationId)
            .then(function(examination) {
                $scope.examinationview.examination = examination;
                $scope.done.selected.examination = examination;
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