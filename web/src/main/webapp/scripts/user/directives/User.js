define(function(require, exports) {
    
'use strict';

var userEditTemp = require("../templates/user/edit.html");
var userExpertTemp = require("../templates/user/expert.html");
var userRelativeTemp = require("../templates/user/relative.html");
var usersDialogTemp = require("../templates/user/usersdialog.html");
var relativesDialogTemp = require("../templates/user/relativedialog.html");

angular.module('ecgUserModules', [])
.controller('UserController', ['$scope', '$filter', '$timeout', '$location', 'EnumService', 'UserService', function ($scope, $filter, $timeout, $location, EnumService, UserService) {
    // 表格头
    $scope.subheader.title = "用户管理";

    // 命名空间
    $scope.user = {};

    // 表格展示
    $scope.user.data = null;
    $scope.user.paging = {
        total: 0,
        curPage: 1,
        goToPage: function(page, max) {
            refreshGrid({'page.curPage': page, 'page.max': max});
        }
    };

    // 刷新功能
    var globalParams = {};
    function refreshGrid(params) {
        globalParams = $.extend(globalParams, params);
        $scope.dialog.showLoading();
        UserService.queryAll(globalParams).then(function(paging) {
            $scope.dialog.hideStandby();
            if (paging) {
                $scope.user.paging.total = paging.total;
                $scope.user.paging.curPage = paging.curPage;
                $scope.user.data = paging.datas;
            } else {
                $scope.message.error("无法加载用户数据!");
            }
        }, function() {
            $scope.dialog.hideStandby();
            $scope.message.error("无法加载用户数据!");
        });
    }
    refreshGrid();

    // 过滤功能
    $scope.user.queryChanged = function(username, name) {
        globalParams['username:like'] = username;
        globalParams['name:like'] = name;
        globalParams['page.curPage'] = 1;
        refreshGrid(globalParams);
    };

    // 显示label
    $scope.user.getGenderLabel = function(user) {
        return EnumService.getGenderLabel(user.gender);
    };
    $scope.user.getDismissedLabel = function(user) {
        return EnumService.getDismissedLabel(user.dismissed);
    };

    // 当前选中数据
    $scope.user.selectedItem = null;

    // 禁用功能
    $scope.user.confirmDisable = function() {
        var selectedItem = $scope.user.selectedItem;
        if (selectedItem === null) {
            $scope.dialog.alert({
                text: '请选择一条记录!'
            });
            return;
        }
        $scope.dialog.confirm({
            text: "禁用用户:" + selectedItem.name + ", 是否继续!",
            handler: function() {
                $scope.dialog.showStandby();
                UserService.disable(selectedItem.id)
                .then(function() {
                    $scope.dialog.hideStandby();
                    $scope.user.selectedItem = null;
                    $scope.message.success("删除成功!");
                    // 刷新
                    refreshGrid();
                }, function() {
                    $scope.dialog.hideStandby();
                    $scope.message.error("无法删除该数据,可能是您的权限不足,请联系管理员!");
                });
            }
        });
    };

    // 删除功能
    $scope.user.confirmDelete = function() {
        var selectedItem = $scope.user.selectedItem;
        if (selectedItem === null) {
            $scope.dialog.alert({
                text: '请选择一条记录!'
            });
            return;
        }
        $scope.dialog.confirm({
            text: "请确认删除用户:" + selectedItem.name + ", 该操作无法恢复!",
            handler: function() {
                $scope.dialog.showStandby();
                UserService.remove(selectedItem.id)
                .then(function() {
                    $scope.dialog.hideStandby();
                    $scope.user.selectedItem = null;
                    $scope.message.success("删除成功!");
                    // 刷新
                    refreshGrid();
                }, function() {
                    $scope.dialog.hideStandby();
                    $scope.message.error("无法删除该用户，可能是权限不足或者是已经有检测记录,请联系管理员!");
                });
            }
        });
    };

    // 编辑功能
    $scope.user.showPage = function(user) {
        $location.path("user/" + user.id);
    };

    // 刷新功能
    $scope.user.refresh = refreshGrid;

}])
.controller('UserNewController', ['$scope', '$timeout', '$location', 'EnumService', 'ProfileService', 'UserService',
    function ($scope, $timeout, $location, EnumService, ProfileService, UserService) {
    $scope.subheader.title = "新增用户";

    $scope.user = {};
    $scope.user.newobj = UserService.getPlainObject();
    $scope.user.genders = EnumService.getGenders();
    $scope.user.marrieds = EnumService.getMarrieds();

    $('#user-birthday').datetimepicker({
        format: "yyyy-MM-dd",
        language: "zh-CN",
        pickTime: false
    });

    $scope.user.showDatePicker = function() {
        $('#user-birthday').datetimepicker('show');
    };

    $scope.user.isUnique = false;
    $scope.user.isEmailUnique = true;
    $scope.user.checkUnique = function() {
        if ($scope.user.newobj.mobile) {
            UserService.findAllByMobile($scope.user.newobj.mobile).then(function(users) {
                if (users.length > 0) { 
                    $scope.user.isUnique = false;
                    $scope.message.warn("手机号码" + $scope.user.newobj.mobile + "已存在!");
                } else {
                    $scope.user.isUnique = true;
                }
            }, function() {
                $scope.user.isUnique = false;
                $scope.message.warn("查询用户是否唯一时出错!");
            });
        }
        if ($scope.user.newobj.email) {
            UserService.findAllByEmail($scope.user.newobj.email).then(function(users) {
                if (users.length > 0) { 
                    $scope.user.isEmailUnique = false;
                    $scope.message.warn("邮箱地址" + $scope.user.newobj.email + "已存在!");
                } else {
                    $scope.user.isEmailUnique = true;
                }
            }, function() {
                $scope.user.isEmailUnique = false;
                $scope.message.warn("查询邮箱地址是否唯一时出错!");
            });
        }    
    };

    $scope.user.create = function() {
        $scope.dialog.showStandby();
        $scope.user.newobj.birthday = $('#user-birthday input').val();
        $scope.user.newobj.password = $scope.user.newobj.mobile;
        UserService.create($scope.user.newobj)
        .then(function(result) {
            $scope.dialog.hideStandby();
            if (result) {
                $scope.message.success("新增用户成功!");
                $location.path("/user");
            } else {
                $scope.message.error("新增用户失败!");
            }
        }, function() {
            $scope.dialog.hideStandby();
            $scope.message.error("服务器异常,新增失败!");
        });;
    };
}])
.controller('UserViewController', ['$scope', '$routeParams', '$timeout', '$location', 'EnumService', 'UserService',
    function ($scope, $routeParams, $timeout, $location, EnumService, UserService) {
    $scope.subheader.title = "编辑用户";

    $scope.user = {};
    $scope.user.tab = 1; // 默认为基本页面

}])
// 基本信息
.controller('UserEditController', ['$scope', '$routeParams', '$timeout', '$location', 'EnumService', 'UserService',
    function ($scope, $routeParams, $timeout, $location, EnumService, UserService) {
    $scope.user.updateobj = null; //UserService.get($routeParams.id);

    // 初始化界面,并获得最新version
    function refresh() {
        $scope.dialog.showLoading();
        UserService.get($routeParams.id).then(function(user) {
            $scope.dialog.hideStandby();
            $scope.user.updateobj = user;
        }, function() {
            $scope.dialog.hideStandby();
            $scope.message.error("加载用户数据失败!");
        });
    };
    refresh();

    $scope.user.genders = EnumService.getGenders();
    $scope.user.marrieds = EnumService.getMarrieds();

    $scope.user.isEmailUnique = true;
    $scope.user.checkUnique = function() {
        if ($scope.user.updateobj.email) {
            UserService.findAllByEmail($scope.user.updateobj.email).then(function(users) {
                if (users.length > 0) { 
                    $scope.user.isEmailUnique = false;
                    $scope.message.warn("邮箱地址" + $scope.user.updateobj.email + "已存在!");
                } else {
                    $scope.user.isEmailUnique = true;
                }
            }, function() {
                $scope.user.isEmailUnique = false;
                $scope.message.warn("查询邮箱地址是否唯一时出错!");
            });
        }    
    };

    $('#user-birthday').datetimepicker({
        format: "yyyy-MM-dd",
        language: "zh-CN",
        pickTime: false,
    }).on('changeDate', function(e) {
        $scope.user.updateobj.birthday = $('#user-birthday input').val();
    });

    $scope.user.showDatePicker = function() {
        $('#user-birthday').datetimepicker('show');
    };

    $scope.user.update = function() {
        $scope.dialog.showStandby();
        $scope.user.updateobj.birthday = $('#user-birthday input').val();
        UserService.update($scope.user.updateobj)
        .then(function(result) {
            $scope.dialog.hideStandby();
            $scope.message.success("编辑用户成功!");
            refresh();
        }, function() {
            $scope.dialog.hideStandby();
            $scope.message.error("编辑用户失败!");
        });;
    };

    $scope.user.resetPassword = function() {
        $scope.dialog.confirm({
            text: "重置后登录密码将与手机号码一致，确定继续?",
            handler: function() {
                $scope.dialog.showStandby();
                UserService.resetPassword($scope.user.updateobj)
                .then(function(result) {
                    $scope.dialog.hideStandby();
                    $scope.message.success("重置密码成功!");
                    refresh();
                }, function() {
                    $scope.dialog.hideStandby();
                    $scope.message.error("重置密码失败!");
                });
            }
        });
    };
}])
.directive("ecgUserEdit", [ '$location', function($location) {
    return {
        restrict : 'A',
        replace : false,
        template : userEditTemp,
        controller : "UserEditController",
        link : function($scope, $element, $attrs) {
        }
    };
}])
.controller('UserExpertController', ['$scope', '$routeParams', '$timeout', '$location', 'EnumService', 'UserService',
    function ($scope, $routeParams, $timeout, $location, EnumService, UserService) {
    $scope.subheader.title = "绑定专家";

    $scope.user.experts = [];

    function refreshLinks() {
        UserService.getExperts($routeParams.id).then(function(experts) {
            $scope.user.experts = experts;
        }, function() {
            $scope.message.error("加载接线员数据失败!");
        });
    }
    refreshLinks();

    $scope.user.check = function(expert) {
        if (expert.removed === true) {
            expert.removed = false;
            return;
        } else {
            expert.removed = true;
        }
    };

    $scope.user.isCheckAll = false;
    $scope.user.checkAll = function() {
        $scope.user.isCheckAll = !$scope.user.isCheckAll;
        $($scope.user.experts).each(function(i, expert) {
            expert.removed = $scope.user.isCheckAll;
        });
    };

    $scope.user.addExperts = function() {
        $scope.expertdialog.show({
            excludes: $scope.user.experts,
            handler: function(experts) {
                var len = experts.length, count = 0;
                if (len > 1) {
                    $scope.dialog.alert({
                        text: '只能绑定一名专家!'
                    });
                    return;
                }
                $(experts).each(function(i, expert) {
                    $scope.dialog.showStandby();
                    UserService.linkExpert($routeParams.id, expert)
                    .then(function(flag) {
                        $scope.dialog.hideStandby();
                        if (flag) {
                            count++;
                        } else {
                            $scope.message.error("无法绑定专家：" + expert.name);
                        }
                        if (count === len) {
                            $scope.message.success("成功绑定！");
                            refreshLinks();
                        }
                    }, function() {
                        $scope.dialog.hideStandby();
                        $scope.message.error("无法绑定接线员：" + user.name);
                    });
                });
            }
        });
    };
    
    $scope.user.removeExperts = function() {
        
        var removes = [], experts = $scope.user.experts, len = 0, count = 0;

        $(experts).each(function(i, expert) {
            if (expert.removed) {
                removes.push(expert);
            }
        });
        
        if (removes.length == 0) {
            $scope.dialog.alert({
                text: '请选择需要解除的绑定!'
            });
            return;
        };

        len = removes.length;

        $scope.dialog.confirm({
            text: "请确认解除绑定, 该操作无法恢复!",
            handler: function() {
                $scope.dialog.showStandby();
                $(removes).each(function(i, remove) {
                    UserService.unlinkExpert($routeParams.id, remove)
                    .then(function() {
                        count++;
                        if (count === len) {
                            $scope.dialog.hideStandby();
                            $scope.message.success("成功解除绑定！");
                            refreshLinks();
                        }
                    }, function() {
                        count++;
                        $scope.dialog.hideStandby();
                        $scope.message.error("无法解除绑定，员工名为：" + remove.name);
                    });
                });
            }
        });
    };

}])
.directive("ecgUserExpert", [ '$location', function($location) {
    return {
        restrict : 'A',
        replace : false,
        template : userExpertTemp,
        controller : "UserExpertController",
        link : function($scope, $element, $attrs) {
        }
    };
}])
.controller('UserDialogController', 
    ['$scope', '$filter', '$timeout', '$location', 'EnumService', 'UserService', 
    function ($scope, $filter, $timeout, $location, EnumService, UserService) {

    // 命名空间
    $scope.userdialog = {};

    // 表格展示
    $scope.userdialog.data = null;
    $scope.userdialog.paging = {
        total: 0,
        curPage: 1,
        goToPage: function(page, max) {
            refreshGrid({'page.curPage': page, 'page.max': max});
        }
    };

    var globalParams = {};
    function refreshGrid(params) {
        globalParams = $.extend(globalParams, params);
        UserService.queryAll(globalParams).then(function(paging) {
            if (paging) {
                $scope.userdialog.paging.total = paging.total;
                $scope.userdialog.paging.curPage = paging.curPage;
                $scope.userdialog.data = paging.datas;
            } else {
                $scope.message.error("无法加载用户数据!");
            }
        });
    };
    refreshGrid();


    // 过滤功能
    $scope.userdialog.queryChanged = function(username) {
        globalParams['username:like'] = username;
        globalParams['page.curPage'] = 1;
        refreshGrid(globalParams);
    };

    $scope.userdialog.execute = function() {
        var selecteds = [];
        $($scope.userdialog.data).each(function(i, expert) {
            if (expert.selected) {
                selecteds.push(expert);
            }
        });
        $scope.userdialog.hide();
        if ($scope.userdialog.handler instanceof Function) {
            $scope.userdialog.handler(selecteds);
        }
    };

    $scope.userdialog.hide = function(opts) {
      $('#ecgUsersDialog').modal('hide');
    };

    $scope.userdialog.show = function(opts) {
      var opts = opts || {}, ids = '', params;

      if (opts.excludes) {
        $(opts.excludes).each(function(i, user) {
            var comma = '';
            if (i != 0) {
                comma = ',';
            }
            ids += comma + user.id;
        });
        if (opts.excludes.length > 0) {
            params = {'id:notIn': ids};
        }
      }
      $scope.userdialog.handler = opts.handler;
      $('#ecgUsersDialog').modal('show');
      refreshGrid(params);
    };

}])
.directive("ecgUserDialog", [ '$location', function($location) {
    return {
        restrict : 'A',
        replace : false,
        template : usersDialogTemp,
        controller : "UserDialogController",
        link : function($scope, $element, $attrs) {
        }
    };
}])
.controller('RelativeDialogController', 
    ['$scope', '$filter', '$timeout', '$location', 'EnumService', 'UserService', 
    function ($scope, $filter, $timeout, $location, EnumService, UserService) {

    // 命名空间
    $scope.relativedialog = {};

    // 表格展示
    $scope.relativedialog.data = null;
    $scope.relativedialog.paging = {
        total: 0,
        curPage: 1,
        goToPage: function(page, max) {
            refreshGrid({'page.curPage': page, 'page.max': max});
        }
    };

    var globalParams = {};
    function refreshGrid(params) {
        globalParams = $.extend(globalParams, params);
        UserService.queryAll(globalParams).then(function(paging) {
            if (paging) {
                $scope.relativedialog.paging.total = paging.total;
                $scope.relativedialog.paging.curPage = paging.curPage;
                $scope.relativedialog.data = paging.datas;
            } else {
                $scope.message.error("无法加载用户数据!");
            }
        });
    };


    // 过滤功能
    $scope.relativedialog.queryChanged = function(mobile) {
        globalParams['mobile:like'] = mobile;
        globalParams['page.curPage'] = 1;
        refreshGrid(globalParams);
    };

    $scope.relativedialog.execute = function() {
        var selecteds = [];
        $($scope.relativedialog.data).each(function(i, user) {
            if (user.selected) {
                selecteds.push(user);
            }
        });
        $scope.relativedialog.hide();
        if ($scope.relativedialog.handler instanceof Function) {
            $scope.relativedialog.handler(selecteds);
        }
    };

    $scope.relativedialog.hide = function(opts) {
      $('#ecgRelativeDialog').modal('hide');
    };

    $scope.relativedialog.show = function(opts) {
      var opts = opts || {}, ids = '', params;

      if (opts.excludes) {
        $(opts.excludes).each(function(i, user) {
            var comma = '';
            if (i != 0) {
                comma = ',';
            }
            ids += comma + user.id;
        });
        if (opts.excludes.length > 0) {
            params = {'id:notIn': ids};
        }
      }
      $scope.relativedialog.handler = opts.handler;
      $('#ecgRelativeDialog').modal('show');
      refreshGrid(params);
    };

}])
.directive("ecgRelativeDialog", [ '$location', function($location) {
    return {
        restrict : 'A',
        replace : false,
        template : relativesDialogTemp,
        controller : "RelativeDialogController",
        link : function($scope, $element, $attrs) {
        }
    };
}])
.directive("ecgUserRelative", [ '$location', function($location) {
    return {
        restrict : 'A',
        replace : false,
        template : userRelativeTemp,
        controller : "UserRelativeController",
        link : function($scope, $element, $attrs) {
        }
    };
}])
.controller('UserRelativeController', ['$scope', '$routeParams', '$timeout', '$location', 'EnumService', 'UserService',
    function ($scope, $routeParams, $timeout, $location, EnumService, UserService) {
    $scope.subheader.title = "绑定亲属";

    $scope.user.relatives = [];

    function refreshLinks() {
        UserService.getRelatives($routeParams.id).then(function(relatives) {
            $scope.user.relatives = relatives;
        }, function() {
            $scope.message.error("加载亲属数据失败!");
        });
    }

    $scope.user.check = function(relative) {
        if (relative.removed === true) {
        	relative.removed = false;
            return;
        } else {
        	relative.removed = true;
        }
    };

    $scope.user.isCheckAll = false;
    $scope.user.checkAll = function() {
        $scope.user.isCheckAll = !$scope.user.isCheckAll;
        $($scope.user.relatives).each(function(i, relative) {
            relative.removed = $scope.user.isCheckAll;
        });
    };

    $scope.user.addRelatives = function() {
        $scope.relativedialog.show({
            excludes: $scope.user.relatives,
            handler: function(relatives) {
                $(relatives).each(function(i, relative) {
                    $scope.dialog.showStandby();
                    UserService.linkRelative($routeParams.id, relative)
                    .then(function(flag) {
                        $scope.dialog.hideStandby();
                        if (flag) {
                            count++;
                        } else {
                            $scope.message.error("无法绑定亲属：" + relative.name);
                        }
                        if (count === len) {
                            $scope.message.success("成功绑定！");
                            refreshLinks();
                        }
                    }, function() {
                        $scope.dialog.hideStandby();
                        $scope.message.error("无法绑定亲属：" + user.name);
                    });
                });
            }
        });
    };
    
    $scope.user.removeRelatives = function() {
        
        var removes = [], relatives = $scope.user.relatives, len = 0, count = 0;

        $(relatives).each(function(i, relative) {
            if (relative.removed) {
                removes.push(relative);
            }
        });
        
        if (removes.length == 0) {
            $scope.dialog.alert({
                text: '请选择需要解除的绑定!'
            });
            return;
        };

        len = removes.length;

        $scope.dialog.confirm({
            text: "请确认解除绑定, 该操作无法恢复!",
            handler: function() {
                $scope.dialog.showStandby();
                $(removes).each(function(i, remove) {
                    UserService.unlinkRelative($routeParams.id, remove)
                    .then(function() {
                        count++;
                        if (count === len) {
                            $scope.dialog.hideStandby();
                            $scope.message.success("成功解除绑定！");
                            refreshLinks();
                        }
                    }, function() {
                        count++;
                        $scope.dialog.hideStandby();
                        $scope.message.error("无法解除绑定，亲属名为：" + remove.name);
                    });
                });
            }
        });
    };
}]);
});