'use strict';
'use strict';
define(function(require, exports) {

    exports.testRule = function(it, RuleService, ReplyConfigService) {

        /**
         * 管理员/主任查看所有系统级别rule
         * 管理员/主任查看所有系统和个人级别的rule
         * 管理员/主任可以检测某个系统级别的rule是否唯一
         * 管理员/主任可以创建一个系统级别的rule
         * 管理员/主任可以编辑一个系统级别的rule
         * 管理员/主任可以初始化某个rule的检测区间
         * 管理员/主任可以新增某个检测区间
         * 管理员/主任可以删除某个检测区间
         * 管理员/主任可以新增某个检测区间下的回复设置
         * 管理员/主任可以编辑某个检测区间下的回复设置
         * 管理员/主任可以删除某个检测区间下的回复设置

         * 专家可以查看所有系统和个人级别的rule
         * 专家可以可以检测某个个人级别的rule是否唯一
         * 专家可以创建一个个人级别的rule
         * 专家可以编辑一个个人级别的rule
         * 专家可以初始化某个个人rule的检测区间
         * 专家可以新增某个检测区间
         * 专家可以删除某个检测区间
         * 专家可以新增某个检测区间下的回复设置
         * 专家可以编辑某个检测区间下的回复设置
         * 专家可以删除某个检测区间下的回复设置

         * 专家不可以编辑系统级别的rule
         * 专家不可以新增系统级别的rule下的检测区间
         * 专家不可以删除系统级别rule下的检测区间
         * 专家不可以新增系统级别下的回复设置
         * 专家不可以编辑系统级别下的回复设置
         * 专家不可以删除系统级别下的回复设置

         * 接线员只能查看，不能对以上任何操作进行新增，编辑，删除。
         */
        // Rule
        it("the rule list should be retrieved", function(done) {
            expect(RuleService).not.to.be(undefined);
            RuleService.queryAll().then(function(rules) {
                if (rules.length > 0) {
                    var rule = rules[0];
                    expect(rule.type).not.to.be(undefined);
                    expect(rule.code).not.to.be(undefined);
                    expect(rule.name).not.to.be(undefined);
                    expect(rule.min).not.to.be(undefined);
                    expect(rule.max).not.to.be(undefined);
                    expect(rule.remark).not.to.be(undefined);
                    done();
                } else {
                    throw new Error('the rule list can\'t be retrieved');
                }
            }, function() {
                throw new Error('the rule list can\'t be retrieved');
            });
        });

        it("the rule should not be created without required fields", function(done) {
            expect(RuleService.getPlainObject).not.to.be(undefined);
            var invalid = RuleService.getPlainObject();
            RuleService.create(invalid).then(function(flag) {
                if (flag) {
                    throw new Error('the rule can be created');
                } else {
                    done();
                }
            });
        });

        var rule = RuleService.getPlainObject();

        it("the rule should be created when required fields are set", function(done) {
            rule.type = '11';
            rule.code = '1';
            rule.name = '测试';
            rule.min = 0;
            rule.max = 100;
            rule.remark = "说明";
 
            RuleService.create(rule).then(function(flag) {
                if (flag) {
                    done();
                } else {
                    throw new Error('the rule can\'t be created');
                }
            });
        });

        it("the rule should be retrieved when type, code is given and usage set as filter", function(done) {
            rule.type = '11';
            rule.code = '1';
            RuleService.queryAll({
            	type: rule.type,
            	code: rule.code,
            	usage: 'group'
            }).then(function(rules) {
                if (rules.length > 0) {
                    rule.id = rules[0].id;
                    done();
                } else {
                    throw new Error('the rule can\'t be created');
                }
            });
        });

        it("the rule should be updated as expectation", function(done) {
            RuleService.get(rule.id).then(function(rule) {
                rule.min = 2;
                rule.max = 99;;
                delete rule.version;
                RuleService.update(rule).then(function() {
                    RuleService.get(rule.id).then(function(pesistedRule) {
                        if (pesistedRule) {
                        	expect(pesistedRule.id).to.be(rule.id);
                            expect(pesistedRule.min).to.be(rule.min);
                            expect(pesistedRule.max).to.be(rule.max);
                            done();
                        } else {
                            throw new Error('the rule can\'t be retieved again');
                        }
                    });
                }, function() {
                    throw new Error('the rule can\'t be updated by id');
                });
            }, function() {
                throw new Error('the rule can\'t be retrieved by id');
            });
        });

        // 回复设置相关case

        var replyrule = null, replyconfig = null;

        it("the rule for replyconfig should be retrieved", function(done) {
            RuleService.queryAll({
                type: rule.type,
                code: rule.code,
                usage: 'filter'
            }).then(function(rules) {
                if (rules.length > 0) {
                    replyrule = rules[0];
                    done();
                } else {
                    throw new Error('the rule can\'t be created');
                }
            });
        });

        it("the replyconfig for a specific rule should not be created without required fields", function(done) {
            expect(replyrule).not.to.be(null);
            
            var invalid = ReplyConfigService.getPlainObject();

            ReplyConfigService.create(replyrule, invalid)
            .then(function(flag) {
                if (flag) {
                    throw new Error('the rule can\'t not be created');
                } else {
                    done();
                }
            }, function() {
                throw new Error('the rule can\'t not be created');
            });
        });

        it("the replyconfig for a specific rule should be created", function(done) {
            expect(replyrule).not.to.be(null);

            var newobj = ReplyConfigService.getPlainObject();
            newobj.result = 0;
            newobj.content = "快速回复内容";

            ReplyConfigService.create(replyrule, newobj)
            .then(function(flag) {
                if (flag) {
                    done();
                } else {
                    throw new Error('the rule can\'t be created');
                }
            }, function() {
                throw new Error('the rule can\'t be created');
            });
        });

        it("the new replyconfig for a specific rule should be retrieved", function(done) {
            expect(replyrule).not.to.be(null);

            ReplyConfigService.queryAllbyRule(replyrule)
            .then(function(replyconfigs) {
                if (replyconfigs.length > 0) {
                    replyconfig = replyconfigs[0];
                    done();
                } else {
                    throw new Error('the rule can\'t be created');
                }
            }, function() {
                throw new Error('the rule can\'t be created');
            });
        });

        it("the replyconfig for a specific rule should be updated as expectation", function(done) {
            expect(replyrule).not.to.be(null);
            expect(replyconfig).not.to.be(null);
            
            replyconfig.result = (new Date()).getTime();
            replyconfig.content = "修改内容" + (new Date()).getTime();

            ReplyConfigService.update(replyrule, replyconfig)
            .then(function() {
                ReplyConfigService.get(replyrule, replyconfig).then(function(pesistedReplyConfig) {
                    expect(pesistedReplyConfig).not.to.be(null);
                    expect(pesistedReplyConfig.result).to.be(replyconfig.result);
                    expect(pesistedReplyConfig.content).to.be(replyconfig.content);
                    done();
                }, function() {
                    throw new Error('the rule can\'t be retrieved');
                });
            }, function() {
                throw new Error('the rule can\'t be updated');
            });
        });

        it("the replyconfig for a specific rule should be removed", function(done) {
            expect(replyrule).not.to.be(null);
            expect(replyconfig).not.to.be(null);

            ReplyConfigService.remove(replyrule, replyconfig.id)
            .then(function() {
                done();
            }, function() {
                throw new Error('the rule can\'t be removed');
            });
        });

        // 删除rule
        it("the rule should be removed", function(done) {
            RuleService.remove(rule.id).then(function() {
                done();
            }, function() {
                throw new Error('the rule can\'t be removed');
            });
        });
    };

});