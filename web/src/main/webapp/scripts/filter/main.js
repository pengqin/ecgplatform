'use strict';
define(function(require, exports) {

require("./services/FilterService");
require("./directives/Filter");

var configTemp = require("./templates/filter.html");

angular.module('ecgFilter', ['ecgFilterService', 'ecgFilterModules'])
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
    .when('/filter', {
        template: configTemp,
        controller: 'FilterConfigController'
    });
}]);

});// end of define