'use strict';
define(function(require, exports) {

    exports.test = function(mocha, angluarjs, services) {
        if (!runCase('task')) {
            return;
        }
        var it = mocha.it,
            user = mocha.user,
            httpProvider = angluarjs.httpProvider,
            UserService = services.UserService;

        // 登录
        var token;
        it("the user should authenciated.", function(done) {
            $.ajax({
                url: PATH + '/api/user/auth',
                data: {
                    'username': user.username,
                    'password': user.password
                },
                type: 'POST',
                dataType: 'json'
            }).then(function(res) {
                expect(res.token).not.to.be(undefined);
                token = res.token;
                done();
            }, function() {
                throw new Error('failed to authnenciate as a new user.');
            });
        });

        // 获取id
        var userId;
        it("the user's info should be retrieved.", function(done) {
            $.ajax({
                url: PATH + '/api/user?username=' + user.username,
                dataType: 'json',
                headers: {Authorization: token}
            }).then(function(res) {
                expect(res).not.to.be(undefined);
                expect(res.datas).not.to.be(undefined);
                expect(res.datas.length).to.be(1);
                userId = res.datas[0].id;
                expect(userId).not.to.be(undefined);
                done();
            }, function() {
                throw new Error('failed to retrieve user\'s  id.');
            });
        });

        // 获取某个id
        var taskId, apkId;
        it("the user's task should be retrieved.", function(done) {
            $.ajax({
                url: PATH + '/api/user/' + userId + '/task',
                dataType: 'json',
                headers: {Authorization: token}
            }).then(function(res) {
                expect(res).not.to.be(undefined);
                expect(res.datas).not.to.be(undefined);
                expect(res.datas.length).not.to.be(0);
                expect(res.datas.length).not.to.be(1);
                taskId = res.datas[0].id;
                apkId = res.datas[0].apkId;
                expect(taskId).not.to.be(undefined);
                expect(apkId).not.to.be(undefined);
                done();
            }, function() {
                throw new Error('failed to retrieve a task id.');
            });
        });

        it("the user's task should be retrieved with conditions.", function(done) {
            expect(apkId).not.to.be(undefined);
            $.ajax({
                url: PATH + '/api/user/' + userId + '/task?apkId:in=' + apkId,
                dataType: 'json',
                headers: {Authorization: token}
            }).then(function(res) {
                expect(res).not.to.be(undefined);
                expect(res.datas).not.to.be(undefined);
                expect(res.datas.length).to.be(1);
                expect(res.datas[0].apkId).to.be(apkId);
                done();
            }, function() {
                throw new Error('failed to retrieve a task id.');
            });
        });

        it("the user's task should not be retrieved with conditions.", function(done) {
            expect(apkId).not.to.be(undefined);
            $.ajax({
                url: PATH + '/api/user/' + userId + '/task?apkId:notIn=' + apkId,
                dataType: 'json',
                headers: {Authorization: token}
            }).then(function(res) {
                expect(res).not.to.be(undefined);
                expect(res.datas).not.to.be(undefined);
                expect(res.datas.length).not.to.be(0);
                var found = false;
                $(res.datas).each(function(i, task) {
                    if (task.apkId === apkId) {
                        found = true;
                    }
                });
                expect(found).not.to.be(true);
                done();
            }, function() {
                throw new Error('failed to retrieve a task id.');
            });
        });

        it("the user's task should not be deleted", function(done) {
            expect(taskId).not.to.be(undefined);
            $.ajax({
                url: PATH + '/api/user/' + userId + '/task/' + taskId,
                type: "DELETE",                
                headers: {Authorization: token}
            }).then(function(res) {
                done();
            }, function() {
                throw new Error('failed to deleted a task.');
            });
        });
    };

});