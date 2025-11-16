import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAuthToken } from '../../hooks/auth/useAuthToken';
import { AllTheProviders } from '../test-utils';

describe('useAuthToken Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('returns null when no token exists', () => {
    const { result } = renderHook(() => useAuthToken(), {
      wrapper: AllTheProviders
    });
    const token = result.current.getAccessToken();
    expect(token === null || token === undefined).toBe(true);
  });

  it('retrieves access token from localStorage', () => {
    const mockToken = 'test-token-123';
    localStorage.setItem('access_token', mockToken);
    
    const { result } = renderHook(() => useAuthToken(), {
      wrapper: AllTheProviders
    });
    expect(result.current.getAccessToken()).toBe(mockToken);
  });

  it('checks if user is teacher', () => {
    const { result } = renderHook(() => useAuthToken(), {
      wrapper: AllTheProviders
    });
    expect(typeof result.current.isTeacher()).toBe('boolean');
  });

  it('checks if user is student', () => {
    const { result } = renderHook(() => useAuthToken(), {
      wrapper: AllTheProviders
    });
    expect(typeof result.current.isStudent()).toBe('boolean');
  });

  it('parses JWT token correctly', () => {
    const { result } = renderHook(() => useAuthToken(), {
      wrapper: AllTheProviders
    });
    
    // Token de ejemplo (estructura básica)
    const mockJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const parsed = result.current.parseJwt(mockJwt);
    
    expect(parsed).toBeTruthy();
    expect(parsed?.name).toBe('John Doe');
  });
});
