// src/app/api/login/route.js
import pool from '../../../../lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Retrieve the user from the database
    const [rows] = await pool.query('SELECT * FROM Users WHERE Email = ?', [email]);

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const user = rows[0];

    // Debugging: Log the entire user object
    // console.log('User:', user);

    // Ensure both password and user.Password are defined
    if (!password || !user.Password) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.Password);

    if (!isPasswordValid) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.UserID }, 'your_jwt_secret', { expiresIn: '1h' });

    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return new Response(JSON.stringify({ error: 'Failed to login' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}