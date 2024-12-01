import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react'; // Make sure you use act from 'react'
import LoginRegister from './Components/LoginRegister'; // Import your component correctly

describe('Login Page', () => {
  beforeEach(() => {
    render(<LoginRegister />);
  });

  it('renders the form elements correctly', () => {
    // Check for form elements to be present
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Paswoord')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log in/i })).toBeInTheDocument();
  });

  it('submits the form with entered credentials', async () => {
    const mockHandleSubmit = jest.fn();
    // Assume LoginRegister has an onSubmit prop (adjust this according to your implementation)
    render(<LoginRegister onSubmit={mockHandleSubmit} />);

    // Wrap in `act` to ensure state updates are flushed
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByPlaceholderText('Paswoord'), { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('button', { name: /Log in/i }));
    });

    // Assert form submission occurred
    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
  });

  it('displays an error message for invalid input', () => {
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: '' } });
    fireEvent.change(screen.getByPlaceholderText('Paswoord'), { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

    // Adjust this assertion based on your actual validation logic and UI message
    expect(screen.getByText(/Please fill out this field/i)).toBeInTheDocument();
  });
});