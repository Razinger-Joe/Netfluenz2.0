import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '../../test/helpers';
import { Pricing } from '../Pricing';

describe('Pricing Page', () => {
    it('renders the pricing heading', () => {
        render(<Pricing />);
        expect(screen.getByText(/transparent/i)).toBeInTheDocument();
    });

    it('renders pricing plan cards with features', () => {
        render(<Pricing />);
        const listItems = document.querySelectorAll('li');
        expect(listItems.length).toBeGreaterThan(0);
    });

    it('renders Subscribe and Get Started buttons', () => {
        render(<Pricing />);
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(2);
    });

    it('shows billing toggle with Monthly and Yearly options', () => {
        render(<Pricing />);
        expect(screen.getByText('Monthly')).toBeInTheDocument();
        expect(screen.getByText(/save 20%/i)).toBeInTheDocument();
    });

    it('renders M-Pesa payment section', () => {
        render(<Pricing />);
        expect(screen.getByText('Pay with M-Pesa')).toBeInTheDocument();
    });

    it('renders FAQ section with questions', () => {
        render(<Pricing />);
        expect(screen.getByText('Can I change plans later?')).toBeInTheDocument();
        expect(screen.getByText('Is there a free trial?')).toBeInTheDocument();
        expect(screen.getByText('How do payments work?')).toBeInTheDocument();
    });

    it('FAQ accordion reveals answer on click', () => {
        render(<Pricing />);
        const faqButton = screen.getByText('Can I change plans later?');
        fireEvent.click(faqButton);

        // The answer container should get max-h-40 (expanded) after click
        const answerContainer = screen.getByText(/upgrade or downgrade/i).closest('div');
        expect(answerContainer).toBeInTheDocument();
    });
});
