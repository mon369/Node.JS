const Sequelize = require('sequelize');

var sequelize = new Sequelize('dpfms35l4l71s', 'jpvbqerwfodzul', '683e032813216ea1abe8b2f25e0f427a4fa312caeb3505b87e614424cd795a9b', {
    host: 'ec2-184-73-199-72.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
    }
});

var departmentCount = 0;
var employeeCount = 0;


//Employee Model
var Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    last_name: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
})


var Department = sequelize.define('Departments', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
})







module.exports.initialize = function () {
    return new Promise((resolve, reject) => {

        sequelize.sync().then(() => {
            console.log("Successfully Connected to the Database");
            resolve();
        }).catch(() => {
            reject("Cannot Connect to the Database");
        })

    });
};



module.exports.getAllEmployees = function () {
    return new Promise((resolve, reject) => {
        Employee.findAll().then((allEmployees) => {
            resolve(allEmployees);
        }).catch(() => {
            reject("Unable to find employees");
        })
    });
}

module.exports.getEmployeesByStatus = function (pStatus) {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {
                status: pStatus
            }
        }).then((employeesByStatus) => {
            resolve(employeesByStatus);
        }).catch(() => {
            reject("Unable to find employees");
        })
    });
}

module.exports.getEmployeesByDepartment = function (departmentNum) {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {
                department: departmentNum
            }
        }).then((employeesByDepartment) => {
            resolve(employeesByDepartment);
        }).catch(() => {
            reject("Unable to find employees");
        })

    });
}


module.exports.getEmployeesByManager = function (managerNum) {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {
                employeeManagerNum: managerNum
            }
        }).then((employeesByManager) => {

            resolve(employeesByManager);

        }).catch(() => {
            reject("Unable to find employees");
        })
    });
}


module.exports.getEmployeeByNum = function (num) {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {
                employeeNum: num
            }
        }).then((employeesByNum) => {
            resolve(employeesByNum[0]);
        }).catch(() => {
            reject("Unable to find employees");
        })
    });
}



module.exports.getManagers = function () {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {
                isManager: true
            }
        }).then((managers) => {
            resolve(managers);
        }).catch(() => {
            reject("Unable to find managers");
        })
    });
}


module.exports.getDepartments = function () {
    return new Promise((resolve, reject) => {
        Department.findAll().then((departments) => {
            resolve(departments);
        }).catch(() => {
            reject("Unable to find departments");
        })
    });
}

module.exports.addEmployee = function (employeeData) {
    return new Promise((resolve, reject) => {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (var prop in employeeData) {
            if (employeeData[prop] == "") {
                employeeData[prop] = null;
            }
        }
        Employee.create(
            {
                firstName: employeeData.firstName,
                last_name: employeeData.last_name,
                email: employeeData.email,
                SSN: employeeData.SSN,
                addressStreet: employeeData.addressStreet,
                addressCity: employeeData.addressCity,
                addressState: employeeData.addressState,
                addressPostal: employeeData.addressPostal,
                maritalStatus: employeeData.maritalStatus,
                isManager: employeeData.isManager,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                department: employeeData.department,
                hireDate: employeeData.hireDate
            })
            .then(() => {
                console.log("Employee Created");
                resolve();
            })
            .catch((err) => {
                reject("Could not create record for Employee: " + err.message)
            })
    })
}

module.exports.updateEmployee = function (employeeData) {
    return new Promise((resolve, reject) => {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (var prop in employeeData) {
            if (employeeData[prop] == "") {
                employeeData[prop] = null;
            }
        }
        Employee.update(
            {
                firstName: employeeData.firstName,
                last_name: employeeData.last_name,
                email: employeeData.email,
                SSN: employeeData.SSN,
                addressStreet: employeeData.addressStreet,
                addressCity: employeeData.addressCity,
                addressState: employeeData.addressState,
                addressPostal: employeeData.addressPostal,
                maritalStatus: employeeData.maritalStatus,
                isManager: employeeData.isManager,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                department: employeeData.department,
                hireDate: employeeData.hireDate
            }, {
                where: {
                    employeeNum: employeeData.employeeNum
                }
            }).then(() => {
                console.log("Employee Updated");
                resolve();
            }).catch((err) => {
                reject(err.message);
            })
    });//End of Promise
}


module.exports.addDepartment = function (departmentData) {
    return new Promise((resolve, reject) => {
        for (var prop in departmentData) {
            if (departmentData[prop] == "") {
                departmentData[prop] = null;
            }
        }
        Department.create(
            {
                departmentName: departmentData.departmentName
            }).then(() => {
                resolve();
            }).catch((err) => {
                reject("Unable to add department");
            })
    })
}


module.exports.updateDepartment = function (departmentData) {
    return new Promise((resolve, reject) => {
        for (var prop in departmentData) {
            if (departmentData[prop] == "") {
                departmentData[prop] = null;
            }
        }
        Department.update({
            departmentName: departmentData.departmentName
        }, {
                where: {
                    departmentId: departmentData.departmentId
                }
            }).then(() => {
                resolve();
            }).catch((err) => {
                reject("Unable to add department");
            })
    })
}


module.exports.getDepartmentById = function (id) {
    return new Promise((resolve, reject) => {
        Department.findAll({
            where: {
                departmentId: id
            }
        }).then((departmentById) => {
            resolve(departmentById[0]);
        }).catch((err) => {
            reject("Unable to get department by ID");
        })
    })
}

module.exports.deleteEmployeeByNum = function (empnum) {

    return new Promise((resolve, reject) => {
        Employee.destroy({
            where: {
                employeeNum: empnum
            }
        }).then(() => {
            resolve();
        }).catch((err) => {
            reject("Unable to Remove Employee/Employee not found");
        })

    })
}