'use strict';
define(function(require, exports) {
  require("./Nav");
  require("./Header");
  require("./Message");
  require("./Footer");
  require("./Dialog");

  angular.module('ecgCommon', ["ngGrid", "ecgNav", "ecgHeader", "ecgMessage", "ecgFooter", "ecgDialog"])

});