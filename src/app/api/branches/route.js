// src/app/api/branches/route.js
import pool from '../../../../lib/db';  // Import your database connection

// Handle GET request (fetch branches)
export async function GET(request) {
  try {
    const [rows] = await pool.query('SELECT * FROM Branch');
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching Branch:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch Branch' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Handle POST request (insert new branch)
export async function POST(request) {
  try {
    // Parse the incoming JSON request body
    const { BranchName, Address, Phone } = await request.json();

    // Validate incoming data
    if (!BranchName || !Address || !Phone) {
      return new Response(
        JSON.stringify({ error: 'BranchName, Address, and Phone are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Insert new branch into the Branch table
    const result = await pool.query(
      'INSERT INTO Branch (BranchName, Address, Phone) VALUES (?, ?, ?)',
      [BranchName, Address, Phone]
    );

    // Return success response
    return new Response(
      JSON.stringify({ message: 'Branch added successfully', BranchID: result.insertId }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error inserting Branch:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to insert Branch' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
