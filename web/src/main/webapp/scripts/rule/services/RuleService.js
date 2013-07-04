'use strict';
define(function(require, exports) {

angular.module('ecgRuleService', [])
    .factory("RuleService", function($rootScope, $http) {
        var uri = PATH + "/api/rule";

        var mock1, mock2;
        /*
        var mock1 = [{
            id: 1,
            type: 11,
            code: 1,
            name: '舒张压',
            min: 60,
            max: 89,
            version: 0,
            desc: '血压的舒张压（毫米汞柱）'
        }, {
            id: 2,
            type: 11,
            code: 2,
            name: '收缩压',
            min: 89,
            max: 139,
            version: 0,
            desc: '血压的收缩压（毫米汞柱）'
        }, {
            id: 3,
            type: 11,
            code: 3,
            name: '心率',
            min: 60,
            max: 100,
            version: 0,
            desc: '次/分钟'
        }, {
            id: 4,
            type: 11,
            code: 4,
            name: '血氧饱和度',
            min: 94,
            max: 100,
            version: 0,
            desc: '百分比'
        }];

        var mock2 = [{
            id: 1,
            min:  0,
            max: 30,
            level: 'danger'
        }, {
            id: 2,
            min:  31,
            max: 45,
            level: 'danger'
        }, {
            id: 3,
            min:  46,
            max: 59,
            level: 'warning'
        }, {
            id: 4,
            min:  60,
            max: 90,
            level: 'success'
        }, {
            id: 5,
            min:  90,
            max: 100,
            level: 'warning'
        }, {
            id: 6,
            min: 101,
            max: 200,
            level: 'danger'
        }];*/

        return {
            queryAll: function(params) {
                var params = params || {};
                return $http({
                    method: 'GET',
                    url: uri + '?' + $.param(params)
                }).then(function(res) { // 构造session用户
                    if (res.data.datas && res.data.datas.length > 0) {
                        return res.data.datas;
                    } else {
                        return [];    
                    }
                }, function() {
                    $rootScope.message.error('服务器异常,无法获取数据');
                    return (params.code ? mock2: mock1) || [];
                });
            },
            getPlainObject: function() {
                return {
                    "type": 11, // 必填 数字
                    "code": "", // 必填 数字
                    "name": "", // 必填
                    "min": 1, // 必填 数字
                    "max": 100, // 必填 数字
                    "desc": "",
                    "usage": "filter",
                };
            },
            create: function(rule) {
                return $http({
                    method: 'POST',
                    headers:{'Content-Type':'application/x-www-form-urlencoded'},
                    data: $.param(rule),
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
                    return res.data;
                }, function() {
                    $rootScope.message.error('服务器异常,无法获取标识为' + id + '的数据.');
                    return null;
                });
            },
            update: function(rule) {
                return $http({
                    method: 'PUT',
                    headers:{'Content-Type':'application/x-www-form-urlencoded'},
                    data: $.param(rule),
                    url: uri + '/' + rule.id
                });
            },
            remove: function(id) {
                return $http({
                    method: 'DELETE',
                    url: uri + '/' + id
                });
            },
        };
    });
});