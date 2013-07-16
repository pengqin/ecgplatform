'use strict';
define(function(require, exports) {

    exports.test = function(mocha, angluarjs, services) {
        if (!runCase('profile')) {
            return;
        }

        var it = mocha.it,
            user = mocha.user,
            httpProvider = angluarjs.httpProvider,
            ProfileService = services.ProfileService;

        var token;
        // 登录
        it("the user should authenciated in employee/profile test module.", function(done) {
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

        // profile
        var sessionuser;
        it("the session user's profile should be retrieved.", function(done) {
            expect(ProfileService).not.to.be(undefined);
            ProfileService.get(user.username).then(function(profile) {
                if (profile) {
                    // retrieved
                    expect(profile).not.to.be(undefined);
                    sessionuser = profile;
                    done();
                } else {
                    throw new Error('the profile can\'t be retrieved');
                }
            });
        });

        it("the session user's profile should be updated.", function(done) {
            expect(ProfileService).not.to.be(undefined);
            expect(sessionuser).not.to.be(undefined);
            sessionuser.gender = 0;
            // updated
            ProfileService.update(sessionuser).then(function() {
                done();
            }, function() {
                throw new Error('the profile can\'t be updated');
            });
        });

        
        it("the session user's password should be updated", function(done) {
            expect(sessionuser).not.to.be(undefined);
            // updated
            ProfileService.updatePassword(sessionuser.id, user.password, user.password + 'updated')
            .then(function() {
                done();
            }, function() {
                throw new Error('the session user\'s password can\'t be updated');
            });
        });

        it("the session user's password should be useful", function(done) {
            expect(sessionuser).not.to.be(undefined);
            $.ajax({
                url: '/api/auth',
                data: {
                    'username': user.username,
                    'password': user.password + 'updated'
                },
                type: 'POST',
                dataType: 'json'
            }).then(function(res) {
                // expect token
                expect(res.token).not.to.be(undefined);
                done();
            }, function() {
                throw new Error('the session user can\'t login in with new password.');
            });
        });

        
        it("the session user's password should be rollback", function(done) {
            expect(sessionuser).not.to.be(undefined);
            // updated
            ProfileService.updatePassword(sessionuser.id, user.password + 'updated', user.password)
            .then(function() {
                done();
            }, function() {
                throw new Error('the session user\'s password can\'t be rollback');
            });
        });


    };

});