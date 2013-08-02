$(function() {
	var PATH = window.location.pathname.slice(0, window.location.pathname.lastIndexOf("/"));

	$(".sendEmailBtn").click(function() {
        $.ajax({
            url: PATH + '/api/user/password/retake?email=' + $("#email").val(),
        }).then(function(res) {
            alert('发送成功');
        }, function() {
            alert('发送失败!');
        });
	});

	$(".sendMobileBtn").click(function() {
        $.ajax({
            url: PATH + '/api/user/password/retake?mobile=' + $("#mobile").val(),
        }).then(function(res) {
            alert('发送成功');
        }, function() {
            alert('发送失败!');
        });
	});

	$(".retakeBtn").click(function() {
        $.ajax({
            url: PATH + '/api/user/password/retake',
            type: 'POST',
            data: {
            	email: $("#email").val(),
            	mobile: $("#mobile").val(),
            	code: $("#code").val(),
            	newPassword: $("#password").val(),
            }
        }).then(function(res) {
            alert('重置成功');
        }, function() {
            alert('重置失败!');
        });
	});
});