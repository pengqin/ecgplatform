define(function(require, exports) {

'use strict';

angular.module('ecgTaskService', [])
    .factory("TaskService", ['$rootScope', '$http', function($rootScope, $http) {
        return {
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
            getReplyByExamination: function(examination) {
                var id = examination.id || examination;
                return $http({
                    method: 'GET',
                    url: PATH + '/api/examination/' + id + '/reply'
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