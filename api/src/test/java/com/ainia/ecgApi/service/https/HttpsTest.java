package com.ainia.ecgApi.service.https;

import java.io.InputStreamReader;
import java.net.URL;

import javax.net.ssl.HttpsURLConnection;

import org.joda.time.DateTime;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;

/**
 * <p>Chief Service test</p>
 * Copyright: Copyright (c) 2013
 * Company:   
 * HttpsTest.java
 * @author pq
 * @createdDate 2013-6-27
 * @version
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:applicationContext.xml"})
@ActiveProfiles("test")
@TransactionConfiguration(defaultRollback = true)
public class HttpsTest {

	@Test
	public void testHttpConnect() throws Exception{
		/*
		// 创建URL对象
        URL myURL = new URL("https://115.28.52.3:8443/web/login.html");
 
        // 创建HttpsURLConnection对象，并设置其SSLSocketFactory对象
        HttpsURLConnection httpsConn = (HttpsURLConnection) myURL.openConnection();
 
        // 取得该连接的输入流，以读取响应内容
        InputStreamReader insr = new InputStreamReader(httpsConn.getInputStream());
 
        // 读取服务器的响应内容并显示
        int respInt = insr.read();
        while (respInt != -1) {
            System.out.print((char) respInt);
            respInt = insr.read();
        }*/
	}
}
