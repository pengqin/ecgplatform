'use strict';
define(function(require, exports) {

angular.module('ecgTaskService', [])
    .factory("TaskService", function() {
        var undones = [], dones = [];
        return {
            getAllUndones: function() {
                while (undones.length !== 0) {
                    undones.pop();
                }
                for (var i=0; i<10; i++) {
                    undones.push({
                        id: i,
                        userId: 1,
                        userName: '客户'+i,
                        createdDate: '2011-01-11 12:22:00',
                        testItem: '1',
                        status: 'normal',
                        isHandler: false,
                        bloodPressureLow: 60, // 低压
                        bloodPressureHigh: 100, // 高压
                        heartRhythm: 80, // 心率
                        bloodOxygen: 40, // 血氧
                        breath: 40, // 呼吸
                        temperature: 37.3, // 温度
                        pulserate: 68 // 脉率
                    });
                }
                return undones;
            },
            getAllUndonesTotal: function() {
                return undones.length;
            },
            getAllDones: function() {
                return dones;
            }
        };
    });
});