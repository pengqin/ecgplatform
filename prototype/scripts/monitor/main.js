'use strict';
define(function(require, exports) {

require("./services/MonitorService");
require("./directives/TaskCurrentReport");
require("./directives/EmployeeStatusReport");
require("./directives/TaskProcessReport");
require("./directives/ExpertsTaskReport");
require("./directives/OperatorsTaskReport");

angular.module('ecgMonitor', 
	['ecgMonitorService',
	 'ecgTaskCurrentReport',
	 'ecgEmployeeStatusReport',
	 'ecgTaskProcessReport',
	 'ecgExpertsTaskReport',
	 'ecgOperatorsTaskReport'])
.controller('OverviewController', ['$scope', function ($scope) {
    // register the inner namespace
    $scope.overview = {};
    $scope.subheader.title = "工作巡查";
}]);

});