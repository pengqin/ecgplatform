define(function(require, exports) {

    'use strict';
    var testStageOneForAdminAndChief = require("./test/stageOneForAdminAndChief").test;
    var testStageTwoForOperator = require("./test/stageTwoForOperator").test;
    
    exports.testTask = function(mocha, angluarjs, services) {
        if (!runCase('task')) {
            return;
        }

        console.info('all roles will be used in the task test module.');
        
        var adminRuntime = {
            undone: 0,
            done: 0
        };
        var chiefRuntime = {
            undone: 0,
            done: 0
        };
        var operatorRuntime = {
            undone: 0,
            done: 0
        };
        var operator1Runtime = {
            undone: 0,
            done: 0
        };
        /**
         * 场景1，管理员、主任都可以查询未完成任务的信息,并将当前的环境信息保存
         */
        mocha.user = {username: TESTCONFIGS.admin.username, password: TESTCONFIGS.admin.password};
        testStageOneForAdminAndChief(mocha, angluarjs, services, adminRuntime);
        
        mocha.user = {username: TESTCONFIGS.chief.username, password: TESTCONFIGS.chief.password};
        testStageOneForAdminAndChief(mocha, angluarjs, services, chiefRuntime);

        /**
         * 场景2，接线员自己回复，并将更改当前环境
         */
        mocha.user = {username: TESTCONFIGS.operator.username, password: TESTCONFIGS.operator.password};
        testStageTwoForOperator(mocha, angluarjs, services, operatorRuntime);
        mocha.user = {username: TESTCONFIGS.operator1.username, password: TESTCONFIGS.operator1.password};
        testStageTwoForOperator(mocha, angluarjs, services, operator1Runtime);

        it("the runtime should be updated as expectation", function() {
            console.info(adminRuntime);
            console.info(chiefRuntime);
            console.info(operatorRuntime);
            console.info(operator1Runtime);
            expect(adminRuntime.undone).to.be(chiefRuntime.undone);
        });
        
        return;
        /**
         * 测试用例场景设计

         * 接线员A查询得到6个未完成任务
         * 管理员/专家将其中一个任务转发给接线员B
         * 管理员/专家将其中一个任务转发给专家A
         * 接线员A查询到2个未完成任务
         * 管理员/专家查询到4个未完成任务
         * 接线员A回复一个任务
         * 接线员A转任务给专家A
         * 接线员A查询到0个未完成任务
         * 接线员A查询到1个未完成任务
         * 接线员A能查看检测请求信息，回复信息

         * 接线员B查询得到1个未完成任务
         * 接线员B回复任务
         * 接线员B查询到0个未完成任务
         * 接线员B查询到1个未完成任务

         * 专家A查询到2个未完成任务
         * 专家A回复任务
         * 专家A查询到1个未完成任务
         * 专家A查询到1个完成任务
         * 专家A能查看检测请求信息，回复信息

         */
        // Rule
    };

});