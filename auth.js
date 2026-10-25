const express = require('express');
const router = express.Router();
const db = require('../data/db');

// Login
router.post('/login', (req, res) => {
  const { emailOrId, password, role } = req.body;
  if (!emailOrId || !password) {
    return res.status(400).json({ success: false, message: 'Please provide ID/Email and password.' });
  }

  if (role === 'admin') {
    const admin = db.data.administrators.find(
      a => (a.adminId.toLowerCase() === emailOrId.toLowerCase() || a.email.toLowerCase() === emailOrId.toLowerCase()) && a.password === password
    );
    if (admin) {
      const { password, ...userWithoutPass } = admin;
      return res.json({ success: true, role: 'admin', user: userWithoutPass });
    }
  } else {
    const student = db.data.students.find(
      s => (s.studentId.toLowerCase() === emailOrId.toLowerCase() || s.email.toLowerCase() === emailOrId.toLowerCase()) && s.password === password
    );
    if (student) {
      const { password, ...userWithoutPass } = student;
      return res.json({ success: true, role: 'student', user: userWithoutPass });
    }
  }

  return res.status(401).json({ success: false, message: 'Invalid credentials or role selection.' });
});

// Register Student
router.post('/register', (req, res) => {
  const { studentId, name, email, phone, course, semester, password, fatherName, section } = req.body;
  if (!studentId || !name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Student ID, Name, Email, and Password are required.' });
  }

  const existing = db.data.students.find(
    s => s.studentId.toLowerCase() === studentId.toLowerCase() || s.email.toLowerCase() === email.toLowerCase()
  );
  if (existing) {
    return res.status(409).json({ success: false, message: 'Student ID or Email already registered.' });
  }

  const newStudent = {
    studentId: studentId.toUpperCase(),
    name,
    email,
    phone: phone || '',
    course: course || 'B.Tech AIML',
    semester: semester || 'IV',
    password,
    section: section || 'AI-A',
    academicYear: '2024-2028',
    fatherName: fatherName || ''
  };

  db.data.students.push(newStudent);

  // Assign default tuition fee for new student
  const feeId = 'FEE' + (db.data.fees.length + 1).toString().padStart(2, '0');
  db.data.fees.push({
    feeId,
    studentId: newStudent.studentId,
    feeType: 'Semester Tuition Fee',
    semester: newStudent.semester,
    academicYear: '2024-25',
    amount: 35000,
    dueDate: '2025-06-30',
    status: 'Pending',
    description: 'Tuition and academic facility fee for ' + newStudent.course + ' Semester ' + newStudent.semester
  });

  db.save();
  const { password: p, ...userWithoutPass } = newStudent;
  res.status(201).json({ success: true, message: 'Registration successful!', user: userWithoutPass, role: 'student' });
});

// Quick Switch Demo Persona
router.get('/personas', (req, res) => {
  const students = db.data.students.map(s => ({
    studentId: s.studentId,
    name: s.name,
    course: s.course,
    semester: s.semester,
    email: s.email,
    role: 'student'
  }));
  const administrators = db.data.administrators.map(a => ({
    adminId: a.adminId,
    name: a.name,
    role: 'admin',
    adminRole: a.role,
    department: a.department,
    email: a.email
  }));
  res.json({ success: true, students, administrators });
});

router.get('/students', (req, res) => {
  res.json({ success: true, students: db.data.students });
});

router.get('/administrators', (req, res) => {
  res.json({ success: true, administrators: db.data.administrators });
});

module.exports = router;

