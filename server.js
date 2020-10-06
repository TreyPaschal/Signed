const express = require('express')
const app = express()
var mongoose = require('mongoose');
const port = 3000

var db = require('./config/db');
console.log("connecting--",db);
mongoose.connect(db.url);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

var Student = require('./app/models/student');
app.get('/api/students', function(req, res) {
   // use mongoose to get all students in the database
   Student.find(function(err, students) {
      // if there is an error retrieving, send the error.
      // nothing after res.send(err) will execute
      if (err)
         res.send(err);
      res.json(students); // return all students in JSON format
   });
});

app.post('/api/students/send', function (req, res) {
    var student = new Student(); // create a new instance of the student model
    student.name = req.body.name; // set the student name (comes from the request)
    student.save(function(err) {
       if (err)
          res.send(err);
          res.json({ message: 'student created!' });
    });
 });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})