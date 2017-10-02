const path = require('path');
const file = require('fs');
var employees = [];
var departments = [];
var empCount = 0;

var employeesFile = "/data/employees.js";
var departmentsFile = "/data/departments.js";

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        file.readFile(path.join(__dirname + employeesFile), (err, data) => {
            if (err) { 
                reject(err);
             }else{
                employees = JSON.parse(data);
                file.readFile(path.join(__dirname + departmentsFile), (err, data) => {
                    if (err) { reject(err); }
                    departments = JSON.parse(data);
                    if (departments.length > 0 && employees.length > 0) {
                        //Set empCount to employees.length
                        empCount = employees.length;
                        resolve();
                    } else {
                        reject("no results");
                    }
                });
             }
        });
    });
};

module.exports.getAllEmployees = function(){
    return new Promise((resolve, reject)=>{
        if (employees.length === 0){
            reject("No results returned for employees");
        }else{
            resolve(employees);
        }
    });
}

module.exports.getEmployeesByStatus = function (status) {
    return new Promise((resolve, reject) => {
        let employeesByStatus = [];
        let s = status.toLowerCase();
        for (let e = 0; e < employees.length; e++) {
            if (employees[e].status.toLowerCase() == s) {
                employeesByStatus.push(employees[e]);
            }
        }
        if (employeesByStatus.length === 0) {
            reject("No employees returned for status: " + status);
        } else {
            resolve(employeesByStatus);
        }
    });
}

module.exports.getEmployeesByDepartment = function (department) {
    return new Promise((resolve, reject) => {
        if(department < 1 ){ reject("Invalid Department Number")}
        let employeesByDepartment = [];
        for (let ed = 0; ed < employees.length; ed++) {
            if (employees[ed].department == department) {
                employeesByDepartment.push(employees[ed]);
            }
        }                                                                                                                                                                                                                                                                         
        if (employeesByDepartment.length === 0) {
            reject("No employees found for department  " + department);
        } else {
            resolve(employeesByDepartment)
        }
    });
}


module.exports.getEmployeesByManager = function (manager) {
    return new Promise((resolve, reject) => {
        if(manager < 1){reject("Invalid Manager Number")}
        let employeesByManager = [];
        for (let ebm = 0; ebm < employees.length; ebm++) {
            if (employees[ebm].employeeManagerNum == manager) {
                employeesByManager.push(employees[ebm]);
            }
        }
        if (employeesByManager.length === 0) {
            reject("No employees found for manager " + manager);
        } else {
            resolve(employeesByManager);
        }
    });
}



module.exports.getEmployeesByNum = function (num) {

    return new Promise((resolve, reject) => {  
        if(num < 1){reject("Invalid Employee Number")}
        let found = false;
        let employeeByNum = {};
        for (let ebnum = 0; ebnum < employees.length && !found; ebnum++) {
            if (employees[ebnum].employeeNum == num) {
                employeeByNum = employees[ebnum];
                found = true;
            }
        }
        if (!found) {
            reject("No employee found for number " + num);
        } else {
            resolve(employeeByNum);
        }
    });
}



module.exports.getManagers = function () {

    return new Promise((resolve, reject) => {
    let managers = [];
    for (let m = 0; m < employees.length; m++) {
        if (employees[m].isManager) {
            managers.push(employees[m]);
        }
    }
        if (managers.length === 0) {
            reject("No managers found");
        } else {
            resolve(managers);
        }
    });
}


module.exports.getDepartments = function () {
    return new Promise((resolve, reject) => {
        if (departments.length === 0) {
            reject("No departments found")
        } else {
            resolve(departments)
        }
    });
}

module.exports.addEmployee = function(employee){
    return new Promise((resolve, reject) => {
        if(employee){
            ++empCount;
            employee.employeeNum = empCount;
            employees.push(employee);
            resolve();
        }else{
            reject("Unable to add employee");
        }
    })
}

module.exports.updateEmployee = function(employee){

    return new Promise((resolve, reject) => {
        var empNum = employee.employeeNum;
        var found = false;
        for(let e = 0; e < employees.length && !found; e++){
            if(empNum == employees[e].employeeNum){
                employees[e] = employee;
                found = true;
                resolve();
            }
        }
        if(!found){
            reject("Error updating employee");
        }

    })
}