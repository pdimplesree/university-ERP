const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const feeRoutes = require('./routes/fees');
const paymentRoutes = require('./routes/payments');
const verificationRoutes = require('./routes/verifications');
const receiptRoutes = require('./routes/receipts');
const reportRoutes = require('./routes/reports');
const umlRoutes = require('./routes/uml');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/verifications', verificationRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/uml', umlRoutes);

// Health check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', project: 'ERP Fee Payment & Verification System' });
});

// Serve Frontend production build (Single unified server on Port 5000!)
const distPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(distPath));

// Fallback for React SPA client-side routing (Express 5 compatible)
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log('==================================================');
  console.log('  ERP FULL STACK PORTAL RUNNING LIVE!');
  console.log('  URL: http://localhost:' + PORT);
  console.log('  MongoDB: "ERP" database (localhost:27017)');
  console.log('==================================================');
});
