import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/helpers';
import { NotFound } from '../NotFound';

describe('NotFound (404) Page', () => {
    it('renders the 404 text', () => {
        render(<NotFound />);
        expect(screen.getByText('404')).toBeInTheDocument();
    });

    it('renders the "Page Not Found" heading', () => {
        render(<NotFound />);
        expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    });

    it('renders a Go Home link pointing to /', () => {
        render(<NotFound />);
        const homeLink = screen.getByRole('link', { name: /go home/i });
        expect(homeLink).toBeInTheDocument();
        expect(homeLink).toHaveAttribute('href', '/');
    });

    it('renders a Go Back button', () => {
        render(<NotFound />);
        const backBtn = screen.getByRole('button', { name: /go back/i });
        expect(backBtn).toBeInTheDocument();
    });

    it('renders quick navigation links', () => {
        render(<NotFound />);
        expect(screen.getByText('Marketplace')).toBeInTheDocument();
        expect(screen.getByText('Campaigns')).toBeInTheDocument();
        expect(screen.getByText('Pricing')).toBeInTheDocument();
    });

    it('quick links have correct hrefs', () => {
        render(<NotFound />);
        const marketplace = screen.getByRole('link', { name: /marketplace/i });
        const campaigns = screen.getByRole('link', { name: /campaigns/i });
        const pricing = screen.getByRole('link', { name: /pricing/i });
        expect(marketplace).toHaveAttribute('href', '/marketplace');
        expect(campaigns).toHaveAttribute('href', '/campaigns');
        expect(pricing).toHaveAttribute('href', '/pricing');
    });
});
