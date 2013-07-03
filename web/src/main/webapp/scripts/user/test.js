'use strict';
define(function(require, exports) {

    exports.testUser = function(it, UserService) {

        // User
        it("the UserService should be defined", function() {
            expect(UserService).not.to.be(undefined);
        });

        it("the User list should be retrieved", function(done) {
            UserService.queryAll().then(function(Users) {
                if (Users.length > 0) {
                    done();
                } else {
                    throw new Error('the User list can\'t be retrieved');
                }
            }, function() {
                throw new Error('the User list can\'t be retrieved');
            });
        });

        it("the getPlainObject method of UserService should be defined", function() {
            expect(UserService.getPlainObject).not.to.be(undefined);
        });

        it("the User should not be created without username and name", function(done) {
            var invalid = UserService.getPlainObject();
            UserService.create(invalid).then(function(flag) {
                if (flag) {
                    throw new Error('the User can be created');
                } else {
                    done();
                }
            });
        });

        it("the User should not be created when username and name but with blank password", function(done) {
            var invalid = UserService.getPlainObject();
            invalid.mobile = '13800000000';
            invalid.name = 'user' + (new Date()).getTime();
            invalid.password = '';
 
            UserService.create(invalid).then(function(flag) {
                if (flag) {
                    throw new Error('the User can be created');
                } else {
                    done();
                }
            });
        });

        var user = UserService.getPlainObject();
        it("the User should be created when username, name and password are set", function(done) {
            user.mobile = '13800000000';
            user.name = 'user' + (new Date()).getTime();
            user.password = User.mobile;
 
            UserService.create(user).then(function(flag) {
                if (flag) {
                    done();
                } else {
                    throw new Error('the User can\'t be created');
                }
            });
        });

        /*
        it("the User could be updated", function(done) {
            UserService.get(User.id).then(function(pesistedUser) {
                if (pesistedUser) {
                    expect(pesistedUser.id).to.be(User.id);
                    expect(pesistedUser.username).to.be(User.username);
                    expect(pesistedUser.name).to.be(User.name);
                    expect(pesistedUser.status).to.be(User.status);
                    expect(pesistedUser.title).to.be(User.title);
                    expect(pesistedUser.mobile).to.be(User.mobile);
                    expect(pesistedUser.company).to.be(User.company);
                    expect(pesistedUser.enabled).to.be(User.enabled);
                    expect(pesistedUser.dismissed).to.be(User.dismissed);
                    expect(pesistedUser.roles).to.be(User.roles);
                    done();
                } else {
                    throw new Error('the User can\'t be retieved by id');
                }
            });
        });

        it("the User should be updated", function(done) {
            User.status = 'ONLINE';
            User.gender = 0;
            User.birthday = '1983-01-11';
            User.idCard = '440803198801122455';
            User.title= '主任1';
            User.mobile= '13800000000';
            User.company = 'User company';
            User.enabled = false;
            User.dismissed = true;
            UserService.update(user).then(function() {
                done();
            }, function() {
                throw new Error('the User can\'t be updated.');
            });
        });

        it("the User should be updated as expectation", function(done) {
            UserService.get(User.id).then(function(pesistedUser) {
                if (pesistedUser) {
                    expect(pesistedUser.id).to.be(User.id);
                    expect(pesistedUser.username).to.be(User.username);
                    expect(pesistedUser.name).to.be(User.name);
                    expect(pesistedUser.status).to.be(User.status);
                    expect(pesistedUser.title).to.be(User.title);
                    expect(pesistedUser.mobile).to.be(User.mobile);
                    expect(pesistedUser.company).to.be(User.company);
                    expect(pesistedUser.enabled).to.be(User.enabled);
                    expect(pesistedUser.dismissed).to.be(User.dismissed);
                    expect(pesistedUser.roles).to.be(User.roles);
                    done();
                } else {
                    throw new Error('the User can\'t be retieved by id');
                }
            });
        });

        it("the User should able to login in with default password", function(done) {
            $.ajax({
                url: '/api/auth',
                data: {
                    'username': User.username,
                    'password': User.password
                },
                type: 'POST',
                dataType: 'json'
            }).then(function(res) {
                done();
            }, function() {
                throw new Error('the User can\'t login in');
            });
        });

        it("the User\' password should be reset", function(done) {
            ProfileService.resetPassword(User.id)
            .then(function() {
                done();
            }, function() {
                throw new Error('the User\'s password can\'t be reset.');
            });
        });

        it("the User should able to login in with reset password", function(done) {
            $.ajax({
                url: '/api/auth',
                data: {
                    'username': User.username,
                    'password': User.username
                },
                type: 'POST',
                dataType: 'json'
            }).then(function(res) {
                done();
            }, function() {
                throw new Error('the User can\'t login in');
            });
        });

        it("the User should be removed", function(done) {
            UserService.remove(User.id).then(function() {
                done();
            }, function() {
                throw new Error('the User can\'t be removed');
            });
        }); */

    };

});