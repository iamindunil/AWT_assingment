"use client";
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useState, memo, useEffect } from 'react';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSignOutAlt, FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

// Extract search component to improve code organization
const SearchBar = memo(({ onMobile = false }: { onMobile?: boolean }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/books/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative ${onMobile ? 'mb-4 w-full' : ''}`}>
      <input
        type="text"
        placeholder="Search books..."
        className={`${onMobile ? 'w-full py-2' : 'py-1'} px-3 pr-10 rounded-${onMobile ? 'md' : 'full'} border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
        <FaSearch />
      </button>
    </form>
  );
});

SearchBar.displayName = 'SearchBar';

// Extract authentication links to improve readability and maintenance
const AuthLinks = memo(({ isMobile = false }: { isMobile?: boolean }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest('.user-dropdown-container')) {
          setDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  if (isAuthenticated) {
    if (isMobile) {
      return (
        <>
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
      );
    }
    
    return (
      <div className="relative user-dropdown-container">
        <button 
          className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
          onClick={toggleDropdown}
        >
          <FaUser className="text-xl" />
          <span className="font-medium">{user?.name?.split(' ')[0]}</span>
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
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
        )}
      </div>
    );
  }
  
  if (isMobile) {
    return (
      <>
        <Link href="/auth/login" className="text-gray-700 hover:text-primary-600 py-2">
          Login
        </Link>
        <Link href="/auth/register" className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 inline-block">
          Sign Up
        </Link>
      </>
    );
  }
  
  return (
    <div className="flex items-center space-x-2">
      <Link href="/auth/login" className="text-gray-700 hover:text-primary-600">
        Login
      </Link>
      <Link href="/auth/register" className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700">
        Sign Up
      </Link>
    </div>
  );
});

AuthLinks.displayName = 'AuthLinks';

// Main Navbar component
export default function Navbar() {
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
            <SearchBar />
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
            <AuthLinks />
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700 hover:text-primary-600"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <SearchBar onMobile />
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
              <AuthLinks isMobile />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 