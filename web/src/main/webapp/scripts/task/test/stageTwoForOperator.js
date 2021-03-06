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
        it("stage 2:the user should authenciated in task test module.", function(done) {
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

        it("stage 2:the profile of the user should be retrieved", function(done) {
            ProfileService.get(user.username)
            .then(function(persistedUser) {
                expect(persistedUser).not.to.be(null);
                expect(persistedUser.username).to.be(user.username);
                user = persistedUser;
                done();
            }, function() {
                throw new Error('failed to retrieved the profile');
            });
        });

        var task, anothertask;
        it("stage 2:the undone task list should be retrieved", function(done) {
            TaskService.queryAllTaskByEmployee(
                user, 
                {status: 'undone'}
            ).then(function(paging) {
                var tasks = paging.datas;
                expect(tasks).not.to.be(null);
                expect(tasks.length).not.to.be(0);
                expect(tasks.length).not.to.be(1);
                task = tasks[0];
                anothertask = tasks[1];
                env.undone = tasks.length;
                expect(task.userId).not.to.be(null);
                expect(task.examinationId).not.to.be(null);
                done();
            });
        });

        it("stage 2:the done task list should be retrieved", function(done) {
            TaskService.queryAllTaskByEmployee(
                user, 
                {status: 'done'}
            ).then(function(paging) {
                var tasks = paging.datas;
                expect(tasks).not.to.be(null);
                env.done = tasks.length;
                done();
            });
        });

        var examination, anotherexamination;
        it("stage 2:the examination of a specific undone task should be retrieved", function(done) {
            expect(task).not.to.be(undefined);
            TaskService.getExamination(task.id)
            .then(function(pesistedExamination) {
                expect(pesistedExamination).not.to.be(undefined);
                expect(pesistedExamination).not.to.be(null);
                examination = pesistedExamination;
                done();
            });
        });

        it("stage 2:the other examination of a specific undone task should be retrieved", function(done) {
            expect(anothertask).not.to.be(undefined);
            TaskService.getExamination(anothertask.id)
            .then(function(pesistedExamination) {
                expect(pesistedExamination).not.to.be(undefined);
                expect(pesistedExamination).not.to.be(null);
                anotherexamination = pesistedExamination;
                done();
            });
        });

        // 并行的插入5条和3条回复
        var replys;
        it("stage 2:five replies of the examination be created", function(done) {
            expect(task).not.to.be(undefined);
            expect(examination).not.to.be(undefined);

            var len = 0, count = 0;
            replys = []
            replys.push({result: "结果1", content: "建议1", reason: "reason1", level: "success"});
            replys.push({result: "结果2", content: "建议2", reason: "reason2", level: "success"});
            replys.push({result: "结果3", content: "建议3", reason: "reason3", level: "success"});
            replys.push({result: "结果4", content: "建议4", reason: "reason4", level: "success"});
            replys.push({result: "结果5", content: "建议5", reason: "reason5", level: "success"});
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

        it("stage 2:five replies of the examination be retrieved", function(done) {
            expect(task).not.to.be(undefined);
            expect(examination).not.to.be(undefined);
            expect(replys).not.to.be(undefined);

            TaskService.getReplyByExamination(examination)
            .then(function(pesistedReplies) {
                expect(pesistedReplies).not.to.be(undefined);
                expect(pesistedReplies).not.to.be(null);
                expect(pesistedReplies.length).to.be(replys.length);
                done();
            });
        });

        var secreplies;
        it("stage 2:threee replies of the other examination be created", function(done) {
            expect(anothertask).not.to.be(undefined);
            expect(anotherexamination).not.to.be(undefined);

            var len = 0, count = 0;
            secreplies = []
            secreplies.push({result: "另外结果1", content: "建议1", reason: "reason1", level: "success"});
            secreplies.push({result: "另外结果2", content: "建议2", reason: "reason2", level: "success"});
            secreplies.push({result: "另外结果3", content: "建议3", reason: "reason3", level: "success"});
            len = secreplies.length;

            $(secreplies).each(function(i, reply) {
                TaskService.reply(anotherexamination, reply)
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

        it("stage 2:three replies of the other examination be retrieved", function(done) {
            expect(anothertask).not.to.be(undefined);
            expect(anotherexamination).not.to.be(undefined);
            expect(secreplies).not.to.be(undefined);

            TaskService.getReplyByExamination(anotherexamination)
            .then(function(pesistedReplies) {
                expect(pesistedReplies).not.to.be(undefined);
                expect(pesistedReplies).not.to.be(null);
                expect(pesistedReplies.length).to.be(secreplies.length);
                done();
            });
        });

        it("stage 2:the undone task total should be the same after replies is posted", function(done) {
            TaskService.queryAllTaskByEmployee(
                user, 
                {status: 'undone'}
            ).then(function(paging) {
                var tasks = paging.datas;
                expect(tasks).not.to.be(null);
                expect(tasks.length).to.be(env.undone);
                done();
            });
        });

        it("stage 2:the done task total should be the same after replies is posted", function(done) {
            TaskService.queryAllTaskByEmployee(
                user, 
                {status: 'done'}
            ).then(function(paging) {
                var tasks = paging.datas;
                expect(tasks).not.to.be(null);
                expect(tasks.length).to.be(env.done);
                done();
            });
        });

        it("stage 2:the task can be marked as completed", function(done) {
            TaskService.complete(task)
            .then(function() {
                done();
            }, function() {
                throw new Error("the task can\' t be marked as completed.");
            });
        });

        it("stage 2:the another task can be marked as completed too", function(done) {
            TaskService.complete(anothertask)
            .then(function() {
                done();
            }, function() {
                throw new Error("the task can\' t be marked as completed.");
            });
        });

        it("stage 2:the undone task total should be decreased with 2", function(done) {
            TaskService.queryAllTaskByEmployee(
                user, 
                {status: 'undone'}
            ).then(function(paging) {
                var tasks = paging.datas;
                expect(tasks).not.to.be(null);
                expect(tasks.length).to.be(env.undone - 2);
                env.undone -= 2;
                done();
            });
        });

        it("stage 2:the done task total should be increased with 1", function(done) {
            TaskService.queryAllTaskByEmployee(
                user, 
                {status: 'done'}
            ).then(function(paging) {
                var tasks = paging.datas;
                expect(tasks).not.to.be(null);
                expect(tasks.length).to.be(env.done + 2);
                env.done = tasks.length;
                done();
            });
        });
        
    };

});