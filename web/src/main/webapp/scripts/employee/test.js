'use strict';
define(function(require, exports) {

    exports.testEmployee = function(it, ChiefService, ExpertService, OperatorService, ProfileService) {
        // profile
        it("the ProfileService should be defined", function() {
            expect(ProfileService).not.to.be(undefined);
        });

        it("the session user's profile should be retrieved, updated and roll back.", function() {
            var sessionuser, username = $.cookie("AiniaOpUsername");
            ProfileService.get(username).then(function(profile) {
                if (profile) {
                    // retrieved
                    expect(profile).not.to.be(undefined);
                    sessionuser = profile;
                    sessionuser.gender = 0;
                    // updated
                    ProfileService.update(sessionuser).then(function() {
                        done();
                    }, function() {
                        throw new Error('the profile can\'t be updated');
                    });
                } else {
                    throw new Error('the profile can\'t be retrieved');
                }
            });
        });

        it("the session user's password should be updated", function() {
            var sessionuser, username = $.cookie("AiniaOpUsername");
            ProfileService.get(username).then(function(profile) {
                if (profile) {
                    // retrieved
                    expect(profile).not.to.be(undefined);
                    sessionuser = profile;
                    // updated
                    ProfileService.updatePassword(sessionuser.id, TESTCONFIGS.password, TESTCONFIGS.password + 'updated')
                    .then(function() {
                        $.ajax({
                            url: '/api/auth',
                            data: {
                                'username': TESTCONFIGS.username,
                                'password': TESTCONFIGS.password + 'updated'
                            },
                            type: 'POST',
                            dataType: 'json'
                        }).then(function(res) {
                            // expect token
                            expect(res.token).not.to.be(undefined);
                            // roll back
                            ProfileService.updatePassword(sessionuser.id, TESTCONFIGS.password + 'updated', TESTCONFIGS.password)
                            .then(function() {
                                done();
                            }, function() {
                                throw new Error('the session user\'s password can\'t be rollback');
                            });
                        }, function() {
                            throw new Error('the session user can\'t login in');
                        });
                    }, function() {
                        throw new Error('the session user\'s password can\'t be updated');
                    });
                } else {
                    throw new Error('the profile can\'t be retrieved');
                }
            });
        });

        // Chief
        it("the ChiefService should be defined", function() {
            expect(ChiefService).not.to.be(undefined);
        });

        it("the chief list should be retrieved", function(done) {
            ChiefService.queryAll().then(function(chiefs) {
                if (chiefs.length > 0) {
                    done();
                } else {
                    throw new Error('the chief list can\'t be retrieved');
                }
            }, function() {
                throw new Error('the chief list can\'t be retrieved');
            });
        });

        it("the getPlainObject method of ChiefService should be defined", function() {
            expect(ChiefService.getPlainObject).not.to.be(undefined);
        });

        it("the chief should not be created without username and name", function(done) {
            var invalid = ChiefService.getPlainObject();
            ChiefService.create(invalid).then(function(flag) {
                if (flag) {
                    throw new Error('the chief can be created');
                } else {
                    done();
                }
            });
        });

        it("the chief should not be created without password", function(done) {
            var invalid = ChiefService.getPlainObject();
            invalid.name = 'test' + (new Date()).getTime();
            invalid.username = 'test' + (new Date()).getTime();
            invalid.password = '';
 
            ChiefService.create(invalid).then(function(flag) {
                if (flag) {
                    throw new Error('the chief can be created');
                } else {
                    done();
                }
            });
        });

        var chief = ChiefService.getPlainObject();

        it("the chief should be created when username, name and password are set", function(done) {
            chief.name = 'test' + (new Date()).getTime();
            chief.username = 'test' + (new Date()).getTime();
            chief.password = chief.name;
 
            ChiefService.create(chief).then(function(flag) {
                if (flag) {
                    done();
                } else {
                    throw new Error('the chief can\'t be created');
                }
            });
        });

        it("the chief should able to login in with default password", function(done) {
            $.ajax({
                url: '/api/auth',
                data: {
                    'username': chief.username,
                    'password': chief.password
                },
                type: 'POST',
                dataType: 'json'
            }).then(function(res) {
                done();
            }, function() {
                throw new Error('the chief can\'t login in');
            });
        });

        it("the chief id should be retrieved by ProfileService", function(done) {
            ProfileService.get(chief.username).then(function(employee) {
                if (employee) {
                    expect(employee.id).not.to.be(undefined);
                    chief.id = employee.id;
                    done();
                } else {
                    throw new Error('the chief id can\'t be created');
                }
            });
        });

        it("the chief should be updated as expectation", function(done) {
            ChiefService.get(chief.id).then(function(chief) {
                chief.status = 'ONLINE';
                chief.gender = 0;
                chief.birthday = '1983-01-21';
                chief.idCard = '440803198801122455';
                chief.title= '主任1';
                chief.mobile= '13800000000';
                chief.company = 'chief company';
                chief.enabled = false;
                chief.dismissed = true;
                delete chief.version;
                ChiefService.update(chief).then(function() {
                    ChiefService.get(chief.id).then(function(pesistedChief) {
                        if (pesistedChief) {
                            expect(pesistedChief.id).to.be(chief.id);
                            expect(pesistedChief.username).to.be(chief.username);
                            expect(pesistedChief.name).to.be(chief.name);
                            expect(pesistedChief.status).to.be(chief.status);
                            expect(pesistedChief.title).to.be(chief.title);
                            expect(pesistedChief.mobile).to.be(chief.mobile);
                            expect(pesistedChief.birthday).to.be(chief.birthday);
                            expect(pesistedChief.company).to.be(chief.company);
                            expect(pesistedChief.enabled).to.be(chief.enabled);
                            expect(pesistedChief.dismissed).to.be(chief.dismissed);
                            expect(pesistedChief.roles).to.be(chief.roles);
                            done();
                        } else {
                            throw new Error('the chief can\'t be retieved again');
                        }
                    });
                }, function() {
                    throw new Error('the chief can\'t be updated by id');
                });
            }, function() {
                throw new Error('the chief can\'t be retrieved by id');
            });
        });

        it("the chief\' password should be reset", function(done) {
            ProfileService.resetPassword(chief.id)
            .then(function() {
                done();
            }, function() {
                throw new Error('the chief\'s password can\'t be reset.');
            });
        });

        it("the chief should able to login in with reset password", function(done) {
            $.ajax({
                url: '/api/auth',
                data: {
                    'username': chief.username,
                    'password': chief.username
                },
                type: 'POST',
                dataType: 'json'
            }).then(function(res) {
                done();
            }, function() {
                throw new Error('the chief can\'t login in');
            });
        });

        it("the chief should be removed", function(done) {
            ChiefService.remove(chief.id).then(function() {
                done();
            }, function() {
                throw new Error('the chief can\'t be removed');
            });
        });

        // Expert
        it("the ExpertService should be defined", function() {
            expect(ExpertService).not.to.be(undefined);
        });

        it("the expert list should be retrieved", function(done) {
            ExpertService.queryAll().then(function(experts) {
                if (experts.length > 0) {
                    done();
                } else {
                    throw new Error('the expert list can\'t be retrieved');
                }
            }, function() {
                throw new Error('the expert list can\'t be retrieved');
            });
        });

        it("the getPlainObject method of ExpertService should be defined", function() {
            expect(ExpertService.getPlainObject).not.to.be(undefined);
        });


        it("the expert should not be created without username and name", function(done) {
            var invalid = ExpertService.getPlainObject();
            ExpertService.create(invalid).then(function(flag) {
                if (flag) {
                    throw new Error('the expert can be created');
                } else {
                    done();
                }
            });
        });

        it("the expert should not be created without password", function(done) {
            var invalid = ExpertService.getPlainObject();
            invalid.name = 'test' + (new Date()).getTime();
            invalid.username = 'test' + (new Date()).getTime();
            invalid.password = '';
 
            ExpertService.create(invalid).then(function(flag) {
                if (flag) {
                    throw new Error('the expert can be created');
                } else {
                    done();
                }
            });
        });

        var expert = ExpertService.getPlainObject();

        it("the expert should be created when username, name and password are set", function(done) {
            expert.name = 'test' + (new Date()).getTime();
            expert.username = 'test' + (new Date()).getTime();
            expert.password = expert.name;
 
            ExpertService.create(expert).then(function(flag) {
                if (flag) {
                    done();
                } else {
                    throw new Error('the expert can\'t be created');
                }
            });
        });

        it("the expert should able to login in with default password", function(done) {
            $.ajax({
                url: '/api/auth',
                data: {
                    'username': expert.username,
                    'password': expert.password
                },
                type: 'POST',
                dataType: 'json'
            }).then(function(res) {
                done();
            }, function() {
                throw new Error('the expert can\'t login in');
            });
        });

        it("the expert id should be retrieved by ProfileService", function(done) {
            ProfileService.get(expert.username).then(function(employee) {
                if (employee) {
                    expect(employee.id).not.to.be(undefined);
                    expert.id = employee.id;
                    done();
                } else {
                    throw new Error('the expert id can\'t be created');
                }
            });
        });

        it("the expert should be updated as expectation", function(done) {
            ExpertService.get(expert.id).then(function(expert) {
                expert.status = 'ONLINE';
                expert.gender = 0;
                expert.birthday = '1983-01-21';
                expert.idCard = '440803198801122455';
                expert.title= '主任1';
                expert.mobile= '13800000000';
                expert.company = 'expert company';
                expert.enabled = false;
                expert.dismissed = true;
                delete expert.version;
                ExpertService.update(expert).then(function() {
                    ExpertService.get(expert.id).then(function(pesistedExpert) {
                        if (pesistedExpert) {
                            expect(pesistedExpert.id).to.be(expert.id);
                            expect(pesistedExpert.username).to.be(expert.username);
                            expect(pesistedExpert.name).to.be(expert.name);
                            expect(pesistedExpert.status).to.be(expert.status);
                            expect(pesistedExpert.title).to.be(expert.title);
                            expect(pesistedExpert.mobile).to.be(expert.mobile);
                            expect(pesistedExpert.birthday).to.be(expert.birthday);
                            expect(pesistedExpert.company).to.be(expert.company);
                            expect(pesistedExpert.enabled).to.be(expert.enabled);
                            expect(pesistedExpert.dismissed).to.be(expert.dismissed);
                            expect(pesistedExpert.roles).to.be(expert.roles);
                            done();
                        } else {
                            throw new Error('the expert can\'t be retieved again');
                        }
                    });
                }, function() {
                    throw new Error('the expert can\'t be updated by id');
                });
            }, function() {
                throw new Error('the expert can\'t be retrieved by id');
            });
        });

        it("the expert\' password should be reset", function(done) {
            ProfileService.resetPassword(expert.id)
            .then(function() {
                done();
            }, function() {
                throw new Error('the expert\'s password can\'t be reset.');
            });
        });

        it("the expert should able to login in with reset password", function(done) {
            $.ajax({
                url: '/api/auth',
                data: {
                    'username': expert.username,
                    'password': expert.username
                },
                type: 'POST',
                dataType: 'json'
            }).then(function(res) {
                done();
            }, function() {
                throw new Error('the expert can\'t login in');
            });
        });

        // Operator
        it("the OperatorService should be defined", function() {
            expect(OperatorService).not.to.be(undefined);
        });

        it("the operator list should be retrieved", function(done) {
            OperatorService.queryAll().then(function(operators) {
                if (operators.length > 0) {
                    done();
                } else {
                    throw new Error('the operator list can\'t be retrieved');
                }
            }, function() {
                throw new Error('the operator list can\'t be retrieved');
            });
        });

        it("the getPlainObject method of OperatorService should be defined", function() {
            expect(OperatorService.getPlainObject).not.to.be(undefined);
        });

        it("the operator should not be created without username and name", function(done) {
            var invalid = OperatorService.getPlainObject();
            OperatorService.create(invalid).then(function(flag) {
                if (flag) {
                    throw new Error('the operator can be created');
                } else {
                    done();
                }
            });
        });

        it("the operator should not be created without password", function(done) {
            var invalid = OperatorService.getPlainObject();
            invalid.name = 'test' + (new Date()).getTime();
            invalid.username = 'test' + (new Date()).getTime();
            invalid.password = '';
 
            OperatorService.create(invalid).then(function(flag) {
                if (flag) {
                    throw new Error('the operator can be created');
                } else {
                    done();
                }
            });
        });

        var operator = OperatorService.getPlainObject();

        it("the operator should be created when username, name and password are set", function(done) {
            operator.name = 'test' + (new Date()).getTime();
            operator.username = 'test' + (new Date()).getTime();
            operator.password = operator.name;
 
            OperatorService.create(operator).then(function(flag) {
                if (flag) {
                    done();
                } else {
                    throw new Error('the operator can\'t be created');
                }
            });
        });

        it("the operator should able to login in with default password", function(done) {
            $.ajax({
                url: '/api/auth',
                data: {
                    'username': operator.username,
                    'password': operator.password
                },
                type: 'POST',
                dataType: 'json'
            }).then(function(res) {
                done();
            }, function() {
                throw new Error('the operator can\'t login in');
            });
        });

        it("the operator id should be retrieved by ProfileService", function(done) {
            ProfileService.get(operator.username).then(function(employee) {
                if (employee) {
                    expect(employee.id).not.to.be(undefined);
                    operator.id = employee.id;
                    done();
                } else {
                    throw new Error('the operator id can\'t be created');
                }
            });
        });

        it("the operator should be updated as expectation", function(done) {
            OperatorService.get(operator.id).then(function(operator) {
                operator.status = 'ONLINE';
                operator.gender = 0;
                operator.birthday = '1983-01-21';
                operator.idCard = '440803198801122455';
                operator.title= '主任1';
                operator.mobile= '13800000000';
                operator.company = 'operator company';
                operator.enabled = false;
                operator.dismissed = true;
                delete operator.version;
                OperatorService.update(operator).then(function() {
                    OperatorService.get(operator.id).then(function(pesistedOperator) {
                        if (pesistedOperator) {
                            expect(pesistedOperator.id).to.be(operator.id);
                            expect(pesistedOperator.username).to.be(operator.username);
                            expect(pesistedOperator.name).to.be(operator.name);
                            expect(pesistedOperator.status).to.be(operator.status);
                            expect(pesistedOperator.title).to.be(operator.title);
                            expect(pesistedOperator.mobile).to.be(operator.mobile);
                            expect(pesistedOperator.birthday).to.be(operator.birthday);
                            expect(pesistedOperator.company).to.be(operator.company);
                            expect(pesistedOperator.enabled).to.be(operator.enabled);
                            expect(pesistedOperator.dismissed).to.be(operator.dismissed);
                            expect(pesistedOperator.roles).to.be(operator.roles);
                            done();
                        } else {
                            throw new Error('the operator can\'t be retieved again');
                        }
                    });
                }, function() {
                    throw new Error('the operator can\'t be updated by id');
                });
            }, function() {
                throw new Error('the operator can\'t be retrieved by id');
            });
        });

        it("the operator\' password should be reset", function(done) {
            ProfileService.resetPassword(operator.id)
            .then(function() {
                done();
            }, function() {
                throw new Error('the operator\'s password can\'t be reset.');
            });
        });

        it("the operator should able to login in with reset password", function(done) {
            $.ajax({
                url: '/api/auth',
                data: {
                    'username': operator.username,
                    'password': operator.username
                },
                type: 'POST',
                dataType: 'json'
            }).then(function(res) {
                done();
            }, function() {
                throw new Error('the operator can\'t login in');
            });
        });

        // 测试专家和接线员直接能绑定关系
        it("the expert should be linked with the operator", function(done) {
            expect(expert).not.to.be(undefined);
            expect(operator).not.to.be(undefined);
            ExpertService.linkOperator(expert, operator).then(function(flag) {
                if (flag) {
                    done();
                } else {
                    throw new Error('the expert can\'t be linked again');
                }
            }, function() {
                throw new Error('the expert can\'t be linked again with server errors');
            });
        });

        it("one link should be retrieved by expert ", function(done) {
            expect(expert).not.to.be(undefined);
            expect(operator).not.to.be(undefined);
            ExpertService.getOperators(expert).then(function(operators) {
                if (operators && operators.length == 1) {
                    done();
                } else {
                    throw new Error('the links can\'t be retrieved by expert');
                }
            }, function() {
                throw new Error('the links can\'t be retrieved by expert');
            });
        });

        it("the link should be removed from expert", function(done) {
            expect(expert).not.to.be(undefined);
            expect(operator).not.to.be(undefined);
            ExpertService.unlinkOperator(expert, operator).then(function(flag) {
                done();
            }, function() {
                throw new Error('the expert can\'t be unlinked with server errors');
            });
        });

        it("the expert should be linked with the operator", function(done) {
            expect(expert).not.to.be(undefined);
            expect(operator).not.to.be(undefined);
            ExpertService.linkOperator(expert, operator).then(function(flag) {
                if (flag) {
                    done();
                } else {
                    throw new Error('the expert can\'t be linked again');
                }
            }, function() {
                throw new Error('the expert can\'t be linked again with server errors');
            });
        });

        it("one link should be retrieved by operator ", function(done) {
            expect(expert).not.to.be(undefined);
            expect(operator).not.to.be(undefined);
            OperatorService.getExperts(operator).then(function(operators) {
                if (operators && operators.length == 1) {
                    done();
                } else {
                    throw new Error('the expert can\'t be linked again');
                }
            }, function() {
                throw new Error('the expert can\'t be linked again with server errors');
            });
        });

        it("the expert should be unlinked with the operator", function(done) {
            expect(expert).not.to.be(undefined);
            expect(operator).not.to.be(undefined);
            OperatorService.unlinkExpert(expert, operator).then(function() {
                done();
            }, function() {
                throw new Error('the expert can\'t be unlinked again with server errors');
            });
        });

        // 用于测试的expert和operator都可以被删除
        it("the expert should be removed", function(done) {
            ExpertService.remove(expert.id).then(function() {
                done();
            }, function() {
                throw new Error('the expert can\'t be removed');
            });
        });

        it("the operator should be removed", function(done) {
            OperatorService.remove(operator.id).then(function() {
                done();
            }, function() {
                throw new Error('the operator can\'t be removed');
            });
        });

    };

});