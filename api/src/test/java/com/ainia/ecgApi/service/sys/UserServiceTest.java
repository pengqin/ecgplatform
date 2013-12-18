package com.ainia.ecgApi.service.sys;

import static org.mockito.Mockito.when;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;

import com.ainia.ecgApi.core.security.AuthUserImpl;
import com.ainia.ecgApi.core.security.AuthenticateService;
import com.ainia.ecgApi.domain.health.HealthExamination;
import com.ainia.ecgApi.domain.health.HealthRule.Level;
import com.ainia.ecgApi.domain.sys.User;
import com.ainia.ecgApi.dto.common.Message;
import com.ainia.ecgApi.dto.common.Message.Type;

/**
 * <p>用户测试</p>
 * Copyright: Copyright (c) 2013
 * Company:   
 * UserServiceTest.java
 * @author pq
 * @createdDate 2013-8-3
 * @version
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:applicationContext.xml"})
@ActiveProfiles("test")
@TransactionConfiguration(defaultRollback = true)
public class UserServiceTest {

	@Autowired
	private UserService userService;	
	@Autowired
    private AuthenticateService authenticateService;

    @Before
    public void setUp() {
    	//MockitoAnnotations.initMocks(this);
    }

	@Test
	public void testCreateWithBlankEmail() {
		User user = new User();
		user.setMobile("test");
		user.setUsername("test");
		user.setPassword("test");
	}
    /**
     * 测试执行3次后,retake相关信息会被清空
     */
	@Test
	public void testRetakePasswordError() {
		User user = userService.findByEmail("16259903@qq.com");
		userService.retakePassword(user, Message.Type.email);
		
		try {
			userService.retakePassword(user, "000000", "passw0rd");
		} catch(Exception e) {
		}
		
		user = userService.findByEmail("16259903@qq.com");
		Assert.assertNotNull(user.getRetakeCount());
		Assert.assertEquals(user.getRetakeCount().intValue(), 1);
		
		try {
			userService.retakePassword(user, "000000", "passw0rd");
		} catch(Exception e) {
		}
		
		try {
			userService.retakePassword(user, "000000", "passw0rd");
		} catch(Exception e) {
			
		}
		user = userService.findByEmail("16259903@qq.com");
		Assert.assertEquals(user.getRetakeCount(), null);
	} 
	
    /**
     * 成功修改后,retake信息会被清空
     */
	@Test
	public void testRetakePasswordSuccess() {
		User user = userService.findByEmail("110486432@qq.com");
		Assert.assertEquals(user.getRetakeCode(), "888888");

		try {
			userService.retakePassword(user, "888888", "passw0rdtest");
		} catch(Exception e) {
			
		}
		
		user = userService.findByEmail("110486432@qq.com");

		Assert.assertEquals(user.getRetakeCode(), null);
		Assert.assertEquals(user.getRetakeDate(), null);
		Assert.assertEquals(user.getRetakeCount(), null);
	}

	@Test
	public void testUserWithExperts() {
		User user = userService.findByEmail("13810042699@qq.com");
		Assert.assertNotNull(user);
		Assert.assertNotNull(user.getExperts());
		Assert.assertEquals(user.getExperts().size(), 1);
	}


    /**
     * 有tasks的任务删不掉
     */
	/*
	 * 	@Test
	public void testDeleteUserWithTask() {
    	when(authenticateService.getCurrentUser()).thenReturn(new AuthUserImpl(1L , "test" , "13700230001" , User.class.getSimpleName()));
		System.out.println("testDeleteUserWithTask");
		User user = userService.findByEmail("13922222222@test.com");
		Assert.assertNotNull(user);

		try {
			userService.delete(user);
		} catch(Exception e) {
			e.printStackTrace();
		}

		user = userService.findByEmail("13922222222@test.com");
		Assert.assertNotNull(user);
	}*/
}
