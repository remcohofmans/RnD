import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginRegister from '../Components/Auth/LoginRegister';


// Mock supabase and react-router-dom
jest.mock('../lib/helper/supabaseClient', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
  },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const mockLoginWithEmail = jest.fn();
const mockSignUpWithEmail = jest.fn();

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <LoginRegister
        loginWithEmail={mockLoginWithEmail}
        signUpWithEmail={mockSignUpWithEmail}
      />
    </BrowserRouter>
  );
};

describe('LoginRegister Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form by default', () => {
    renderComponent();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Wachtwoord')).toBeInTheDocument();
    expect(screen.getByText('Log in')).toBeInTheDocument();
  });

  test('switches to registration form', () => {
    renderComponent();
    const registerLink = screen.getByText('Registreer hier');
    fireEvent.click(registerLink);

    expect(screen.getByPlaceholderText('Wachtwoord')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Bevestig Wachtwoord')).toBeInTheDocument();
    expect(screen.getByText('Selecteer jouw faciliteit')).toBeInTheDocument();
  });

  test('validates email input', () => {
    renderComponent();
    const emailInput = screen.getByPlaceholderText('Email');

    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
    expect(screen.getByText('Voer een geldig e-mailadres in.')).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });
    expect(screen.queryByText('Voer een geldig e-mailadres in.')).not.toBeInTheDocument();
  });

  test('validates password length', () => {
    renderComponent();
    const passwordInput = screen.getByPlaceholderText('Wachtwoord');

    fireEvent.change(passwordInput, { target: { value: '12345' } });
    expect(screen.getByText('Wachtwoord moet minstens 6 tekens lang zijn.')).toBeInTheDocument();

    fireEvent.change(passwordInput, { target: { value: '123456' } });
    expect(screen.queryByText('Wachtwoord moet minstens 6 tekens lang zijn.')).not.toBeInTheDocument();
  });

  test('handles login submission', async () => {
    mockLoginWithEmail.mockResolvedValue({ success: true, user: {} });

    renderComponent();

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Wachtwoord');
    const loginButton = screen.getByText('Log in');

    fireEvent.change(emailInput, { target: { value: 'test@email.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockLoginWithEmail).toHaveBeenCalledWith('test@email.com', 'password123');
    });
  });

  test('disable registreer button until all information is provided', async () => {
    renderComponent();

    // Switch to registration form
    const registerLink = screen.getByText('Registreer hier');
    fireEvent.click(registerLink);

    // Fill out text fields
    const passwordInput = screen.getByPlaceholderText('Wachtwoord');
    const confirmPasswordInput = screen.getByPlaceholderText('Bevestig Wachtwoord');

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    // Add facility code
    fireEvent.change(screen.getByPlaceholderText('Faciliteitscode'), { target: { value: '12345' } });

    // Select the checkboxes for Terms & Conditions and Privacy Policy
    const termsCheckbox = screen.getByLabelText(/Ik ga akkoord met de Terms and Conditions/i);
    const privacyCheckbox = screen.getByLabelText(/Ik ga akkoord met de Privacy Policy/i);

    // Check the checkboxes
    fireEvent.click(termsCheckbox);
    fireEvent.click(privacyCheckbox);

    // Check if the submit button is enabled after agreement
    const submitButton = screen.getByRole('button', { name: 'Registreer' });
    expect(submitButton).toBeDisabled();
  });

  describe('LoginRegister sign up Functionality', () => {
    beforeEach(() => {
      mockLoginWithEmail.mockClear();
      mockSignUpWithEmail.mockClear();
    });
  
    // Switch to signup form before each test
    const switchToSignup = (container) => {
      const signupLink = screen.getByText(/Registreer hier/i);
      fireEvent.click(signupLink);
    };
  
    test('renders signup form when switching from login', () => {
      renderComponent();
      switchToSignup();
      
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Wachtwoord')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Bevestig Wachtwoord')).toBeInTheDocument();
    });
  
    test('validates email format', () => {
      renderComponent();
      switchToSignup();
  
      const emailInput = screen.getByPlaceholderText('Email');
      
      fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
      expect(screen.getByText('Voer een geldig e-mailadres in.')).toBeInTheDocument();
  
      fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });
      expect(screen.queryByText('Voer een geldig e-mailadres in.')).toBeNull();
    });
  
    test('password validation', () => {
      renderComponent();
      switchToSignup();
  
      const passwordInput = screen.getByPlaceholderText('Wachtwoord');
      const confirmPasswordInput = screen.getByPlaceholderText('Bevestig Wachtwoord');
  
      fireEvent.change(passwordInput, { target: { value: 'short' } });
      expect(screen.getByText('Wachtwoord moet minstens 6 tekens lang zijn.')).toBeInTheDocument();
  
      fireEvent.change(passwordInput, { target: { value: 'validpassword' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } });
      
      expect(screen.queryByText('De wachtwoorden zijn een match!')).toBeNull();
    });
  
    test('requires facility selection and code', () => {
      renderComponent();
      switchToSignup();
  
      // Fill in basic signup info
      fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByPlaceholderText('Wachtwoord'), { target: { value: 'validpassword' } });
      fireEvent.change(screen.getByPlaceholderText('Bevestig Wachtwoord'), { target: { value: 'validpassword' } });
  
      // Check signup button is disabled without facility selection
      const signupButton = screen.getByRole('button', { name: 'Registreer' });
      expect(signupButton).toBeDisabled();
  
      // Select a facility
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Bloemetje' } });
  
      // Fill facility code
      fireEvent.change(screen.getByPlaceholderText('Faciliteitscode'), { target: { value: '12345' } });
  
      // Check terms and privacy checkboxes
      const termsCheckbox = screen.getByLabelText(/Ik ga akkoord met de Terms and Conditions/i);
      const privacyCheckbox = screen.getByLabelText(/Ik ga akkoord met de Privacy Policy/i);
      
      fireEvent.click(termsCheckbox);
      fireEvent.click(privacyCheckbox);
  
      // Signup button should now be enabled
      expect(signupButton).toBeEnabled();
    });
  
    test('mentor sign up flow', async () => {

      mockSignUpWithEmail.mockResolvedValue({ success: true });

      renderComponent();
      switchToSignup();
  
      // Select mentor checkbox
      const mentorCheckbox = screen.getByLabelText(/Ik ben een mentor/i);
      fireEvent.click(mentorCheckbox);
  
      // Fill in signup details
      fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'mentor@example.com' } });
      fireEvent.change(screen.getByPlaceholderText('Wachtwoord'), { target: { value: 'validpassword' } });
      fireEvent.change(screen.getByPlaceholderText('Bevestig Wachtwoord'), { target: { value: 'validpassword' } });
      fireEvent.change(screen.getByPlaceholderText('Mentorcode'), { target: { value: 'MENTOR01' } });
  
      // Select facility
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Bloemetje' } });
  
      // Check terms and privacy checkboxes
      const termsCheckbox = screen.getByLabelText(/Ik ga akkoord met de Terms and Conditions/i);
      const privacyCheckbox = screen.getByLabelText(/Ik ga akkoord met de Privacy Policy/i);
      
      fireEvent.click(termsCheckbox);
      fireEvent.click(privacyCheckbox);
  
      // Submit signup
      const signupButton = screen.getByRole('button', { name: 'Registreer' });
      fireEvent.click(signupButton);
  
      // Verify signup function was called
      await waitFor(() => {
        expect(mockSignUpWithEmail).toHaveBeenCalledWith(
          'mentor@example.com', 
          'validpassword', 
          true, 
          'Bloemetje'
        );
      });
    });
  });
});