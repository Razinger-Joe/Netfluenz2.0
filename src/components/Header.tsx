import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { NotificationBell } from './notifications/NotificationBell';
import { Menu, X, LogOut, User, Settings, LayoutDashboard } from 'lucide-react';
import { cn } from '../lib/utils';

export const Header: React.FC = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/marketplace', label: 'Discover' },
        { href: '/campaigns', label: 'Campaigns' },
        { href: '/pricing', label: 'Pricing' },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">N</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">Netfluenz</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                to={href}
                                className={cn(
                                    'text-sm font-medium transition-colors',
                                    location.pathname === href
                                        ? 'text-orange-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                )}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Section */}
                    <div className="flex items-center gap-3">
                        {isAuthenticated && user ? (
                            <>
                                <NotificationBell />

                                {/* Profile Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <img
                                            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                            alt={user.name}
                                            className="w-8 h-8 rounded-full"
                                        />
                                    </button>

                                    {isProfileMenuOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setIsProfileMenuOpen(false)}
                                            />
                                            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg z-50 overflow-hidden">
                                                <div className="p-3 border-b border-gray-100">
                                                    <p className="font-medium text-gray-900">{user.name}</p>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                </div>
                                                <div className="p-1">
                                                    <Link
                                                        to="/dashboard"
                                                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                                                        onClick={() => setIsProfileMenuOpen(false)}
                                                    >
                                                        <LayoutDashboard className="w-4 h-4" />
                                                        Dashboard
                                                    </Link>
                                                    <Link
                                                        to="/profile"
                                                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                                                        onClick={() => setIsProfileMenuOpen(false)}
                                                    >
                                                        <User className="w-4 h-4" />
                                                        Profile
                                                    </Link>
                                                    <Link
                                                        to="/settings"
                                                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                                                        onClick={() => setIsProfileMenuOpen(false)}
                                                    >
                                                        <Settings className="w-4 h-4" />
                                                        Settings
                                                    </Link>
                                                </div>
                                                <div className="p-1 border-t border-gray-100">
                                                    <button
                                                        onClick={() => {
                                                            logout();
                                                            setIsProfileMenuOpen(false);
                                                        }}
                                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                        Sign out
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg hover:shadow-lg transition-all"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-100">
                        <nav className="flex flex-col gap-2">
                            {navLinks.map(({ href, label }) => (
                                <Link
                                    key={href}
                                    to={href}
                                    className={cn(
                                        'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                                        location.pathname === href
                                            ? 'bg-orange-50 text-orange-600'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    )}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};
