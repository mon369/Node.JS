/*********************************************************************************** 
 * WEB322 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this
*  assignment has been copied manually or electronically from any other source (including web sites) or 
*  distributed to other students.
* 
*  Name: Abel Inocencio Student ID: 047 492 095 Date: June 23, 2017
*
*  Online (Heroku) Link: http://web322-abel.herokuapp.com/
*
********************************************************************************/


const express = require('express');
const app = express();
const path = require('path');
const dataService = require('./data-service.js');
const exphbs = require('express-handlebars');
const bparser = require('body-parser');


var port = process.env.PORT || 8080;

app.use(express.static('public'));
app.use(bparser.urlencoded({ extended: true }));

app.engine(".hbs", exphbs({
    extname: ".hbs",
    defaultLayout: 'layout',
    helpers: {
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));


app.set("view engine", ".hbs");


app.get("/", (req, res) => {
   res.render("home");
    
})

//about
app.get("/about", (req, res) => {
    res.render("about");
})

//employees
app.get("/employees", (req, res) => {

    if (req.query.manager) {
        dataService.getEmployeesByManager(req.query.manager)
            .then((employeesByManager) => {
                res.render("employeeList", {data:employeesByManager, title:"Employees By Manager"})
            })
            .catch((err) => {
                 res.render("employeeList", {data:{}, title:"Employees By Manager"})
            })
    } else if (req.query.status) {
        dataService.getEmployeesByStatus(req.query.status)
            .then((employeesByStatus) => {
                res.render("employeeList", {data: employeesByStatus, title:"Employees By Status"})
            })
            .catch((err) => {
                res.render("employeeList", {data: {}, title:"Employees By Status"})
            })

    } else if (req.query.department) {
        dataService.getEmployeesByDepartment(req.query.department)
            .then((employeesByDepartment) => {
                res.render("employeeList", {data: employeesByDepartment, title:"Employees By Department"})
            })
            .catch((err) => {
                res.render("employeeList", {data: {}, title:"Employees By Department"})
            })

    } else {
        dataService.getAllEmployees()
            .then((employees) => {
                res.render("employeeList", {data:employees, title:"Employees"});
            })
            .catch((err) => {
                res.render("employeeList", {data:{}, title:"Employees"});
            })
    }
})

//employees/value
app.get("/employee/:empId", (req, res) => {

    //console.log(req.params.empId);
    dataService.getEmployeesByNum(req.params.empId)
        .then((employeeById) => {
            res.render("employee", {data: employeeById, title: "Employee By Number" });
        })
        .catch((err) => {
            res.status(404).send("No Employee Found");
        })       
});

//employee update
app.post("/employee/update", (req, res) => {
    dataService.updateEmployee(req.body)
    .then(() => {
        res.redirect("/employees");
    })
    .catch(()=>{
        res.status(404).send("Error Updating Employee");
    })

})

//managers
app.get("/managers", (req, res) => {
    dataService.getManagers()
        .then((managers) => {
            res.render("employeeList", {data: managers, title: "Employees (Managers)"});
        })
        .catch((err) => {
            res.render("employeeList", {data: {}, title: "Employees (Managers)"});
        })
})

//departments
app.get("/departments", (req, res) => {
    dataService.getDepartments()
        .then((departments) => {
            res.render("departmentList", {data: departments, title: "Departments"});
        })
        .catch((err) => {
            res.render("departmentList", {data: {}, title: "Departments"});
        })

})


//Add User
app.get("/employees/add", (req, res) => {
    res.render("addEmployee");

});

//Post User
app.post("/employees/add", (req, res) => {
    dataService.addEmployee(req.body)
    .then((employees) =>{
        res.redirect("/employees");
    })
    .catch((err) =>{
        res.json({message: err});
    })
});

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


