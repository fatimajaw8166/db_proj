// src/app/api/global/route.js
import pool from '../../../../lib/db';

export async function GET(request) {
  try {
    const [customers] = await pool.query('SELECT * FROM Customer');
    const [cars] = await pool.query('SELECT * FROM Car');
    const [carModels] = await pool.query('SELECT * FROM CarModel');
    const [rentals] = await pool.query('SELECT * FROM Rental');
    const [payments] = await pool.query('SELECT * FROM Payment');
    const [employees] = await pool.query('SELECT * FROM Employee');
    const [branches] = await pool.query('SELECT * FROM Branch');
    const [reservations] = await pool.query('SELECT * FROM Reservation');
    const [maintenances] = await pool.query('SELECT * FROM Maintenance');
    const [insurances] = await pool.query('SELECT * FROM Insurance');
    const [feedbacks] = await pool.query('SELECT * FROM Feedback');
    // Add more queries as needed

    return new Response(JSON.stringify({ customers, cars, carModels, rentals, payments, employees, branches, reservations, maintenances, insurances, feedbacks }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}