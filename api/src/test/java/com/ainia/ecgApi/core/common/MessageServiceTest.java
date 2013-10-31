package com.ainia.ecgApi.core.common;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;

import com.ainia.ecgApi.service.common.MessageService;
import com.ainia.ecgApi.service.sys.UserService;
import com.ainia.ecgApi.domain.sys.User;
import com.ainia.ecgApi.dto.common.Message;


@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:applicationContext.xml"})
@ActiveProfiles("test")
@TransactionConfiguration(defaultRollback = true)
public class MessageServiceTest {

    @Autowired
    private com.ainia.ecgApi.service.common.MessageService messageService;
    @Autowired
    private com.ainia.ecgApi.service.sys.UserService userService;
    
    public void setMessageService(MessageService messageService) {
        this.messageService = messageService;
    }

    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    @Before
    public void setUp() {
    	MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testSimpleEmail() {
    	Message msg = new Message("", "888888", "", "16259903@qq.com", "亲爱的用户，您好：\n\n您正在使用AINIA邮箱找回密码功能，验证码为: 888888\n\n该验证码24小时内有效，如输入错误次数达3次则立即失效，需再次申请。\n\n请勿向他人包括AINIA员工提供本次验证码。\n\nAINIA客户中心");
    	messageService.sendEmail(msg);
    }
    
    @Test
    public void testSimpleSMS() throws Exception{
    	Message msg = new Message("", "888888", "", "13027334591", "测试验证码短信");
    	messageService.sendSms(msg);
    }

    @Test
    public void testSendEmail() throws Exception{
    	User user = userService.findByMobile("13811749917");
    	Assert.assertNotNull(user);
    	userService.retakePassword(user, Message.Type.email);
    }

    @Test
    public void testECGSMS() throws Exception{
    	User user = userService.findByMobile("13811749917");
    	Assert.assertNotNull(user);
    	userService.retakePassword(user, Message.Type.sms);
    }
}
