'use strict';
define(function(require, exports) {
var headerTemplate = require("./templates/header.html");
var subheaderTemplate = require("./templates/subheader.html");

angular.module('ecgHeader', [])
.controller('HeaderController', ['$scope', 'EnumService', 'ProfileService', function ($scope, EnumService, ProfileService) {
    $scope.logout = function() {
        window.logout();
    };

    $scope.header = {};
    $scope.header.status = null;
    $scope.header.statuses = EnumService.getEmployeeStatus();
    $scope.header.getEmployeeStatusLabel = EnumService.getEmployeeStatusLabel;

    $scope.$watch("session.user", function() {
        if (!$scope.session.user.id) { return; }
        $scope.header.status = $scope.session.user.status;
        if ($scope.header.status === 'OFFLINE') {
            $scope.dialog.confirm({
                text: "您是否要切换到正在工作的状态!",
                handler: function() {
                    $scope.header.setStatus('ONLINE');
                }
            });
        }
    });

    $scope.header.setStatus = function(status) {
        $scope.header.status = status;
        $scope.session.user.status = status;
        
        $scope.dialog.showStandby();
        ProfileService.update($scope.session.user).then(function(result) {
            $scope.dialog.hideStandby();
            $scope.message.success("更改工作状态成功!");
            setTimeout(function() {
                if ($scope.header.status === 'OFFLINE') {
                    $scope.dialog.confirm({
                        text: "您是否要退出系统!",
                        handler: function() {
                            window.logout();
                        }
                    });
                }
            }, 1500);
        }, function() {
            $scope.dialog.hideStandby();
            $scope.message.error("更改工作状态失败!");
        });
    };
}])
.controller('SubHeaderController', function ($scope) {
    $scope.subheader = {title: "请选择菜单"};
})
.directive("ecgHeader", ['$location', function ($location) {
    return {
        restrict: 'A',
        replace: true,
        template: headerTemplate,
        controller: "HeaderController",
        link: function ($scope, $element, $attrs) {
        }
    };
}])
.directive("ecgSubHeader", ['$location', function ($location) {
    return {
        restrict: 'A',
        replace: true,
        template: subheaderTemplate,
        controller: "SubHeaderController",
        link: function ($scope, $element, $attrs) {
        }
    };
}]);

});