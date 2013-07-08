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
                var opts = opts || {}, url, params = '?';

                url = "/api/task";
                if (user.roles === 'operator') {
                    url = "/api/operator/" + user.id + '/task';
                } else if (user.roles === 'expert') {
                    url = "/api/expert/" + user.id + '/task';
                }

                if (opts.status === 'undone') {
                    params += 'status=pending&status=proceeding';
                } else if (opts.status === 'done') {
                    params += 'status=completed';
                }

                return $http({
                    method: 'GET',
                    url: PATH + url + params
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
            getExamination: function(id) {
                return $http({
                    method: 'GET',
                    cache: false,
                    url: PATH + '/api/examination/' + id
                }).then(function(res) {
                    return res.data;
                }, function() {
                    $rootScope.message.error('服务器异常,无法获取标识为' + id + '的数据.');
                    return null;
                });
            },
            getPlainReply: function() {
                return {
                    title: "标题",
                    result: "",
                    content: ""
                };
            },
            reply: function(examination, reply) {
                var newreply = this.getPlainReply();
                    newreply.result = reply.result;
                    newreply.content = reply.content;
                return $http({
                    method: 'POST',
                    headers:{'Content-Type':'application/x-www-form-urlencoded'},
                    data: $.param(newreply),
                    url: PATH + '/api/examination/' + examination.id + '/reply'
                }).then(function(res) {
                    if (res.status === 201) {
                        return true;
                    } else {
                        return false;
                    }
                }, function() {
                    return false;
                });
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
            forward: function(task) {
                return $http({
                    method: 'PUT',
                    headers:{'Content-Type':'application/x-www-form-urlencoded'},
                    data: $.param({
                        status: 'proceeding'
                    }),
                    url: PATH + '/api/task/' + task.id
                }).then(function(res) {
                    return true;
                }, function() {
                    return false;
                });
            },
            getReplyByExamination: function(examinationId) {
                return $http({
                    method: 'GET',
                    url: PATH + '/api/examination/' + examinationId + '/reply'
                }).then(function(res) {
                    if (res.data && res.data.length > 0) {
                        return res.data;
                    } else {
                        return [];    
                    }
                }, function() {
                    $rootScope.message.error('服务器异常,无法获取数据');
                    return [];
                });
            }
        };
    }]);
});