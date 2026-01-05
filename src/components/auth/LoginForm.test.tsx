import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../test/utils';
import { LoginForm } from './LoginForm';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('LoginForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('renders login form with all fields', () => {
        render(<LoginForm />);

        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('renders demo credentials section', () => {
        render(<LoginForm />);

        expect(screen.getByText(/demo credentials/i)).toBeInTheDocument();
        expect(screen.getByText(/influencer@netfluenz.com/i)).toBeInTheDocument();
        expect(screen.getByText(/brand@netfluenz.com/i)).toBeInTheDocument();
    });

    it('renders remember me checkbox', () => {
        render(<LoginForm />);

        expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
    });

    it('renders forgot password link', () => {
        render(<LoginForm />);

        const forgotLink = screen.getByText(/forgot password/i);
        expect(forgotLink.closest('a')).toHaveAttribute('href', '/forgot-password');
    });

    it('has link to signup page', () => {
        render(<LoginForm />);

        const signupLink = screen.getByText(/sign up for free/i);
        expect(signupLink.closest('a')).toHaveAttribute('href', '/signup');
    });
});
