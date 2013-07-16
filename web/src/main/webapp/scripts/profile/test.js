'use strict';
define(function(require, exports) {

    var testProfileAsEmployee = require("./test/profile.js").test;
    var testProfileAsUser = require("./test/uprofile.js").test;

    exports.testProfile = function(mocha, angluarjs, services) {
        if (!runCase('profile')) {
            return;
        }

        // 个人资料编辑功能
        mocha.user = {username: TESTCONFIGS.admin.username, password: TESTCONFIGS.admin.password};
        runCaseAs('admin') ? testProfileAsEmployee(mocha, angluarjs, services) : null;

        mocha.user = {username: TESTCONFIGS.chief.username, password: TESTCONFIGS.chief.password};
        runCaseAs('chief') ? testProfileAsEmployee(mocha, angluarjs, services) : null;

        mocha.user = {username: TESTCONFIGS.expert.username, password: TESTCONFIGS.expert.password};
        runCaseAs('expert') ? testProfileAsEmployee(mocha, angluarjs, services) : null;

        mocha.user = {username: TESTCONFIGS.operator.username, password: TESTCONFIGS.operator.password};
        runCaseAs('operator') ? testProfileAsEmployee(mocha, angluarjs, services) : null;

        mocha.user = {username: TESTCONFIGS.user.username, password: TESTCONFIGS.user.password};
        runCaseAs('user') ? testProfileAsUser(mocha, angluarjs, services) : null;
    };

});