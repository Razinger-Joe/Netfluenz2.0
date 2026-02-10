import { describe, it, expect } from 'vitest';
import { render, screen, setMockAuth, resetMockAuth, mockUser } from '../../test/helpers';
import { Settings } from '../Settings';

describe('Settings Page', () => {
    beforeEach(() => {
        setMockAuth({ user: mockUser, isApproved: true });
    });
    afterEach(() => resetMockAuth());

    it('renders the settings heading', () => {
        render(<Settings />);
        expect(screen.getByText(/settings/i)).toBeInTheDocument();
    });

    it('renders all 5 tabs', () => {
        render(<Settings />);
        expect(screen.getByRole('tab', { name: /account/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /notifications/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /privacy/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /appearance/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /billing/i })).toBeInTheDocument();
    });

    it('Account tab is active by default', () => {
        render(<Settings />);
        const accountTab = screen.getByRole('tab', { name: /account/i });
        expect(accountTab.getAttribute('data-state')).toBe('active');
    });

    it('renders account form fields', () => {
        render(<Settings />);
        // Account tab should have email-related content
        expect(screen.getByText(/email/i)).toBeInTheDocument();
    });

    it('redirects unauthenticated users', () => {
        setMockAuth({ user: null });
        render(<Settings />);
        // Settings uses Navigate to redirect when no user
        expect(screen.queryByRole('tab', { name: /account/i })).not.toBeInTheDocument();
    });
});
