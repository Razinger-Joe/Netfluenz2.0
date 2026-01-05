import React from 'react';
import { LoginForm } from '../../components/auth/LoginForm';

export const Login: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, rgb(249 115 22) 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            {/* Login Form */}
            <div className="relative z-10">
                <LoginForm />
            </div>
        </div>
    );
};
