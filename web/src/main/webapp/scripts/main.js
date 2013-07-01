'use strict';
define(function(require) {

require("./common/main");
require("./task/main");
require("./monitor/main");
require("./employee/main");
require("./user/main");

var welcomeTemp = require("./common/templates/welcome.html");

angular.module('ecgApp', ['ecgCommon', 'ecgTask', 'ecgMonitor', 'ecgEmployee', 'ecgUser'])
.config(['$httpProvider', '$routeProvider', function ($httpProvider, $routeProvider) {
        //console.info($cookieStore.get('AiniaOpAuthToken'));
        var token = $.cookie('AiniaOpAuthToken');
        // header头带认证参数
         $httpProvider.defaults.headers.common['Authorization'] = token;
    
        // 配置路由,和模块相关的配置均在相应模块下的main.js
        $routeProvider
        .when('/welcome', {
            template: welcomeTemp,
            controller: function($scope) {
                $scope.subheader.title = "系统首页";
            }
        })
        .otherwise({
            redirectTo: '/welcome'
        });
}])
.run(['$rootScope', '$http', function($rootScope, $http) {
    // 公用函数:退出系统
    function logout(msg) {
        if (msg) { alert(msg); }
        window.location.href = "login.html";
    };

    // 加载完成, 显示工作界面
    function inited() {
        $(document.body).removeClass("noscroll");
        $("#loadingpage").hide();
    }

    // 判断是否登录
    var username = $.cookie("AiniaOpUsrename");
    if (!username) {
        logout('请先登录!');
        return;
    }

    // 构造session用户函数
    function initUser(props) {
        var user = $.extend({}, props || {roles: ''});
        user.isAdmin = function() {
            return this.roles.indexOf('admin') >= 0;
        };
        user.isChief = function() {
            return this.roles.indexOf('chief') >= 0;
        };
        user.isExpert = function() {
            return this.roles.indexOf('expert') >= 0;
        };
        user.isOperator = function() {
            return this.roles.indexOf('operator') >= 0;
        };
        return user;
    };

    // 设置session的用户
    $rootScope.session = {user: {roles: ""}};
    $http({
        method: 'GET',
        cache: false,
        url: "/api/employee?username=" + username
    }).then(function(res) { // 构造session用户
        if (res.data.datas && res.data.datas.length === 1) {
            $rootScope.session.user = initUser(res.data.datas[0]);
        } else {
            logout('无法获取您登录名为' + username +'用户信息。请与管理员联系!');
        }
    }, function() {
        logout('获取您登录名为' + username +'用户信息时, 服务器异常。请与管理员联系!');
        return;
    }).then(function() { // 显示工作界面
        inited();
    });

}]);

angular.bootstrap(document, ["ecgApp"]);

});