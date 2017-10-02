/*********************************************************************************
* WEB322 􀍴 Assignment 07
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part of this
* assignment has been copied manually or electronically from any other source (including web sites) or
* distributed to other students.
*
* Name: Abel Inocencio Student ID: 047 492 095 Date: August 2, 2017
*
* Online (Heroku) Link: https://web322-abel.herokuapp.com/
*
********************************************************************************/

const express = require('express');
const app = express();
const path = require('path');
const dataService = require('./data-service.js');
const dataServiceComments = require('./data-service-comments.js')
const exphbs = require('express-handlebars');
const bparser = require('body-parser');
const clientSessions = require('client-sessions');
const dataServiceAuth = require('./data-service-auth.js')


var port = process.env.PORT || 8080;


app.use(express.static('public'));
app.use(bparser.urlencoded({ extended: true }));

//A7, Step 1: Create middleware for Client-Sessions
app.use(clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "the1quick2brown3fox4jumped5over6the7lazy8dog!@#$", // this should be a long un-guessable string.
    duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)

})
)

//A7, Step 3
app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
})

//A7, Step 4

function ensureLogin(req, res, next) {
    if (!req.session.user) {
        res.redirect("/login");
    } else {
        next();
    }


}

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



//employees
app.get("/employees", ensureLogin, (req, res) => {

    if (req.query.manager) {
        dataService.getEmployeesByManager(req.query.manager)
            .then((employeesByManager) => {
                res.render("employeeList", { data: employeesByManager, title: "Employees By Manager" })
            })
            .catch((err) => {
                res.render("employeeList", { data: {}, title: "Employees By Manager" })
            })
    } else if (req.query.status) {
        dataService.getEmployeesByStatus(req.query.status)
            .then((employeesByStatus) => {
                res.render("employeeList", { data: employeesByStatus, title: "Employees By Status" })
            })
            .catch((err) => {
                res.render("employeeList", { data: {}, title: "Employees By Status" })
            })

    } else if (req.query.department) {
        dataService.getEmployeesByDepartment(req.query.department)
            .then((employeesByDepartment) => {
                res.render("employeeList", { data: employeesByDepartment, title: "Employees By Department" })
            })
            .catch((err) => {
                res.render("employeeList", { data: {}, title: "Employees By Department" })
            })

    } else {
        dataService.getAllEmployees()
            .then((employees) => {
                res.render("employeeList", { data: employees, title: "Employees" });
            })
            .catch((err) => {
                res.render("employeeList", { data: {}, title: "Employees" });
            })
    }
})

//employees/value
app.get("/employee/:empNum", ensureLogin, (req, res) => {
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
app.post("/employee/update", ensureLogin, (req, res) => {
    dataService.updateEmployee(req.body)
        .then(() => {
            res.redirect("/employees");
        })
        .catch(() => {
            res.status(404).send("Error Updating Employee");
        })

})


//Add User
app.get("/employees/add", ensureLogin, (req, res) => {
    dataService.getDepartments()
        .then((departmentsList) => {
            res.render("addEmployee", { departments: departmentsList })
        })
        .catch(() => {
            res.render("addEmployee", { departments: [] });
        })

});

//Post User
app.post("/employees/add", ensureLogin, (req, res) => {
    dataService.addEmployee(req.body)
        .then((employees) => {
            res.redirect("/employees");
        })
        .catch((err) => {
            res.json({ message: err });
        })
});

//Managers
app.get("/managers", ensureLogin, (req, res) => {
    dataService.getManagers()
        .then((managers) => {
            res.render("employeeList", { data: managers, title: "Employees (Managers)" });
        })
        .catch((err) => {
            res.render("employeeList", { data: {}, title: "Employees (Managers)" });
        })
})



//Department
app.get("/departments", ensureLogin, (req, res) => {
    dataService.getDepartments()
        .then((departments) => {
            res.render("departmentList", { data: departments, title: "Departments" });
        })
        .catch((err) => {
            res.render("departmentList", { data: {}, title: "Departments" });
        })

})



//Add Department
app.get("/departments/add", ensureLogin, (req, res) => {
    res.render("addDepartment");
})

app.post("/departments/add", ensureLogin, (req, res) => {
    dataService.addDepartment(req.body)
        .then(() => {
            res.redirect("/departments");
        }).catch((err) => {
            res.json({ Error: err });
        })
})


//Department ID
app.get("/department/:id", ensureLogin, (req, res) => {
    dataService.getDepartmentById(req.params.id)
        .then((departmentById) => {
            res.render("department", { department: departmentById, title: "Department By ID" });
        })
        .catch((err) => {
            res.status(404).send(err);
        })

})

//Department Update
app.post("/department/update", ensureLogin, (req, res) => {
    dataService.updateDepartment(req.body)
        .then(() => {
            res.redirect("/departments");
        })
        .catch((err) => {
            res.status(404).send(err);
        })

})


app.get("/employee/delete/:empNum", ensureLogin, (req, res) => {
    dataService.deleteEmployeeByNum(req.params.empNum)
        .then(() => {
            res.redirect("/employees");

        }).catch((err) => {
            res.status(500).send(err)
        })
})

//Add Comment

app.post("/about/addcomment", (req, res) => {


    dataServiceComments.addComment(req.body)
        .then((commentId) => {
            res.redirect("/about");
        })
        .catch((err) => {
            console.log(err);
            res.redirect("/about");

        })

})


//Add Comment

app.post("/about/addreply", (req, res) => {

    dataServiceComments.addReply(req.body)
        .then(() => {
            res.redirect("/about");
        })
        .catch((err) => {
            console.log(err);
            res.redirect("/about");

        })

})

//GET ALL COMMENTS
app.get("/about", (req, res) => {
    dataServiceComments.getAllComments()
        .then((comments) => {

            console.log("Found");
            res.render("about", { data: comments });
        })
        .catch((err) => {
            console.log("Not found");
            res.render("about");
        })
})



//A7 ROUTES
app.get("/login", (req, res)=>{
    res.render("login");
})

app.get("/register", (req, res) =>{

    res.render("register")
})

app.post("/register", (req, res) =>{
    dataServiceAuth.registerUser(req.body)
    .then(()=>{
        res.render("register", { successMessage:"User Created" })
    })
    .catch((err) =>{
        res.render("register", {errorMessage: err, user: req.body.user})
    });
})

app.post("/login", (req, res) =>{
    dataServiceAuth.checkUser(req.body)
    .then(() => {
        req.session.user = {
            username: req.body.user
        }
        res.redirect("/employees");
    })
    .catch((err)=>{
        res.render("login", {errorMessage: err, user: req.body.user})
    })
})



app.get("/logout", (req, res) =>{
    req.session.reset();
    res.redirect("/");
})




//No matching route
app.use((req, res) => {
    res.json({ message: "No route Found" });
})



dataService.initialize()
    .then(() => {
        console.log("Data Service Module initialized")
    })
    .then(dataServiceComments.initialize())
    .then(() => {
        console.log("Data Service Comments Module initialized");
    })
    .then(dataServiceAuth.initialize())
    .then(()=>{
        console.log("Data Service Auth Module initialized");
    })
    .then(() => {
        app.listen(port, () => {
            console.log("Listening to port " + port);
        });
    })
    .catch((err) => {
        console.log("CANNOT READ THE FILE: " + err);
    });



/*
dataServiceComments.initialize()
    .then(() => {
        dataServiceComments.addComment({
            authorName: "Comment 1 Author",
            authorEmail: "comment1@mail.com",
            subject: "Comment 1",
            commentText: "Comment Text 1"
        }).then((id) => {
            dataServiceComments.addReply({
                comment_id: id,
                authorName: "Reply 1 Author",
                authorEmail: "reply1@mail.com",
                commentText: "Reply Text 1"
            }).then(dataServiceComments.getAllComments)
                .then((data) => {
                    console.log("comment: " + data[data.length - 1]);
                    process.exit();
                });
        });
    }).catch((err) => {
        console.log("Error: " + err);
        process.exit();
    });
    */