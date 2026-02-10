import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, setMockAuth, resetMockAuth, mockBrandUser } from '../../test/helpers';
import { Campaigns } from '../Campaigns';

describe('Campaigns Page', () => {
    afterEach(() => resetMockAuth());

    it('renders the page heading', () => {
        render(<Campaigns />);
        expect(screen.getByText('Campaigns')).toBeInTheDocument();
    });

    it('renders search input', () => {
        render(<Campaigns />);
        const input = screen.getByPlaceholderText(/search campaigns/i);
        expect(input).toBeInTheDocument();
    });

    it('renders campaign cards', () => {
        render(<Campaigns />);
        expect(screen.getByText('Safaricom Brand Ambassador')).toBeInTheDocument();
        expect(screen.getByText('Tusker Celebrate Local Culture')).toBeInTheDocument();
    });

    it('filters campaigns by search', () => {
        render(<Campaigns />);
        const input = screen.getByPlaceholderText(/search campaigns/i);
        fireEvent.change(input, { target: { value: 'Safaricom' } });
        expect(screen.getByText('Safaricom Brand Ambassador')).toBeInTheDocument();
        expect(screen.queryByText('Tusker Celebrate Local Culture')).not.toBeInTheDocument();
    });

    it('renders category filter dropdown', () => {
        render(<Campaigns />);
        const select = screen.getByDisplayValue('All Categories');
        expect(select).toBeInTheDocument();
    });

    it('renders status tabs', () => {
        render(<Campaigns />);
        expect(screen.getByRole('tab', { name: /all/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /active/i })).toBeInTheDocument();
    });

    it('shows Create Campaign button for brand users', () => {
        setMockAuth({ user: mockBrandUser });
        render(<Campaigns />);
        expect(screen.getByText(/create campaign/i)).toBeInTheDocument();
    });

    it('hides Create Campaign button for logged-out users', () => {
        setMockAuth({ user: null });
        render(<Campaigns />);
        expect(screen.queryByText(/create campaign/i)).not.toBeInTheDocument();
    });
});
