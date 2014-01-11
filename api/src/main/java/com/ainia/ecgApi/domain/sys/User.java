package com.ainia.ecgApi.domain.sys;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.Version;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotBlank;
import org.joda.time.DateTime;

import com.ainia.ecgApi.core.bean.Domain;
import com.ainia.ecgApi.domain.health.HealthRule;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * <p>User Domain Object</p>
 * User.java
 * @author pq
 * @createdDate 2013-06-21
 * @version 0.1
 */
@Entity
@Table(name = "users")
@SequenceGenerator(name="SEQ_USER",sequenceName="SEQ_USER", initialValue=1, allocationSize=100)
public class User implements Domain {

	private static final long serialVersionUID = 1L;

	private Long    id;
	private String  mobile;
	private String  name;
	private String  username;
	private String  password;
	private String  type;
	private Date birthday;
	private String address;
	private Float  stature;
	private Float  weight;
	private String email;
	private String idCard;
	private Integer gender;
	private Integer married;
	private String city;
	private String emContact1;
	private String emContact1Tel;
	private String emContact2;
	private String emContact2Tel;
	private String badHabits;
	private String anamnesis;
	private Date   createdDate;
	private Date   lastUpdated;
	private String remark;
	private Boolean isFree;
	private Integer version;
	private Set<HealthRule> rules;
	private Date lastLoginDate;
	private Date tokenDate;
	
	private String bindCode;
	private Long   bindUserId;
	private Date   bindDate;
	
	private String salt;
	private String retakeCode;
	private Date   retakeDate;
	private Integer retakeCount;

	private Set<Expert> experts;
	private Set<User> relatives;

	@JsonIgnore
	@ManyToMany(fetch=FetchType.EAGER)  
	@JoinTable(name="expert_user"  , joinColumns={@JoinColumn(name="user_id")}  
        						, inverseJoinColumns={@JoinColumn(name="expert_id")}  
    )  
	public Set<Expert> getExperts() {
		return experts;
	}

	public void setExperts(Set<Expert> experts) {
		this.experts = experts;
	}
	@JsonIgnore
	@ManyToMany(fetch=FetchType.EAGER)  
	@JoinTable(name="users_relative"  , joinColumns={@JoinColumn(name="user_id")}  
        						, inverseJoinColumns={@JoinColumn(name="relative_user_id")}  
    )  	
	public Set<User> getRelatives() {
		return relatives;
	}

	public void setRelatives(Set<User> relatives) {
		this.relatives = relatives;
	}

	@Transient
	public void addExpert(Expert expert) {
		if (experts == null) {
			experts = new HashSet();
		}
		experts.add(expert);
	}
	@Transient
	public void addRelative(User user) {
		if (relatives == null) {
			relatives = new HashSet();
		}
		relatives.add(user);
	}
	@Transient
	public void removeRelative(User user) {
		if (relatives == null) {
			return;
		}
		relatives.remove(user);
	}

	@PrePersist
	public void onCreate() {
		this.createdDate = new Date();
		this.lastUpdated = new Date();
		if (username == null || "".equals(username)) {
			username = mobile;
		}
	}
	@PreUpdate
	public void onUpdate() {
		this.lastUpdated = new Date();
	}
	
	@Transient
	public String getMobilePrefix () {
		return mobile == null?null : mobile.substring(7);
	}
	@Transient
	public boolean isMan() { 
		return this.gender == 1;
	}
	@Transient
	public Integer getAge() {
		if (this.birthday != null) {
			return new DateTime().getYear() - new DateTime(this.birthday).getYear();
		}
		return null;
	}
	
	@Id
	@GeneratedValue(strategy=GenerationType.SEQUENCE,generator="SEQ_USER")
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	@NotBlank
	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}
	@NotBlank
	@JsonIgnore
	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Integer getGender() {
		return gender;
	}

	public void setGender(Integer gender) {
		this.gender = gender;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
	@JsonFormat(pattern = "yyyy-MM-dd" ,  timezone = "GMT+08:00")
	public Date getBirthday() {
		return birthday;
	}

	public void setBirthday(Date birthday) {
		this.birthday = birthday;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public Float getStature() {
		return stature;
	}

	public void setStature(Float stature) {
		this.stature = stature;
	}

	public Float getWeight() {
		return weight;
	}

	public void setWeight(Float weight) {
		this.weight = weight;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}
	@Email
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getEmContact1() {
		return emContact1;
	}

	public void setEmContact1(String emContact1) {
		this.emContact1 = emContact1;
	}
	@Column(name="em_contact1_tel")
	public String getEmContact1Tel() {
		return emContact1Tel;
	}

	public void setEmContact1Tel(String emContact1Tel) {
		this.emContact1Tel = emContact1Tel;
	}

	public String getEmContact2() {
		return emContact2;
	}

	public void setEmContact2(String emContact2) {
		this.emContact2 = emContact2;
	}
	@Column(name="em_contact2_tel")
	public String getEmContact2Tel() {
		return emContact2Tel;
	}

	public void setEmContact2Tel(String emContact2Tel) {
		this.emContact2Tel = emContact2Tel;
	}

	public String getBadHabits() {
		return badHabits;
	}

	public void setBadHabits(String badHabits) {
		this.badHabits = badHabits;
	}

	public String getAnamnesis() {
		return anamnesis;
	}

	public void setAnamnesis(String anamnesis) {
		this.anamnesis = anamnesis;
	}
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss"  , timezone = "GMT+08:00")
	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss" ,  timezone = "GMT+08:00")
	public Date getLastUpdated() {
		return lastUpdated;
	}

	public void setLastUpdated(Date lastUpdated) {
		this.lastUpdated = lastUpdated;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}
	public Boolean getIsFree() {
		return isFree;
	}

	public void setIsFree(Boolean isFree) {
		this.isFree = isFree;
	}
	@Version
	public Integer getVersion() {
		return version;
	}

	public void setVersion(Integer version) {
		this.version = version;
	}
	public String getIdCard() {
		return idCard;
	}
	
	@JsonIgnore
	@ManyToMany
	@JoinTable(name="health_rule_user"  , joinColumns={@JoinColumn(name="user_id")}  
        						, inverseJoinColumns={@JoinColumn(name="rule_id")}  
    )  
	public Set<HealthRule> getRules() {
		return rules;
	}
	private void setRules(Set<HealthRule> rules) {
		this.rules = rules;
	}
	@Transient
	public void addRule(HealthRule rule) {
		if (rules == null) {
			rules = new HashSet();
		}
		rules.add(rule);
	}
	
	@Transient
	public void removeRule(HealthRule rule) {
		if (rules == null) {
			return;
		}
		rules.remove(rule);
	}
	
	public void setIdCard(String idCard) {
		this.idCard = idCard;
	}
	
	@JsonIgnore
	public String getRetakeCode() {
		return retakeCode;
	}
	public void setRetakeCode(String retakeCode) {
		this.retakeCode = retakeCode;
	}
	@JsonIgnore
	public Date getRetakeDate() {
		return retakeDate;
	}
	public void setRetakeDate(Date retakeDate) {
		this.retakeDate = retakeDate;
	}
	@JsonIgnore
	public Integer getRetakeCount() {
		return retakeCount;
	}
	public void setRetakeCount(Integer retakeCount) {
		this.retakeCount = retakeCount;
	}

	@JsonFormat(pattern = "yyyy-MM-dd hh:mm" ,  timezone = "GMT+08:00")
	public Date getLastLoginDate() {
		return lastLoginDate;
	}
	public void setLastLoginDate(Date lastLoginDate) {
		this.lastLoginDate = lastLoginDate;
	}
	@JsonIgnore
	public String getSalt() {
		return salt;
	}
	public void setSalt(String salt) {
		this.salt = salt;
	}
	@JsonIgnore
	public Date getTokenDate() {
		return tokenDate;
	}
	public void setTokenDate(Date tokenDate) {
		this.tokenDate = tokenDate;
	}
	@JsonIgnore
	public String getBindCode() {
		return bindCode;
	}

	public void setBindCode(String bindCode) {
		this.bindCode = bindCode;
	}
	@JsonIgnore
	public Long getBindUserId() {
		return bindUserId;
	}

	public void setBindUserId(Long bindUserId) {
		this.bindUserId = bindUserId;
	}
	@JsonIgnore
	public Date getBindDate() {
		return bindDate;
	}

	public void setBindDate(Date bindDate) {
		this.bindDate = bindDate;
	}
	
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		return result;
	}

	

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		User other = (User) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
	public Integer getMarried() {
		return married;
	}
	public void setMarried(Integer married) {
		this.married = married;
	}


}
