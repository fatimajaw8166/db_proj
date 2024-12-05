// src/app/home/page.js
'use client';

import Link from 'next/link';

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-center mb-6">Welcome to Car Rental Management System</h1>
      <div className="text-center">
        <Link href="/cars" legacyBehavior>
          <a className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300">
            Manage Cars
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Home;