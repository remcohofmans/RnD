import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginRegister from './Components/LoginRegister';

// Mock functions for login and signup
const mockLoginWithEmail = jest.fn();
const mockSignUpWithEmail = jest.fn();

describe('LoginRegister Component', () => {
  beforeEach(() => {
    render(
      <LoginRegister
        loginWithEmail={mockLoginWithEmail}
        signUpWithEmail={mockSignUpWithEmail}
      />
    );
  });

  test('renders login form initially', () => {
    expect(screen.getByText('Welkom!')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Paswoord')).toBeInTheDocument();
    expect(screen.getByText('Log in')).toBeInTheDocument();
  });

  test('toggles to registration form', () => {
    fireEvent.click(screen.getByText('Registreer hier'));
    expect(screen.getByText('Registreer')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Bevestig Paswoord')).toBeInTheDocument();
    expect(screen.getByText('Registreer')).toBeInTheDocument();
  });

  test('displays error when login form is submitted without credentials', () => {
    fireEvent.click(screen.getByText('Log in'));
    expect(mockLoginWithEmail).not.toHaveBeenCalled();
    expect(screen.getByText('Please provide both email and password.')).toBeInTheDocument();
  });

  test('validates email input during registration', () => {
    fireEvent.click(screen.getByText('Registreer hier'));
    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(screen.queryByText('Please enter a valid email address.')).not.toBeInTheDocument();
  });

  test('validates password and confirm password during registration', () => {
    fireEvent.click(screen.getByText('Registreer hier'));
    const passwordInput = screen.getByPlaceholderText('Paswoord');
    const confirmPasswordInput = screen.getByPlaceholderText('Bevestig Paswoord');

    fireEvent.change(passwordInput, { target: { value: 'short' } });
    expect(screen.getByText('Password must be at least 6 characters long.')).toBeInTheDocument();

    fireEvent.change(passwordInput, { target: { value: 'longenoughpassword' } });
    expect(screen.queryByText('Password must be at least 6 characters long.')).not.toBeInTheDocument();

    fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } });
    expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();

    fireEvent.change(confirmPasswordInput, { target: { value: 'longenoughpassword' } });
    expect(screen.queryByText('Passwords do not match.')).not.toBeInTheDocument();
  });

  test('submits registration form with valid data', () => {
    fireEvent.click(screen.getByText('Registreer hier'));
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Paswoord'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Bevestig Paswoord'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByLabelText(/Ik ga akkoord met de/i));
    fireEvent.click(screen.getByText('Registreer'));

    expect(mockSignUpWithEmail).toHaveBeenCalledWith('test@example.com', 'password123');
  });
});
