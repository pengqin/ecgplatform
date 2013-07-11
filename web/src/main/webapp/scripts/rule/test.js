'use strict';
'use strict';
define(function(require, exports) {

    var testAsAdminOrChiefOrExpert = require("./test/base.js").test;
    
    exports.testRule = function(mocha, angluarjs, services) {
        if (!runCase('rule')) {
            return;
        }
        var it = mocha.it;
        var httpProvider = angluarjs.httpProvider;

        mocha.user = {username: TESTCONFIGS.admin.username, password: TESTCONFIGS.admin.password};
        runCaseAs('admin') ? testAsAdminOrChiefOrExpert(mocha, angluarjs, services) : null;
        
        mocha.user = {username: TESTCONFIGS.chief.username, password: TESTCONFIGS.chief.password};
        runCaseAs('chief') ? testAsAdminOrChiefOrExpert(mocha, angluarjs, services) : null;

        mocha.user = {username: TESTCONFIGS.expert.username, password: TESTCONFIGS.expert.password};
        runCaseAs('expert') ? testAsAdminOrChiefOrExpert(mocha, angluarjs, services) : null;

        /*
         * 专家不可以编辑系统级别的rule
         * 专家不可以新增系统级别的rule下的检测区间
         * 专家不可以删除系统级别rule下的检测区间
         * 专家不可以新增系统级别下的回复设置
         * 专家不可以编辑系统级别下的回复设置
         * 专家不可以删除系统级别下的回复设置

         * 接线员只能查看，不能对以上任何操作进行新增，编辑，删除。
         */

    };

});