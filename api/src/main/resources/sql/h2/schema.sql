drop table if exists user;

create table user (
	id bigint generated by default as identity,
	mobile varchar(20) not null unique,
	id_card varchar(20),
	username varchar(20),
    email varchar(64) unique,
	name varchar(20) not null,
	password varchar(100) not null,
	roles varchar(100),
    retake_code varchar(10),
    retake_date timestamp,
    retake_count int,
    salt varchar(100),
    last_login_date timestamp,
    token_date timestamp,
    gender int,
    married int,
	type varchar(10),
	birthday timestamp,
	address varchar(255),
	stature double,
	weight  double,
	city     varchar(20),
	em_contact1 varchar(20),
	em_contact1_tel varchar(20),
	em_contact2 varchar(20),
	em_contact2_tel varchar(20),
	bad_habits varchar(30),
	anamnesis varchar(30),
	created_date timestamp,
	last_updated timestamp,
	remark varchar(255),
	title varchar(20),
	is_free int,
	version int,
	primary key (id)
);

drop table if exists employee;

create table employee (
    id bigint generated by default as identity,
    type varchar(20),
    name varchar(20),
    username varchar(20) not null unique,
    password varchar(100),
    roles varchar(100),
    status varchar(10) not null,
    enabled int not null,
    dismissed int not null,
    gender int not null,
    expire timestamp,
    birthday timestamp,
    id_card varchar(20),
    mobile varchar(11),
    title varchar(20),
    company varchar(100),
    created_date timestamp,
    last_updated timestamp,
    last_live_date timestamp,
    email varchar(64),
    salt varchar(100),
    last_login_date timestamp,
    token_date timestamp,
    version int,
    primary key(id)
);

drop table if exists expert_operator;

create table expert_operator (
    expert_id bigint not null ,
    operator_id bigint not null
);

drop table if exists health_rule;

create table health_rule (
    id bigint generated by default as identity,
    name varchar(20),
    code varchar(20),
    rule_usage varchar(10),
    can_reply number(1),
    type varchar(30),
    employee_id bigint,
    group_id bigint,
    unit varchar(10),
    level varchar(10),
    min float,
    max float,
    created_date timestamp,
    last_updated timestamp,
    remark varchar(255),
    version int,
    primary key(id)
);

drop table if exists health_rule_reply;

create table health_rule_reply (
    id bigint generated by default as identity,
    title varchar(100) not null,
    content varchar(1000),
    result varchar(20),
    rule_id bigint ,
    created_date timestamp,
    last_updated timestamp,
    version int,
    primary key(id)
);

drop table if exists health_rule_user;

create table health_rule_user (rule_id bigint , user_id bigint);

drop table if exists health_examination;

create table health_examination (
    id bigint generated by default as identity,
    user_id bigint,
    user_name varchar(30),
    test_item varchar(30) not null,
    user_type varchar(30),
    is_test int,
    level varchar(30),
    apk_id varchar(40),
    blood_pressure_low int,
    blood_pressure_high int,
    heart_rhythm int,
    blood_sugar float,
    medicine varchar(64),
    blood_oxygen int,
    breath int,
    body_temp float,
    pulserate int,
    has_data_error int,
    heart_data varchar(200),
    latitude double,
    altitude int,
    temp float,
    humidity int,
    pressure int ,
    charge_type varchar(30),
    heart_features varchar(30),
    algorithm_version float,
    created_date timestamp,
    version int,
    primary key(id)
);

drop table if exists health_reply;

create table health_reply(
    id bigint generated by default as identity,
    type varchar(30),
    reason varchar(100),
    result varchar(100),
    content varchar(1000),
    level varchar(30),
    employee_id bigint,
    examination_id bigint,
    created_date timestamp,
    last_updated timestamp,
    version int,
    primary key(id)
);

drop table if exists task;

create table task(
    id bigint generated by default as identity,
    status varchar(30),
    type varchar(30),
    apk_id varchar(40),
    user_id bigint,
    user_name varchar(30),
    expert_id bigint,
    operator_id bigint,
    examination_id bigint,
    auto int,
    created_date timestamp,
    completed_date timestamp,
    version int,
    primary key(id)
);

drop table if exists system_config;

create table system_config (
    id int generated by default as identity,
    type varchar(10),
    apk_id varchar(40),
    config_key varchar(30),
    value varchar(200),
    primary key(id)
);

drop table if exists card;

create table card (
    id bigint generated by default as identity,
    encoded_serial varchar(200) unique,
    serial varchar(100) unique,
    encoded_password varchar(100),
    days int,
    created_date timestamp,
    created_batch int,
    expire_date timestamp,
    actived_date timestamp,
    user_id bigint,
    user_name varchar(20),
    charged_date timestamp,
    charge_type varchar(10),
    employee_id bigint,
    employee_name varchar(20),
    used_count int,
    max_used int,
    primary key(id)
);

drop  table  if exists apk;
create table apk (
    id bigint generated by default as identity,
    version varchar(20) not null unique,
    released int,
    enabled int,
    created_date timestamp,
    external_url varchar(300),
    primary key(id)
);
