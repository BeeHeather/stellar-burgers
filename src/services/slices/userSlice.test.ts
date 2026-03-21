/// <reference types="jest" />

import userReducer, {
  loginUser,
  registerUser,
  getUser,
  updateUser,
  forgotPassword,
  resetPassword,
  clearUser,
  setAuthChecked,
  initialState
} from './userSlice';
import { TUser } from '@utils-types';

describe('user slice', () => {
  const mockUser: TUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  describe('loginUser', () => {
    it('pending: isLoading=true, error=null', () => {
      const action = { type: loginUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled: user set, isAuthenticated=true, isAuthChecked=true, isLoading=false', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer({ ...initialState, isLoading: true }, action);

      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('rejected: error set, isLoading=false', () => {
      const errorMessage = 'Login failed';
      const action = {
        type: loginUser.rejected.type,
        payload: errorMessage
      };
      const state = userReducer({ ...initialState, isLoading: true }, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('registerUser', () => {
    it('pending: isLoading=true, error=null', () => {
      const action = { type: registerUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled: user set, isAuthenticated=true, isAuthChecked=true, isLoading=false', () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer({ ...initialState, isLoading: true }, action);

      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('rejected: error set, isLoading=false', () => {
      const errorMessage = 'Registration failed';
      const action = {
        type: registerUser.rejected.type,
        payload: errorMessage
      };
      const state = userReducer({ ...initialState, isLoading: true }, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('getUser', () => {
    it('pending: isLoading=true', () => {
      const action = { type: getUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });

    it('fulfilled: user set, isAuthenticated=true, isAuthChecked=true, isLoading=false', () => {
      const action = {
        type: getUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer({ ...initialState, isLoading: true }, action);

      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('rejected: isAuthChecked=true, isLoading=false', () => {
      const action = { type: getUser.rejected.type };
      const state = userReducer({ ...initialState, isLoading: true }, action);

      expect(state.isAuthChecked).toBe(true);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('updateUser', () => {
    it('pending: isLoading=true, error=null', () => {
      const action = { type: updateUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled: user updated, isLoading=false, error=null', () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      const action = {
        type: updateUser.fulfilled.type,
        payload: updatedUser
      };
      const state = userReducer(
        { ...initialState, isLoading: true, user: mockUser },
        action
      );

      expect(state.user).toEqual(updatedUser);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('rejected: error set, isLoading=false', () => {
      const errorMessage = 'Update failed';
      const action = {
        type: updateUser.rejected.type,
        payload: errorMessage
      };
      const state = userReducer({ ...initialState, isLoading: true }, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('forgotPassword', () => {
    it('pending: isLoading=true, error=null', () => {
      const action = { type: forgotPassword.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled: isLoading=false, error=null', () => {
      const action = { type: forgotPassword.fulfilled.type };
      const state = userReducer({ ...initialState, isLoading: true }, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('rejected: error set, isLoading=false', () => {
      const errorMessage = 'Forgot password request failed';
      const action = {
        type: forgotPassword.rejected.type,
        payload: errorMessage
      };
      const state = userReducer({ ...initialState, isLoading: true }, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('resetPassword', () => {
    it('pending: isLoading=true, error=null', () => {
      const action = { type: resetPassword.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled: isLoading=false, error=null', () => {
      const action = { type: resetPassword.fulfilled.type };
      const state = userReducer({ ...initialState, isLoading: true }, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('rejected: error set, isLoading=false', () => {
      const errorMessage = 'Reset password failed';
      const action = {
        type: resetPassword.rejected.type,
        payload: errorMessage
      };
      const state = userReducer({ ...initialState, isLoading: true }, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('clearUser', () => {
    it('clears user data and sets isAuthChecked=true', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        isAuthenticated: true,
        isAuthChecked: true,
        error: 'Some error'
      };

      const state = userReducer(stateWithUser, clearUser());

      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('setAuthChecked', () => {
    it('sets isAuthChecked=true', () => {
      const state = userReducer(
        { ...initialState, isAuthChecked: false },
        setAuthChecked()
      );

      expect(state.isAuthChecked).toBe(true);
    });
  });
});
