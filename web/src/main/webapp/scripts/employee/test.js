'use strict';
define(function(require, exports) {

    var testForProfile = require("./test/profile.js").test;
    var testChiefAsAdmin = require("./test/chief/base.js").test;
    var testChiefAsAdminOrChief = require("./test/expert/base.js").test;
    var testOperatorAsAdminOrChief = require("./test/operator/base.js").test;
    var testLinkAsAdminOrChief = require("./test/link/base.js").test;

    exports.testEmployee = function(mocha, angluarjs, services) {
        if (!runCase('employee')) {
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

        // 主任模块功能
        mocha.user = {username: TESTCONFIGS.admin.username, password: TESTCONFIGS.admin.password};
        runCaseAs('admin') ? testChiefAsAdmin(mocha, angluarjs, services) : null;

        // 专家模块
        mocha.user = {username: TESTCONFIGS.admin.username, password: TESTCONFIGS.admin.password};
        runCaseAs('admin') ? testChiefAsAdmin(mocha, angluarjs, services) : null;

        mocha.user = {username: TESTCONFIGS.chief.username, password: TESTCONFIGS.chief.password};
        runCaseAs('chief') ? testChiefAsAdmin(mocha, angluarjs, services) : null;

        // 接线员模块
        mocha.user = {username: TESTCONFIGS.admin.username, password: TESTCONFIGS.admin.password};
        runCaseAs('admin') ? testOperatorAsAdminOrChief(mocha, angluarjs, services) : null;

        mocha.user = {username: TESTCONFIGS.chief.username, password: TESTCONFIGS.chief.password};
        runCaseAs('chief') ? testOperatorAsAdminOrChief(mocha, angluarjs, services) : null;

        // 专家和接线员绑定功能
        mocha.user = {username: TESTCONFIGS.admin.username, password: TESTCONFIGS.admin.password};
        runCaseAs('admin') ? testLinkAsAdminOrChief(mocha, angluarjs, services) : null;

        mocha.user = {username: TESTCONFIGS.chief.username, password: TESTCONFIGS.chief.password};
        runCaseAs('chief') ? testLinkAsAdminOrChief(mocha, angluarjs, services) : null;
    };

});