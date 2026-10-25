const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const DB_FILE = path.join(__dirname, 'store.json');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ERP';

const initialData = {
  university: {
    universityId: 'UNI01',
    name: 'Aditya University',
    campus: 'Surampalem Campus, ADB Road, Kakinada District, Andhra Pradesh - 533437',
    tagline: 'Object Oriented Analysis & Design (OOAD) ERP System',
    department: 'Department of Artificial Intelligence and Machine Learning',
    subject: 'Object Oriented Analysis & Design using UML',
    team: [
      { name: 'P. Dimple Sree', roll: '24B11AI107', role: 'System Analyst / Use Case Designer' },
      { name: 'K. Gnanavi', roll: '24B11AI189', role: 'Class & Sequence Designer' },
      { name: 'M. Naga Raju', roll: '24B11AI272', role: 'Full Stack & Verification Architect' },
      { name: 'G. Shanmukh', roll: '24B11AI117', role: 'Database & Behavioral Modeler' }
    ]
  },
  students: [
    {
      studentId: 'ST101',
      name: 'Naga Raju M',
      email: 'nagaraju24@aditya.edu.in',
      phone: '9876543210',
      course: 'B.Tech AIML',
      semester: 'IV',
      password: 'password123',
      section: 'AI-A',
      academicYear: '2024-2028',
      fatherName: 'M. Venkateswarlu'
    },
    {
      studentId: 'ST102',
      name: 'P. Dimple Sree',
      email: 'dimple24@aditya.edu.in',
      phone: '9876543211',
      course: 'B.Tech AIML',
      semester: 'IV',
      password: 'password123',
      section: 'AI-A',
      academicYear: '2024-2028',
      fatherName: 'P. Srinivasa Rao'
    },
    {
      studentId: 'ST103',
      name: 'K. Gnanavi',
      email: 'gnanavi24@aditya.edu.in',
      phone: '9876543212',
      course: 'B.Tech AIML',
      semester: 'IV',
      password: 'password123',
      section: 'AI-A',
      academicYear: '2024-2028',
      fatherName: 'K. Rama Krishna'
    },
    {
      studentId: 'ST104',
      name: 'G. Shanmukh',
      email: 'shanmukh24@aditya.edu.in',
      phone: '9876543213',
      course: 'B.Tech AIML',
      semester: 'IV',
      password: 'password123',
      section: 'AI-B',
      academicYear: '2024-2028',
      fatherName: 'G. Prasad'
    }
  ],
  administrators: [
    {
      adminId: 'ADM01',
      name: 'Admin User',
      email: 'admin@aditya.edu.in',
      role: 'Fee Officer',
      department: 'Finance & Accounts',
      password: 'admin123'
    },
    {
      adminId: 'ADM02',
      name: 'Dr. S. R. Murthy',
      email: 'cfo@aditya.edu.in',
      role: 'Super Admin',
      department: 'Central Administration',
      password: 'admin123'
    }
  ],
  fees: [
    {
      feeId: 'FEE01',
      studentId: 'ST101',
      feeType: 'Semester Tuition Fee',
      semester: 'IV',
      academicYear: '2024-25',
      amount: 35000,
      dueDate: '2025-06-30',
      status: 'Pending',
      description: 'Tuition and academic facility fee for B.Tech AIML Semester IV'
    },
    {
      feeId: 'FEE02',
      studentId: 'ST101',
      feeType: 'AI & ML GPU Supercomputing Lab Fee',
      semester: 'IV',
      academicYear: '2024-25',
      amount: 8500,
      dueDate: '2025-05-15',
      status: 'Paid',
      description: 'Specialized lab charges for High Performance Computing & Deep Learning'
    },
    {
      feeId: 'FEE03',
      studentId: 'ST101',
      feeType: 'Semester End Examination & JNTU Reg Fee',
      semester: 'IV',
      academicYear: '2024-25',
      amount: 2500,
      dueDate: '2025-07-10',
      status: 'Pending',
      description: 'Theory and Practical regular examination registration fee'
    },
    {
      feeId: 'FEE04',
      studentId: 'ST102',
      feeType: 'Hostel & Premium Mess Fee',
      semester: 'IV',
      academicYear: '2024-25',
      amount: 45000,
      dueDate: '2025-06-15',
      status: 'In Verification',
      description: 'Hostel accommodation, food and maintenance charges'
    },
    {
      feeId: 'FEE05',
      studentId: 'ST103',
      feeType: 'Semester Tuition Fee',
      semester: 'IV',
      academicYear: '2024-25',
      amount: 35000,
      dueDate: '2025-06-30',
      status: 'Pending',
      description: 'Tuition and academic facility fee for B.Tech AIML Semester IV'
    },
    {
      feeId: 'FEE06',
      studentId: 'ST104',
      feeType: 'Semester Tuition Fee',
      semester: 'IV',
      academicYear: '2024-25',
      amount: 35000,
      dueDate: '2025-06-30',
      status: 'Pending',
      description: 'Tuition and academic facility fee for B.Tech AIML Semester IV'
    }
  ],
  payments: [
    {
      paymentId: 'PAY099',
      feeId: 'FEE02',
      studentId: 'ST101',
      amount: 8500,
      paymentDate: '2025-05-20 14:20:00',
      mode: 'UPI',
      status: 'Success',
      transactionId: 'UPI4567890123',
      gatewayId: 'GW01'
    }
  ],
  bankGatewayLedger: [
    {
      transactionId: 'UPI1234567890',
      referenceNo: 'HDFC-UPI-9928104',
      transactionDate: '2025-05-28 10:30:15',
      amount: 35000,
      payerName: 'Naga Raju M',
      payerAccount: 'XXXXXX4920@oksbi',
      bankName: 'HDFC Bank Payment Gateway',
      gatewayStatus: 'Settled in University Account',
      settlementTime: '2025-05-28 10:31:00',
      reconciled: false
    },
    {
      transactionId: 'UPI9876543211',
      referenceNo: 'SBI-UPI-8837190',
      transactionDate: '2025-05-28 11:15:00',
      amount: 45000,
      payerName: 'P Dimple Sree',
      payerAccount: 'XXXXXX8812@icici',
      bankName: 'State Bank of India Gateway',
      gatewayStatus: 'Settled in University Account',
      settlementTime: '2025-05-28 11:16:20',
      reconciled: false
    },
    {
      transactionId: 'UPI4567890123',
      referenceNo: 'ICICI-UPI-1102948',
      transactionDate: '2025-05-20 14:20:00',
      amount: 8500,
      payerName: 'Naga Raju M',
      payerAccount: 'XXXXXX4920@oksbi',
      bankName: 'ICICI Direct Gateway',
      gatewayStatus: 'Settled in University Account',
      settlementTime: '2025-05-20 14:20:45',
      reconciled: true
    },
    {
      transactionId: 'UPI5566778899',
      referenceNo: 'AXIS-UPI-4491022',
      transactionDate: '2025-05-29 09:00:10',
      amount: 35000,
      payerName: 'K Gnanavi',
      payerAccount: 'XXXXXX3319@ybl',
      bankName: 'Axis Bank Gateway',
      gatewayStatus: 'Settled in University Account',
      settlementTime: '2025-05-29 09:01:05',
      reconciled: false
    },
    {
      transactionId: 'UPI7788990011',
      referenceNo: 'CANARA-UPI-771829',
      transactionDate: '2025-05-29 10:00:00',
      amount: 2500,
      payerName: 'Naga Raju M',
      payerAccount: 'XXXXXX4920@oksbi',
      bankName: 'Canara Bank Gateway',
      gatewayStatus: 'Settled in University Account',
      settlementTime: '2025-05-29 10:00:45',
      reconciled: false
    }
  ],
  paymentScreenshots: [
    {
      screenshotId: 'SS100',
      paymentId: 'PAY100',
      feeId: 'FEE04',
      studentId: 'ST102',
      fileName: 'hostel_payment_proof.svg',
      filePath: '/uploads/sample_receipt_proof.svg',
      uploadedOn: '2025-05-28 11:20:00',
      transactionId: 'UPI9876543211',
      amount: 45000,
      payerName: 'P Dimple Sree',
      bankName: 'SBI UPI',
      remarks: 'Amount debited from SBI account but portal showed pending status due to network drop.'
    }
  ],
  verifications: [
    {
      verificationId: 'VER100',
      paymentId: 'PAY100',
      screenshotId: 'SS100',
      feeId: 'FEE04',
      studentId: 'ST102',
      studentName: 'P. Dimple Sree',
      feeType: 'Hostel & Premium Mess Fee',
      transactionId: 'UPI9876543211',
      amount: 45000,
      status: 'Pending',
      submittedOn: '2025-05-28 11:20:00',
      verifiedBy: null,
      verifiedOn: null,
      remarks: 'Awaiting admin verification and bank ledger match.',
      screenshotPath: '/uploads/sample_receipt_proof.svg'
    }
  ],
  feeReceipts: [
    {
      receiptId: 'RC099',
      feeId: 'FEE02',
      paymentId: 'PAY099',
      studentId: 'ST101',
      studentName: 'Naga Raju M',
      course: 'B.Tech AIML',
      semester: 'IV',
      receiptNo: 'RCPT250520001',
      amount: 8500,
      feeType: 'AI & ML GPU Supercomputing Lab Fee',
      generatedOn: '2025-05-20 14:25:00',
      verifiedBy: 'ADM01 (Fee Officer)',
      qrCode: 'AU-REC-250520-ST101-8500',
      paymentMode: 'UPI (ICICI Gateway)',
      transactionId: 'UPI4567890123'
    }
  ],
  notifications: [
    {
      id: 'NOTIF01',
      recipientId: 'ST101',
      title: 'Fee Payment Approved',
      message: 'Your payment for AI & ML GPU Supercomputing Lab Fee (Rs. 8,500) has been verified and receipt RCPT250520001 is ready for download.',
      date: '2025-05-20 14:25:00',
      read: true,
      type: 'success'
    },
    {
      id: 'NOTIF02',
      recipientId: 'ADM01',
      title: 'Pending Verification Request',
      message: 'New payment verification request submitted by P. Dimple Sree (ST102) for Rs. 45,000.',
      date: '2025-05-28 11:20:00',
      read: false,
      type: 'warning'
    }
  ]
};

// Mongoose Schemas for MongoDB Compass ("ERP" database)
const StudentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: String,
  email: String,
  phone: String,
  course: String,
  semester: String,
  password: String,
  section: String,
  academicYear: String,
  fatherName: String
}, { timestamps: true });

const AdminSchema = new mongoose.Schema({
  adminId: { type: String, required: true, unique: true },
  name: String,
  email: String,
  role: String,
  department: String,
  password: String
}, { timestamps: true });

const FeeSchema = new mongoose.Schema({
  feeId: { type: String, required: true, unique: true },
  studentId: String,
  feeType: String,
  semester: String,
  academicYear: String,
  amount: Number,
  dueDate: String,
  status: String,
  description: String
}, { timestamps: true });

const PaymentSchema = new mongoose.Schema({
  paymentId: { type: String, required: true, unique: true },
  feeId: String,
  studentId: String,
  amount: Number,
  paymentDate: String,
  mode: String,
  status: String,
  transactionId: String,
  gatewayId: String
}, { timestamps: true });

const VerificationSchema = new mongoose.Schema({
  verificationId: { type: String, required: true, unique: true },
  paymentId: String,
  screenshotId: String,
  feeId: String,
  studentId: String,
  studentName: String,
  feeType: String,
  transactionId: String,
  amount: Number,
  status: String,
  submittedOn: String,
  verifiedBy: String,
  verifiedOn: String,
  remarks: String,
  screenshotPath: String
}, { timestamps: true });

const BankLedgerSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  referenceNo: String,
  transactionDate: String,
  amount: Number,
  payerName: String,
  payerAccount: String,
  bankName: String,
  gatewayStatus: String,
  settlementTime: String,
  reconciled: Boolean
}, { timestamps: true });

const ReceiptSchema = new mongoose.Schema({
  receiptId: { type: String, required: true, unique: true },
  feeId: String,
  paymentId: String,
  studentId: String,
  studentName: String,
  course: String,
  semester: String,
  receiptNo: String,
  amount: Number,
  feeType: String,
  generatedOn: String,
  verifiedBy: String,
  qrCode: String,
  paymentMode: String,
  transactionId: String
}, { timestamps: true });

const StudentModel = mongoose.models.Student || mongoose.model('Student', StudentSchema);
const AdminModel = mongoose.models.Administrator || mongoose.model('Administrator', AdminSchema);
const FeeModel = mongoose.models.Fee || mongoose.model('Fee', FeeSchema);
const PaymentModel = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
const VerificationModel = mongoose.models.Verification || mongoose.model('Verification', VerificationSchema);
const BankLedgerModel = mongoose.models.BankLedger || mongoose.model('BankLedger', BankLedgerSchema);
const ReceiptModel = mongoose.models.FeeReceipt || mongoose.model('FeeReceipt', ReceiptSchema);

class Database {
  constructor() {
    this.mongoConnected = false;
    this.initFileStore();
    this.connectMongo();
  }

  initFileStore() {
    if (!fs.existsSync(DB_FILE)) {
      this.data = JSON.parse(JSON.stringify(initialData));
      this.saveFile();
    } else {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
      } catch (err) {
        this.data = JSON.parse(JSON.stringify(initialData));
        this.saveFile();
      }
    }
  }

  async connectMongo() {
    try {
      await mongoose.connect(MONGO_URI, { dbName: 'ERP', serverSelectionTimeoutMS: 2000 });
      this.mongoConnected = true;
      console.log('✅ Connected exclusively to separate MongoDB database: "ERP" (Accessible in MongoDB Compass)!');
      await this.syncToMongo();
    } catch (err) {

      console.log('ℹ️ MongoDB Local connection notice: Using active JSON file persistence (store.json).');
      console.log('   When MongoDB service starts on localhost:27017, it will automatically populate database "ERP" in MongoDB Compass.');
    }
  }

  async syncToMongo() {
    if (!this.mongoConnected) return;
    try {
      // Seed if empty
      const count = await StudentModel.countDocuments();
      if (count === 0) {
        await StudentModel.insertMany(this.data.students);
        await AdminModel.insertMany(this.data.administrators);
        await FeeModel.insertMany(this.data.fees);
        await PaymentModel.insertMany(this.data.payments);
        await VerificationModel.insertMany(this.data.verifications);
        await BankLedgerModel.insertMany(this.data.bankGatewayLedger);
        await ReceiptModel.insertMany(this.data.feeReceipts);
        console.log('✅ Initial seed data populated in MongoDB "ERP" database!');
      }
    } catch (err) {
      console.error('Error syncing seed to MongoDB:', err.message);
    }
  }

  saveFile() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Failed to save file DB:', err);
    }
  }

  async save() {
    this.saveFile();
    if (this.mongoConnected) {
      try {
        // Sync collections asynchronously to MongoDB Compass
        await Promise.all([
          StudentModel.deleteMany({}).then(() => StudentModel.insertMany(this.data.students)),
          AdminModel.deleteMany({}).then(() => AdminModel.insertMany(this.data.administrators)),
          FeeModel.deleteMany({}).then(() => FeeModel.insertMany(this.data.fees)),
          PaymentModel.deleteMany({}).then(() => PaymentModel.insertMany(this.data.payments)),
          VerificationModel.deleteMany({}).then(() => VerificationModel.insertMany(this.data.verifications)),
          BankLedgerModel.deleteMany({}).then(() => BankLedgerModel.insertMany(this.data.bankGatewayLedger)),
          ReceiptModel.deleteMany({}).then(() => ReceiptModel.insertMany(this.data.feeReceipts))
        ]);
      } catch (err) {
        // Safe failover
      }
    }
  }

  reset() {
    this.data = JSON.parse(JSON.stringify(initialData));
    this.save();
    return this.data;
  }
}

const dbInstance = new Database();
module.exports = dbInstance;
