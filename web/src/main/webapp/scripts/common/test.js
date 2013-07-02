'use strict';
define(function(require, exports) {

    exports.testCommon = function(it, EnumService) {
        it("the EnumService should be defined", function() {
            expect(EnumService).not.to.be(undefined);
        });
    };

});