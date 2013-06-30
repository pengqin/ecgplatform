'use strict';
define(function(require, exports) {

angular.module('ecgProfileService', [])
    .factory("ProfileService", function($rootScope, $http) {
        var uri = "/api/employee";

        function initUser(props) {
            var user = $.extend({}, props || {roles: ''});
            user.isAdmin = function() {
                return this.roles.indexOf('admin') >= 0;
            };
            user.isChief = function() {
                return this.roles.indexOf('chief') >= 0;
            };
            user.isExpert = function() {
                return this.roles.indexOf('expert') >= 0;
            };
            user.isOperator = function() {
                return this.roles.indexOf('operator') >= 0;
            };
            return user;
        };

        return {
            get: function() {
                var username = $.cookie("AiniaOpUsrename");
                return $http({
                    method: 'GET',
                    cache: false,
                    url: "/api/employee?username=" + username
                }).then(function(res) { // 构造session用户
                    if (res.data.datas && res.data.datas.length === 1) {
                        return initUser(res.data.datas[0]);
                    } else {
                        return null;
                    }
                }, function() {
                    return null;
                });
            },
            update: function(employee) {
                var data = $.extend({}, employee);
                delete data.isAdmin;
                delete data.isChief;
                delete data.isExpert;
                delete data.isOperator;
                return $http({
                    method: 'PUT',
                    headers:{'Content-Type':'application/x-www-form-urlencoded'},
                    data: $.param(data),
                    url: uri + '/' + employee.id
                });
            }
        };
    });
});