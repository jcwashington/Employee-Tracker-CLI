const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const { message } = require('statuses');
const e = require('express');


const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false}));
app.use(express.json());


// mysql connection
const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'abcd1234',
        database: 'employee_tracker_db',
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
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'View employees by department',
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
            case 'View employees by department':
                viewEmployeesByDepartment();
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
    const query = db.query(`SELECT * FROM departments`, (err, res) => {
        if (err) throw err;
        console.table(res);
        initQuery();
    })
}

viewRoles = () => {
    const query = db.query(`SELECT * FROM roles`, (err, res) => {
        if (err) throw err;
        console.table(res);
        initQuery();
    })
}

viewEmployees = () => {
    const query = db.query(`SELECT * FROM employees`, (err, res) => {
        if (err) throw err;
        console.table(res);
        initQuery();
    })
}

viewEmployeesByDepartment = () => {
    // collect departments
    db.query(`SELECT * FROM departments`, (err, res) => {
        if (err) throw err;
        const deptList = res.map( dept => (
            {
                name: dept.dept_name,
                value: dept.dept_id
            }
        ))
        inquirer.prompt([
            {
                type: 'list',
                name: 'chosenDept',
                message: 'Which department would you like to see the employees for? ',
                choices: deptList
            }]
            ).then((answer) => {
                db.query(`SELECT employees.first_name, employees.last_name,  roles.title FROM roles INNER JOIN employees ON employees.role_id = roles.role_id WHERE roles.dept_id = ${answer.chosenDept}`, (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    initQuery();
            })
        });
    });
}


addDepartment = () => {
    inquirer.prompt({
        type: 'input',
        message: 'WHAT IS THE NEW DEPARTMENT NAME? ',
        name: 'dept_name'
    }) .then ((answer) => {
        db.query(`INSERT INTO departments (dept_name) VALUES ('${answer.dept_name}')`, (err, res) => {
            if (err) throw err;
            console.log(`Added a new department called ${answer.dept_name}`);
            // show the newly updated departments
            db.query(`SELECT * FROM departments`, (err, res) => {
                if (err) throw err;
                console.table(res);
                initQuery();
            })
            
        })
    })
}

addRole = () => {
    // asking for list of the current available departments so User can select the correct dept_id
    db.query(`SELECT * FROM departments`, (err, res) => {
        if (err) throw err;
        const deptList = res.map(dept => (
            {
                name: dept.dept_name,
                value: dept.dept_id
            }
        ))
        // now to begin asking questions
        inquirer.prompt ([
            {
                type: "input",
                name: "title",
                message: "What is the new role name? "

            },
            {
                type: "number",
                name: "salary",
                message: "What is the salary for this role? ",
                default: 45000
            },
            {
                type: "list",
                name: "dept_id",
                message: "What department does this role belong to? ",
                choices: deptList
            }
        ]) .then ((answer) => {
            db.query(`INSERT INTO roles (title, salary, dept_id) VALUES ('${answer.title}', ${answer.salary}, ${answer.dept_id})`, (err, res) => {
                if (err) throw err;
                console.log(`Added a new role called ${answer.title}`);
                //show newly updated roles table
                db.query(`SELECT * FROM roles`, (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    // and then give initial options
                    initQuery();
                })
            })
        })
    })
}

addEmployee = () => {
    db.query( `SELECT * FROM roles`, (err, res) => {
        if (err) throw err;
        const roleList = res.map(role => (
            {
                name: role.title,
                value: role.role_id
            }
        ))
        inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: 'Employee first name: '
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'Employee last name: '
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'What is their role? ',
                    choices: roleList
                },
                {
                    type: 'confirm',
                    name: 'has_manager',
                    message: 'Does this person have a manager?'
                },
            ]).then ((answer) => {
                const employeeFirstName = answer.first_name;
                const employeeLastName = answer.last_name;
                const roleId = answer.role_id;
                if (answer.has_manager){
                    db.query(`SELECT * FROM employees`, (err, res) => {
                        if (err) throw err;
                        const employees = res.map(employee => ({
                            name : employee.first_name,
                            value: employee.emp_id
                        }))
                        inquirer.prompt([
                            {
                                type: 'list',
                                name: 'manager_id',
                                message: 'Who is their manager? ',
                                choices: employees
                            }
                        ]).then((answer) => {
                            const manager_id = answer.manager_id;
                            db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('${employeeFirstName}', '${employeeLastName}', ${roleId}, ${manager_id})`, (err, res) => {
                                if (err) throw err; 
                                console.log(`Successfully added new employee ${employeeFirstName} ${employeeLastName}`);
                                initQuery();
                            })
                        })
                    })
            } else {
                db.query(`INSERT INTO employees (first_name, last_name, role_id) VALUES ('${employeeFirstName}', '${employeeLastName}', ${roleId})`, (err, res) => {
                    if (err) throw err; 
                    console.log(`Successfully added new employee ${employeeFirstName} ${employeeLastName}`);
                    initQuery();
                })
            }
        })
    })
}

updateEmployeeRole = () => {
    db.query(`SELECT * FROM employees`, (err, res) => {
        if (err) throw err;
        let allEmployees = res;
        let employeeNames = [];
        allEmployees.forEach((el) => {
            let employeeFullName = `${el.first_name} ${el.last_name}`
            employeeNames.push(employeeFullName);
        })
        console.log(employeeNames);
        db.query( `SELECT * FROM roles`, (err, res) => {
            if (err) throw err;
            const roleList = res.map(role => (
                {
                    name: role.title,
                    value: role.role_id
                })
            )
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'fullName',
                    message: 'Which employee\'s role would you like to update? ',
                    choices: employeeNames
                },
                {
                    type: 'list',
                    name: 'updateRole',
                    message: 'What is the new role? ',
                    choices: roleList
                }
            ]).then((answer) => {
                const seperateName = answer.fullName.split(' ');
                db.query(`UPDATE employees SET role_id = ${answer.updateRole} WHERE first_name = '${seperateName[0]}'`, (err, res) => {
                    if (err) throw err;
                    db.query(`SELECT emp_id, first_name, last_name, role_id FROM employees WHERE first_name = '${seperateName[0]}'`, (err, res) => {
                        console.table(res);
                        initQuery();
                    })
                })
            })
        })
    })
}

exitApp = () => {
    console.log('Bye!');
    db.end();
    process.exit();
}