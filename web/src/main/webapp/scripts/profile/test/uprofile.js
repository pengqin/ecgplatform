'use strict';
define(function(require, exports) {

    exports.test = function(mocha, angluarjs, services) {
        if (!runCase('profile')) {
            return;
        }

        var it = mocha.it,
            user = mocha.user,
            httpProvider = angluarjs.httpProvider,
            ProfileService = services.ProfileService,
            UserService = services.UserService;

        var token;
        // 登录
        it("the user should authenciated in profile test module.", function(done) {
            $.ajax({
                url: PATH + '/api/user/auth',
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
        it("the user should retrieved his own info.", function(done) {
            UserService.findAllByMobile(user.username)
            .then(function(users) {
                expect(users.length).to.be(1);
                done();
            }, function() {
                throw new Error('failed to retrieved');
            });
        });


    };

});