// src/app/api/rent/[id]/route.js
import pool from '../../../../../lib/db';

export async function GET(request, { params }) {
  const rentalId = params.id;
  try {
    const [rental] = await pool.query('SELECT * FROM Rental WHERE RentalID = ?', [rentalId]);
    return new Response(JSON.stringify(rental[0]), {
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