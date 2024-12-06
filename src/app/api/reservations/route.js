// src/app/api/reservations/route.js
import pool from '../../../../lib/db';

export async function GET(request) {
  try {
    const [rows] = await pool.query('SELECT * FROM Reservation');
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch reservations' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request) {
  try {
    const { carId, customerId, reservationDate, status } = await request.json();

    // Insert reservation record
    await pool.query(
      'INSERT INTO Reservation (CarID, CustomerID, ReservationDate, Status) VALUES (?, ?, ?, ?)',
      [carId, customerId, reservationDate, status]
    );

    return new Response(JSON.stringify({ message: 'Reservation created successfully' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating reservation:', error);
    return new Response(JSON.stringify({ error: 'Failed to create reservation' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}