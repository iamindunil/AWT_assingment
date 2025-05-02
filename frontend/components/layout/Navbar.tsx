"use client";
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSignOutAlt, FaSearch } from 'react-icons/fa';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/books/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary-600">
            BookManager
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/books" className="text-gray-700 hover:text-primary-600">
              Books
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-primary-600">
              Categories
            </Link>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search books..."
                className="py-1 px-3 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <FaSearch />
              </button>
            </form>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart" className="relative text-gray-700 hover:text-primary-600">
              <FaShoppingCart className="text-xl" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                  <FaUser className="text-xl" />
                  <span className="font-medium">{user?.name?.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  <Link href="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Orders
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <FaSignOutAlt className="mr-2" /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login" className="text-gray-700 hover:text-primary-600">
                  Login
                </Link>
                <Link href="/auth/register" className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700 hover:text-primary-600"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <form onSubmit={handleSearch} className="relative mb-4">
              <input
                type="text"
                placeholder="Search books..."
                className="w-full py-2 px-3 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <FaSearch />
              </button>
            </form>
            <div className="flex flex-col space-y-3">
              <Link href="/books" className="text-gray-700 hover:text-primary-600 py-2">
                Books
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-primary-600 py-2">
                Categories
              </Link>
              <Link href="/cart" className="text-gray-700 hover:text-primary-600 py-2 flex items-center">
                <FaShoppingCart className="mr-2" /> Cart {totalItems > 0 && `(${totalItems})`}
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link href="/profile" className="text-gray-700 hover:text-primary-600 py-2">
                    Profile
                  </Link>
                  <Link href="/orders" className="text-gray-700 hover:text-primary-600 py-2">
                    Orders
                  </Link>
                  <button
                    onClick={logout}
                    className="text-left text-gray-700 hover:text-primary-600 py-2 flex items-center"
                  >
                    <FaSignOutAlt className="mr-2" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="text-gray-700 hover:text-primary-600 py-2">
                    Login
                  </Link>
                  <Link href="/auth/register" className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 inline-block">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 