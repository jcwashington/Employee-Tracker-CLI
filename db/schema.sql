DROP DATABASE IF exists employee_tracker_db;
CREATE DATABASE employee_tracker_db;
USE employee_tracker_db;

CREATE TABLE department(
    dept_id INTEGER AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (dept_id)
);

CREATE TABLE roles (
    role_id INTEGER AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    dept_id INTEGER,
    PRIMARY KEY (role_id),
    FOREIGN KEY (dept_id) REFERENCES department(dept_id)
);

CREATE TABLE employees (
    emp_id INTEGER AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    --making last name nullable in case they're famous and have no last name
    last_name VARCHAR(30),
    role_id INTEGER,
    manager_id INTEGER,
    PRIMARY KEY (emp_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id),
    FOREIGN KEY (manager_id) REFERENCES employees(emp_id)
);