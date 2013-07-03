'use strict';
define(function(require, exports) {

    exports.testUser = function(it, UserService) {

        // User
        it("the userService should be defined", function() {
            expect(UserService).not.to.be(undefined);
        });

        it("the user list should be retrieved", function(done) {
            UserService.queryAll().then(function(users) {
                if (users.length > 0) {
                    var user = users[0];
                    expect(user.gender).not.to.be(undefined);
                    expect(user.idCard).not.to.be(undefined);
                    expect(user.fnPlace).to.be(undefined);
                    expect(user.tel).to.be(undefined);
                    expect(user.mobileNum).to.be(undefined);
                    done();
                } else {
                    throw new Error('the user list can\'t be retrieved');
                }
            }, function() {
                throw new Error('the user list can\'t be retrieved');
            });
        });

        it("the getPlainObject method of UserService should be defined", function() {
            expect(UserService.getPlainObject).not.to.be(undefined);
        });

        it("the user should not be created without username and name", function(done) {
            var invalid = UserService.getPlainObject();
            UserService.create(invalid).then(function(flag) {
                if (flag) {
                    throw new Error('the user can be created');
                } else {
                    done();
                }
            });
        });

        it("the user should not be created without password", function(done) {
            var invalid = UserService.getPlainObject();
            invalid.mobile = '13800000000';
            invalid.name = 'user' + (new Date()).getTime();
            invalid.password = '';
 
            UserService.create(invalid).then(function(flag) {
                if (flag) {
                    throw new Error('the user can be created');
                } else {
                    done();
                }
            });
        });

        var user = UserService.getPlainObject();

        it("the user should be created when username, name and password are set", function(done) {
            user.mobile = '13800000000';
            user.name = 'user' + (new Date()).getTime();
            user.password = user.mobile;
 
            UserService.create(user).then(function(flag) {
                if (flag) {
                    done();
                } else {
                    throw new Error('the user can\'t be created');
                }
            });
        });

        it("the user should be retrieved when moblie is given", function(done) {
            user.mobile = '13800000000';
            user.name = 'user' + (new Date()).getTime();
            user.password = user.mobile;
 
            UserService.findAllByMobile(user.mobile).then(function(users) {
                if (users.length == 1) {
                    user.id = users[0].id;
                    done();
                } else {
                    throw new Error('the user can\'t be created');
                }
            });
        });

        it("the user should be updated", function(done) {
            user.gender = 0;
            user.birthday = '1983-01-11';
            user.address = '地址';
            user.idCard = '440803198801122455';
            user.stature = 1.72;
            user.weight = 50;
            user.city = '北京';
            user.emContact1 = "联系人1",
            user.emContact1Tel = "11111",
            user.emContact2 = "联系人2",
            user.emContact2Tel = "22222",
            user.badHabits = "不良嗜好",
            user.anamnesis = "心脏病",
            user.isFree = false;

            UserService.update(user).then(function() {
                done();
            }, function() {
                throw new Error('the user can\'t be updated.');
            });
        });

        it("the user should be updated as expectation", function(done) {
            UserService.get(user.id).then(function(pesistedUser) {
                if (pesistedUser) {
                    expect(pesistedUser.id).to.be(user.id);
                    expect(pesistedUser.mobile).to.be(user.mobile);
                    expect(pesistedUser.name).to.be(user.name);
                    expect(pesistedUser.birthday).to.be(user.birthday);
                    expect(pesistedUser.idCard).to.be(user.idCard);
                    expect(pesistedUser.stature).to.be(user.stature);
                    expect(pesistedUser.weight).to.be(user.weight);
                    expect(pesistedUser.city).to.be(user.city);
                    expect(pesistedUser.emContact1).to.be(user.emContact1);
                    expect(pesistedUser.emContact1Tel).to.be(user.emContact1Tel);
                    expect(pesistedUser.emContact2).to.be(user.emContact2);
                    expect(pesistedUser.emContact2Tel).to.be(user.emContact2Tel);
                    expect(pesistedUser.badHabits).to.be(user.badHabits);
                    expect(pesistedUser.anamnesis).to.be(user.anamnesis);
                    expect(pesistedUser.isFree).to.be(user.isFree);
                    done();
                } else {
                    throw new Error('the user can\'t be retieved by id');
                }
            });
        });

        it("the user should be removed", function(done) {
            UserService.remove(user.id).then(function() {
                done();
            }, function() {
                throw new Error('the user can\'t be removed');
            });
        });
    };

});