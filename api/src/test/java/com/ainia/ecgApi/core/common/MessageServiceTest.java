package com.ainia.ecgApi.core.common;

import static org.mockito.Mockito.when;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;

import com.ainia.ecgApi.service.common.MessageService;
import com.ainia.ecgApi.service.common.MessageServiceImpl;
import com.ainia.ecgApi.service.sys.UserService;
import com.ainia.ecgApi.service.sys.UserServiceImpl;
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
    public void testSimpleSMS() throws Exception{
    	Message msg = new Message("", "888888", "", "13811749917", "测试验证码短信");
    	//messageService.sendSms(msg);
    }

    @Test
    public void testECGSMS() throws Exception{
    	User user = userService.findByMobile("13811749917");
    	Assert.assertNotNull(user);
    	userService.retakePassword(user, Message.Type.sms);
    }
}
