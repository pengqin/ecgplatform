package com.ainia.ecgApi.service.charge;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ainia.ecgApi.core.crud.BaseDao;
import com.ainia.ecgApi.core.crud.BaseServiceImpl;
import com.ainia.ecgApi.core.exception.ServiceException;
import com.ainia.ecgApi.dao.charge.CardDao;
import com.ainia.ecgApi.domain.charge.Card;
import com.ainia.ecgApi.domain.sys.Employee;
import com.ainia.ecgApi.domain.sys.User;
import com.ainia.ecgApi.service.sys.EmployeeService;

/**
 * <p>Card Service Impl</p>
 * Copyright: Copyright (c) 2013
 * Company:   
 * CardServiceImpl.java
 * @author pq
 * @createdDate 2013-07-29
 * @version 0.1
 */
@Service
public class CardServiceImpl extends BaseServiceImpl<Card , Long> implements CardService {
    
    @Autowired
    private CardDao cardDao;
    @Autowired
    private EmployeeService employeeService;
    
    @Override
    public BaseDao<Card , Long> getBaseDao() {
        return cardDao;
    }

	@Override
	public void charge(String serial, Date activeDate, Long employeeId , User user) {
		Card card = cardDao.findBySerial(serial);
		if (card == null) {
			throw new ServiceException("exception.card.notFound");
		}
		if (activeDate == null || activeDate.before(new Date())) {
			throw new ServiceException("exception.card.invalidActiveDate");
		}
		if (employeeId != null) {
			Employee employee = employeeService.get(employeeId);
			if (employee != null) {
				card.setEmployeeId(employeeId);
				card.setEmployeeName(employee.getName());
			}
		}
	}

}
