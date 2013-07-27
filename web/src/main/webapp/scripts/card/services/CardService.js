'use strict';
define(function(require, exports) {

angular.module('ecgCardService', [])
    .factory("CardService", function($rootScope, $http) {
        var uri = PATH + "/api/card";

        var mock = [{
            serial: "serial1",
            chargedDate: "2013-01-01",
            userId: "1",
            userName: "用户1",
            days: "365",
            chargeType: "phone",
            employeeId: null,
            employeeName: null,
        }, {
            serial: "serial2",
            chargedDate: "2013-01-02",
            userId: "2",
            userName: "用户2",
            days: "365",
            chargeType: "web",
            employeeId: 1,
            employeeName: "管理员"
        }];
        return {
            queryAll: function() {
                return $http({
                    method: 'GET',
                    url: uri
                }).then(function(res) {
                    if (res.data.datas && res.data.datas.length > 0) {
                        return res.data.datas;
                    } else {
                        return [];    
                    }
                }, function() {
                    return mock || [];
                });
            },
            charge: function(card) {
                var putobj = $.extend({}, card);
                delete putobj.serial;
                return $http({
                    method: 'PUT',
                    headers:{'Content-Type':'application/x-www-form-urlencoded'},
                    data: $.param(putobj),
                    url: uri + '/' + card.serial
                });
            },
            get: function(card) {
                return $http({
                    method: 'GET',
                    cache: false,
                    url: uri + '/' + card.serial
                }).then(function(res) {
                    return res.data;
                }, function() {
                    return null;
                });
            }
        };
    });
});