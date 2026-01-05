import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
    children?: React.ReactNode;
    hideHeader?: boolean;
    hideFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
    children,
    hideHeader = false,
    hideFooter = false
}) => {
    return (
        <div className="min-h-screen flex flex-col">
            {!hideHeader && <Header />}
            <main className="flex-1">
                {children || <Outlet />}
            </main>
            {!hideFooter && <Footer />}
        </div>
    );
};
