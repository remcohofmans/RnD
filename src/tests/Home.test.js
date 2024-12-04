import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // Direct import
import { motion } from 'framer-motion';
import Home from '../Components/Home';
import { supabase } from '../lib/helper/supabaseClient';
import { useAuth } from '../hooks/AuthContext';
import { useAnalytics } from '../hooks/analyticsContext';

// Mock the entire react-router-dom module
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../hooks/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../hooks/analyticsContext', () => ({
  useAnalytics: jest.fn(),
}));

jest.mock('../lib/helper/supabaseClient', () => ({
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(),
      })),
    })),
    update: jest.fn(() => ({
      eq: jest.fn(() => ({ error: null })),
    })),
  })),
}));

describe('Home Component', () => {
  const mockTrack = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mocks
    useNavigate.mockReturnValue(mockNavigate);

    useAuth.mockReturnValue({
      user: { email: 'testuser@example.com' },
      role: 'USER',
      checkSubscription: jest.fn(),
    });

    useAnalytics.mockReturnValue({
      track: mockTrack,
    });
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

  test('renders the hero section with the correct content', () => {
    renderComponent();

  // Check if "V(l)inder" is rendered as a header
  const header = screen.getByRole('heading', { name: 'V(l)inder' });
  expect(header).toBeInTheDocument();    
  expect(
      screen.getByText(
        'Ontdek verbindingen die je leven verrijken - of het nu gaat om liefde, vriendschap of avontuur!'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Ontdek Matches')).toBeInTheDocument();
  });

  // ... (rest of the tests remain the same as in the previous version)
});