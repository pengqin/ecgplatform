package com.ainia.ecgApi.service.sys;

import java.util.List;

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

import com.ainia.ecgApi.core.crud.Query;
import com.ainia.ecgApi.domain.sys.Expert;
import com.ainia.ecgApi.domain.sys.Employee.Status;
import com.ainia.ecgApi.service.sys.ExpertService;

/**
 * <p>Expert Service test</p>
 * Copyright: Copyright (c) 2013
 * Company:   
 * ExpertServiceTest.java
 * @author pq
 * @createdDate 2013-6-27
 * @version
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:applicationContext.xml"})
@ActiveProfiles("test")
@TransactionConfiguration(defaultRollback = true)
public class ExpertServiceTest {

	@Autowired
	private ExpertService expertService;

	private static Expert expert;
	
	public void setExpertService(ExpertService expertService) {
		this.expertService = expertService;
	}
	
	
	
	@Test
	public void testExpertWithUsers() {
		Expert expert = expertService.get(7l);
		Assert.assertNotNull(expert);
		Assert.assertNotNull(expert.getUsers());
		Assert.assertEquals(expert.getUsers().size(), 1);
	}

	
}
