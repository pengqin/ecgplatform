'use strict';
define(function(require, exports) {

angular.module('ecgEmployeeService', [])
    .factory("EmployeeService", function() {
        var chiefs = [], chiefsTotal = 10;
        return {
            getChief: function() {
                for (var i=0; i<10; i++) {
                    chiefs.push({id: i, name: "主任"+i});
                }
                return chiefs;
            },
            getChiefTotal: function() {
                return chiefsTotal;
            }
        };
    });
});