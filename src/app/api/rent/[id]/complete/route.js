// src/app/api/rent/[id]/complete/route.js
import pool from '../../../../../lib/db';

export async function PUT(request, { params }) {
  const rentalId = params.id;
  try {
    // Update the rental status to complete
    await pool.query('UPDATE Rental SET Status = "Completed" WHERE RentalID = ?', [rentalId]);

    // Set the car status to available
    const [rental] = await pool.query('SELECT CarID FROM Rental WHERE RentalID = ?', [rentalId]);
    const carId = rental[0].CarID;
    await pool.query('UPDATE Car SET Status = "Available" WHERE CarID = ?', [carId]);

    return new Response(JSON.stringify({ message: 'Rental completed and car status updated to available' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error completing rental:', error);
    return new Response(JSON.stringify({ error: 'Failed to complete rental' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}