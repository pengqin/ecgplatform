package com.ainia.ecgApi.service.https;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.conn.scheme.Scheme;
import org.apache.http.conn.scheme.SchemeRegistry;
import org.apache.http.conn.ssl.SSLSocketFactory;
import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.conn.tsccm.ThreadSafeClientConnManager;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;

import com.ainia.ecgApi.core.web.AjaxResult;

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
		 SSLContext ctx = SSLContext.getInstance("TLS");
         X509TrustManager tm = new X509TrustManager() {
             public X509Certificate[] getAcceptedIssuers() {
                 return null;
             }
             public void checkClientTrusted(X509Certificate[] arg0, String arg1) throws CertificateException {}
             public void checkServerTrusted(X509Certificate[] arg0, String arg1) throws CertificateException {}
         };
         ctx.init(null, new TrustManager[] { tm }, null);
         SSLSocketFactory ssf = new SSLSocketFactory(ctx, SSLSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER);
         SchemeRegistry registry = new SchemeRegistry();
         registry.register(new Scheme("https", 443, ssf));
         ThreadSafeClientConnManager mgr = new ThreadSafeClientConnManager(registry);
		
        HttpClient httpClient = new DefaultHttpClient(mgr);  
  
        HttpGet get = new HttpGet("https://115.28.52.3:8443/web/index.html");
        HttpResponse response = httpClient.execute(get);  
        
        if (response.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
        	BufferedReader reader = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
        	String line = null;
        	while ((line = reader.readLine()) != null) {
        		System.out.println("============ " + line);
        	}
        }
	}
	
	public void testHttpsGizpUpload() throws NoSuchAlgorithmException, KeyManagementException, ClientProtocolException, IOException {
		 SSLContext ctx = SSLContext.getInstance("TLS");
         X509TrustManager tm = new X509TrustManager() {
             public X509Certificate[] getAcceptedIssuers() {
                 return null;
             }
             public void checkClientTrusted(X509Certificate[] arg0, String arg1) throws CertificateException {}
             public void checkServerTrusted(X509Certificate[] arg0, String arg1) throws CertificateException {}
         };
         ctx.init(null, new TrustManager[] { tm }, null);
         SSLSocketFactory ssf = new SSLSocketFactory(ctx, SSLSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER);
         SchemeRegistry registry = new SchemeRegistry();
         registry.register(new Scheme("https", 443, ssf));
         ThreadSafeClientConnManager mgr = new ThreadSafeClientConnManager(registry);
		
        HttpClient httpClient = new DefaultHttpClient(mgr);  
  
        HttpPost post = new HttpPost("https://localhost:8443/api/user/1/examination");
        File gzipFile = new File("D:/my-job/ecg2/ecgplatform/draw/data/sample3-gzip");    
        FileBody gzipFileBody = new FileBody(gzipFile);
        MultipartEntity  entity = new MultipartEntity();
        
        entity.addPart("file", gzipFileBody);
        entity.addPart("isGziped" , new StringBody("true"));
        entity.addPart("apkId" , new StringBody("100211"));
        
        post.addHeader(AjaxResult.AUTH_HEADER , "testToken");
        post.setEntity(entity);
        HttpResponse response = httpClient.execute(post);  
        System.out.println("========== " + response.getStatusLine().getStatusCode());
    	BufferedReader reader = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
    	String line = null;
    	while ((line = reader.readLine()) != null) {
    		System.out.println("============ " + line);
    	}
	}
	
}
