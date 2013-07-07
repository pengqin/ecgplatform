'use strict';
'use strict';
define(function(require, exports) {

    exports.testTask = function(it, ProfileService, TaskService) {

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