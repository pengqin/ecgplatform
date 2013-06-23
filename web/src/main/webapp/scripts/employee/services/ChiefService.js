'use strict';
define(function(require, exports) {

angular.module('ecgChiefService', [])
    .factory("ChiefService", function($rootScope, $http) {
        var chiefs = [];
        for (var i=0; i<100; i++) {
            chiefs.push({
                id: i, 
                name: "主任"+i,
                gender: i % 2,
                birthday: "1950-07-09",
                idCard: "44080319881191999" + i,
                title: "主任" + i,
                mobile: "010-89898989",
                hospital: "医院" + i,
                dismissed: i % 2
            });
        }
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
                    $rootScope.popup.error('服务器异常,无法获取专家列表');
                    return [];
                });
            },
            getTotal: function() {
                return chiefs.length;
            },
            remove: function(id) {
                
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
                    console.info(res);
                    return {};
                }, function() {
                    $rootScope.popup.error('服务器异常,无法获取ID为' + id + '的专家信息.');
                    return {};
                });
            },
            update: function() {

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