'use strict';
define(function(require, exports) {

angular.module('ecgTaskService', [])
    .factory("TaskService", function() {
        var undones = [], dones = [];
        return {
            getAllUndones: function() {
                while (undones.length !== 0) {
                    undones.pop()
                }
                for (var i=0; i<10; i++) {
                    undones.push({
                        id: i,
                        guest: "张三"+i,
                        checkState: "正常",
                        processState: "未处理",
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
        }
    });
});