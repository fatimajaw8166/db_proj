// src/app/api/feedback/route.js
import pool from '../../../../lib/db';

export async function POST(request) {
  try {
    const { rentalId, comments, rating } = await request.json();

    await pool.query(
      'INSERT INTO Feedback (RentalID, FeedbackDate, Comments, Rating) VALUES (?, NOW(), ?, ?)',
      [rentalId, comments, rating]
    );

    return new Response(JSON.stringify({ message: 'Feedback submitted successfully' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return new Response(JSON.stringify({ error: 'Failed to submit feedback' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}