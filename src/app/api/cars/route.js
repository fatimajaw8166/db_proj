// src/app/api/cars/route.js
import pool from '../../../../lib/db';

export async function GET(request) {
  try {
    const [rows] = await pool.query('SELECT * FROM Car');
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching cars:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch cars' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request) {
  try {
    const { CarID, ModelID, LicensePlate, Status, BranchID } = await request.json();

    // Validate incoming data
    if (!ModelID || !LicensePlate || !Status || !BranchID) {
      return new Response(
        JSON.stringify({ error: 'ModelID, LicensePlate, Status, and BranchID are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (CarID) {
      // Update existing car
      await pool.query(
        'UPDATE Car SET ModelID = ?, LicensePlate = ?, Status = ?, BranchID = ? WHERE CarID = ?',
        [ModelID, LicensePlate, Status, BranchID, CarID]
      );
      return new Response(
        JSON.stringify({ message: 'Car updated successfully' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } else {
      // Insert new car
      const [result] = await pool.query(
        'INSERT INTO Car (ModelID, LicensePlate, Status, BranchID) VALUES (?, ?, ?, ?)',
        [ModelID, LicensePlate, Status, BranchID]
      );
      return new Response(
        JSON.stringify({ message: 'Car added successfully', CarID: result.insertId }),
        {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Error handling car:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to handle car' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}