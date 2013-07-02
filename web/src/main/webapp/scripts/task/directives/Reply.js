'use strict';
define(function(require, exports) {

    var template = require("../templates/reply.html");

    angular.module('ecgTaskReply', [])
    .controller('ReplyController', ['$scope', 'TaskService',
    function($scope, TaskService) {
        $scope.undone.reply = {};
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
    .directive("ecgTaskReply", [ '$location', function($location) {
        return {
            restrict : 'A',
            replace : false,
            template : template,
            controller : "ReplyController",
            link : function($scope, $element, $attrs) {
            }
        };
    } ]);
});