import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
        },
    },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider attribute="class" defaultTheme="light">
                    <BrowserRouter>
                        <AuthProvider>
                            <NotificationProvider>
                                <App />
                            </NotificationProvider>
                        </AuthProvider>
                    </BrowserRouter>
                </ThemeProvider>
            </QueryClientProvider>
        </ErrorBoundary>
    </React.StrictMode>,
);
