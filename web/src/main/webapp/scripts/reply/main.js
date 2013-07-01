'use strict';
define(function(require, exports) {

require("./services/ReplyService");
require("./directives/Reply");

var configTemp = require("./templates/config.html");

angular.module('ecgReply', ['ecgReplyService', 'ecgReplyModules'])
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
    .when('/reply/config', {
        template: configTemp,
        controller: 'ReplyConfigController'
    });
}]);

});// end of define