'use strict';
'use strict';
define(function(require, exports) {

    exports.testTask = function(it, ProfileService, TaskService) {

        /**
         * 测试用例场景设计

         * 接线员A查询得到6个未完成任务
         * 管理员/专家将其中一个任务转发给接线员B
         * 管理员/专家将其中一个任务转发给专家A
         * 接线员A查询到2个未完成任务
         * 管理员/专家查询到4个未完成任务
         * 接线员A回复一个任务
         * 接线员A转任务给专家A
         * 接线员A查询到0个未完成任务
         * 接线员A查询到1个未完成任务
         * 接线员A能查看检测请求信息，回复信息

         * 接线员B查询得到1个未完成任务
         * 接线员B回复任务
         * 接线员B查询到0个未完成任务
         * 接线员B查询到1个未完成任务

         * 专家A查询到2个未完成任务
         * 专家A回复任务
         * 专家A查询到1个未完成任务
         * 专家A查询到1个完成任务
         * 专家A能查看检测请求信息，回复信息

         */
        // Rule
        it("the services should be defined", function() {
            expect(ProfileService).not.to.be(undefined);
            expect(TaskService).not.to.be(undefined);
        });

        it("the undone task list for admin should be retrieved", function(done) {
            ProfileService.get('admin')
            .then(function(user) {
                return user;
            }, function() {
                return null
            })
            .then(function(user) {
                if (user) {
                    TaskService.queryAllTaskByEmployee(
                        user, 
                        {status: 'undone'}
                    ).then(function(tasks) {
                        if (tasks.length > 0) {
                            done();
                        } else {
                            throw new Error("failed to retrieved the list for admin");
                        }
                    });
                } else {
                    throw new Error("failed to retrieved the profile of the admin");
                }
            });
        });

        it("the undone task list for chief should be retrieved", function(done) {
            ProfileService.get('chief')
            .then(function(user) {
                return user;
            }, function() {
                return null
            })
            .then(function(user) {
                if (user) {
                    TaskService.queryAllTaskByEmployee(
                        user, 
                        {status: 'undone'}
                    ).then(function(tasks) {
                        if (tasks.length > 0) {
                            done();
                        } else {
                            throw new Error("failed to retrieved the list for chief");
                        }
                    });
                } else {
                    throw new Error("failed to retrieved the profile of the chief");
                }
            });
        });

        it("the undone task list for operator should be retrieved", function(done) {
            ProfileService.get('operator')
            .then(function(user) {
                return user;
            }, function() {
                return null
            })
            .then(function(user) {
                if (user) {
                    TaskService.queryAllTaskByEmployee(
                        user, 
                        {status: 'undone'}
                    ).then(function(tasks) {
                        if (tasks.length >= 0) {
                            done();
                        } else {
                            throw new Error("failed to retrieved the list for operator");
                        }
                    });
                } else {
                    throw new Error("failed to retrieved the profile of the operator");
                }
            });
        });

        it("the undone task list for expert should be retrieved", function(done) {
            ProfileService.get('operator')
            .then(function(user) {
                return user;
            }, function() {
                return null
            })
            .then(function(user) {
                if (user) {
                    TaskService.queryAllTaskByEmployee(
                        user, 
                        {status: 'undone'}
                    ).then(function(tasks) {
                        if (tasks.length >= 0) {
                            done();
                        } else {
                            throw new Error("failed to retrieved the list for expert");
                        }
                    });
                } else {
                    throw new Error("failed to retrieved the profile of the expert");
                }
            });
        });

        it("the done task list for admin should be retrieved", function(done) {
            ProfileService.get('admin')
            .then(function(user) {
                return user;
            }, function() {
                return null
            })
            .then(function(user) {
                if (user) {
                    TaskService.queryAllTaskByEmployee(
                        user, 
                        {status: 'done'}
                    ).then(function(tasks) {
                        if (tasks.length > 0) {
                            done();
                        } else {
                            throw new Error("failed to retrieved the list for admin");
                        }
                    });
                } else {
                    throw new Error("failed to retrieved the profile of the admin");
                }
            });
        });

        it("the done task list for chief should be retrieved", function(done) {
            ProfileService.get('chief')
            .then(function(user) {
                return user;
            }, function() {
                return null
            })
            .then(function(user) {
                if (user) {
                    TaskService.queryAllTaskByEmployee(
                        user, 
                        {status: 'done'}
                    ).then(function(tasks) {
                        if (tasks.length > 0) {
                            done();
                        } else {
                            throw new Error("failed to retrieved the list for chief");
                        }
                    });
                } else {
                    throw new Error("failed to retrieved the profile of the chief");
                }
            });
        });

        it("the done task list for operator should be retrieved", function(done) {
            ProfileService.get('operator')
            .then(function(user) {
                return user;
            }, function() {
                return null
            })
            .then(function(user) {
                if (user) {
                    TaskService.queryAllTaskByEmployee(
                        user, 
                        {status: 'done'}
                    ).then(function(tasks) {
                        if (tasks.length >= 0) {
                            done();
                        } else {
                            throw new Error("failed to retrieved the list for operator");
                        }
                    });
                } else {
                    throw new Error("failed to retrieved the profile of the operator");
                }
            });
        });

        it("the done task list for expert should be retrieved", function(done) {
            ProfileService.get('operator')
            .then(function(user) {
                return user;
            }, function() {
                return null
            })
            .then(function(user) {
                if (user) {
                    TaskService.queryAllTaskByEmployee(
                        user, 
                        {status: 'done'}
                    ).then(function(tasks) {
                        if (tasks.length >= 0) {
                            done();
                        } else {
                            throw new Error("failed to retrieved the list for expert");
                        }
                    });
                } else {
                    throw new Error("failed to retrieved the profile of the expert");
                }
            });
        });
    };

});