// src/app/api/rent/route.js
import pool from '../../../../lib/db';

export async function POST(request) {
  try {
    const { carId, customerId, employeeId, rentalDate, returnDate, totalAmount } = await request.json();

    // Insert rental record
    await pool.query(
      'INSERT INTO Rental (CustomerID, CarID, EmployeeID, RentalDate, ReturnDate, TotalAmount) VALUES (?, ?, ?, ?, ?, ?)',
      [customerId, carId, employeeId, rentalDate, returnDate, totalAmount]
    );

    // Update car status to 'Rented'
    await pool.query('UPDATE Car SET Status = ? WHERE CarID = ?', ['Rented', carId]);

    return new Response(JSON.stringify({ message: 'Car rented successfully' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error renting car:', error);
    return new Response(JSON.stringify({ error: 'Failed to rent car' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}