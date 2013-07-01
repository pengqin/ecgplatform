'use strict';
define(function(require, exports) {

var userEditTemp = require("../templates/user/edit.html");

angular.module('ecgUserModules', [])
.controller('UserController', ['$scope', '$filter', '$timeout', '$location', 'EnumService', 'UserService', function ($scope, $filter, $timeout, $location, EnumService, UserService) {
    // 表格头
    $scope.subheader.title = "用户管理";

    // 命名空间
    $scope.user = {};

    // 表格展示
    $scope.user.data = UserService.queryAll();
    $scope.user.filteredData = $scope.user.data;

    // 显示label
    $scope.user.getGenderLabel = function(user) {
        return EnumService.getGenderLabel(user.gender);
    };
    $scope.user.getDismissedLabel = function(user) {
        return EnumService.getDismissedLabel(user.dismissed);
    };

    // 当前选中数据
    $scope.user.selectedItem = null;

    // 刷新功能
    function refreshGrid() {
        $scope.user.data = UserService.queryAll();
        $scope.user.filteredData = $scope.user.data;
    }

    // 删除功能
    $scope.user.confirmDelete = function() {
        var selectedItem = $scope.user.selectedItem;
        if (selectedItem === null) {
            $scope.dialog.alert({
                text: '请选择一条记录!'
            });
            return;
        }
        $scope.dialog.confirm({
            text: "请确认删除用户:" + selectedItem.name + ", 该操作无法恢复!",
            handler: function() {
                $scope.dialog.showStandby();
                UserService.remove(selectedItem.id)
                .then(function() {
                    $scope.dialog.hideStandby();
                    $scope.user.selectedItem = null;
                    $scope.popup.success("删除成功!");
                    // 刷新
                    refreshGrid();
                }, function() {
                    $scope.dialog.hideStandby();
                    $scope.popup.error("无法删除该数据,可能是您的权限不足,请联系管理员!");
                });
            }
        });
    };

    // 过滤功能
    $scope.user.queryChanged = function(query) {
        return $scope.user.filteredData = $filter("filter")($scope.user.data, query);
    };

    // 编辑功能
    $scope.user.showPage = function(user) {
        $location.path("user/" + user.id);
    };

}])
.controller('UserNewController', ['$scope', '$timeout', '$location', 'EnumService', 'ProfileService', 'UserService',
    function ($scope, $timeout, $location, EnumService, ProfileService, UserService) {
    $scope.subheader.title = "新增用户";

    $scope.user = {};
    $scope.user.newobj = UserService.getPlainObject();
    $scope.user.genders = EnumService.getGenders();
    $scope.user.dismissedStates = EnumService.getDismissedStates();

    $('#user-birthday').datetimepicker({
        format: "yyyy-MM-dd",
        language: "zh-CN",
        pickTime: false
    });

    $scope.user.showDatePicker = function() {
        $('#user-birthday').datetimepicker('show');
    };

    $scope.user.isUnique = true;
    $scope.user.checkUnique = function() {
        ProfileService.get($scope.user.newobj.username).then(function(user) {
            if (user) { 
                $scope.user.isUnique = false;
                $scope.popup.warn("用户" + $scope.user.newobj.username + "已存在!");
            } else {
                $scope.user.isUnique = true;
            }
        }, function() {
            $scope.user.isUnique = true;
            $scope.popup.warn("查询用户是否唯一时出错!");
        });
    };

    $scope.user.create = function() {
        $scope.dialog.showStandby();
        $scope.user.newobj.birthday = $('#user-birthday input').val();
        $scope.user.newobj.password = $scope.user.newobj.username;
        UserService.create($scope.user.newobj)
        .then(function(result) {
            $scope.dialog.hideStandby();
            if (result) {
                $scope.popup.success("新增成功!");
                $location.path("/user");
            } else {
                $scope.popup.error("新增失败!");
            }
        }, function() {
            $scope.dialog.hideStandby();
            $scope.popup.error("服务器异常,新增失败!");
        });;
    };
}])
.controller('UserViewController', ['$scope', '$routeParams', '$timeout', '$location', 'EnumService', 'UserService',
    function ($scope, $routeParams, $timeout, $location, EnumService, UserService) {
    $scope.subheader.title = "编辑用户";

    $scope.user = {};
    $scope.user.tab = 1; // 默认为基本页面

}])
// 基本信息
.controller('UserEditController', ['$scope', '$routeParams', '$timeout', '$location', 'EnumService', 'UserService',
    function ($scope, $routeParams, $timeout, $location, EnumService, UserService) {
    $scope.user.updateobj = null; //UserService.get($routeParams.id);
    UserService.get($routeParams.id).then(function(user) {
        $scope.user.updateobj = user;
    });
    $scope.user.genders = EnumService.getGenders();
    $scope.user.dismissedStates = EnumService.getDismissedStates();

    $('#user-birthday').datetimepicker({
        format: "yyyy-MM-dd",
        language: "zh-CN",
        pickTime: false,
    }).on('changeDate', function(e) {
        $scope.user.updateobj.birthday = $('#user-birthday input').val();
    });

    $scope.user.showDatePicker = function() {
        $('#user-birthday').datetimepicker('show');
    };

    $scope.user.update = function() {
        $scope.dialog.showStandby();
        $scope.user.updateobj.birthday = $('#user-birthday input').val();
        UserService.update($scope.user.updateobj)
        .then(function(result) {
            $scope.dialog.hideStandby();
            $scope.popup.success("编辑成功!");
        }, function() {
            $scope.dialog.hideStandby();
            $scope.popup.error("编辑失败!");
        });;
    };

    $scope.user.resetPassword = function() {
        $scope.dialog.showStandby();
        $scope.user.updateobj.password = $scope.user.updateobj.username;
        UserService.update($scope.user.updateobj)
        .then(function(result) {
            $scope.dialog.hideStandby();
            $scope.popup.success("重置密码成功!");
        }, function() {
            $scope.dialog.hideStandby();
            $scope.popup.error("重置密码失败!");
        });;
    };
}])
.directive("ecgUserEdit", [ '$location', function($location) {
    return {
        restrict : 'E',
        replace : false,
        template : userEditTemp,
        controller : "UserEditController",
        link : function($scope, $element, $attrs) {
        }
    };
}]);


});