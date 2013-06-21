'use strict';
define(function(require, exports) {
  require("./Nav");
  require("./Header");
  require("./Popup");
  require("./Footer");
  require("./Dialog");

  angular.module('ecgCommon', ["ngGrid", "ecgNav", "ecgHeader", "ecgPopup", "ecgFooter", "ecgDialog"])
  .factory("EnumService", function() {
  	return {
  		getGenders: function() {
  			return [{label: '男', value: 1}, {label: '女', value: 0}];
  		},
      getGenderLabel: function(gender) {
        return gender ?  '男': '女';
      },
  		getWorkStates: function() {
  			return [{label: '在职', value: 1}, {label: '离职', value: 0}];
  		},
      getWorkStateLabel: function(dismissed) {
        return !dismissed ? '在职' : '离职';
      }
  	}
  });

});