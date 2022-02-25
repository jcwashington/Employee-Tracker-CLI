DROP DATABASE IF exists employee_tracker_db;
CREATE DATABASE employee_tracker_db;
USE employee_tracker_db;

CREATE TABLE departments (
    dept_id INTEGER AUTO_INCREMENT,
    dept_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (dept_id)
);

CREATE TABLE roles (
    role_id INTEGER AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    dept_id INTEGER,
    PRIMARY KEY (role_id),
    FOREIGN KEY (dept_id) REFERENCES departments (dept_id)
);

CREATE TABLE employees (
    emp_id INTEGER AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30),
    role_id INTEGER,
    manager_id INTEGER REFERENCES employees(emp_id),
    PRIMARY KEY (emp_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);