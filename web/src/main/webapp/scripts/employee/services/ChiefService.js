'use strict';
define(function(require, exports) {

angular.module('ecgChiefService', [])
    .factory("ChiefService", function() {
        var chiefs = [], chiefsTotal = 10;
        return {
            queryAll: function() {
                for (var i=0; i<10; i++) {
                    chiefs.push({
                        id: i, 
                        name: "主任"+i,
                        gender: 1,
                        birthday: "1950-07-09",
                        idCard: "440803198811919999",
                        title: "主任",
                        tel: "010-89898989",
                        hospital: "安贞医院",
                        dismissed: 1
                    });
                }
                return chiefs;
            },
            getTotal: function() {
                return chiefsTotal;
            },
            remove: function(id) {
                
            },
            getPlainObject: function() {
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
            create: function(chief) {
                chief.id = (new Date()).getTime();
                chiefs.push(chief);
            },
            get: function(id) {
                return {
                    id: id, 
                    name: "主任" + id,
                    gender: 1,
                    birthday: "1950-07-09",
                    idCard: "440803198811919999",
                    title: "主任",
                    tel: "010-89898989",
                    hospital: "安贞医院",
                    dismissed: 1
                };
            },
            update: function() {
                
            }
        };
    });
});