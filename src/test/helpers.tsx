import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';
import { vi } from 'vitest';

// ─── Mock Auth Context ──────────────────────────────────────────────
export const mockUser = {
    id: 'test-user-123',
    email: 'test@netfluenz.com',
    name: 'Test User',
    role: 'influencer' as const,
    isApproved: true,
};

export const mockAdminUser = {
    id: 'admin-user-456',
    email: 'admin@netfluenz.com',
    name: 'Admin User',
    role: 'admin' as const,
    isApproved: true,
};

export const mockBrandUser = {
    id: 'brand-user-789',
    email: 'brand@netfluenz.com',
    name: 'Brand User',
    role: 'brand' as const,
    isApproved: true,
};

// Mock useAuth hook - default: logged-out
const defaultAuthMock = {
    user: null as any,
    login: vi.fn(),
    logout: vi.fn(),
    signup: vi.fn(),
    isLoading: false,
    isApproved: false,
};

let currentAuthMock = { ...defaultAuthMock };

export function setMockAuth(overrides: Partial<typeof defaultAuthMock>) {
    currentAuthMock = { ...defaultAuthMock, ...overrides };
}

export function resetMockAuth() {
    currentAuthMock = { ...defaultAuthMock };
}

// We need to mock the useAuth module
vi.mock('../hooks/useAuth', () => ({
    useAuth: () => currentAuthMock,
}));

// ─── Custom Render ──────────────────────────────────────────────────
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
    routerProps?: MemoryRouterProps;
}

function customRender(ui: React.ReactElement, options?: CustomRenderOptions) {
    const { routerProps, ...renderOptions } = options || {};

    function Wrapper({ children }: { children: React.ReactNode }) {
        return <MemoryRouter {...routerProps}>{children}</MemoryRouter>;
    }

    return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
