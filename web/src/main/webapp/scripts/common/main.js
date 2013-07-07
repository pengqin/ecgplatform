'use strict';
define(function(require, exports) {

require("./Nav");
require("./Header");
require("./Message");
require("./Footer");
require("./Dialog");

angular.module('ecgCommon', ["angular-table", "ecgNav", "ecgHeader", "ecgMessage", "ecgFooter", "ecgDialog"])
.factory("EnumService", function() {
    var results = [{value: '0', label: "异常心律"}, {value: '1', label: "心动过缓"}, {value: '2', label: "无明显心律失常"}, 
                   {value: '3', label: "心律不齐"}, {value: '4', label: "心率正常，偏快"}, {value: '5', label: "心动过速"}];
    return {
        getGenders: function() {
            return [{label: '男', value: 1}, {label: '女', value: 0}];
        },
        getGenderLabel: function(gender) {
            return gender ?  '男': '女';
        },
        getDismissedStates: function() {
            return [{label: '离职', value: true}, {label: '在职', value: false}];
        },
        getDismissedLabel: function(dismissed) {
            return !dismissed ? '在职' : '离职';
        },
        getResults: function() {
            return results;
        },
        getResultsLabel: function(resultVal) {
            var label = '未知';
            $(results).each(function(i, result) {
                if (resultVal === result.value) {
                    label = result.label;
                }
            });
            return label;
        }
    };
});

});
