package com.ainia.ecgApi.utils;

/**
 * <p></p>
 * Copyright: Copyright (c) 2014
 * Company:   
 * Constants.java
 * @author pq
 * @createdDate 2014年1月11日 下午4:03:27
 * @version
 */
public class Constants {

	public static final String SMS_REQUEST_BIND_RELATIVE = 
			"手机号为%s用户请求与您建立亲属关系，验证码为: %s 。请将本验证码通过手机短信或者其他方式在48小时内告知发起用户。【AINIA】";

	public static final String EMAIL_REQUEST_BIND_RELATIVE = 
			"亲爱的用户，您好：\n\n手机号为%s 的用户申请和您绑定亲属关系，验证码为: %s\n\n该验证码48小时内有效 \n\n请勿向他人包括AINIA员工提供本次验证码。\n\n\n\nAINIA客户中心";
}
