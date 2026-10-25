const express = require('express');
const router = express.Router();
const db = require('../data/db');

const umlData = {
  projectTitle: 'University Fee Payment Verification System (ERP)',
  subject: 'Object Oriented Analysis & Design (OOAD) using UML',
  institution: 'Aditya University - Surampalem',
  department: 'Department of Artificial Intelligence and Machine Learning',
  team: db.data.university.team,
  sections: [
    {
      id: 'usecase',
      title: '1. Use Case Diagram',
      slide: 10,
      description: 'Models actor interactions between Student, Administrator, and Bank Payment Gateway. Captures use cases such as Pay Fee, Upload Screenshot (extend condition: unreflected payment), Verify Payment, and Generate Receipt.',
      mermaid: `graph LR
  classDef actorStyle fill:#1e3a8a,stroke:#3b82f6,stroke-width:2px,color:#ffffff;
  classDef ucStyle fill:#f8fafc,stroke:#0284c7,stroke-width:2px,color:#0f172a;

  Student["👤 Student"]:::actorStyle
  Admin["👤 Administrator"]:::actorStyle
  Bank["🏦 Payment Gateway / Bank"]:::actorStyle

  subgraph System["🏛️ University Fee Payment Verification System"]
    UC1(("1. Register / Login")):::ucStyle
    UC2(("2. View Fee Details")):::ucStyle
    UC3(("3. Make Fee Payment")):::ucStyle
    UC4(("4. Upload Payment Screenshot")):::ucStyle
    UC5(("5. Submit Verification Request")):::ucStyle
    UC6(("6. Check Verification Status")):::ucStyle
    UC7(("7. View / Download Fee Receipt")):::ucStyle

    UC8(("8. Verify Payment Details")):::ucStyle
    UC9(("9. Update Fee Status")):::ucStyle
    UC10(("10. Generate Fee Receipt")):::ucStyle

    UC11(("11. Manage Student Details")):::ucStyle
    UC12(("12. View Payment Records")):::ucStyle
    UC13(("13. Approve / Reject Payment")):::ucStyle
    UC14(("14. Generate Reports")):::ucStyle

    UCA(("A. Process Payment")):::ucStyle
    UCB(("B. Send Transaction Details")):::ucStyle
    UCC(("C. Verify Transaction")):::ucStyle
  end

  Student --- UC1
  Student --- UC2
  Student --- UC3
  Student --- UC4
  Student --- UC5
  Student --- UC6
  Student --- UC7

  Admin --- UC1
  Admin --- UC11
  Admin --- UC12
  Admin --- UC8
  Admin --- UC13
  Admin --- UC14

  Bank --- UCA
  Bank --- UCB
  Bank --- UCC

  UC3 -.->|«include»| UCA
  UC3 -.->|«extend» (unreflected)| UC4
  UC5 -.->|«include»| UC8
  UC8 -.->|«include»| UCC
  UC8 -.->|«include»| UC9
  UC8 -.->|«include»| UC10`,
      specifications: [
        { useCase: 'Make Fee Payment', actor: 'Student', trigger: 'Student initiates fee payment online', preCondition: 'Student logged in and fee is pending', postCondition: 'Bank debited and transaction recorded' },
        { useCase: 'Upload Payment Screenshot', actor: 'Student', trigger: 'Bank debited but ERP shows pending / failed', preCondition: 'Successful bank transaction proof available', postCondition: 'Screenshot uploaded and verification queued' },
        { useCase: 'Verify Payment Details', actor: 'Administrator', trigger: 'New verification request in queue', preCondition: 'Student proof & bank ledger available', postCondition: 'Fee status updated to Paid and Receipt generated' }
      ]
    },
    {
      id: 'class',
      title: '2. Class Diagram',
      slide: 11,
      description: 'Complete structural model showing classes, encapsulated attributes, public operations, visibility, and multi-tier associations adhering to Object-Oriented principles.',
      mermaid: `classDiagram
  class Student {
    -String studentId
    -String name
    -String email
    -String phone
    -String course
    -String semester
    +login()
    +viewFeeDetails()
    +makePayment()
    +uploadScreenshot()
    +checkStatus()
    +downloadReceipt()
  }

  class Administrator {
    -String adminId
    -String name
    -String email
    -String role
    +login()
    +manageStudents()
    +viewPayments()
    +verifyPayment()
    +updateFeeStatus()
    +generateReceipt()
    +generateReports()
  }

  class Fee {
    -String feeId
    -String studentId
    -double amount
    -Date dueDate
    -String status
    +viewFee()
    +calculateDue()
  }

  class Payment {
    -String paymentId
    -String feeId
    -double amount
    -Date paymentDate
    -String mode
    -String status
    -String transactionId
    +processPayment()
    +getStatus()
  }

  class PaymentScreenshot {
    -String screenshotId
    -String paymentId
    -String filePath
    -Date uploadedOn
    -String remarks
    +upload()
    +download()
    +extractDetails()
  }

  class Verification {
    -String verificationId
    -String paymentId
    -String screenshotId
    -String verifiedBy
    -Date verifiedOn
    -String status
    -String remarks
    +verify()
    +approve()
    +reject()
  }

  class TransactionDetails {
    -String transactionId
    -String paymentId
    -String referenceNo
    -Date transactionDate
    -double amount
    -String payerName
    -String payerAccount
    +fetchFromGateway()
    +matchTransaction()
  }

  class FeeStatus {
    -String statusId
    -String feeId
    -String status
    -Date updatedOn
    -String updatedBy
    +updateStatus()
    +getStatus()
  }

  class FeeReceipt {
    -String receiptId
    -String feeId
    -String paymentId
    -String receiptNo
    -Date generatedOn
    -String filePath
    +generateReceipt()
    +downloadReceipt()
  }

  class PaymentGateway {
    -String gatewayId
    -String name
    -String type
    +processPayment()
    +sendTransactionDetails()
    +verifyTransaction()
  }

  Student "1" --> "0..*" Fee : has
  Student "1" --> "0..*" Payment : initiates
  Administrator "1" --> "0..*" Verification : conducts
  Fee "1" --> "0..*" Payment : settled by
  Payment "1" --> "1" PaymentScreenshot : evidenced by
  PaymentScreenshot "1" --> "1" Verification : triggers
  Verification "1" --> "1" FeeStatus : updates
  Verification "1" --> "0..1" FeeReceipt : generates
  PaymentGateway "1" --> "0..*" TransactionDetails : logs
  TransactionDetails ..> Verification : matches`,
      notes: 'Demonstrates Single Responsibility Principle (SRP), Encapsulation of payment properties, and Association with high cohesion.'
    },
    {
      id: 'object',
      title: '3. Object Diagram (Snapshot)',
      slide: 12,
      description: 'Runtime instance snapshot for student Naga Raju M (ST101) verifying payment for Fee FEE01 with actual runtime attribute values.',
      mermaid: `graph TD
  classDef objStyle fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a,font-family:monospace;

  uni01["<u>uni01 : University</u><br/>universityId = 'UNI01'<br/>name = 'Aditya University'<br/>location = 'Surampalem'"]:::objStyle
  st101["<u>st101 : Student</u><br/>studentId = 'ST101'<br/>name = 'Naga Raju M'<br/>course = 'B.Tech AIML'<br/>semester = 'IV'<br/>email = 'nagaraju24@aditya.edu.in'<br/>phone = '9876543210'"]:::objStyle
  admin01["<u>admin01 : Administrator</u><br/>adminId = 'ADM01'<br/>name = 'Admin User'<br/>role = 'Fee Officer'<br/>email = 'admin@aditya.edu.in'"]:::objStyle

  fee01["<u>fee01 : Fee</u><br/>feeId = 'FEE01'<br/>studentId = 'ST101'<br/>semester = 'IV'<br/>amount = 35000.00<br/>dueDate = '2025-06-30'<br/>status = 'Pending'"]:::objStyle
  pay101["<u>pay101 : Payment</u><br/>paymentId = 'PAY101'<br/>feeId = 'FEE01'<br/>amount = 35000.00<br/>paymentDate = '2025-05-28'<br/>mode = 'UPI'<br/>status = 'Not Reflected'<br/>transactionId = 'UPI1234567890'"]:::objStyle
  ss101["<u>ss101 : PaymentScreenshot</u><br/>screenshotId = 'SS101'<br/>paymentId = 'PAY101'<br/>fileName = 'payment_ss.jpg'<br/>filePath = '/uploads/payment_ss.jpg'<br/>uploadedOn = '2025-05-28 10:35 AM'<br/>remarks = 'Payment successful but not updated in portal'"]:::objStyle
  ver101["<u>ver101 : Verification</u><br/>verificationId = 'VER101'<br/>paymentId = 'PAY101'<br/>screenshotId = 'SS101'<br/>verifiedBy = 'ADM01'<br/>verifiedOn = '2025-05-28 12:15 PM'<br/>status = 'Approved'<br/>remarks = 'Payment matched with gateway records'"]:::objStyle
  fs101["<u>fs101 : FeeStatus</u><br/>statusId = 'FS101'<br/>feeId = 'FEE01'<br/>status = 'Paid'<br/>updatedOn = '2025-05-28'<br/>updatedBy = 'ADM01'"]:::objStyle
  rc101["<u>rc101 : FeeReceipt</u><br/>receiptId = 'RC101'<br/>feeId = 'FEE01'<br/>paymentId = 'PAY101'<br/>receiptNo = 'RCPT250528001'<br/>generatedOn = '2025-05-28 12:20 PM'<br/>filePath = '/receipts/RCPT250528001.pdf'"]:::objStyle

  uni01 --- st101
  uni01 --- admin01
  st101 --- fee01
  fee01 --- pay101
  pay101 --- ss101
  ss101 --- ver101
  admin01 --- ver101
  ver101 --- fs101
  ver101 --- rc101`,
      notes: 'Shows the exact snapshot state after fee verification approval and receipt generation.'
    },
    {
      id: 'ssd',
      title: '4. System Sequence Diagram (SSD)',
      slide: 13,
      description: 'Black-box interactions between Student and the University Fee Payment Verification System boundary.',
      mermaid: `sequenceDiagram
  autonumber
  actor Student as 👤 Student
  participant System as 🏛️ University Fee Payment Verification System

  Student->>System: 1. viewFeeDetails()
  System-->>Student: 2. displayFeeDetails()
  Student->>System: 3. makePayment(amount)
  System-->>Student: 4. paymentConfirmation() [Unreflected]
  Student->>System: 5. uploadPaymentScreenshot(file)
  System-->>Student: 6. screenshotUploaded()
  Student->>System: 7. submitVerificationRequest()
  System->>System: 8. verifyPaymentDetails()
  Student->>System: 9. checkVerificationStatus()
  System-->>Student: 10. displayVerificationStatus(status)
  System->>System: 11. updateFeeStatus(status)
  System->>System: 12. generateFeeReceipt(receiptNo)
  Student->>System: 13. downloadFeeReceipt()
  System-->>Student: 14. feeReceipt(file)`,
      notes: 'Illustrates the event exchange from fee viewing to receipt retrieval.'
    },
    {
      id: 'sequence-bce',
      title: '5. High-Level Sequence Diagram (BCE Pattern)',
      slide: 14,
      description: 'Detailed object interaction adhering to Boundary-Control-Entity (BCE) architecture: StudentPortalUI (Boundary), PaymentController (Control), Fee, Payment, Verification, Receipt entities, and PaymentGateway.',
      mermaid: `sequenceDiagram
  autonumber
  actor Student as 👤 Student
  participant UI as 🖥️ StudentPortalUI (Boundary)
  participant Ctrl as ⚙️ PaymentController (Control)
  participant FeeEnt as 📄 Fee (Entity)
  participant PayEnt as 💳 Payment (Entity)
  participant VerEnt as 🔍 Verification (Entity)
  participant RecEnt as 🧾 Receipt (Entity)
  participant GW as 🏦 PaymentGateway (Entity)

  Student->>UI: viewFeeDetails()
  UI->>Ctrl: requestFeeDetails()
  Ctrl->>FeeEnt: getFeeDetails()
  FeeEnt-->>Ctrl: feeDetails
  Ctrl-->>UI: displayFeeDetails()
  UI-->>Student: showFeeDetails()

  Student->>UI: makePayment(amount)
  UI->>Ctrl: initiatePayment(amount)
  Ctrl->>GW: processPayment(amount)
  GW-->>Ctrl: paymentSuccess / unreflected
  Ctrl->>PayEnt: savePayment(details)
  PayEnt-->>Ctrl: paymentSaved
  Ctrl-->>UI: paymentConfirmation()
  UI-->>Student: showConfirmation()

  Student->>UI: uploadScreenshot(file)
  UI->>Ctrl: uploadScreenshot(file)
  Ctrl->>PayEnt: saveScreenshot(file)
  PayEnt-->>Ctrl: screenshotSaved

  Student->>UI: submitVerificationRequest()
  UI->>Ctrl: submitRequest()
  Ctrl->>VerEnt: verifyPayment()
  VerEnt->>FeeEnt: updateStatus(status)
  FeeEnt-->>VerEnt: statusUpdated
  Ctrl->>UI: showVerificationStatus(status)
  UI-->>Student: showStatus(status)

  Ctrl->>RecEnt: generateReceipt()
  RecEnt-->>Ctrl: receiptGenerated
  Ctrl-->>UI: showReceipt(receiptNo)
  Student->>UI: downloadReceipt()`,
      notes: 'Separation of concerns: Boundary manages user inputs, Control executes business workflow, Entities manage persistent state.'
    },
    {
      id: 'activity',
      title: '6. Activity Diagram',
      slide: 15,
      description: 'End-to-end workflow execution paths, decision diamonds, and concurrency forks for payment verification.',
      mermaid: `flowchart TD
  Start([● Start]) --> View[View Fee Details]
  View --> Pay[Make Fee Payment]
  Pay --> Check1{Payment Successful in Portal?}

  Check1 -->|No| Failed[Show Payment Failed / Unreflected]
  Check1 -->|Yes| Reflected[Direct Success & Issue Receipt]

  Failed --> Upload[Upload Payment Screenshot & UTR]
  Upload --> SubmitReq[Submit Verification Request]
  SubmitReq --> AdminQueue[Queued in Admin Verification Desk]

  AdminQueue --> AdminVer[Verify Payment Details against Bank Ledger]
  AdminVer --> Check2{Payment Verified?}

  Check2 -->|No / Fraud| Reject[Reject Payment]
  Reject --> SetReject[Update Status as 'Rejected']
  SetReject --> NotifReject[Notify Student with Reason]
  NotifReject --> End1([● End])

  Check2 -->|Yes / Match| Approve[Approve Payment]
  Approve --> SetPaid[Update Status as 'Paid']
  SetPaid --> GenRec[Generate Official Fee Receipt]
  GenRec --> NotifApprove[Notify Student with Receipt Link]
  NotifApprove --> Download[Student Downloads Official Fee Receipt]
  Download --> End2([● End])`,
      notes: 'Covers both normal online flow and recovery workflow for bank debit mismatches.'
    }
  ]
};

router.get('/data', (req, res) => {
  res.json({ success: true, ...umlData });
});

module.exports = router;
