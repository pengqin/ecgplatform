'use strict';
define(function(require, exports) {

    var testBaseAsAdminOrChief = require("./test/base.js").test;

    exports.testUser = function(mocha, angluarjs, services) {
        if (!runCase('user')) {
            return;
        }

        runCaseAs('admin') ? testBaseAsAdminOrChief({
        	it: mocha.it,
        	user: {username: TESTCONFIGS.admin.username, password: TESTCONFIGS.admin.password}
        }, angluarjs, services) : null;
    };

});