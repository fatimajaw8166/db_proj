// backend/index.js
const express = require('express');
const cors = require('cors');
const db = require('./db');
const customerRoutes = require('./routes/customers');
// Import other routes as needed
// const carRoutes = require('./routes/cars');
// const rentalRoutes = require('./routes/rentals');
// const paymentRoutes = require('./routes/payments');
// const employeeRoutes = require('./routes/employees');
// const branchRoutes = require('./routes/branches');
// const reservationRoutes = require('./routes/reservations');
// const maintenanceRoutes = require('./routes/maintenances');
// const insuranceRoutes = require('./routes/insurances');
// const feedbackRoutes = require('./routes/feedbacks');

const app = express();
app.use(cors());
app.use(express.json());

// Use routes
app.use('/api/customers', customerRoutes);
// Use other routes as needed
// app.use('/api/cars', carRoutes);
// app.use('/api/rentals', rentalRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/employees', employeeRoutes);
// app.use('/api/branches', branchRoutes);
// app.use('/api/reservations', reservationRoutes);
// app.use('/api/maintenances', maintenanceRoutes);
// app.use('/api/insurances', insuranceRoutes);
// app.use('/api/feedbacks', feedbackRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));