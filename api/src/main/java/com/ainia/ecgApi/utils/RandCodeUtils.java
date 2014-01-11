package com.ainia.ecgApi.utils;

/**
 * <p>生成随机码</p>
 * Copyright: Copyright (c) 2014
 * Company:   
 * RandCodeUtils.java
 * @author pq
 * @createdDate 2014年1月11日 下午4:25:13
 * @version
 */
public class RandCodeUtils {

	/**
	 * <p>生成随机码</p>
	 * @param $
	 * @return String
	 */
	public static String generateCode() {
		int rand = (int)(Math.random() * 1000000);
		if (rand < 100000) {
			rand = 840328;
		}
		String code = String.valueOf(rand);
		return code;
	}
}
