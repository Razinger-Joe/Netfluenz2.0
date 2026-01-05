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
        <aside className="w-64 bg-gray-900 min-h-screen p-4">
            <div className="flex items-center gap-2 px-2 mb-8">
                <Shield className="w-8 h-8 text-orange-500" />
                <span className="text-xl font-bold text-white">Admin Panel</span>
            </div>

            <nav className="space-y-1">
                {navItems.map(({ icon: Icon, label, path }) => (
                    <NavLink
                        key={path}
                        to={path}
                        end={path === '/admin'}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                                isActive
                                    ? 'bg-orange-500 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                            )
                        }
                    >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};
