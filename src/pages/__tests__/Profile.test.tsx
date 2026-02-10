import { describe, it, expect } from 'vitest';
import { render, screen, setMockAuth, resetMockAuth, mockUser } from '../../test/helpers';
import { Profile } from '../Profile';

describe('Profile Page', () => {
    beforeEach(() => {
        setMockAuth({ user: mockUser, isApproved: true });
    });
    afterEach(() => resetMockAuth());

    it('renders the profile heading', () => {
        render(<Profile />);
        expect(screen.getByText(/profile/i)).toBeInTheDocument();
    });

    it('renders stats grid', () => {
        render(<Profile />);
        // Stats like followers, engagement, etc.
        const statCards = document.querySelectorAll('.glass-card');
        expect(statCards.length).toBeGreaterThan(0);
    });

    it('renders edit button', () => {
        render(<Profile />);
        const editBtn = screen.getByRole('button', { name: /edit/i });
        expect(editBtn).toBeInTheDocument();
    });

    it('renders social links section', () => {
        render(<Profile />);
        // Check for social platform references
        expect(screen.getByText(/instagram/i)).toBeInTheDocument();
    });
});
