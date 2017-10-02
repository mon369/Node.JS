/*********************************************************************************** 
 * WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this
*  assignment has been copied manually or electronically from any other source (including web sites) or 
*  distributed to other students.
* 
*  Name: Abel Inocencio Student ID: 047 492 095 Date: June 11, 2017
*
*  Online (Heroku) Link: https://web322-abel.herokuapp.com/
*
********************************************************************************/


var express = require('express');
var app = express();
var path = require('path');
var dataService = require('./data-service.js');


var port = process.env.PORT || 8080;

app.use(express.static('public'));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/views/home.html"))
    dataService.initialize().then(dataService.getAllEmployees());
})

//about
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname + "/views/about.html"))
})

//employees
app.get("/employees", (req, res) => {

    if (req.query.manager) {
        dataService.getEmployeesByManager(req.query.manager)
            .then((employeesByManager) => {
                res.json(employeesByManager)
            })
            .catch((err) => {
                res.json({message: err});
            })
    } else if (req.query.status) {
        dataService.getEmployeesByStatus(req.query.status)
            .then((employees) => {
                res.json(employees)
            })
            .catch((err) => {
                res.json({message: err});
            })

    } else if (req.query.department) {
        dataService.getEmployeesByDepartment(req.query.department)
            .then((employeesByDepartment) => {
                res.json(employeesByDepartment);
            })
            .catch((err) => {
                res.json({message: err});
            })

    } else {
        dataService.getAllEmployees()
            .then((employees) => {
                res.json(employees)
            })
            .catch((err) => {
                res.json({message: err});
            })
    }
})

//employees/value
app.get('/employee/:empId', (req, res) => {

    dataService.getEmployeesByNum(req.params.empId)
        .then((employeeById) => {
            res.json(employeeById);
        })
        .catch((err) => {
            res.json({message: err});
        })       
});


//managers
app.get("/managers", (req, res) => {
    dataService.getManagers()
        .then((managers) => {
            res.json(managers);
        })
        .catch((err) => {
            res.json({message: err});
        })
})

//departments
app.get("/departments", (req, res) => {
    dataService.getDepartments()
        .then((departments) => {
            res.json(departments);
        })
        .catch((err) => {
            res.json({message: err});
        })

})

//No matching route
app.use((req, res) => {
    res.json({message: "No route Found"});
})



dataService.initialize().then(() => {
    app.listen(port, () => {
        console.log("Listening to port " + port);
    });
}).catch((err) => {
    console.log("CANNOT READ THE FILE: " + err);
});


