import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import {
    User, Bell, Shield, Palette, CreditCard, LogOut,
    Mail, Smartphone, Lock, Key, Moon, Sun, Monitor,
    Save
} from 'lucide-react';
import { toast } from 'sonner';
import * as Tabs from '@radix-ui/react-tabs';
import * as Switch from '@radix-ui/react-switch';

export const Settings: React.FC = () => {
    const { user, logout } = useAuth();

    // Account form state
    const [accountForm, setAccountForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '+254 712 345 678',
        language: 'en',
    });

    // Notification preferences
    const [notifications, setNotifications] = useState({
        emailCampaigns: true,
        emailMessages: true,
        emailMarketing: false,
        pushNewCampaign: true,
        pushApplication: true,
        pushPayment: true,
        pushMessages: false,
    });

    // Privacy settings
    const [privacy, setPrivacy] = useState({
        profileVisible: true,
        showEmail: false,
        showPhone: false,
        showStats: true,
    });

    // Theme
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

    // Show password form
    const [showPassword, setShowPassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        current: '',
        newPass: '',
        confirm: '',
    });

    if (!user) return <Navigate to="/login" replace />;

    const handleAccountSave = () => {
        toast.success('Account settings saved!');
    };

    const handlePasswordChange = () => {
        if (passwordForm.newPass !== passwordForm.confirm) {
            toast.error('Passwords do not match');
            return;
        }
        if (passwordForm.newPass.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }
        toast.success('Password updated successfully!');
        setPasswordForm({ current: '', newPass: '', confirm: '' });
        setShowPassword(false);
    };

    const handleNotificationSave = () => {
        toast.success('Notification preferences saved!');
    };

    const handleDeleteAccount = () => {
        toast.error('Account deletion requires Supabase integration', {
            description: 'This feature will be available after backend setup.',
        });
    };

    const ToggleSwitch: React.FC<{ checked: boolean; onCheckedChange: (v: boolean) => void; label: string; description?: string }> = ({
        checked, onCheckedChange, label, description
    }) => (
        <div className="flex items-center justify-between py-3">
            <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
            </div>
            <Switch.Root
                checked={checked}
                onCheckedChange={onCheckedChange}
                className="w-11 h-6 rounded-full bg-muted data-[state=checked]:bg-primary transition-colors relative"
            >
                <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-md transition-transform translate-x-0.5 data-[state=checked]:translate-x-[22px]" />
            </Switch.Root>
        </div>
    );

    return (
        <div className="min-h-screen gradient-mesh py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-foreground">Settings</h1>
                    <p className="text-muted-foreground mt-1">Manage your account preferences</p>
                </div>

                <Tabs.Root defaultValue="account" className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar Nav */}
                    <Tabs.List className="md:w-56 flex md:flex-col gap-1 glass-card rounded-2xl p-2 h-fit flex-shrink-0 overflow-x-auto md:overflow-visible">
                        {[
                            { value: 'account', icon: User, label: 'Account' },
                            { value: 'notifications', icon: Bell, label: 'Notifications' },
                            { value: 'privacy', icon: Shield, label: 'Privacy' },
                            { value: 'appearance', icon: Palette, label: 'Appearance' },
                            { value: 'billing', icon: CreditCard, label: 'Billing' },
                        ].map((tab) => (
                            <Tabs.Trigger
                                key={tab.value}
                                value={tab.value}
                                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground whitespace-nowrap transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-muted/50"
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </Tabs.Trigger>
                        ))}
                    </Tabs.List>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {/* Account Tab */}
                        <Tabs.Content value="account" className="space-y-6">
                            <div className="glass-card rounded-2xl p-6">
                                <h2 className="text-lg font-bold text-foreground mb-4">Account Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                                        <input
                                            type="text"
                                            value={accountForm.name}
                                            onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                                            className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="email"
                                                value={accountForm.email}
                                                onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                                                className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number</label>
                                        <div className="relative">
                                            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="tel"
                                                value={accountForm.phone}
                                                onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })}
                                                className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1.5">Language</label>
                                        <select
                                            value={accountForm.language}
                                            onChange={(e) => setAccountForm({ ...accountForm, language: e.target.value })}
                                            className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
                                        >
                                            <option value="en">English</option>
                                            <option value="sw">Kiswahili</option>
                                        </select>
                                    </div>
                                    <button
                                        onClick={handleAccountSave}
                                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white gradient-hero rounded-xl hover:shadow-lg transition-all duration-300"
                                    >
                                        <Save className="w-4 h-4" /> Save Changes
                                    </button>
                                </div>
                            </div>

                            {/* Password */}
                            <div className="glass-card rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-foreground">Password & Security</h2>
                                        <p className="text-sm text-muted-foreground">Keep your account secure</p>
                                    </div>
                                    <button
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium glass-card rounded-lg hover:bg-muted/50 transition-all"
                                    >
                                        <Key className="w-4 h-4" /> Change Password
                                    </button>
                                </div>

                                {showPassword && (
                                    <div className="space-y-3 animate-slide-up">
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="password"
                                                placeholder="Current password"
                                                value={passwordForm.current}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                                                className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="password"
                                                placeholder="New password"
                                                value={passwordForm.newPass}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                                                className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="password"
                                                placeholder="Confirm new password"
                                                value={passwordForm.confirm}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                                                className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm"
                                            />
                                        </div>
                                        <button
                                            onClick={handlePasswordChange}
                                            className="px-5 py-2 text-sm font-semibold text-white gradient-hero rounded-xl hover:shadow-lg transition-all duration-300"
                                        >
                                            Update Password
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Danger Zone */}
                            <div className="glass-card rounded-2xl p-6 border-2 border-destructive/20">
                                <h2 className="text-lg font-bold text-destructive mb-2">Danger Zone</h2>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Once you delete your account, there's no going back. Please be certain.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => { logout(); toast.success('Logged out successfully'); }}
                                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-muted-foreground glass-card rounded-xl hover:bg-muted/50 transition-all"
                                    >
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </button>
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-destructive bg-destructive/10 rounded-xl hover:bg-destructive/20 transition-all"
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </Tabs.Content>

                        {/* Notifications Tab */}
                        <Tabs.Content value="notifications" className="space-y-6">
                            <div className="glass-card rounded-2xl p-6">
                                <h2 className="text-lg font-bold text-foreground mb-1">Email Notifications</h2>
                                <p className="text-sm text-muted-foreground mb-4">Choose what emails you receive</p>
                                <div className="divide-y divide-border/50">
                                    <ToggleSwitch
                                        checked={notifications.emailCampaigns}
                                        onCheckedChange={(v) => setNotifications({ ...notifications, emailCampaigns: v })}
                                        label="Campaign Updates"
                                        description="Get notified when campaigns you're in are updated"
                                    />
                                    <ToggleSwitch
                                        checked={notifications.emailMessages}
                                        onCheckedChange={(v) => setNotifications({ ...notifications, emailMessages: v })}
                                        label="New Messages"
                                        description="Receive email for new chat messages"
                                    />
                                    <ToggleSwitch
                                        checked={notifications.emailMarketing}
                                        onCheckedChange={(v) => setNotifications({ ...notifications, emailMarketing: v })}
                                        label="Marketing & Tips"
                                        description="Platform updates, tips, and promotional content"
                                    />
                                </div>
                            </div>

                            <div className="glass-card rounded-2xl p-6">
                                <h2 className="text-lg font-bold text-foreground mb-1">Push Notifications</h2>
                                <p className="text-sm text-muted-foreground mb-4">Manage browser push notifications</p>
                                <div className="divide-y divide-border/50">
                                    <ToggleSwitch
                                        checked={notifications.pushNewCampaign}
                                        onCheckedChange={(v) => setNotifications({ ...notifications, pushNewCampaign: v })}
                                        label="New Campaigns"
                                        description="Matching campaigns in your niche"
                                    />
                                    <ToggleSwitch
                                        checked={notifications.pushApplication}
                                        onCheckedChange={(v) => setNotifications({ ...notifications, pushApplication: v })}
                                        label="Application Status"
                                        description="When brands respond to your applications"
                                    />
                                    <ToggleSwitch
                                        checked={notifications.pushPayment}
                                        onCheckedChange={(v) => setNotifications({ ...notifications, pushPayment: v })}
                                        label="Payments"
                                        description="Payment confirmations and releases"
                                    />
                                    <ToggleSwitch
                                        checked={notifications.pushMessages}
                                        onCheckedChange={(v) => setNotifications({ ...notifications, pushMessages: v })}
                                        label="Chat Messages"
                                        description="Real-time push for new messages"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleNotificationSave}
                                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white gradient-hero rounded-xl hover:shadow-lg transition-all duration-300"
                            >
                                <Save className="w-4 h-4" /> Save Preferences
                            </button>
                        </Tabs.Content>

                        {/* Privacy Tab */}
                        <Tabs.Content value="privacy" className="space-y-6">
                            <div className="glass-card rounded-2xl p-6">
                                <h2 className="text-lg font-bold text-foreground mb-1">Profile Visibility</h2>
                                <p className="text-sm text-muted-foreground mb-4">Control who can see your information</p>
                                <div className="divide-y divide-border/50">
                                    <ToggleSwitch
                                        checked={privacy.profileVisible}
                                        onCheckedChange={(v) => setPrivacy({ ...privacy, profileVisible: v })}
                                        label="Public Profile"
                                        description="Allow your profile to appear in the marketplace"
                                    />
                                    <ToggleSwitch
                                        checked={privacy.showEmail}
                                        onCheckedChange={(v) => setPrivacy({ ...privacy, showEmail: v })}
                                        label="Show Email Address"
                                        description="Display your email on your public profile"
                                    />
                                    <ToggleSwitch
                                        checked={privacy.showPhone}
                                        onCheckedChange={(v) => setPrivacy({ ...privacy, showPhone: v })}
                                        label="Show Phone Number"
                                        description="Display your phone number on your public profile"
                                    />
                                    <ToggleSwitch
                                        checked={privacy.showStats}
                                        onCheckedChange={(v) => setPrivacy({ ...privacy, showStats: v })}
                                        label="Show Performance Stats"
                                        description="Display engagement rate and campaign stats"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => toast.success('Privacy settings saved!')}
                                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white gradient-hero rounded-xl hover:shadow-lg transition-all duration-300"
                            >
                                <Save className="w-4 h-4" /> Save Privacy Settings
                            </button>
                        </Tabs.Content>

                        {/* Appearance Tab */}
                        <Tabs.Content value="appearance" className="space-y-6">
                            <div className="glass-card rounded-2xl p-6">
                                <h2 className="text-lg font-bold text-foreground mb-1">Theme</h2>
                                <p className="text-sm text-muted-foreground mb-4">Choose your preferred color scheme</p>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { value: 'light' as const, icon: Sun, label: 'Light' },
                                        { value: 'dark' as const, icon: Moon, label: 'Dark' },
                                        { value: 'system' as const, icon: Monitor, label: 'System' },
                                    ].map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => { setTheme(opt.value); toast.success(`Theme set to ${opt.label}`); }}
                                            className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 ${theme === opt.value
                                                ? 'bg-primary/10 text-primary ring-2 ring-primary/30'
                                                : 'glass-card text-muted-foreground hover:bg-muted/50'
                                                }`}
                                        >
                                            <opt.icon className="w-6 h-6" />
                                            <span className="text-sm font-medium">{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </Tabs.Content>

                        {/* Billing Tab */}
                        <Tabs.Content value="billing" className="space-y-6">
                            <div className="glass-card rounded-2xl p-6">
                                <h2 className="text-lg font-bold text-foreground mb-1">Current Plan</h2>
                                <p className="text-sm text-muted-foreground mb-4">Manage your subscription</p>

                                <div className="glass-card-hover rounded-xl p-5 mb-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-foreground">Free Plan</p>
                                            <p className="text-sm text-muted-foreground">Basic access to marketplace and 3 campaigns/month</p>
                                        </div>
                                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400">
                                            Active
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => toast.info('Upgrade flow coming soon!')}
                                    className="px-5 py-2.5 text-sm font-semibold text-white gradient-hero rounded-xl hover:shadow-lg transition-all duration-300"
                                >
                                    Upgrade Plan
                                </button>
                            </div>

                            <div className="glass-card rounded-2xl p-6">
                                <h2 className="text-lg font-bold text-foreground mb-1">Payment Methods</h2>
                                <p className="text-sm text-muted-foreground mb-4">Add or manage payment methods</p>

                                <div className="glass-card-hover rounded-xl p-5 flex items-center gap-4 mb-3">
                                    <div className="w-12 h-8 rounded bg-green-600 flex items-center justify-center text-white text-xs font-bold">
                                        M-Pesa
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">M-Pesa</p>
                                        <p className="text-xs text-muted-foreground">+254 ••• ••• 678</p>
                                    </div>
                                    <span className="ml-auto text-xs text-green-600 font-medium">Default</span>
                                </div>

                                <button
                                    onClick={() => toast.info('Payment method management coming soon!')}
                                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-primary glass-card rounded-xl hover:bg-primary/5 transition-all"
                                >
                                    + Add Payment Method
                                </button>
                            </div>
                        </Tabs.Content>
                    </div>
                </Tabs.Root>
            </div>
        </div>
    );
};
