package com.ainia.ecgApi.service.sys;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ainia.ecgApi.core.crud.BaseDao;
import com.ainia.ecgApi.core.crud.BaseServiceImpl;
import com.ainia.ecgApi.dao.sys.ChiefDao;
import com.ainia.ecgApi.domain.sys.Chief;

/**
 * <p>chief Domain Service</p>
 * Copyright: Copyright (c) 2013
 * Company:   
 * ChiefServiceImpl.java
 * @author pq
 * @createdDate 2013-6-22
 * @version 0.1
 */
@Service
public class ChiefServiceImpl extends BaseServiceImpl<Chief , Long> implements ChiefService
{
	@Autowired
	private ChiefDao chiefDao;
	@Autowired
	private EmployeeService employeeService;

	@Override
	public BaseDao<Chief, Long> getBaseDao() {
		return chiefDao;
	}

	@Override
	public Chief save(Chief domain) {
		return employeeService.save(domain);
	}

	@Override
	public List<Chief> save(Iterable domains) {
		return employeeService.save(domains);
	} 

	
	
}
