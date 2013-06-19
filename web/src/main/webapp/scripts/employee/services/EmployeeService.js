'use strict';
define(function(require, exports) {

angular.module('ecgEmployeeService', [])
    .factory("EmployeeService", function() {
        var chiefs = [], chiefsTotal = 10;
        return {
            getChief: function() {
                for (var i=0; i<10; i++) {
                    chiefs.push({
                        id: i, 
                        name: "主任"+i,
                        gender: {
                            label: "男",
                            id: 1
                        },
                        brith: "1950-07-09",
                        identity: "440803198811919999",
                        position: "主任",
                        phone: "010-89898989",
                        hospital: "安贞医院",
                        state: {
                            label: "在职",
                            id: 1
                        }
                    });
                }
                return chiefs;
            },
            getChiefTotal: function() {
                return chiefsTotal;
            },
            removeChief: function(id) {
                
            }
        };
    });
});