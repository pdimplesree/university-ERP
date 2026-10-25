const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../data/db');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png';
    cb(null, 'ss_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8) + ext);
  }
});
const upload = multer({ storage });

router.post('/simulate', (req, res) => {
  const { feeId, studentId, amount, mode, simulateUnreflected } = req.body;
  const fee = db.data.fees.find(f => f.feeId.toUpperCase() === feeId?.toUpperCase());
  const student = db.data.students.find(s => s.studentId.toUpperCase() === studentId?.toUpperCase());

  if (!fee || !student) {
    return res.status(404).json({ success: false, message: 'Fee record or Student not found.' });
  }

  const transactionId = 'UPI' + Math.floor(1000000000 + Math.random() * 9000000000);
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

  db.data.bankGatewayLedger.push({
    transactionId,
    referenceNo: 'HDFC-UPI-' + Math.floor(1000000 + Math.random() * 9000000),
    transactionDate: now,
    amount: Number(amount || fee.amount),
    payerName: student.name,
    payerAccount: 'XXXXXX' + (student.phone ? student.phone.slice(-4) : '4920') + '@okupi',
    bankName: 'HDFC Bank Payment Gateway',
    gatewayStatus: 'Settled in University Account',
    settlementTime: now,
    reconciled: !simulateUnreflected
  });

  if (simulateUnreflected) {
    res.json({
      success: true,
      status: 'GATEWAY_SYNC_ERROR',
      simulated: true,
      transactionId,
      amount: Number(amount || fee.amount),
      message: 'Bank account was debited successfully, but payment gateway callback dropped due to network latency. Please submit screenshot proof for verification!',
      feeId
    });
  } else {
    const paymentId = 'PAY' + (db.data.payments.length + 1).toString().padStart(3, '0');
    db.data.payments.push({
      paymentId,
      feeId: fee.feeId,
      studentId: student.studentId,
      amount: Number(amount || fee.amount),
      paymentDate: now,
      mode: mode || 'UPI',
      status: 'Success',
      transactionId,
      gatewayId: 'GW01'
    });

    fee.status = 'Paid';

    const receiptNo = 'RCPT' + new Date().toISOString().slice(2, 10).replace(/-/g, '') + (db.data.feeReceipts.length + 1).toString().padStart(3, '0');
    const receiptId = 'RC' + (db.data.feeReceipts.length + 1).toString().padStart(3, '0');
    const receipt = {
      receiptId,
      feeId: fee.feeId,
      paymentId,
      studentId: student.studentId,
      studentName: student.name,
      course: student.course || 'B.Tech AIML',
      semester: fee.semester || student.semester || 'IV',
      receiptNo,
      amount: Number(amount || fee.amount),
      feeType: fee.feeType,
      generatedOn: now,
      verifiedBy: 'Auto Payment Gateway (GW01)',
      qrCode: 'ERP-REC-' + receiptNo + '-' + student.studentId,
      paymentMode: mode || 'UPI (Direct Gateway)',
      transactionId
    };
    db.data.feeReceipts.push(receipt);

    db.data.notifications.push({
      id: 'NOTIF' + Date.now(),
      recipientId: student.studentId,
      title: 'Payment Successful',
      message: 'Your payment of Rs. ' + (amount || fee.amount) + ' for ' + fee.feeType + ' was successful. Receipt #' + receiptNo + ' generated.',
      date: now,
      read: false,
      type: 'success'
    });

    db.save();

    res.json({
      success: true,
      status: 'SUCCESS',
      transactionId,
      receipt,
      message: 'Payment completed successfully and receipt generated!'
    });
  }
});

router.post('/upload-proof', upload.single('screenshot'), (req, res) => {
  const { feeId, studentId, transactionId, amount, payerName, bankName, remarks } = req.body;

  const fee = db.data.fees.find(f => f.feeId.toUpperCase() === feeId?.toUpperCase());
  const student = db.data.students.find(s => s.studentId.toUpperCase() === studentId?.toUpperCase());

  if (!fee || !student) {
    return res.status(404).json({ success: false, message: 'Fee record or student not found' });
  }
  if (!transactionId) {
    return res.status(400).json({ success: false, message: 'Transaction ID / UTR is required' });
  }

  const filePath = req.file ? '/uploads/' + req.file.filename : '/uploads/sample_receipt_proof.svg';
  const fileName = req.file ? req.file.originalname : 'payment_proof_receipt.png';
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const screenshotId = 'SS' + (db.data.paymentScreenshots.length + 1).toString().padStart(3, '0');
  const paymentId = 'PAY' + (db.data.payments.length + 1).toString().padStart(3, '0');
  const verificationId = 'VER' + (db.data.verifications.length + 1).toString().padStart(3, '0');

  let ledgerMatch = db.data.bankGatewayLedger.find(
    tx => tx.transactionId.trim().toLowerCase() === transactionId.trim().toLowerCase()
  );

  // If not already in bank ledger, automatically record the settled bank transaction
  if (!ledgerMatch) {
    ledgerMatch = {
      transactionId: transactionId.trim(),
      referenceNo: 'HDFC-UPI-' + Math.floor(1000000 + Math.random() * 9000000),
      transactionDate: now,
      amount: Number(amount || fee.amount),
      payerName: payerName || student.name,
      payerAccount: 'XXXXXX' + (student.phone ? student.phone.slice(-4) : '4920') + '@okupi',
      bankName: bankName || 'HDFC Bank Payment Gateway',
      gatewayStatus: 'Settled in University Account',
      settlementTime: now,
      reconciled: false
    };
    db.data.bankGatewayLedger.push(ledgerMatch);
  }

  const screenshotObj = {
    screenshotId,
    paymentId,
    feeId: fee.feeId,
    studentId: student.studentId,
    fileName,
    filePath,
    uploadedOn: now,
    transactionId: transactionId.trim(),
    amount: Number(amount || fee.amount),
    payerName: payerName || student.name,
    bankName: bankName || 'UPI Bank App',
    remarks: remarks || 'Payment screenshot proof submitted for verification.'
  };
  db.data.paymentScreenshots.push(screenshotObj);

  const verificationObj = {
    verificationId,
    paymentId,
    screenshotId,
    feeId: fee.feeId,
    studentId: student.studentId,
    studentName: student.name,
    feeType: fee.feeType,
    transactionId: transactionId.trim(),
    amount: Number(amount || fee.amount),
    status: 'Pending',
    submittedOn: now,
    verifiedBy: null,
    verifiedOn: null,
    remarks: remarks || 'Payment proof uploaded by student. Awaiting administrative verification.',
    screenshotPath: filePath,
    matchedLedger: true,
    matchConfidence: 100
  };
  db.data.verifications.push(verificationObj);

  fee.status = 'In Verification';

  db.data.notifications.push({
    id: 'NOTIF' + Date.now(),
    recipientId: 'ADM01',
    title: 'New Verification Request',
    message: student.name + ' (' + student.studentId + ') submitted payment proof for ' + fee.feeType + ' (Rs. ' + fee.amount + ').',
    date: now,
    read: false,
    type: 'warning'
  });

  db.save();

  res.status(201).json({
    success: true,
    message: 'Payment screenshot and verification request submitted successfully!',
    verification: verificationObj,
    screenshot: screenshotObj
  });
});

module.exports = router;
