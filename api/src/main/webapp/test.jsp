<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<html>
    <head>
        <title>12321</title>
        <script type="text/javascript" src="/js/jquery-1.8.1.min.js"></script>
    </head>
    <body>
        <form action="/api/chief" method="post">
           <input name="birthday" value="1981-03-12 13:11:12">
           <input type="submit">
        </form>
        <script type="text/javascript">
        function commit() {
        	var chief = {};
        	chief.name = "test";
        	chief.username = "test12";
        	chief.birthday = "1981-02-11 08:11:00";
        	
        	$.ajax({
        		url:"/api/chief",
        		type:'POST',
        		contentType:"application/json;charset=utf-8",
        		data:JSON.stringify(chief),
        		dataType:"json",
        		success:function(){
        			alert(1);
        		}
        	});
        	
        }
        </script>
    </body>
</html>