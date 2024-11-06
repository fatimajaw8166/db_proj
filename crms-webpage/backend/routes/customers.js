// backend/routes/customers.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming you have a db.js file for database connection

// Get all customers
router.get('/', (req, res) => {
    db.query('SELECT * FROM Customer', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Get a single customer by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM Customer WHERE CustomerID = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
});

// Create a new customer
router.post('/', (req, res) => {
    const { FirstName, LastName, Email, Phone, LicenseNumber, Address } = req.body;
    db.query('INSERT INTO Customer (FirstName, LastName, Email, Phone, LicenseNumber, Address) VALUES (?, ?, ?, ?, ?, ?)', 
    [FirstName, LastName, Email, Phone, LicenseNumber, Address], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Customer created', CustomerID: results.insertId });
    });
});

// Update a customer
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { FirstName, LastName, Email, Phone, LicenseNumber, Address } = req.body;
    db.query('UPDATE Customer SET FirstName = ?, LastName = ?, Email = ?, Phone = ?, LicenseNumber = ?, Address = ? WHERE CustomerID = ?', 
    [FirstName, LastName, Email, Phone, LicenseNumber, Address, id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Customer updated' });
    });
});

// Delete a customer
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM Customer WHERE CustomerID = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Customer deleted' });
    });
});

module.exports = router;