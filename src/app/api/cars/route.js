// src/app/api/properties/route.js
import pool from '../../../../lib/db';

export async function GET(request) {
  try {
    const [rows] = await pool.query('SELECT * FROM car');
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching car:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch car' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}