'use strict';
define(function(require, exports) {

    var testForProfile = require("./test/profile.js").test;

    exports.testProfile = function(mocha, angluarjs, services) {
        if (!runCase('profile')) {
            return;
        }

        // 个人资料编辑功能
        mocha.user = {username: TESTCONFIGS.admin.username, password: TESTCONFIGS.admin.password};
        runCaseAs('admin') ? testForProfile(mocha, angluarjs, services) : null;

        mocha.user = {username: TESTCONFIGS.chief.username, password: TESTCONFIGS.chief.password};
        runCaseAs('chief') ? testForProfile(mocha, angluarjs, services) : null;

        mocha.user = {username: TESTCONFIGS.expert.username, password: TESTCONFIGS.expert.password};
        runCaseAs('expert') ? testForProfile(mocha, angluarjs, services) : null;

        mocha.user = {username: TESTCONFIGS.operator.username, password: TESTCONFIGS.operator.password};
        runCaseAs('operator') ? testForProfile(mocha, angluarjs, services) : null;
    };

});