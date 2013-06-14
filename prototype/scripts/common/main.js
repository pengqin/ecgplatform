'use strict';
define(function(require, exports) {
  require("./Nav");
  require("./Header");
  require("./Message");
  require("./Footer");

  angular.module('ecgCommon', ["ngGrid", "ecgNav", "ecgHeader", "ecgMessage", "ecgFooter"])

});