import React, { useEffect, useState } from 'react';
import { adminService, AdminUser } from '../../services/admin';
import { Search, Check, X, UserPlus, Users as UsersIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import * as Tabs from '@radix-ui/react-tabs';

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
        return (
            <div className="p-8 flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-primary border-r-transparent" />
                    <p className="mt-4 text-muted-foreground text-sm">Loading users...</p>
                </div>
            </div>
        );
    }

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const pendingUsers = filteredUsers.filter(u => u.status === 'pending');

    const handleStatusChange = async (userId: string, status: 'active' | 'suspended') => {
        await adminService.updateUserStatus(userId, status);
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
    };

    const UserTable: React.FC<{ userList: AdminUser[] }> = ({ userList }) => (
        <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border/50 text-left text-sm text-muted-foreground">
                            <th className="px-5 py-3.5 font-medium">User</th>
                            <th className="px-5 py-3.5 font-medium">Role</th>
                            <th className="px-5 py-3.5 font-medium">Status</th>
                            <th className="px-5 py-3.5 font-medium">Campaigns</th>
                            <th className="px-5 py-3.5 font-medium">Last Login</th>
                            <th className="px-5 py-3.5 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userList.map((user) => (
                            <tr key={user.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="w-10 h-10 rounded-full ring-2 ring-border/50"
                                        />
                                        <div>
                                            <p className="font-medium text-foreground text-sm">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <span className={cn(
                                        'px-2.5 py-1 text-xs font-semibold rounded-full capitalize',
                                        user.role === 'influencer'
                                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400'
                                            : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                                    )}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <span className={cn(
                                        'px-2.5 py-1 text-xs font-semibold rounded-full capitalize inline-flex items-center gap-1',
                                        user.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                                            user.status === 'suspended' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                                                'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'
                                    )}>
                                        <span className={cn(
                                            'w-1.5 h-1.5 rounded-full',
                                            user.status === 'active' ? 'bg-green-500' :
                                                user.status === 'suspended' ? 'bg-red-500' :
                                                    'bg-yellow-500'
                                        )} />
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-sm text-muted-foreground">{user.campaignsCount}</td>
                                <td className="px-5 py-4 text-sm text-muted-foreground">
                                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-1.5">
                                        {user.status !== 'active' && (
                                            <button
                                                onClick={() => handleStatusChange(user.id, 'active')}
                                                className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg transition-colors"
                                                title="Approve"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        )}
                                        {user.status !== 'suspended' && (
                                            <button
                                                onClick={() => handleStatusChange(user.id, 'suspended')}
                                                className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Suspend"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {userList.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="p-6 gradient-mesh min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">User Management</h1>
                <p className="text-muted-foreground mt-1">Manage and approve platform users</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 glass-input rounded-xl text-sm focus:outline-none"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as 'all' | 'influencer' | 'brand')}
                    className="px-4 py-2.5 glass-input rounded-xl text-sm focus:outline-none"
                >
                    <option value="all">All Roles</option>
                    <option value="influencer">Influencers</option>
                    <option value="brand">Brands</option>
                </select>
            </div>

            {/* Tabs */}
            <Tabs.Root defaultValue="all">
                <Tabs.List className="flex gap-1 mb-6 p-1 glass-card rounded-xl w-fit">
                    <Tabs.Trigger
                        value="all"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground"
                    >
                        <UsersIcon className="w-4 h-4" />
                        All Users ({filteredUsers.length})
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value="pending"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground"
                    >
                        <UserPlus className="w-4 h-4" />
                        Pending ({pendingUsers.length})
                    </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="all">
                    <UserTable userList={filteredUsers} />
                </Tabs.Content>
                <Tabs.Content value="pending">
                    <UserTable userList={pendingUsers} />
                </Tabs.Content>
            </Tabs.Root>
        </div>
    );
};
