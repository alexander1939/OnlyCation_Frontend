import { describe, it, expect } from 'vitest';
import { screen, render } from '../test-utils';
import Header from '../../components/ui/Header';

describe('Header Component', () => {
  it('renders header with logo', () => {
    render(<Header />);
    
    const logo = screen.getByAltText(/logo/i);
    expect(logo).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Header />);
    
    expect(screen.getByText(/inicio/i)).toBeInTheDocument();
  });
});
