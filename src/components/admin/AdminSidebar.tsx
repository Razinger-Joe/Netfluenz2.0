import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Target, BarChart3, Settings, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Target, label: 'Campaigns', path: '/admin/campaigns' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export const AdminSidebar: React.FC = () => {
    return (
        <aside className="w-64 min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 p-5 relative overflow-hidden">
            {/* Subtle gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600" />

            {/* Header */}
            <div className="flex items-center gap-3 px-2 mb-10 mt-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                    <span className="text-lg font-bold text-white block">Admin</span>
                    <span className="text-xs text-gray-500 font-medium">Netfluenz Panel</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
                {navItems.map(({ icon: Icon, label, path }) => (
                    <NavLink
                        key={path}
                        to={path}
                        end={path === '/admin'}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group',
                                isActive
                                    ? 'bg-gradient-to-r from-orange-500/90 to-amber-500/90 text-white shadow-lg shadow-orange-500/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            )
                        }
                    >
                        <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                        <span className="font-medium text-sm">{label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};
