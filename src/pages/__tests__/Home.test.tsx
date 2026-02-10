import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/helpers';
import { Home } from '../Home';

describe('Home Page', () => {
    it('renders the hero section with platform name', () => {
        render(<Home />);
        expect(screen.getByText(/Netfluenz/i)).toBeInTheDocument();
    });

    it('renders feature cards', () => {
        render(<Home />);
        // The home page should have multiple feature sections
        const cards = document.querySelectorAll('.glass-card, .glass-card-hover');
        expect(cards.length).toBeGreaterThan(0);
    });

    it('renders call-to-action buttons', () => {
        render(<Home />);
        const buttons = screen.getAllByRole('button');
        // We expect at least the "I'm an Influencer" and "I'm a Brand" buttons
        expect(buttons.length).toBeGreaterThanOrEqual(2);
        expect(screen.getByText(/i'm an influencer/i)).toBeInTheDocument();
        expect(screen.getByText(/i'm a brand/i)).toBeInTheDocument();
    });

    it('renders stats section', () => {
        render(<Home />);
        // Check for stat-related content (numbers/metrics)
        const statElements = document.querySelectorAll('.glass-card');
        expect(statElements.length).toBeGreaterThanOrEqual(1);
    });
});
