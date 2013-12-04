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

import com.ainia.ecgApi.core.security.AuthUserImpl;
import com.ainia.ecgApi.core.security.AuthenticateService;
import com.ainia.ecgApi.domain.health.HealthExamination;
import com.ainia.ecgApi.service.health.HealthExaminationService;
import com.ainia.ecgApi.service.health.HealthExaminationServiceImpl;
import com.ainia.ecgApi.domain.health.HealthRule.Level;
import com.ainia.ecgApi.domain.sys.User;
import com.ainia.ecgApi.utils.DataException;


@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:applicationContext.xml"})
@ActiveProfiles("test")
@TransactionConfiguration(defaultRollback = true)
public class PdfTest {

    @Autowired
    private HealthExaminationService healthExaminationService;
    @Mock
    private AuthenticateService authenticateService;
    
    private static HealthExamination healthExamination;
    
    public void setHealthExaminationService(HealthExaminationService healthExaminationService) {
        this.healthExaminationService = healthExaminationService;
    }

    @Before
    public void setUp() {
    	MockitoAnnotations.initMocks(this);
        healthExamination = new HealthExamination();
        healthExamination.setUserId(1L);
        healthExamination.setTestItem("PHONE");
        healthExamination.setUserType("VIP");
        healthExamination.setLevel(Level.danger);
        healthExamination.setBloodPressureLow(80);
        healthExamination.setBloodPressureHigh(100);
        healthExamination.setHeartRhythm(1);
        healthExamination.setBloodOxygen(1);
        healthExamination.setBreath(1);
        healthExamination.setBodyTemp(1.0F);
        healthExamination.setPulserate(1);
        healthExamination.setHeartData("");
        healthExamination.setLatitude(0.0);
        healthExamination.setAltitude(1);
        healthExamination.setTemp(27.0F);
        healthExamination.setHumidity(1);
        healthExamination.setPressure(1);
        healthExamination.setChargeType("");
        healthExamination.setHeartFeatures("");
        healthExamination.setAlgorithmVersion(1.0F);
    }

    @Test
    public void testExport() throws IOException, DataException, InterruptedException {
    	when(authenticateService.getCurrentUser()).thenReturn(new AuthUserImpl(2L , "test" , "13700230001" , User.class.getSimpleName()));
    	Resource resource = new ClassPathResource("health/sample6");
    	ByteArrayOutputStream out = new ByteArrayOutputStream();
    	int b = -1;
    	InputStream input = resource.getInputStream();
    	while ((b = input.read()) != -1) {
    		out.write(b);
    	}
    	byte[] bytes = out.toByteArray();
    	((HealthExaminationServiceImpl)healthExaminationService).setAuthenticateService(authenticateService);
    	HealthExamination examination = new HealthExamination();
    	examination.setIsGziped(false);
    	healthExaminationService.upload(examination, bytes , null, null, null, null);
    	Thread.sleep(25000);
    	input.close();
    	out.close();
    	
    	Assert.assertTrue(examination.getBloodPressureHigh() != null);
    	Assert.assertTrue(examination.getBloodPressureLow() != null);
    	
    	File file = new File("c:/upload/test.pdf");
    	if (file.exists()) {
    		file.delete();
    	}
    	healthExaminationService.exportPDF(examination, new FileOutputStream(file));
    }
}
