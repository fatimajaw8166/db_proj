// src/app/api/register/route.js
import pool from '../../../../lib/db';
import bcrypt from 'bcrypt';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query('INSERT INTO Users (email, password) VALUES (?, ?)', [email, hashedPassword]);

    return new Response(JSON.stringify({ message: 'User registered successfully' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return new Response(JSON.stringify({ error: 'Failed to register user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}