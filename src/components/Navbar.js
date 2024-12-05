// src/components/Navbar.js
'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const { isAuthenticated, userEmail, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth'); // Redirect to the login page
  };

  return (
    <nav className="bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-semibold">Car Rental Management</div>
        <div className="space-x-4">
          {isAuthenticated ? (
            <>
              <Link href="/home" legacyBehavior>
                <a className="text-gray-300 hover:text-white">Home</a>
              </Link>
              <Link href="/cars" legacyBehavior>
                <a className="text-gray-300 hover:text-white">Manage Cars</a>
              </Link>
              <span className="text-gray-300">{userEmail}</span>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/auth" legacyBehavior>
              <a className="text-gray-300 hover:text-white">Login / Register</a>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;