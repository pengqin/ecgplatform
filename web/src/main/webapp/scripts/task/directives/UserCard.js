'use strict';
define(function(require, exports) {

    var template = require("../templates/usercard.html");

    angular.module('ecgUserCard', [])
    .controller('UserCardController', ['$scope', 'UserService',
    function($scope, UserService) {
        $scope.usercard = {};
        $scope.$watch("undone.selected", function() {
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