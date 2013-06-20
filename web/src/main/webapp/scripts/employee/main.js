'use strict';
define(function(require, exports) {

require("./services/EmployeeService");
require("./directives/Chief");
require("./directives/Expert");
require("./directives/Operator");

angular.module('ecgEmployee', ['ecgEmployeeService', 'ecgChief', 'ecgExpert', 'ecgOperator']);

});