'use strict';
define(function(require, exports) {

angular.module('ecgEmployeeService', [])
    .factory("EmployeeService", function() {
        var chiefs = [], chiefsTotal = 10;
        return {
            getChiefs: function() {
                for (var i=0; i<10; i++) {
                    chiefs.push({
                        id: i, 
                        name: "主任"+i,
                        gender: {
                            label: "男",
                            id: 1
                        },
                        brithday: "1950-07-09",
                        idCard: "440803198811919999",
                        title: "主任",
                        tel: "010-89898989",
                        hospital: "安贞医院",
                        dismissed: {
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
                
            },
            getPlainChief: function() {
                return {
                    name: "",
                    gender: 1,
                    birthday: "",
                    idCard: "",
                    title: "",
                    tel: "",
                    hospital: "",
                    dismissed: 1
                };
            },
            createChief: function(chief) {
                chief.id = (new Date()).getTime();
                chief.gender = chief.gender ? {label: "男", value: 1} : {label: "女", value: 0};
                chief.dismissed = chief.dismissed ? {label: "在职", value: 1} : {label: "离职", value: 0};
                chiefs.push(chief);
            }
        };
    });
});