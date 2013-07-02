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

        var chief = ChiefService.getPlainObject();

        it("the chief should not be created without username and name", function(done) {
            ChiefService.create(chief).then(function(flag) {
                if (flag) {
                    throw new Error('the chief can be created');
                } else {
                    done();
                }
            });
        });

        it("the chief should not be created when username and name but with blank password", function(done) {
            chief.name = 'test' + (new Date()).getTime();
            chief.username = 'test' + (new Date()).getTime();
            chief.password = '';
 
            ChiefService.create(chief).then(function(flag) {
                if (flag) {
                    throw new Error('the chief can be created');
                } else {
                    done();
                }
            });
        });

        it("the chief should be created when username, name and password are set", function(done) {
            chief.password = chief.name;
 
            ChiefService.create(chief).then(function(flag) {
                if (flag) {
                    done();
                } else {
                    throw new Error('the chief can\'t be created');
                }
            });
        });

        it("the chief id should be retrieved by ProfileService", function(done) {
            chief.password = 'password' + (new Date()).getTime();
 
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

        it("the chief could be updated", function(done) {
            ChiefService.get(chief.id).then(function(pesistedChief) {
                if (pesistedChief) {
                    expect(pesistedChief.id).to.be(chief.id);
                    expect(pesistedChief.username).to.be(chief.username);
                    expect(pesistedChief.name).to.be(chief.name);
                    expect(pesistedChief.status).to.be(chief.status);
                    expect(pesistedChief.title).to.be(chief.title);
                    expect(pesistedChief.mobile).to.be(chief.mobile);
                    expect(pesistedChief.hospital).to.be(chief.hospital);
                    expect(pesistedChief.enabled).to.be(chief.enabled);
                    expect(pesistedChief.dismissed).to.be(chief.dismissed);
                    expect(pesistedChief.roles).to.be(chief.roles);
                    done();
                } else {
                    throw new Error('the chief can\'t be retieved by id');
                }
            });
        });

        it("the chief should be updated", function(done) {
            chief.status = 'ONLINE';
            chief.gender = 0;
            chief.birthday = '1983-01-11';
            chief.idCard = '440803198801122455';
            chief.title= '主任1';
            chief.mobile= '13800000000';
            chief.hospital = 'chief hospital';
            chief.enabled = false;
            chief.dismissed = true;
            ChiefService.update(chief).then(function() {
                done();
            }, function() {
                throw new Error('the chief can\'t be updated.');
            });
        });

        it("the chief should be updated as expectation", function(done) {
            ChiefService.get(chief.id).then(function(pesistedChief) {
                if (pesistedChief) {
                    expect(pesistedChief.id).to.be(chief.id);
                    expect(pesistedChief.username).to.be(chief.username);
                    expect(pesistedChief.name).to.be(chief.name);
                    expect(pesistedChief.status).to.be(chief.status);
                    expect(pesistedChief.title).to.be(chief.title);
                    expect(pesistedChief.mobile).to.be(chief.mobile);
                    expect(pesistedChief.hospital).to.be(chief.hospital);
                    expect(pesistedChief.enabled).to.be(chief.enabled);
                    expect(pesistedChief.dismissed).to.be(chief.dismissed);
                    expect(pesistedChief.roles).to.be(chief.roles);
                    done();
                } else {
                    throw new Error('the chief can\'t be retieved by id');
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
            console.info(ExpertService.getPlainObject);
            expect(ExpertService.getPlainObject).not.to.be(undefined);
        });

        var expert = ExpertService.getPlainObject();

        it("the expert should not be created without username and name", function(done) {
            ExpertService.create(expert).then(function(flag) {
                if (flag) {
                    throw new Error('the expert can be created');
                } else {
                    done();
                }
            });
        });

        it("the expert should not be created when username and name but with blank password", function(done) {
            expert.name = 'test' + (new Date()).getTime();
            expert.username = 'test' + (new Date()).getTime();
            expert.password = '';
 
            ExpertService.create(expert).then(function(flag) {
                if (flag) {
                    throw new Error('the expert can be created');
                } else {
                    done();
                }
            });
        });

        it("the expert should be created when username, name and password are set", function(done) {
            expert.password = expert.name;
 
            ExpertService.create(expert).then(function(flag) {
                if (flag) {
                    done();
                } else {
                    throw new Error('the expert can\'t be created');
                }
            });
        });

        it("the expert id should be retrieved by ProfileService", function(done) {
            expert.password = 'password' + (new Date()).getTime();
 
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

        it("the expert could be updated", function(done) {
            ExpertService.get(expert.id).then(function(pesistedExpert) {
                if (pesistedExpert) {
                    expect(pesistedExpert.id).to.be(expert.id);
                    expect(pesistedExpert.username).to.be(expert.username);
                    expect(pesistedExpert.name).to.be(expert.name);
                    expect(pesistedExpert.status).to.be(expert.status);
                    expect(pesistedExpert.title).to.be(expert.title);
                    expect(pesistedExpert.mobile).to.be(expert.mobile);
                    expect(pesistedExpert.hospital).to.be(expert.hospital);
                    expect(pesistedExpert.enabled).to.be(expert.enabled);
                    expect(pesistedExpert.dismissed).to.be(expert.dismissed);
                    expect(pesistedExpert.roles).to.be(expert.roles);
                    done();
                } else {
                    throw new Error('the expert can\'t be retieved by id');
                }
            });
        });

        it("the expert should be updated", function(done) {
            expert.status = 'ONLINE';
            expert.gender = 0;
            expert.birthday = '1983-01-11';
            expert.idCard = '440803198801122455';
            expert.title= '主任1';
            expert.mobile= '13800000000';
            expert.hospital = 'expert hospital';
            expert.enabled = false;
            expert.dismissed = true;
            ExpertService.update(expert).then(function() {
                done();
            }, function() {
                throw new Error('the expert can\'t be updated.');
            });
        });

        it("the expert should be updated as expectation", function(done) {
            ExpertService.get(expert.id).then(function(pesistedExpert) {
                if (pesistedExpert) {
                    expect(pesistedExpert.id).to.be(expert.id);
                    expect(pesistedExpert.username).to.be(expert.username);
                    expect(pesistedExpert.name).to.be(expert.name);
                    expect(pesistedExpert.status).to.be(expert.status);
                    expect(pesistedExpert.title).to.be(expert.title);
                    expect(pesistedExpert.mobile).to.be(expert.mobile);
                    expect(pesistedExpert.hospital).to.be(expert.hospital);
                    expect(pesistedExpert.enabled).to.be(expert.enabled);
                    expect(pesistedExpert.dismissed).to.be(expert.dismissed);
                    expect(pesistedExpert.roles).to.be(expert.roles);
                    done();
                } else {
                    throw new Error('the expert can\'t be retieved by id');
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

        it("the expert should be removed", function(done) {
            ExpertService.remove(expert.id).then(function() {
                done();
            }, function() {
                throw new Error('the expert can\'t be removed');
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
            console.info(OperatorService.getPlainObject);
            expect(OperatorService.getPlainObject).not.to.be(undefined);
        });

        var operator = OperatorService.getPlainObject();

        it("the operator should not be created without username and name", function(done) {
            OperatorService.create(operator).then(function(flag) {
                if (flag) {
                    throw new Error('the operator can be created');
                } else {
                    done();
                }
            });
        });

        it("the operator should not be created when username and name but with blank password", function(done) {
            operator.name = 'test' + (new Date()).getTime();
            operator.username = 'test' + (new Date()).getTime();
            operator.password = '';
 
            OperatorService.create(operator).then(function(flag) {
                if (flag) {
                    throw new Error('the operator can be created');
                } else {
                    done();
                }
            });
        });

        it("the operator should be created when username, name and password are set", function(done) {
            operator.password = operator.name;
 
            OperatorService.create(operator).then(function(flag) {
                if (flag) {
                    done();
                } else {
                    throw new Error('the operator can\'t be created');
                }
            });
        });

        it("the operator id should be retrieved by ProfileService", function(done) {
            operator.password = 'password' + (new Date()).getTime();
 
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

        it("the operator could be updated", function(done) {
            OperatorService.get(operator.id).then(function(pesistedOperator) {
                if (pesistedOperator) {
                    expect(pesistedOperator.id).to.be(operator.id);
                    expect(pesistedOperator.username).to.be(operator.username);
                    expect(pesistedOperator.name).to.be(operator.name);
                    expect(pesistedOperator.status).to.be(operator.status);
                    expect(pesistedOperator.title).to.be(operator.title);
                    expect(pesistedOperator.mobile).to.be(operator.mobile);
                    expect(pesistedOperator.hospital).to.be(operator.hospital);
                    expect(pesistedOperator.enabled).to.be(operator.enabled);
                    expect(pesistedOperator.dismissed).to.be(operator.dismissed);
                    expect(pesistedOperator.roles).to.be(operator.roles);
                    done();
                } else {
                    throw new Error('the operator can\'t be retieved by id');
                }
            });
        });

        it("the operator should be updated", function(done) {
            operator.status = 'ONLINE';
            operator.gender = 0;
            operator.birthday = '1983-01-11';
            operator.idCard = '440803198801122455';
            operator.title= '主任1';
            operator.mobile= '13800000000';
            operator.hospital = 'operator hospital';
            operator.enabled = false;
            operator.dismissed = true;
            OperatorService.update(operator).then(function() {
                done();
            }, function() {
                throw new Error('the operator can\'t be updated.');
            });
        });

        it("the operator should be updated as expectation", function(done) {
            OperatorService.get(operator.id).then(function(pesistedOperator) {
                if (pesistedOperator) {
                    expect(pesistedOperator.id).to.be(operator.id);
                    expect(pesistedOperator.username).to.be(operator.username);
                    expect(pesistedOperator.name).to.be(operator.name);
                    expect(pesistedOperator.status).to.be(operator.status);
                    expect(pesistedOperator.title).to.be(operator.title);
                    expect(pesistedOperator.mobile).to.be(operator.mobile);
                    expect(pesistedOperator.hospital).to.be(operator.hospital);
                    expect(pesistedOperator.enabled).to.be(operator.enabled);
                    expect(pesistedOperator.dismissed).to.be(operator.dismissed);
                    expect(pesistedOperator.roles).to.be(operator.roles);
                    done();
                } else {
                    throw new Error('the operator can\'t be retieved by id');
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

        it("the operator should be removed", function(done) {
            OperatorService.remove(operator.id).then(function() {
                done();
            }, function() {
                throw new Error('the operator can\'t be removed');
            });
        });
    };

});