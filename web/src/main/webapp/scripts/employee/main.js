'use strict';
define(function(require, exports) {

require("./services/ChiefService");
require("./directives/Chief");
require("./directives/Expert");
require("./directives/Operator");

angular.module('ecgEmployee', ['ecgChiefService', 'ecgChief', 'ecgExpert', 'ecgOperator']);

});