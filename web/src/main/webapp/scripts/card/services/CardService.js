'use strict';
define(function(require, exports) {

angular.module('ecgCardService', [])
    .factory("CardService", function($rootScope, $http) {
        var uri = PATH + "/api/card";

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
                    return [];
                });
            },
            charge: function(employee, user, card) {
                return $http({
                    method: 'POST',
                    headers:{'Content-Type':'application/x-www-form-urlencoded'},
                    data: $.param({
                        mobile: user.mobile,
                        employeeId: employee.id,
                        activedDate: card.activedDate,
                        password: card.password
                    }),
                    url: uri + '/' + card.serial + '/charge'
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