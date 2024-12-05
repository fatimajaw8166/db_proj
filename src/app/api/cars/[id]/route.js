// src/app/api/cars/[id]/route.js
import pool from '../../../../../lib/db';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const [carRows] = await pool.query('SELECT * FROM Car WHERE CarID = ?', [id]);
    const [feedbackRows] = await pool.query(`
      SELECT Feedback.* FROM Feedback
      JOIN Rental ON Feedback.RentalID = Rental.RentalID
      WHERE Rental.CarID = ?
    `, [id]);

    if (carRows.length === 0) {
      return new Response(JSON.stringify({ error: 'Car not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const car = carRows[0];
    const feedback = feedbackRows;

    return new Response(JSON.stringify({ car, feedback }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching car details:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch car details' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}