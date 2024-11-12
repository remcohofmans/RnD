import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import LoginRegister from './LoginRegister'; // Adjust the path if necessary

describe('LoginRegister Component', () => {
  const mockLoginWithEmail = jest.fn();
  const mockSignUpWithEmail = jest.fn();

  beforeEach(() => {
    render(
      <LoginRegister
        loginWithEmail={mockLoginWithEmail}
        signUpWithEmail={mockSignUpWithEmail}
      />
    );
  });

  test('renders the login form by default', () => {
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Paswoord')).toBeInTheDocument();
  });

  test('toggles to registration form', () => {
    act(() => {
      fireEvent.click(screen.getByText('Registreer hier'));
    });
    expect(screen.getByText('Registreer')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Bevestig Paswoord')).toBeInTheDocument();
  });

  test('submits login form', () => {
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Paswoord'), { target: { value: 'password123' } });
    fireEvent.submit(screen.getByText('Login'));
    expect(mockLoginWithEmail).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  test('submits registration form with matching passwords', () => {
    act(() => {
      fireEvent.click(screen.getByText('Registreer hier'));
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Paswoord'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Bevestig Paswoord'), { target: { value: 'password123' } });
    fireEvent.submit(screen.getByText('Registreer'));
    expect(mockSignUpWithEmail).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  test('does not submit registration form with non-matching passwords', () => {
    act(() => {
      fireEvent.click(screen.getByText('Registreer hier'));
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Paswoord'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Bevestig Paswoord'), { target: { value: 'password456' } });
    fireEvent.submit(screen.getByText('Registreer'));
    expect(mockSignUpWithEmail).not.toHaveBeenCalled();
  });
});
