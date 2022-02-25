const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');


const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false}));
app.use(express.json());


// mysql connection
const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'abcd1234',
        database: 'employee_tracker_db'
});

db.connect(function(err) {
    if (err) throw err;
    console.log('Connected to db')

    initQuery();
});

initQuery = () => {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choice: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a new department',
            'Add a new role',
            'Add a new employee',
            'Update an employee role',
            'Exit'
        ]
    }).then((answer) => {
        console.log(`You want to : ${answer.action}`);
        switch (answer.action) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a new department':
                addDepartment();
                break;
            case 'Add a new role':
                addRole();
                break;
            case 'Add a new employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Exit':
                exitApp();
        }
    });
}

viewDepartments = () => {

}

viewRoles = () => {

}

viewEmployees = () => {

}

addDepartment = () => {

}

addRole = () => {

}

addEmployee = () => {

}

updateEmployeeRole = () => {

}

exitApp = () => {
    console.log('Bye!');
    db.end();
    process.exit();
}