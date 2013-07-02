'use strict';
define(function(require, exports) {

angular.module('ecgReplyModules', [])
.controller('ReplyConfigController', ['$scope', 'ReplyService', function ($scope, ReplyService) {
    // 表格头
    $scope.subheader.title = "默认回复";

    // 命名空间
    $scope.replyconfig = {};

    // 回复新对象
    $scope.replyconfig.newobj = {};

    // 回复类型
    $scope.replyconfig.replytypes = [{value: '心律正常', label: '心律不齐'}, {value: '心律正常', label: '心律正常'}];

    // 数据范围
    $scope.replyconfig.configs = [{
    	id: 1,
    	min:  0,
    	max: 30,
    	level: 'danger',
    	replys: [{
			id: 1,
			type: '异常心律',
			text: '请您用正确的方式再重新测量一遍！'
		}, {
			id: 2,
			type: '异常心律',
			text: '您的心电图显示，心律、心率是正常的，但您手机上的心率数字是不正确的，可能与心电测试时姿势不正确有关。建议您重新测试一次！'
		}, {
			id: 4,
			type: '异常心律',
			text: '检测波型不正确，按照正常的操作方式重新检测发送。'
		}, {
			id: 5,
			type: '异常心律',
			text: '您刚才发送的心电信息图形不完整，请您按照正确的操作方式重新检测发送，谢谢！'
		}, {
			id: 3,
			type: '无明显心律失常',
			text: '心动过缓,心率低于30次／分以下,可能为病理性或药物性的变化,建议您不定期监测心率并发送数据给服务中心,稍后会有专家给您致电提出健康指导，并建议您赴医院治疗,必要时安装心脏起博器。'
    	}]
    }, {
    	id: 2,
    	min:  31,
    	max: 45,
    	level: 'danger',
    	replys: [{
			id: 6,
			type: '异常心律',
			text: '窦性心动过缓,心率45次／分以下,可能为病理性或药物性的改变,提醒您自测心率并再次发送数据,注意心率改变,便于去医院进一步检查治疗。稍后会有专家给您致电提出健康指导。'
		}, {
			id: 7,
			type: '异常心律',
			text: '窦性心率45次／分以下，可能会引发头晕，胸闷，晕厥、心绞痛或缺血性脑血管病，如有以上临床症状，您应应尽快再次测试自己的心率，便于去医疗机构进一步检查。稍后会有专家给您致电提出健康指导。'
    	}]
    }, {
    	id: 3,
    	min:  46,
    	max: 59,
    	level: 'warning',
    	replys: [{
			id: 8,
			type: '心动过缓',
			text: '心动过缓，多数为生理性的，无需处理，工作之余应多注意休息，定期检测自己的心率,并发送数据至AINIA健康服务中心，做到早预防，早发现，早治疗。'
		}, {
			id: 9,
			type: '心动过缓',
			text: '心动过缓，多数为生理性的，无需处理。如是病理性心动过缓，多数会出现乏力、头晕、胸闷，严重甚至发生晕厥，心率一般低于40次，生活中要注意观察自己的心率，随时监测，随时了解心率变化，保证身体健康。'
    	}]
    }, {
    	id: 4,
    	min:  60,
    	max: 90,
    	level: 'success',
    	replys: [{
			id: 10,
			type: '无明显心律失常',
			text: '无明显心律失常，请您定时监测心率，建议清淡饮食，多吃新鲜的蔬菜和水果，坚持乐观的情绪，经常参加户外活动。'
		}, {
			id: 11,
			type: '无明显心律失常',
			text: '心律正常，请坚持有氧运动，建议每天步行一小时，定期监测心率，做到早预防，早发现，早治疗。'
		}, {
			id: 12,
			type: '心律不齐',
			text: '心律不齐,常见于年轻人，尤其是心律慢时，与呼吸有关，一般无症状，也不需要治疗，建议定期检测心率并发送至AINIA健康服务中心。'
		}, {
			id: 13,
			type: '心律不齐',
			text: '心律不齐，常与呼吸的改变有关，吸气时增快，呼气时减慢，多见于正常人群，但人的情绪波动是发生心律不齐的诱因之一，建议保持心情舒畅，定期检测心率并发送至AINIA健康服务中心。'
    	}]
    }, {
    	id: 5,
    	min:  90,
    	max: 100,
    	level: 'warning',
    	replys: [{
			id: 14,
			type: '心率正常，偏快',
			text: '无心律失常，属于正常心率，但偏快。建议营养平衡、保持心情舒畅、心态平和，提醒用户可定期检查心率并发送数据至AINIA健康服务中心，听取专家的建议。'
		}, {
			id: 15,
			type: '心率正常，偏快',
			text: '属正常心率，但偏快。坚持户外活动，少盐、限酒、饮食清淡，富有营养，注意劳逸结合，定期检查心率并发送数据至AINIA健康服务中心，听取专家意见。'
    	}]
    }, {
    	id: 6,
    	min: 101,
    	max: 200,
    	level: 'danger',
    	replys: [{
			id: 16,
			type: '心动过速',
			text: '窦性心动过速，心率超过100次/分以上，200次/分以下时，建议用户自测心率并发送数据至AINIA健康服务中心，听取专家建议或者按自己的实际身体状况，是否建议去医院检查治疗。'
		}, {
			id: 17,
			type: '心动过速',
			text: '心动过速，是常见的心律失常，有病理性也有生理性，还有药物性，其主要是心率快大于100次/分以上，建议用户根据自己的身体状况，除定期自测心率外，还要结合实际状况来安排生活，安排就医。'
    	}]
    }];

    // 计算每个区间的百分比
    $($scope.replyconfig.configs).each(function(i, config) {
    	config.percent = (config.max - config.min + 0.64) / 200 * 100;
    });

    // 当前选择中config
    $scope.replyconfig.selected = null;

    // 新增回复
    $scope.replyconfig.create = function() {
    	$scope.replyconfig.newobj.id = (new Date()).getTime();
    	$scope.replyconfig.selected.replys.push($scope.replyconfig.newobj);
    	$scope.replyconfig.newobj = {};
    	$scope.popup.success("新增默认回复成功!");
    };

    // 选择某个config
    $scope.replyconfig.onselect = function(config) {
		$scope.replyconfig.newobj = {};
		$scope.replyconfig.selected = config;
    };

    // 删除某条回复
    $scope.replyconfig.remove = function(deletedItem) {
    	var idx = -1;
    	$($scope.replyconfig.selected.replys).each(function(i, reply) {
    		if (deletedItem.id === reply.id) {
    			idx = i;
    		}
    	});
    	if (idx >= 0) {
    		$scope.dialog.confirm({
	            text: "请确认删除, 该操作无法恢复!",
	            handler: function() {
	                $scope.dialog.showStandby();
	                $scope.replyconfig.selected.replys.splice(idx, 1);
	                $scope.dialog.hideStandby();
	                $scope.popup.success("删除成功!");
	                /*
	                ChiefService.remove(selectedItem.id)
	                .then(function() {
	                    $scope.dialog.hideStandby();
	                    $scope.chief.selectedItem = null;
	                    $scope.popup.success("删除成功!");
	                    // 刷新
	                    refreshGrid();
	                }, function() {
	                    $scope.dialog.hideStandby();
	                    $scope.popup.error("无法删除该数据,可能是您的权限不足,请联系管理员!");
	                });*/
	            }
	        });
    	}
    };

}]);


});