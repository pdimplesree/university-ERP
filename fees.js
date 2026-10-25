const express = require('express');
const router = express.Router();
const db = require('../data/db');

// Get all registered students for Admin dropdown / selection
router.get('/students', (req, res) => {
  const students = db.data.students.map(s => ({
    studentId: s.studentId,
    name: s.name,
    email: s.email,
    phone: s.phone,
    course: s.course,
    semester: s.semester,
    section: s.section,
    academicYear: s.academicYear
  }));
  res.json({ success: true, students });
});

// Get fees for a specific student
router.get('/student/:studentId', (req, res) => {
  const { studentId } = req.params;
  const student = db.data.students.find(s => s.studentId.toUpperCase() === studentId.toUpperCase());
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }

  const fees = db.data.fees.filter(f => f.studentId.toUpperCase() === studentId.toUpperCase());
  const verifications = db.data.verifications.filter(v => v.studentId.toUpperCase() === studentId.toUpperCase());
  const receipts = db.data.feeReceipts.filter(r => r.studentId.toUpperCase() === studentId.toUpperCase());

  const totalAmount = fees.reduce((sum, f) => sum + f.amount, 0);
  const paidAmount = fees.filter(f => f.status === 'Paid').reduce((sum, f) => sum + f.amount, 0);
  const pendingAmount = fees.filter(f => f.status === 'Pending' || f.status === 'In Verification').reduce((sum, f) => sum + f.amount, 0);

  res.json({
    success: true,
    student,
    fees,
    verifications,
    receipts,
    summary: { totalAmount, paidAmount, pendingAmount, totalCount: fees.length }
  });
});

// Get all fees across all students (Admin)
router.get('/all', (req, res) => {
  const feesWithStudent = db.data.fees.map(fee => {
    const student = db.data.students.find(s => s.studentId.toUpperCase() === fee.studentId.toUpperCase());
    return {
      ...fee,
      studentName: student ? student.name : 'Unknown Student',
      studentCourse: student ? student.course : 'B.Tech AIML',
      studentPhone: student ? student.phone : '',
      studentEmail: student ? student.email : ''
    };
  });
  res.json({ success: true, fees: feesWithStudent });
});

// Add new Fee Demand for a student (Admin)
router.post('/add', (req, res) => {
  const { studentId, studentName, feeType, semester, amount, dueDate, description, isBulkAll } = req.body;

  if (!feeType || !amount || !dueDate) {
    return res.status(400).json({ success: false, message: 'Fee Type, Amount, and Due Date are required.' });
  }

  // Handle Bulk Assign to all students
  if (isBulkAll) {
    const createdFees = [];
    db.data.students.forEach((s, idx) => {
      const feeId = 'FEE' + (db.data.fees.length + 1 + idx).toString().padStart(2, '0');
      const feeObj = {
        feeId,
        studentId: s.studentId.toUpperCase(),
        feeType,
        semester: semester || s.semester || 'IV',
        academicYear: '2024-25',
        amount: Number(amount),
        dueDate,
        status: 'Pending',
        description: description || feeType
      };
      db.data.fees.push(feeObj);
      createdFees.push(feeObj);
    });

    db.save();
    return res.status(201).json({
      success: true,
      count: createdFees.length,
      message: `Fee demand assigned to all ${createdFees.length} students successfully!`
    });
  }

  // Handle Individual Student
  if (!studentId && !studentName) {
    return res.status(400).json({ success: false, message: 'Please select or provide a Student ID or Name.' });
  }

  let student = null;
  if (studentId) {
    student = db.data.students.find(s => s.studentId.toUpperCase() === studentId.trim().toUpperCase());
  }
  if (!student && studentName) {
    student = db.data.students.find(s => s.name.toLowerCase() === studentName.trim().toLowerCase());
  }

  // If student does not exist yet, auto-register them
  let targetStudentId = student ? student.studentId : (studentId ? studentId.trim().toUpperCase() : 'ST' + (db.data.students.length + 101));
  if (!student) {
    const newStudent = {
      studentId: targetStudentId,
      name: studentName ? studentName.trim() : `Student ${targetStudentId}`,
      email: `${targetStudentId.toLowerCase()}@erp.edu.in`,
      phone: '9876543210',
      course: 'B.Tech AIML',
      semester: semester || 'IV',
      password: 'password123',
      section: 'AI-A',
      academicYear: '2024-2028',
      fatherName: 'Guardian'
    };
    db.data.students.push(newStudent);
    student = newStudent;
  }

  const feeId = 'FEE' + (db.data.fees.length + 1).toString().padStart(2, '0');
  const newFee = {
    feeId,
    studentId: targetStudentId,
    feeType,
    semester: semester || student?.semester || 'IV',
    academicYear: '2024-25',
    amount: Number(amount),
    dueDate,
    status: 'Pending',
    description: description || `${feeType} for ${student.name}`
  };

  db.data.fees.push(newFee);

  // Add Notification for student
  db.data.notifications.push({
    id: 'NOTIF' + Date.now(),
    recipientId: targetStudentId,
    title: 'New Fee Demand Added',
    message: `Admin assigned a new fee: ${feeType} (₹${Number(amount).toLocaleString('en-IN')}) due on ${dueDate}.`,
    date: new Date().toISOString().replace('T', ' ').substring(0, 19),
    read: false,
    type: 'info'
  });

  db.save();

  res.status(201).json({
    success: true,
    fee: {
      ...newFee,
      studentName: student.name,
      studentCourse: student.course
    },
    message: `Fee of ₹${Number(amount).toLocaleString('en-IN')} assigned to ${student.name} (${targetStudentId}) successfully!`
  });
});

// Delete a fee demand (Admin)
router.delete('/:feeId', (req, res) => {
  const { feeId } = req.params;
  const index = db.data.fees.findIndex(f => f.feeId.toUpperCase() === feeId.toUpperCase());
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Fee record not found' });
  }

  const removed = db.data.fees.splice(index, 1)[0];
  db.save();
  res.json({ success: true, message: `Fee ${removed.feeType} (₹${removed.amount}) removed successfully.` });
});

module.exports = router;
