'use strict';
'use strict';
define(function(require, exports) {

    exports.test = function(mocha, angluarjs, services, env) {

        var it = mocha.it,
            user = mocha.user,
            httpProvider = angluarjs.httpProvider,
            ProfileService = services.ProfileService,
            TaskService = services.TaskService;

        var token = null;

        // 登录
        it("the user should authenciated in task test module.", function(done) {
            $.ajax({
                url: PATH + '/api/auth',
                data: {
                    'username': user.username,
                    'password': user.password
                },
                type: 'POST',
                dataType: 'json'
            }).then(function(res) {
                token = res.token;
                expect(token).not.to.be(undefined);
                httpProvider.defaults.headers.common['Authorization'] = token;
                done();
            }, function() {
                throw new Error('failed to authnenciate as admin in rule test module');
            });
        });

        it("the profile of the user should be retrieved", function(done) {
            ProfileService.get(user.username)
            .then(function(persistedUser) {
                expect(persistedUser).not.to.be(null);
                expect(persistedUser.username).to.be(user.username);
                user = persistedUser;
                done();
            }, function() {
                return null
            });
        });

        var task;
        it("the undone task list should be retrieved", function(done) {
            TaskService.queryAllTaskByEmployee(
                user, 
                {status: 'undone'}
            ).then(function(tasks) {
                expect(tasks).not.to.be(null);
                expect(tasks.length).not.to.be(0);
                task = tasks[0];
                env.undone = tasks.length;
                expect(task.userId).not.to.be(null);
                expect(task.examinationId).not.to.be(null);
                done();
            });
        });

        it("the done task list should be retrieved", function(done) {
            TaskService.queryAllTaskByEmployee(
                user, 
                {status: 'done'}
            ).then(function(tasks) {
                expect(tasks).not.to.be(null);
                env.done = tasks.length;
                done();
            });
        });

        var examination;
        it("the examination of a specific undone task should be retrieved", function(done) {
            expect(task).not.to.be(undefined);
            TaskService.getExamination(task.id)
            .then(function(pesistedExamination) {
                expect(pesistedExamination).not.to.be(undefined);
                expect(pesistedExamination).not.to.be(null);
                examination = pesistedExamination;
                done();
            });
        });

        // 并行的插入2条回复
        it("two replies of the examination be created", function(done) {
            expect(task).not.to.be(undefined);
            expect(examination).not.to.be(undefined);

            var replys = [], len = 0, count = 0;
            replys.push({result: "结果1", content: "建议1"});
            replys.push({result: "结果2", content: "建议2"});
            len = replys.length;

            $(replys).each(function(i, reply) {
                TaskService.reply(examination, reply)
                .then(function(flag) {
                    if (flag) {
                        count++;
                    }
                    if (count === len) {
                        done();
                    }
                }, function() {
                    throw new Error("failed to create a reply for a specific examination.");
                });
            });
        });

        it("two replies of the examination be retrieved", function(done) {
            expect(task).not.to.be(undefined);
            expect(examination).not.to.be(undefined);

            TaskService.getReplyByExamination(examination)
            .then(function(replies) {
                console.info(replies);
                expect(replies).not.to.be(undefined);
                expect(replies).not.to.be(null);
                expect(replies.length).to.be(2);
                done();
            });
        });

        it("the undone task total should be decreased with 1", function(done) {
            TaskService.queryAllTaskByEmployee(
                user, 
                {status: 'undone'}
            ).then(function(tasks) {
                expect(tasks).not.to.be(null);
                expect(tasks.length).to.be(env.undone - 1);
                env.undone -= 1;
                done();
            });
        });

        it("the done task total should be increased with 1", function(done) {
            TaskService.queryAllTaskByEmployee(
                user, 
                {status: 'done'}
            ).then(function(tasks) {
                expect(tasks).not.to.be(null);
                expect(tasks.length).to.be(env.done + 1);
                env.done = tasks.length;
                done();
            });
        });
        
    };

});