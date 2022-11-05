/*********************************************************************************
 *  WEB322 – Assignment 04
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part
 *  of this assignment has been copied manually or electronically from any other source
 *  (including 3rd party web sites) or distributed to other students.
 *
 *  Name: Yujin Kim / Student ID: ykim296 / Date: 2022 Nov 4
 *
 *  Online (Cyclic) Link: https://elated-mite-trunks.cyclic.app
 *
 ********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;

var express = require("express");
var multer = require("multer");
var app = express();
const path = require("path");
const fs = require("fs");
const dataService = require("./data-service.js");
const exphbs = require("express-handlebars");

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.engine(
    ".hbs",
    exphbs.engine({
        extname: ".hbs",
        defaultLayout: "main",
        helpers: {
            navLink: function (url, options) {
                return (
                    "<li" +
                    (url == app.locals.activeRoute ? ' class="active" ' : "") +
                    '><a href="' +
                    url +
                    '">' +
                    options.fn(this) +
                    "</a></li>"
                );
            },
            equal: function (lvalue, rvalue, options) {
                if (arguments.length < 3)
                    throw new Error(
                        "Handlebars Helper equal needs 2 parameters"
                    );
                if (lvalue != rvalue) {
                    return options.inverse(this);
                } else {
                    return options.fn(this);
                }
            },
        },
    })
);
app.set("view engine", ".hbs");

app.use(function (req, res, next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = route == "/" ? "/" : route.replace(/\/$/, "");
    next();
});

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });

// Routes
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/students", (req, res) => {
    if (req.query.status) {
        const status = req.query.status;
        dataService
            .getStudentsByStatus(status)
            .then((data) => {
                res.render("students", { students: data });
            })
            .catch((err) => {
                res.render("students", { message: "no results" });
            });
    } else if (req.query.program) {
        const program = req.query.program;
        dataService
            .getStudentsByProgramCode(program)
            .then((data) => {
                res.render("students", { students: data });
            })
            .catch((err) => {
                res.render("students", { message: "no results" });
            });
    } else if (req.query.credential) {
        const credential = req.query.credential;
        dataService
            .getStudentsByExpectedCredential(credential)
            .then((data) => {
                res.render("students", { students: data });
            })
            .catch((err) => {
                res.render("students", { message: "no results" });
            });
    } else {
        dataService
            .getAllstudents()
            .then((data) => {
                res.render("students", { students: data });
            })
            .catch((err) => {
                res.render("students", { message: "no results" });
            });
    }
});
app.get("/student/:studentId", function (req, res) {
    var sid = req.params.studentId;
    dataService
        .getStudentById(sid)
        .then((data) => {
            res.render("student", { student: data });
        })
        .catch((err) => {
            res.render("student", { message: "no results" });
        });
});

app.post("/student/update", (req, res) => {
    dataService
        .updateStudent(req.body)
        .then(() => {
            res.redirect("/students");
        })
        .catch((err) => {
            res.render("students", { message: "no results" });
        });
});

app.post("/students/add", (req, res) => {
    dataService
        .addStudent(req.body)
        .then(() => {
            res.redirect("/students");
        })
        .catch((err) => {
            console.log("Error: ", err);
        });
});

app.get("/students/add", (req, res) => {
    res.render("addStudent");
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});

app.get("/images/add", (req, res) => {
    res.render("addImage");
});

app.get("/images", (req, res) => {
    fs.readdir("./public/images/uploaded", function (err, items) {
        res.render("images", { data: items });
    });
});

app.get("/intlstudents", (req, res) => {
    dataService
        .getInternationalStudents()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.send(err);
        });
});

app.get("/programs", (req, res) => {
    dataService
        .getPrograms()
        .then((data) => {
            res.render("programs", { programs: data });
        })
        .catch((err) => {
            res.render("programs", { message: "no results" });
        });
});

app.use((req, res) => {
    res.status(404).send("<h2>404</h2><p>Page Not Found</p>");
});

dataService
    .initialize()
    .then(() => {
        app.listen(HTTP_PORT, onHttpStart);
    })
    .catch((err) => {
        console.log("Error: ", err);
    });
