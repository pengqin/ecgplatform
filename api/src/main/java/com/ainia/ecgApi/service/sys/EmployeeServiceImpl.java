package com.ainia.ecgApi.service.sys;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ainia.ecgApi.core.crud.BaseDao;
import com.ainia.ecgApi.core.crud.BaseServiceImpl;
import com.ainia.ecgApi.core.crud.Query;
import com.ainia.ecgApi.core.exception.ServiceException;
import com.ainia.ecgApi.core.security.AuthUser;
import com.ainia.ecgApi.core.security.AuthenticateService;
import com.ainia.ecgApi.core.utils.PropertyUtil;
import com.ainia.ecgApi.core.utils.ValueUtils;
import com.ainia.ecgApi.dao.sys.EmployeeDao;
import com.ainia.ecgApi.domain.sys.Employee;
import com.ainia.ecgApi.domain.sys.Employee.Status;
import com.ainia.ecgApi.domain.sys.SystemConfig;
import com.ainia.ecgApi.domain.task.ExaminationTask;
import com.ainia.ecgApi.service.task.ExaminationTaskService;

/**
 * <p>Employee Service Impl</p>
 * Copyright: Copyright (c) 2013
 * Company:   
 * EmployeeServiceImpl.java
 * @author pq
 * @createdDate 2013-6-22
 * @version 0.1
 */
@Service("employeeService")
public class EmployeeServiceImpl extends BaseServiceImpl<Employee , Long> implements EmployeeService {
	
	public static final Integer DEFAULT_LIVE_TIMEOUT = 30;
	
	@Autowired
	private EmployeeDao employeeDao;
	@Autowired
	private AuthenticateService authenticateService;
	@Autowired
	private SystemConfigService systemConfigService;
	@Autowired
	private ExaminationTaskService examinationTaskService;

	@Override
	public BaseDao<Employee, Long> getBaseDao() {
		return employeeDao;
	}

	public void setEmployeeDao(EmployeeDao employeeDao) {
		this.employeeDao = employeeDao;
	}

	public Employee findByUsername(String username) {
		return employeeDao.findByUsername(username);
	}
	
	@Override
	public Employee create(Employee employee) {
		if (StringUtils.isNotBlank(employee.getPassword())) {
			employee.setPassword(authenticateService.encodePassword(employee.getPassword() , null));
		}
		return super.create(employee);
	}
	

	@Override
	public Employee update(Employee employee) {
		//not allowed change the password
		Employee old = employeeDao.findOne(employee.getId());
		List<String> excludes = new ArrayList<String>(1);
		excludes.add(Employee.PASSWORD);
		PropertyUtil.copyProperties(old , employee , excludes);
		return super.update(old);
	}

	@Override
	public void delete(Employee employee) {
		int size = 0;
		Query<ExaminationTask> query = new Query<ExaminationTask>();
		query.eq(ExaminationTask.OPERATOR_ID, employee.getId());
		List<ExaminationTask> tasks = this.examinationTaskService.findAll(query);
		size += tasks.size();
		
		query = new Query<ExaminationTask>();
		query.eq(ExaminationTask.EXPERT_ID, employee.getId());
		tasks = this.examinationTaskService.findAll(query);
		size += tasks.size();
		
		if (size == 0) {
			super.delete(employee);
		} else {
			throw new ServiceException("exception.employee.has.some.examinations");
		}
	}

	@Override
	public Employee patch(Employee employee) {
		//not allowed change the password
		Employee old = employeeDao.findOne(employee.getId());
		employee.setPassword(old.getPassword());
		return super.patch(employee);
	}

	public void changePassword(Long id, String oldPassword,
			String newPassword) {
		Employee employee = this.get(id);
		AuthUser currentUser = authenticateService.getCurrentUser();
		if (employee == null) {
			throw new ServiceException("exception.notFound");
		}
		if (!currentUser.isSuperAdmin() && !currentUser.isChief() && !currentUser.getId().equals(id)) {
			throw new ServiceException("exception.password.cannotChange");
		}
		
		if (!authenticateService.checkPassword(employee.getPassword() , oldPassword , null)) {
			throw new ServiceException("exception.oldPassword.notEquals");
		}
		employee.setLastLoginDate(new Date());
		employee.setPassword(authenticateService.encodePassword(newPassword , null));
		this.employeeDao.save(employee);
	}
	
	public void resetPassword(Long id) {
		Employee employee = this.get(id);
		AuthUser currentUser = authenticateService.getCurrentUser();
		if (employee == null) {
			throw new ServiceException("exception.notFound");
		}
		if (!currentUser.isSuperAdmin() && !currentUser.isChief() && !currentUser.getId().equals(id)) {
			throw new ServiceException("exception.password.cannotChange");
		}
		employee.setLastLoginDate(new Date());
		employee.setPassword(authenticateService.encodePassword(employee.getUsername() , null));
		this.employeeDao.save(employee);
	}

	public void setAuthenticateService(AuthenticateService authenticateService) {
		this.authenticateService = authenticateService;
	}

	@Override
	public void checkLive() {
		List<Employee> allEmployee = this.employeeDao.findAll();
		Integer timeout = ValueUtils.asInt(systemConfigService.findByKey(SystemConfig.EMPLOYEE_LIVE_TIMEOUT) ,
								DEFAULT_LIVE_TIMEOUT);
		DateTime now = new DateTime();
		for (Employee employee : allEmployee) {
			Date lastLiveDate = employee.getLastLiveDate();
			if (lastLiveDate == null || now.minusMinutes(timeout).isAfter(new DateTime(lastLiveDate).getMillis())) {
				employee.setStatus(Status.OFFLINE);
			}
			this.update(employee);
		}
	}

}
