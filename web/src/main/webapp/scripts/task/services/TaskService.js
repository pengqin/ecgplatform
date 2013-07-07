'use strict';
define(function(require, exports) {

angular.module('ecgTaskService', [])
    .factory("TaskService", ['$rootScope', '$http', function($rootScope, $http) {
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
            queryAllTaskByEmployee: function(user, opts) {
                var opts = opts || {};
                var tasks = [];
                for (var i=0; i<10; i++) {
                    tasks.push({
                        id: i,
                        userId: 1,
                        userName: '客户'+i,
                        operatorId: '1',
                        operatorName: '接线员',
                        expertId: '1',
                        expertName: '专家',
                        status: 'pending',
                        level: 'success',
                        examinationId: i,
                        auto: false
                    });
                }
                return tasks;
            },
            getExamination: function(id) {
                return {
                    id: 1,
                    userId: 1,
                    userName: '客户',
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
                };
            },
            getPlainReply: function() {
                return {
                    title: "标题",
                    result: "",
                    content: ""
                };
            },
            reply: function(examination, reply) {
                console.info(examination);
                console.info(reply);
                // 先创建reply
                // 然后更新state到completed
            },
            queryExpertsByOperators: function(user) {
                return $http({
                    method: 'GET',
                    url: PATH + '/api/expert'
                }).then(function(res) {
                    if (res.data.datas && res.data.datas.length > 0) {
                        return res.data.datas;
                    } else {
                        return [];    
                    }
                }, function() {
                    $rootScope.message.error('服务器异常,无法获取数据');
                    return [];
                });
            },
            forward: function(task, expert) {
                console.info(task);
                console.info(expert);
                // 先更新expert
                // 然后更新state到forwarded
            }
        };
    }]);
});