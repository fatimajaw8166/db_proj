// src/app/login/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        router.push('/home');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to login');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-center mb-6">Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-200 font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mt-2 bg-gray-600 text-white rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-200 font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mt-2 bg-gray-600 text-white rounded-lg"
            required
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition duration-300"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;