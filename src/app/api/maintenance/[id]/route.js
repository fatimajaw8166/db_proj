// src/app/api/maintenance/[id]/route.js
import pool from '../../../../../lib/db';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const [rows] = await pool.query('SELECT * FROM Maintenance WHERE CarID = ?', [id]);

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Maintenance details not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const maintenanceDetails = rows[0];

    return new Response(JSON.stringify(maintenanceDetails), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching maintenance details:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch maintenance details' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}