/********************************************************************************
* 
* WEB322 – Assignment 05 
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part of this 
* assignment has been copied manually or electronically from any other source (including web sites) or 
* distributed to other students. 
* 
* Name: Abel Inocencio Student ID: 047 492 095 Date: July 9, 2017
* 
* Online (Heroku) Link: http://web322-abel.herokuapp.com/
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
app.get("/employee/:empNum", (req, res) => {
    // initialize an empty object to store the values
    let viewData = {};
    dataService.getEmployeeByNum(req.params.empNum)
        .then((data) => {
            viewData.data = data; //store employee data in the "viewData" object as "data"
        }).catch(() => {
            viewData.data = null; // set employee to null if there was an error
        }).then(dataService.getDepartments)
        .then((data) => {
            viewData.departments = data; // store department data in the "viewData" object as "departments"
            // loop through viewData.departments and once we have found the departmentId that matches
            // the employee's "department" value, add a "selected" property to the matching
            // viewData.departments object
            for (let i = 0; i < viewData.departments.length; i++) {
                if (viewData.departments[i].departmentId == viewData.data.department) {
                    viewData.departments[i].selected = true;
                }
            }
        }).catch(() => {
            viewData.departments = []; // set departments to empty if there was an error
        }).then(() => {
            if (viewData.data == null) { // if no employee - return an error
                res.status(404).send("Employee Not Found");
            } else {
                res.render("employee", { viewData: viewData }); // render the "employee" view
            }
        });
});

//Employee Update
app.post("/employee/update", (req, res) => {
    dataService.updateEmployee(req.body)
    .then(() => {
        res.redirect("/employees");
    })
    .catch(()=>{
        res.status(404).send("Error Updating Employee");
    })

})


//Add User
app.get("/employees/add", (req, res) => {
    dataService.getDepartments()
    .then((departmentsList)=>{
        res.render("addEmployee", {departments: departmentsList})
    })
    .catch(()=>{
        res.render("addEmployee", {departments: []});
    })

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

//Managers
app.get("/managers", (req, res) => {
    dataService.getManagers()
        .then((managers) => {
            res.render("employeeList", {data: managers, title: "Employees (Managers)"});
        })
        .catch((err) => {
            res.render("employeeList", {data: {}, title: "Employees (Managers)"});
        })
})



//Department
app.get("/departments", (req, res) => {
    dataService.getDepartments()
        .then((departments) => {
            res.render("departmentList", {data: departments, title: "Departments"});
        })
        .catch((err) => {
            res.render("departmentList", {data: {}, title: "Departments"});
        })

})



//Add Department
app.get("/departments/add",(req, res) =>{
    res.render("addDepartment");
})

app.post("/departments/add", (req, res)=>{
    dataService.addDepartment(req.body)
    .then(() =>{
        res.redirect("/departments");
    }).catch((err)=>{
        res.json({Error: err});
    })
})


//Department ID
app.get("/department/:id", (req, res)=>{
    dataService.getDepartmentById(req.params.id)
    .then((departmentById) =>{
        res.render("department",{department: departmentById, title: "Department By ID"});
    })
    .catch((err)=>{
        res.status(404).send(err);
    })

})

//Department Update
app.post("/department/update", (req, res)=>{
    dataService.updateDepartment(req.body)
    .then(()=>{
        res.redirect("/departments");
    })
    .catch((err)=>{
        res.status(404).send(err);
    })

})


app.get("/employee/delete/:empNum", (req, res) =>{
    dataService.deleteEmployeeByNum(req.params.empNum)
    .then(()=>{
        res.redirect("/employees");

    }).catch((err)=>{
        res.status(500).send(err)
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



