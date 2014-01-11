drop table if exists user;

create table users (
    id number(10) primary key,
    mobile varchar2(20) not null unique,
    id_card varchar2(20),
    username varchar2(20),
    email varchar2(64) unique,
    name varchar2(20) not null,
    password varchar2(100) not null,
    roles varchar2(100),
    retake_code varchar2(10),
    retake_date date,
    retake_count number,
    salt varchar2(100),
    last_login_date date,
    token_date date,
    gender number,
    married number,
    type varchar2(10),
    birthday date,
    address varchar2(255),
    stature number,
    weight  number,
    city     varchar2(20),
    em_contact1 varchar2(20),
    em_contact1_tel varchar2(20),
    em_contact2 varchar2(20),
    em_contact2_tel varchar2(20),
    bad_habits varchar2(30),
    anamnesis varchar2(30),
    created_date date,
    last_updated date,
    remark varchar2(255),
    title varchar2(20),
    is_free number(1),
    version number(5)
);

drop table if exists employee;

create table employee (
    id number(5) primary key,
    type varchar2(20),
    name varchar2(20),
    username varchar2(20) not null unique,
    password varchar2(100),
    roles varchar2(100),
    status varchar2(10) not null,
    enabled number(1) not null,
    dismissed number not null,
    gender number(1) not null,
    expire date,
    birthday date,
    id_card varchar2(20),
    mobile varchar2(11),
    title varchar2(20),
    company varchar2(100),
    created_date date,
    last_updated date,
    last_live_date date,
    email varchar2(64),
    salt varchar2(100),
    last_login_date date,
    token_date date,
    version number(5)
);

drop table if exists expert_operator;

create table expert_operator (
    expert_id bigint not null ,
    operator_id bigint not null
);

drop table if exists health_rule;

create table health_rule (
    id number primary key,
    name varchar2(20),
    code varchar2(20),
    rule_usage varchar2(10),
    can_reply number(1),
    type varchar2(30),
    employee_id number,
    group_id number,
    unit varchar2(10),
    health_level varchar2(10),
    min number,
    max number,
    created_date date,
    last_updated date,
    remark varchar2(255),
    version number(5)
);

drop table if exists health_rule_reply;

create table health_rule_reply (
    id number primary key,
    title varchar2(100) not null,
    content varchar2(1000),
    result varchar2(20),
    rule_id number ,
    created_date date,
    last_updated date,
    version number(5)
);

drop table if exists health_rule_user;

create table health_rule_user (rule_id number , user_id number);

drop table if exists health_examination;

create table health_examination (
    id number primary key,
    user_id number,
    user_name varchar2(30),
    test_item varchar2(30) not null,
    user_type varchar2(30),
    is_test number(1),
    health_level varchar2(30),
    apk_id varchar2(40),
    blood_pressure_low number,
    blood_pressure_high number,
    heart_rhythm number,
    blood_sugar number,
    medicine varchar2(64),
    blood_oxygen number,
    breath number,
    body_temp number,
    pulserate number,
    has_data_error number(1),
    heart_data varchar2(200),
    latitude number,
    altitude number,
    temp number,
    humidity number,
    pressure number ,
    charge_type varchar2(30),
    heart_features varchar2(30),
    algorithm_version number,
    created_date date,
    version number(5)
);

drop table if exists health_reply;

create table health_reply(
    id number primary key,
    type varchar2(30),
    reason varchar2(100),
    result varchar2(100),
    content varchar2(1000),
    health_level varchar2(30),
    employee_id number,
    examination_id number,
    created_date date,
    last_updated date,
    version number(5)
);

drop table if exists task;

create table task(
    id number primary key,
    status varchar2(30),
    type varchar2(30),
    apk_id varchar2(40),
    user_id number,
    user_name varchar2(30),
    expert_id number,
    operator_id number,
    examination_id number,
    auto number,
    created_date date,
    completed_date date,
    version number(5)
);

drop table if exists system_config;

create table system_config (
    id number primary key,
    type varchar2(10),
    apk_id varchar2(40),
    config_key varchar2(30),
    value varchar2(200)
);

drop table if exists card;

create table card (
    id number primary key,
    encoded_serial varchar2(200) unique,
    serial varchar2(100) unique,
    encoded_password varchar2(100),
    days number,
    created_date date,
    created_batch number,
    expire_date date,
    actived_date date,
    user_id number,
    user_name varchar2(20),
    charged_date date,
    charge_type varchar2(10),
    employee_id number,
    employee_name varchar2(20),
    used_count number ,
    max_used number
);

drop  table  if exists apk;
create table apk (
    id number primary key,
    version varchar2(20) not null unique,
    released number,
    enabled number(1),
    created_date date,
    external_url varchar2(300)
);

drop table if exists expert_user;

create table expert_user (
    user_id number not null ,
    expert_id number not null
);

create table expert_operator (
    expert_id number not null ,
    operator_id number not null
);


create table users_relative(
    user_id number not null,
    user_relative_id number not null
    
);