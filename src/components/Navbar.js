// src/components/Navbar.js
'use client';

import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-semibold">Car Rental Management</div>
        <div className="space-x-4">
          <Link href="/home" legacyBehavior>
            <a className="text-gray-300 hover:text-white">Home</a>
          </Link>
          <Link href="/cars" legacyBehavior>
            <a className="text-gray-300 hover:text-white">Manage Cars</a>
          </Link>
          <Link href="/login" legacyBehavior>
            <a className="text-gray-300 hover:text-white">Login</a>
          </Link>
          <Link href="/register" legacyBehavior>
            <a className="text-gray-300 hover:text-white">Register</a>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;