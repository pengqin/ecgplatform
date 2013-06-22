'use strict';
define(function(require, exports) {

angular.module('ecgEmployeeService', [])
    .provider("EmployeeService", function() {
        return {
            get: function(username) {
            	return {};
            }
        };
    });
});