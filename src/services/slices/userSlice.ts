import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '../../utils/types';
import {
  TLoginData,
  TRegisterData,
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi
} from '../../utils/burger-api';
import { setCookie, deleteCookie } from '../../utils/cookie';
import type { RootState } from '../store';

export interface UserState {
  user: TUser | null;
  isAuthenticated: boolean;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
}

export const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

export const loginUser = createAsyncThunk(
  'user/login',
  async (loginData: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(loginData);
      if (response.success) {
        setCookie('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        return response.user;
      }
      return rejectWithValue('Login failed');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (registerData: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(registerData);
      if (response.success) {
        setCookie('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        return response.user;
      }
      return rejectWithValue('Registration failed');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getUser = createAsyncThunk(
  'user/get',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      if (response.success) {
        return response.user;
      }
      return rejectWithValue('Failed to get user');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (userData: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(userData);
      if (response.success) {
        return response.user;
      }
      return rejectWithValue('Update failed');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const logout = createAsyncThunk(
  'user/logout',
  async (_, { dispatch }) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      dispatch(userSlice.actions.clearUser());
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await forgotPasswordApi({ email });
      if (response.success) {
        return response;
      }
      return rejectWithValue('Forgot password request failed');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (
    { password, token }: { password: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await resetPasswordApi({ password, token });
      if (response.success) {
        return response;
      }
      return rejectWithValue('Reset password failed');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAuthChecked = true;
      state.error = null;
    },
    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(getUser.rejected, (state) => {
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearUser, setAuthChecked } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;
export const selectUserLoading = (state: RootState) => state.user.isLoading;
export const selectUserError = (state: RootState) => state.user.error;

export default userSlice.reducer;
