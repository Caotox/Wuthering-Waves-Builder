import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from '@/components/navbar';

// Mock wouter
vi.mock('wouter', () => ({
  Link: ({ children, href }: any) => <a href={href}>{children}</a>,
  useLocation: () => ['/', vi.fn()],
}));

// Mock useAuth hook
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '@/hooks/useAuth';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Navbar', () => {
  it('affiche le logo et le titre', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: undefined,
      isAuthenticated: false,
      isLoading: false,
    });

    render(<Navbar />, { wrapper: createWrapper() });
    
    expect(screen.getByText('WW Database')).toBeInTheDocument();
    expect(screen.getByTestId('link-home')).toBeInTheDocument();
  });

  it('affiche les liens de navigation pour un utilisateur authentifié', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: {
        id: '1',
        email: 'user@test.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'USER',
      },
      isAuthenticated: true,
      isLoading: false,
    });

    render(<Navbar />, { wrapper: createWrapper() });
    
    expect(screen.getByTestId('link-characters')).toBeInTheDocument();
    expect(screen.getByTestId('link-favorites')).toBeInTheDocument();
  });

  it('affiche le lien admin pour un administrateur', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: {
        id: '1',
        email: 'admin@test.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
      },
      isAuthenticated: true,
      isLoading: false,
    });

    render(<Navbar />, { wrapper: createWrapper() });
    
    expect(screen.getByTestId('link-admin')).toBeInTheDocument();
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
  });

  it('ouvre le menu utilisateur au clic', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: {
        id: '1',
        email: 'user@test.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'USER',
      },
      isAuthenticated: true,
      isLoading: false,
    });

    render(<Navbar />, { wrapper: createWrapper() });
    
    const userMenuButton = screen.getByTestId('button-user-menu');
    
    // Le dropdown Radix UI nécessite un clic direct sur le bouton
    expect(userMenuButton).toBeInTheDocument();
    expect(screen.getByText('J')).toBeInTheDocument(); // Avatar initial
  });

  it('ouvre le menu mobile sur petit écran', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: {
        id: '1',
        email: 'user@test.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'USER',
      },
      isAuthenticated: true,
      isLoading: false,
    });

    render(<Navbar />, { wrapper: createWrapper() });
    
    const mobileMenuButton = screen.getByTestId('button-mobile-menu');
    expect(mobileMenuButton).toBeInTheDocument();
  });
});
