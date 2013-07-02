'use strict';
define(function(require) {

require("./common/main");
require("./task/main");
require("./monitor/main");
require("./employee/main");
require("./user/main");
require("./reply/main");
require("./filter/main");

var testCommon = require("./common/test").testCommon;
var testEmployee = require("./employee/test").testEmployee;

// 定义模块
angular.module('ecgTestApp', ['ecgCommon', 'ecgTask', 'ecgMonitor', 'ecgEmployee', 'ecgUser', 'ecgReply', 'ecgFilter'])
.config(['$httpProvider', '$routeProvider', function ($httpProvider, $routeProvider) {
    var token = $.cookie('AiniaOpAuthToken');
        // header头带认证参数
     $httpProvider.defaults.headers.common['Authorization'] = token;
}])
.run([        '$rootScope', '$http','EnumService',
              'ChiefService', 'ExpertService', 'OperatorService', 'ProfileService',
      function($rootScope,   $http,  EnumService,
               ChiefService,   ExpertService,   OperatorService ,  ProfileService) {
    // 判断是否登录成功
    var token = $.cookie("AiniaOpAuthToken");
    describe("App REST Test", function() {
        // 基础验证
        it("the token from cookie should be defined", function() {
            expect(token).not.to.be(undefined);
        });
        // 验证基础模块
        testCommon(it, EnumService);
        // 验证员工模块
        testEmployee(it, ChiefService, ExpertService, OperatorService, ProfileService);
    });
    mocha.run();
}]);

// 尝试登陆
$.ajax({
    url: '/api/auth',
    data: {
        'username': 'admin',
        'password': 'passw0rd'
    },
    type: 'POST',
    dataType: 'json'
}).then(function(res) {
    // 保存token
    $.cookie("AiniaOpUsername", 'admin');
    $.cookie('AiniaOpAuthToken', res.token, { expires: 1, path: '/' });
    // 构造测试环境
    angular.bootstrap(document, ["ecgTestApp"]);
}, function() {
    console.warn('用户名或密码不对,请重新尝试!');
});


});