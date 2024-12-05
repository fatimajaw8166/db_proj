// src/app/api/rentals/[id]/route.js
import pool from '../../../../../lib/db';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const [rows] = await pool.query('SELECT * FROM Rental WHERE CarID = ?', [id]);

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Rental details not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const rentalDetails = rows[0];

    return new Response(JSON.stringify(rentalDetails), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching rental details:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch rental details' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}