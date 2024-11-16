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
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });
});
