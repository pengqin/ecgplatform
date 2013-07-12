
define(function(require, exports) {

    'use strict';
    var template = require("../templates/examinationreply.html");

    angular.module('ecgExaminationReply', [])
    .controller('ExaminationReplyController', ['$scope', 'TaskService',
    function($scope, TaskService) {
        $scope.examinationreply = {};
        $scope.examinationreply.replys = null;
        
        // 监听已完成
        $scope.$watch('done.selected',function() {
            if (!$scope.done) { return; }
            if(!$scope.done.selected) { return; }
            if ($scope.done.selected.replys) {
                $scope.examinationreply.replys = $scope.done.selected.replys;
                return;
            }

            TaskService.getReplyByExamination($scope.done.selected.examinationId)
            .then(function(replys) {
                $scope.examinationreply.replys = replys;
                $scope.done.selected.replys = replys;
            });
        });
    }])
    .directive("ecgExaminationReply", [ '$location', function($location) {
        return {
            restrict : 'A',
            replace : false,
            template : template,
            controller : "ExaminationReplyController",
            link : function($scope, $element, $attrs) {
            }
        };
    } ]);
});