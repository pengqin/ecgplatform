package com.ainia.ecgApi.service.common;

import java.net.URLEncoder;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;

import com.ainia.ecgApi.core.exception.ServiceException;
import com.ainia.ecgApi.dto.common.Message;

/**
 * <p>采用web接口发送短信及邮件</p>
 * Copyright: Copyright (c) 2013
 * Company:   
 * MessageServiceImpl.java
 * @author pq
 * @createdDate 2013-8-1
 * @version
 */
@Service
public class MessageServiceImpl implements MessageService {

	private static String ACCESSKEY = "992";
	private static String SECRETKEY = "eccdd993cc245923afbaaf4379e1d9ef9f1042b2";
	@Autowired
	private MailSender  mailSender;
	

	public void setMailSender(MailSender mailSender) {
		this.mailSender = mailSender;
	}

	@Override
	public void sendEmail(Message message) {
		SimpleMailMessage  mailMessage =  new SimpleMailMessage();
		mailMessage.setFrom("noreply@ainia.com.cn");
		mailMessage.setTo(message.getTo());
		mailMessage.setSubject("AINIA找回密码邮件");
		mailMessage.setText(message.getContent());
		mailSender.send(mailMessage);
//		HttpGet get = new HttpGet(String.format("http://ecgnotify.sinaapp.com/email.php?to=%s&code=%s" ,
//													message.getTo() , message.getCode()));  
//		HttpClient httpclient = new DefaultHttpClient();
//		try {
//			HttpResponse response = httpclient.execute(get);
//			if (response.getStatusLine().getStatusCode() != 200) {
//				throw new ServiceException("exception.email.sendError");
//			}
//		} catch (Exception e) {
//			e.printStackTrace();
//			throw new ServiceException("exception.email.sendError");
//		} 
//		finally {
//            httpclient.getConnectionManager().shutdown();
//        }
	}

	@Override
	public void sendSms(Message message) {

		HttpClient httpclient = new DefaultHttpClient();
		try {
			HttpGet get = new HttpGet(
				String.format(
					"http://sms.bechtech.cn/Api/send/data/json?accesskey=%s&secretkey=%s&mobile=%s&content=%s",
					ACCESSKEY,
					SECRETKEY,
					message.getTo(),
					URLEncoder.encode(message.getContent(), "UTF-8")
				)
			);
			
			HttpResponse response = httpclient.execute(get);
			if (response.getStatusLine().getStatusCode() != 200) {
				throw new ServiceException("exception.sms.sendError");
			}
		} 
		catch (Exception e) {
			e.printStackTrace();
			throw new ServiceException("exception.sms.sendError");
		} 
		finally {
			httpclient.getConnectionManager().shutdown();
		}

	}

}
