'use strict';
define(function(require, exports) {

angular.module('ecgChiefService', [])
    .factory("ChiefService", function() {
        var chiefs = [], chiefsTotal = 100;
        for (var i=0; i<chiefsTotal; i++) {
            chiefs.push({
                id: i, 
                name: "主任"+i,
                gender: i % 2,
                birthday: "1950-07-09",
                idCard: "44080319881191999" + i,
                title: "主任" + i,
                tel: "010-89898989",
                hospital: "医院" + i,
                dismissed: i % 2
            });
        }

        return {
            queryAll: function() {
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
                for (var i=0; i<chiefsTotal; i++) {
                    if (chiefs[i].id == id) {
                        return chiefs[i];
                    }
                }
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