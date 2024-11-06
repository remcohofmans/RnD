// App.test.js

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
    // Use getByRole for the button to avoid ambiguity
    expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /sign up/i })).not.toBeInTheDocument();
  });

  test('switches to sign up form when "Sign up" is clicked', () => {
    fireEvent.click(screen.getByRole('link', { name: /sign up/i })); 
    expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /log in/i })).not.toBeInTheDocument();
  });

  test('handles login form submission', () => {
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  test('shows error if login fields are empty', () => {
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(mockLogin).not.toHaveBeenCalled();
  });

  test('handles sign up form submission', () => {
    fireEvent.click(screen.getByRole('link', { name: /sign up/i }));
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/choose your nearest facility/i), { target: { value: 'facility1' } });
    fireEvent.click(screen.getByLabelText(/i agree to the/i));

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  test('shows error if sign up fields are empty or terms not agreed', () => {
    fireEvent.click(screen.getByRole('link', { name: /sign up/i }));
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(mockSignUp).not.toHaveBeenCalled();
  });

  test('opens terms modal when terms link is clicked', () => {
    fireEvent.click(screen.getByRole('link', { name: /sign up/i }));
    fireEvent.click(screen.getByRole('link', { name: /terms and conditions/i }));

    expect(screen.getByRole('heading', { name: /terms and conditions/i })).toBeInTheDocument();
  });

  test('closes terms modal when close button is clicked', () => {
    fireEvent.click(screen.getByRole('link', { name: /sign up/i }));
    fireEvent.click(screen.getByRole('link', { name: /terms and conditions/i }));
    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    expect(screen.queryByRole('heading', { name: /terms and conditions/i })).not.toBeInTheDocument();
  });
});
