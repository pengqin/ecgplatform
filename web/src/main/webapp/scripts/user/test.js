'use strict';
define(function(require, exports) {

    var testBaseAsAdminOrChief = require("./test/base.js").test;
    var testBaseAsUser = require("./test/user.js").test;

    exports.testUser = function(mocha, angluarjs, services) {
        if (!runCase('user')) {
            return;
        }

        mocha.user = {username: TESTCONFIGS.admin.username, password: TESTCONFIGS.admin.password};
        runCaseAs('admin') ? testBaseAsAdminOrChief(mocha, angluarjs, services) : null;

        mocha.user = {username: TESTCONFIGS.user.username, password: TESTCONFIGS.user.password};
        runCaseAs('user') ? testBaseAsUser(mocha, angluarjs, services) : null;
    };

});