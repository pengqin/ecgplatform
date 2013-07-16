'use strict';
define(function(require, exports) {

    var testChiefAsAdmin = require("./test/chief/base.js").test;
    var testExpertAsAdminOrChief = require("./test/expert/base.js").test;
    var testOperatorAsAdminOrChief = require("./test/operator/base.js").test;
    var testLinkAsAdminOrChief = require("./test/link/base.js").test;

    exports.testEmployee = function(mocha, angluarjs, services) {
        if (!runCase('employee')) {
            return;
        }

        // 主任模块功能
        mocha.user = {username: TESTCONFIGS.admin.username, password: TESTCONFIGS.admin.password};
        runCaseAs('admin') ? testChiefAsAdmin(mocha, angluarjs, services) : null;

        // 专家模块
        mocha.user = {username: TESTCONFIGS.admin.username, password: TESTCONFIGS.admin.password};
        runCaseAs('admin') ? testExpertAsAdminOrChief(mocha, angluarjs, services) : null;

        mocha.user = {username: TESTCONFIGS.chief.username, password: TESTCONFIGS.chief.password};
        runCaseAs('chief') ? testExpertAsAdminOrChief(mocha, angluarjs, services) : null;

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