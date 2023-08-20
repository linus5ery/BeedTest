import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 8080;
const apiUrl = '/api/v1/main';

// Create a student array and populate it with some student data
let students: Array<{ id: number; name: string; age: number; sex: number }> = [
  {
    id: 1,
    name: 'John',
    age: 23,
    sex: 1
  },
  {
    id: 2,
    name: 'Jane',
    age: 22,
    sex: 2
  },
  {
    id: 3,
    name: 'Jack',
    age: 25,
    sex: 1
  },
  {
    id: 4,
    name: 'Jill',
    age: 24,
    sex: 2
  }
];

// Use the cors middleware
app.use(cors({
  origin: 'http://localhost:1200'
}));

app.use(bodyParser.json());

// GET endpoint to retrieve a student by ID
app.get(`${apiUrl}/getStudentById/:id`, (req, res) => {
  const id = parseInt(req.params.id);
  const student = students.find((student) => student.id === id);
  if (student) {
    res.status(200).send(student);
  } else {
    res.status(404).send({ message: 'Student not found' });
  }
});

// GET endpoint to retrieve all students
app.get(`${apiUrl}/getAllStudents`, (req, res) => {
  res.status(200).send(students);
});

// POST endpoint to add a new student
app.post(`${apiUrl}/addStudent`, (req, res) => {
  const student = req.body;
  students.push(student);
  res.status(201).send({ message: 'Student added', student: student });
});

// PUT endpoint to update a student by ID
app.put(`${apiUrl}/updateStudent/:id`, (req, res) => {
  const id = parseInt(req.params.id);
  const updatedData = req.body;
  const studentIndex = students.findIndex((student) => student.id === id);
  
  if (studentIndex !== -1) {
    const originalStudent = students[studentIndex];

    // Update the fields of the student without changing the ID
    const updatedStudent = {
      ...originalStudent,
      ...updatedData,
      id: originalStudent.id // Ensure the ID remains the same
    };

    students[studentIndex] = updatedStudent;
    res.status(200).send({ message: 'Student updated', student: updatedStudent });
  } else {
    res.status(404).send({ message: 'Student not found' });
  }
});

// POST endpoint to replace the entire student array with new data
app.post(`${apiUrl}/replaceStudents`, (req, res) => {
  students = req.body;
  res.status(200).send({ message: 'Student array replaced', students: students });
});

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
