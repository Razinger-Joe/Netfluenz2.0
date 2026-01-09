import React, { useEffect, useState } from 'react';
import { adminService, AdminUser } from '../../services/admin';
import { Search, Check, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'influencer' | 'brand'>('all');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await adminService.getAllUsers();
                setUsers(data);
            } catch (error) {
                console.error('Failed to load users:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadUsers();
    }, []);

    if (isLoading) {
        return <div className="p-8 text-center">Loading users...</div>;
    }

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const handleStatusChange = async (userId: string, status: 'active' | 'suspended') => {
        await adminService.updateUserStatus(userId, status);
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-500 mt-1">Manage platform users</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as 'all' | 'influencer' | 'brand')}
                    className="px-4 py-2 border border-gray-200 rounded-lg"
                >
                    <option value="all">All Roles</option>
                    <option value="influencer">Influencers</option>
                    <option value="brand">Brands</option>
                </select>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 text-left text-sm text-gray-500">
                                <th className="px-4 py-3 font-medium">User</th>
                                <th className="px-4 py-3 font-medium">Role</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Campaigns</th>
                                <th className="px-4 py-3 font-medium">Last Login</th>
                                <th className="px-4 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-900">{user.name}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={cn(
                                            'px-2 py-1 text-xs font-medium rounded-full capitalize',
                                            user.role === 'influencer' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                                        )}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={cn(
                                            'px-2 py-1 text-xs font-medium rounded-full capitalize',
                                            user.status === 'active' ? 'bg-green-100 text-green-700' :
                                                user.status === 'suspended' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                        )}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{user.campaignsCount}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {user.status !== 'active' && (
                                                <button
                                                    onClick={() => handleStatusChange(user.id, 'active')}
                                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                    title="Activate"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                            )}
                                            {user.status !== 'suspended' && (
                                                <button
                                                    onClick={() => handleStatusChange(user.id, 'suspended')}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    title="Suspend"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
