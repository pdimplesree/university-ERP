const express = require('express');
const router = express.Router();
const db = require('../data/db');

router.get('/all', (req, res) => {
  res.json({ success: true, receipts: db.data.feeReceipts });
});

router.get('/student/:studentId', (req, res) => {
  const { studentId } = req.params;
  const receipts = db.data.feeReceipts.filter(
    r => r.studentId.toLowerCase() === studentId.toLowerCase()
  );
  res.json({ success: true, receipts });
});

router.get('/:receiptNo', (req, res) => {

  const { receiptNo } = req.params;
  const receipt = db.data.feeReceipts.find(
    r => r.receiptNo.toLowerCase() === receiptNo.toLowerCase() || r.receiptId.toLowerCase() === receiptNo.toLowerCase()
  );

  if (!receipt) {
    return res.status(404).json({ success: false, message: 'Receipt not found' });
  }

  const student = db.data.students.find(s => s.studentId === receipt.studentId);
  const fee = db.data.fees.find(f => f.feeId === receipt.feeId);

  res.json({
    success: true,
    receipt,
    university: db.data.university,
    student: student || {},
    fee: fee || {}
  });
});

router.get('/verify/:qrCode', (req, res) => {
  const { qrCode } = req.params;
  const receipt = db.data.feeReceipts.find(
    r => r.qrCode.toLowerCase() === qrCode.toLowerCase() || r.receiptNo.toLowerCase() === qrCode.toLowerCase()
  );

  if (!receipt) {
    return res.status(404).json({ success: false, valid: false, message: 'Invalid or forged receipt verification code.' });
  }

  res.json({
    success: true,
    valid: true,
    receipt,
    university: db.data.university.name,
    message: 'Official Aditya University Digital Receipt Verified Authentically.'
  });
});

module.exports = router;
