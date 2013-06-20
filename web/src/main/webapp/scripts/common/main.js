'use strict';
define(function(require, exports) {
  require("./Nav");
  require("./Header");
  require("./Popup");
  require("./Footer");
  require("./Dialog");

  angular.module('ecgCommon', ["ngGrid", "ecgNav", "ecgHeader", "ecgPopup", "ecgFooter", "ecgDialog"])

});