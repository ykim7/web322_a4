const fs = require("fs");

var students = [];
var programs = [];

module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
        fs.readFile("./data/students.json", "utf8", (err, data) => {
            if (err) {
                reject("Unable to read file");
            }
            students = JSON.parse(data);
        });
        fs.readFile("./data/programs.json", "utf8", (err, data) => {
            if (err) {
                reject("Unable to read file");
            }
            programs = JSON.parse(data);
        });
        resolve();
    });
};

module.exports.getAllstudents = () => {
    return new Promise((resolve, reject) => {
        if (students.length == 0) {
            reject("no results returned");
            return;
        }
        resolve(students);
    });
};

module.exports.getInternationalStudents = () => {
    return new Promise((resolve, reject) => {
        const allIntStudents = students.filter(
            (stu) => stu.isInternationalStudent === true
        );
        if (allIntStudents.length == 0) {
            reject("no results returned");
            return;
        }
        resolve(allIntStudents);
    });
};

module.exports.getPrograms = () => {
    return new Promise((resolve, reject) => {
        if (programs.length == 0) {
            reject("no results returned");
            return;
        }
        resolve(programs);
    });
};

module.exports.addStudent = (studentData) => {
    return new Promise((resolve, reject) => {
        if (studentData.isInternationalStudent == undefined) {
            studentData.isInternationalStudent = false;
        } else {
            studentData.isInternationalStudent = true;
        }

        const allStudentIDs = students.map((student) => {
            return parseInt(student.studentID);
        });
        studentData.studentID = (Math.max(...allStudentIDs) + 1).toString();
        students.push(studentData);
        resolve();
    });
};

module.exports.getStudentsByStatus = (status) => {
    return new Promise((resolve, reject) => {
        const studentsByStatus = students.filter((student) => {
            return student.status == status;
        });
        if (studentsByStatus.length == 0) {
            reject("no results returned");
        }
        resolve(studentsByStatus);
    });
};
module.exports.getStudentsByProgramCode = (programCode) => {
    return new Promise((resolve, reject) => {
        const studentsByProgram = students.filter((student) => {
            return student.program == programCode;
        });
        if (studentsByProgram.length == 0) {
            reject("no results returned");
        }
        resolve(studentsByProgram);
    });
};
module.exports.getStudentsByExpectedCredential = (credential) => {
    return new Promise((resolve, reject) => {
        const studentsByCredential = students.filter((student) => {
            return student.expectedCredential == credential;
        });
        if (studentsByCredential.length == 0) {
            reject("no results returned");
        }
        resolve(studentsByCredential);
    });
};
module.exports.getStudentById = (sid) => {
    return new Promise((resolve, reject) => {
        const studentsById = students.filter((student) => {
            return student.studentID == sid;
        });
        if (studentsById.length == 0) {
            reject("no results returned");
        }
        resolve(studentsById);
    });
};

module.exports.updateStudent = (studentData) => {
    return new Promise(function (resolve, reject) {
        let findStudent = students.filter((student) => {
            return student.studentID == studentData.studentID;
        });
        if (findStudent) {
            let index = students.indexOf(studentData.studentID);
            students[index] = studentData;
            console.log(students[index]);
            resolve(students[index]);
        } else {
            reject("no results returned");
        }
    });
};
