import { render, screen, fireEvent } from '@testing-library/react';
import LoginRegister from './Components/LoginRegister'; // Replace with the actual component's import

describe('Login Page', () => {
  beforeEach(() => {
    render(<LoginRegister />);
  });

  it('renders the form elements correctly', () => {
    // Check for form elements
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Paswoord')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log in/i })).toBeInTheDocument();
  });

  it('submits the form with entered credentials', () => {
    // Mock a function for form submission (you may have to adjust based on your implementation)
    const mockHandleSubmit = jest.fn();

    // Assuming form submission triggers this function
    render(<LoginRegister onSubmit={mockHandleSubmit} />);

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Paswoord'), { target: { value: 'password123' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

    // Ensure the form submission function was called
    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
  });

  it('displays an error message for invalid input', () => {
    // Simulate invalid form submission
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: '' } });
    fireEvent.change(screen.getByPlaceholderText('Paswoord'), { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

    // Expect some kind of error message (adjust based on actual error handling)
    expect(screen.getByText(/Please fill out this field/i)).toBeInTheDocument();
  });
});
