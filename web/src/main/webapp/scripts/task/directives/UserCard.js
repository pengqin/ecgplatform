'use strict';
define(function(require, exports) {

    var template = require("../templates/usercard.html");

    angular.module('ecgUserCard', [])
    .controller('UserCardController', ['$scope', 'UserService',
    function($scope, UserService) {
        $scope.usercard = {};

        // 监听未完成
        $scope.$watch("undone.selected", function() {
            if (!$scope.undone) { return; }
            if (!$scope.undone.selected) { return; }
            if (!$scope.undone.selected.user) {
                $scope.usercard.user = null;
                UserService.get($scope.undone.selected.userId)
                .then(function(user) {
                    $scope.usercard.user = user;
                    $scope.undone.selected.user = user;
                }, function() {
                    $scope.message.error("加载用户数据失败!");
                });
            } else {
                $scope.usercard.user = $scope.undone.selected.user;
            }
        });

        // 监听已完成
        $scope.$watch("done.selected", function() {
            if (!$scope.done) { return; }
            if (!$scope.done.selected) { return; }
            if (!$scope.done.selected.user) {
                $scope.usercard.user = null;
                UserService.get($scope.done.selected.userId)
                .then(function(user) {
                    $scope.usercard.user = user;
                    $scope.done.selected.user = user;
                }, function() {
                    $scope.message.error("加载用户数据失败!");
                });
            } else {
                $scope.usercard.user = $scope.done.selected.user;
            }
        });
    }])
    .directive("ecgUserCard", [ '$location', function($location) {
        return {
            restrict : 'A',
            replace : false,
            template : template,
            controller : "UserCardController",
            link : function($scope, $element, $attrs) {
            }
        };
    } ]);
});