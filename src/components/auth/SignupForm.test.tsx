import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test/utils';
import { SignupForm } from './SignupForm';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('SignupForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('renders signup form with all fields', () => {
        render(<SignupForm />);

        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    });

    it('has role selection buttons', () => {
        render(<SignupForm />);

        expect(screen.getByText(/Influencer/i)).toBeInTheDocument();
        expect(screen.getByText(/Brand/i)).toBeInTheDocument();
    });

    it('shows validation error for non-matching passwords', async () => {
        render(<SignupForm />);

        // Click influencer role
        fireEvent.click(screen.getByText(/Influencer/));

        fireEvent.change(screen.getByLabelText(/full name/i), {
            target: { value: 'Test User' },
        });
        fireEvent.change(screen.getByLabelText(/email address/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/^password$/i), {
            target: { value: 'Password123!' },
        });
        fireEvent.change(screen.getByLabelText(/confirm password/i), {
            target: { value: 'DifferentPassword1!' },
        });

        // Check the terms checkbox
        const termsCheckbox = screen.getByRole('checkbox');
        fireEvent.click(termsCheckbox);

        fireEvent.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
        });
    });

    it('has link to login page', () => {
        render(<SignupForm />);

        const loginLink = screen.getByText(/sign in/i);
        expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
    });

    it('shows password strength indicator', async () => {
        render(<SignupForm />);

        const passwordInput = screen.getByLabelText(/^password$/i);

        // Type a password to trigger strength indicator
        fireEvent.change(passwordInput, { target: { value: 'Password1' } });
        await waitFor(() => {
            expect(screen.getByText(/password strength:/i)).toBeInTheDocument();
        });
    });
});
