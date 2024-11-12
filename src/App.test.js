import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginRegister from './Components/LoginRegister';
import '@testing-library/jest-dom/extend-expect';

const mockLogin = jest.fn();
const mockSignUp = jest.fn();

describe('LoginRegister Component', () => {
  beforeEach(() => {
    render(<LoginRegister loginWithEmail={mockLogin} signUpWithEmail={mockSignUp} />);
  });

  test('renders login form by default', () => {
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Paswoord')).toBeInTheDocument();
  });

  test('switches to registration form when clicking "Registreer hier"', () => {
    fireEvent.click(screen.getByText(/registreer hier/i));
    expect(screen.getByRole('button', { name: /registreer/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Bevestig Paswoord')).toBeInTheDocument();
  });

  test('calls login function with correct inputs', () => {
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Paswoord'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  test('shows error when login form is submitted with empty fields', () => {
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    expect(screen.getByText('Please provide both email and password.')).toBeInTheDocument();
  });

  test('handles invalid email input for login', () => {
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'invalidemail' } });
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
  });

  test('calls sign up function with correct inputs', () => {
    fireEvent.click(screen.getByText(/registreer hier/i));
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'signup@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Paswoord'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Bevestig Paswoord'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('checkbox', { name: /terms/i }));
    fireEvent.click(screen.getByRole('button', { name: /registreer/i }));

    expect(mockSignUp).toHaveBeenCalledWith('signup@example.com', 'password123');
  });

  test('shows error if passwords do not match during registration', () => {
    fireEvent.click(screen.getByText(/registreer hier/i));
    fireEvent.change(screen.getByPlaceholderText('Paswoord'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Bevestig Paswoord'), { target: { value: 'password456' } });
    fireEvent.blur(screen.getByPlaceholderText('Bevestig Paswoord'));

    expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
  });

  test('disables registration button if terms are not agreed', () => {
    fireEvent.click(screen.getByText(/registreer hier/i));
    expect(screen.getByRole('button', { name: /registreer/i })).toBeDisabled();
  });

  test('shows terms modal when terms link is clicked', () => {
    fireEvent.click(screen.getByText(/registreer hier/i));
    fireEvent.click(screen.getByText(/terms and conditions/i));

    expect(screen.getByText('Algemene Voorwaarden')).toBeInTheDocument();
  });
});
