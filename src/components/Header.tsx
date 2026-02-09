import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { NotificationBell } from './notifications/NotificationBell';
import { Menu, X, LogOut, User, Settings, LayoutDashboard, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export const Header: React.FC = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/marketplace', label: 'Discover' },
        { href: '/campaigns', label: 'Campaigns' },
        { href: '/pricing', label: 'Pricing' },
    ];

    return (
        <header className="sticky top-0 z-50 glass-nav">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-400 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                            <span className="text-white font-extrabold text-lg">N</span>
                        </div>
                        <span className="text-xl font-bold text-gradient">Netfluenz</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                to={href}
                                className={cn(
                                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
                                    location.pathname === href
                                        ? 'text-primary bg-primary/10 shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
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

                                {/* Profile Dropdown — Radix UI */}
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger asChild>
                                        <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-muted/50 transition-all duration-300 outline-none focus:ring-2 focus:ring-primary/20">
                                            <img
                                                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                                alt={user.name}
                                                className="w-8 h-8 rounded-full ring-2 ring-white/50 shadow-sm"
                                            />
                                            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
                                        </button>
                                    </DropdownMenu.Trigger>

                                    <DropdownMenu.Portal>
                                        <DropdownMenu.Content
                                            align="end"
                                            sideOffset={8}
                                            className="z-[100] min-w-[220px] glass-card-strong rounded-xl p-1.5 animate-scale-in origin-top-right"
                                        >
                                            {/* User Info */}
                                            <div className="px-3 py-2.5 mb-1">
                                                <p className="font-semibold text-sm text-foreground">{user.name}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
                                            </div>

                                            <DropdownMenu.Separator className="h-px bg-border/50 mx-2 my-1" />

                                            <DropdownMenu.Item
                                                className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground rounded-lg cursor-pointer outline-none hover:bg-muted/60 transition-colors"
                                                onSelect={() => navigate('/dashboard')}
                                            >
                                                <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                                                Dashboard
                                            </DropdownMenu.Item>

                                            <DropdownMenu.Item
                                                className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground rounded-lg cursor-pointer outline-none hover:bg-muted/60 transition-colors"
                                                onSelect={() => navigate('/profile')}
                                            >
                                                <User className="w-4 h-4 text-muted-foreground" />
                                                Profile
                                            </DropdownMenu.Item>

                                            <DropdownMenu.Item
                                                className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground rounded-lg cursor-pointer outline-none hover:bg-muted/60 transition-colors"
                                                onSelect={() => navigate('/settings')}
                                            >
                                                <Settings className="w-4 h-4 text-muted-foreground" />
                                                Settings
                                            </DropdownMenu.Item>

                                            <DropdownMenu.Separator className="h-px bg-border/50 mx-2 my-1" />

                                            <DropdownMenu.Item
                                                className="flex items-center gap-2.5 px-3 py-2 text-sm text-destructive rounded-lg cursor-pointer outline-none hover:bg-destructive/10 transition-colors"
                                                onSelect={() => logout()}
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Sign out
                                            </DropdownMenu.Item>
                                        </DropdownMenu.Content>
                                    </DropdownMenu.Portal>
                                </DropdownMenu.Root>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-5 py-2 text-sm font-semibold text-white gradient-hero rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-xl hover:bg-muted/50 transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-border/50 animate-slide-up">
                        <nav className="flex flex-col gap-1">
                            {navLinks.map(({ href, label }) => (
                                <Link
                                    key={href}
                                    to={href}
                                    className={cn(
                                        'px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300',
                                        location.pathname === href
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
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
