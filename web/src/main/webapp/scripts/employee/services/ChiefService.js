'use strict';
define(function(require, exports) {

angular.module('ecgChiefService', [])
    .factory("ChiefService", function($rootScope, $http) {
        var uri = "/api/chief";

        return {
            queryAll: function() {
                return $http({
                    method: 'GET',
                    cache: false,
                    url: uri
                }).then(function(res) { // 构造session用户
                    if (res.data.datas && res.data.datas.length > 0) {
                        return res.data.datas;
                    }
                    return [];
                }, function() {
                    $rootScope.popup.error('服务器异常,无法获取数据');
                    return [];
                });
            },
            getTotal: function() {
                return 0;
            },
            remove: function(id) {
                return $http({
                    method: 'DELETE',
                    url: uri + '/' + id
                });
            },
            getPlainObject: function() {
                return {
                    name: "",
                    username: "",
                    gender: 1,
                    birthday: "",
                    idCard: "",
                    title: "",
                    mobile: "",
                    hospital: "",
                    enabled: 1,
                    dismissed: 0,
                    expire: '2099-01-01'
                };
            },
            create: function(chief) {
                return $http({
                    method: 'POST',
                    data: chief,
                    url: uri
                }).then(function(res) {
                    if (res.status === 201) {
                        return true;
                    } else {
                        return false;
                    }
                }, function() {
                    return false;
                });
            },
            get: function(id) {
                return $http({
                    method: 'GET',
                    cache: false,
                    url: uri + '/' + id
                }).then(function(res) {
                    return {};
                }, function() {
                    $rootScope.popup.error('服务器异常,无法获取标识为' + id + '的数据.');
                    return {};
                });
            },
            update: function() {
                return $http({
                    method: 'PUT',
                    data: chief,
                    url: uri + '/' + id
                });
            },
            getRules: function(id) {
                return [];
            },
            getOperators: function(id) {
                return [];
            }
        };
    });
});