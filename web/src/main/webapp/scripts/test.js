'use strict';
define(function(require) {

require("./common/main");
require("./task/main");
require("./monitor/main");
require("./employee/main");
require("./user/main");
require("./rule/main");
require("./task/main");

var testCommon = require("./common/test").testCommon;
var testEmployee = require("./employee/test").testEmployee;
var testUser = require("./user/test").testUser;
var testRule = require("./rule/test").testRule;
var testTask = require("./task/test").testTask;

// GOABAL VAL
window.PATH = window.location.pathname.slice(0, window.location.pathname.lastIndexOf("/"));

// 定义模块
angular.module('ecgTestApp', ['ecgCommon', 'ecgTask', 'ecgMonitor', 'ecgEmployee', 'ecgUser', 'ecgRule', 'ecgTask'])
.config(['$httpProvider', '$routeProvider', function ($httpProvider, $routeProvider) {
    var token = $.cookie('AiniaOpAuthToken');
        // header头带认证参数
     $httpProvider.defaults.headers.common['Authorization'] = token;
}])
.run([        '$rootScope', '$http','EnumService',
              'ChiefService', 'ExpertService', 'OperatorService', 'ProfileService',
              'UserService', 'RuleService', 'ReplyConfigService',
              'TaskService',
      function($rootScope,   $http,  EnumService,
               ChiefService,   ExpertService,   OperatorService ,  ProfileService,
               UserService, RuleService, ReplyConfigService,
               TaskService) {
    // 判断是否登录成功
    var token = $.cookie("AiniaOpAuthToken");
    describe("App REST Test", function() {
        // 基础验证
        it("the token from cookie should be defined", function() {
            expect(token).not.to.be(undefined);
        });
        // 验证基础模块
        //testCommon(it, EnumService);
        // 验证员工模块
        //testEmployee(it, ChiefService, ExpertService, OperatorService, ProfileService);
        // 验证用户模块
        //testUser(it, UserService);
        // 验证规则及回复模块
        testRule(it, RuleService, ReplyConfigService);
        // 验证任务模块
        testTask(it, ProfileService, TaskService);

    });
    mocha.run();
}]);

// 尝试登陆
$.ajax({
    url: PATH + '/api/auth',
    data: {
        'username': TESTCONFIGS.username,
        'password': TESTCONFIGS.password
    },
    type: 'POST',
    dataType: 'json'
}).then(function(res) {
    // 保存token
    $.cookie("AiniaOpUsername", TESTCONFIGS.username);
    $.cookie('AiniaOpAuthToken', res.token, { expires: 1, path: '/' });
    // 构造测试环境
    angular.bootstrap(document, ["ecgTestApp"]);
}, function() {
    console.warn('用户名或密码不对,请重新尝试!');
});


});