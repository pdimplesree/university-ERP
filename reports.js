const express = require('express');
const router = express.Router();
const db = require('../data/db');

router.get('/analytics', (req, res) => {
  const totalStudents = db.data.students.length;
  const totalFeesCount = db.data.fees.length;
  const totalBilled = db.data.fees.reduce((sum, f) => sum + f.amount, 0);
  const totalCollected = db.data.fees.filter(f => f.status === 'Paid').reduce((sum, f) => sum + f.amount, 0);
  const totalPending = db.data.fees.filter(f => f.status === 'Pending').reduce((sum, f) => sum + f.amount, 0);
  const totalInVerification = db.data.fees.filter(f => f.status === 'In Verification').reduce((sum, f) => sum + f.amount, 0);

  const pendingVerificationsCount = db.data.verifications.filter(v => v.status === 'Pending').length;
  const approvedVerificationsCount = db.data.verifications.filter(v => v.status === 'Approved').length;
  const rejectedVerificationsCount = db.data.verifications.filter(v => v.status === 'Rejected').length;

  const totalBankTransactions = db.data.bankGatewayLedger.length;
  const reconciledBankTransactions = db.data.bankGatewayLedger.filter(b => b.reconciled).length;

  const departmentBreakdown = [
    { department: 'AI & ML', students: 4, billed: 161000, collected: 8500, pending: 152500 },
    { department: 'CSE', students: 8, billed: 280000, collected: 210000, pending: 70000 },
    { department: 'ECE', students: 6, billed: 210000, collected: 175000, pending: 35000 },
    { department: 'Data Science', students: 5, billed: 175000, collected: 140000, pending: 35000 }
  ];

  res.json({
    success: true,
    stats: {
      totalStudents,
      totalFeesCount,
      totalBilled,
      totalCollected,
      totalPending,
      totalInVerification,
      pendingVerificationsCount,
      approvedVerificationsCount,
      rejectedVerificationsCount,
      totalBankTransactions,
      reconciledBankTransactions,
      collectionEfficiency: totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0
    },
    departmentBreakdown,
    recentVerifications: db.data.verifications.slice(-5),
    bankLedger: db.data.bankGatewayLedger
  });
});

router.post('/reset-demo', (req, res) => {
  const freshData = db.reset();
  res.json({ success: true, message: 'Database reset to default presentation state successfully!', data: freshData });
});

module.exports = router;
