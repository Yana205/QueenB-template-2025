// Authentication service for QueenB frontend
// Supports both JWT tokens and basic email/password for development

class AuthService {
  constructor() {
    this.baseURL = '/api';
    this.tokenKey = 'queenb_token';
    this.userKey = 'queenb_user';
  }

  // Store JWT token in localStorage
  setToken(token) {
    localStorage.setItem(this.tokenKey, token);
  }

  // Get JWT token from localStorage
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  // Remove JWT token from localStorage
  removeToken() {
    localStorage.removeItem(this.tokenKey);
  }

  // Store user data in localStorage
  setUser(user) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  // Get user data from localStorage
  getUser() {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  // Remove user data from localStorage
  removeUser() {
    localStorage.removeItem(this.userKey);
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }

  // JWT Authentication - Login with email/password
  async loginWithJWT(email, password, userType) {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, userType }),
      });

      const data = await response.json();

      if (data.success) {
        this.setToken(data.data.token);
        this.setUser(data.data.user);
        return { success: true, user: data.data.user, token: data.data.token };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('JWT Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }

  // Basic Authentication - Fallback for development
  async loginWithBasic(email, password, userType) {
    try {
      // Fetch users from the appropriate endpoint
      const endpoint = userType === 'mentor' ? '/mentors' : '/mentees';
      const response = await fetch(`${this.baseURL}${endpoint}`);
      const data = await response.json();

      if (data.success) {
        // Find user with matching email and password
        const user = data.data.find(user => 
          user.email === email && user.password === password
        );

        if (user) {
          // Create a simple token for basic auth
          const basicToken = btoa(`${user._id}:${userType}:${Date.now()}`);
          this.setToken(basicToken);
          this.setUser(user);
          return { success: true, user, token: basicToken };
        } else {
          return { success: false, error: 'Invalid email or password' };
        }
      } else {
        return { success: false, error: 'Failed to fetch user data' };
      }
    } catch (error) {
      console.error('Basic Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }

  // Unified login method - tries JWT first, falls back to basic auth
  async login(email, password, userType) {
    // Try JWT authentication first
    const jwtResult = await this.loginWithJWT(email, password, userType);
    
    if (jwtResult.success) {
      return jwtResult;
    }

    // If JWT fails, try basic authentication (for development)
    console.log('JWT login failed, trying basic authentication...');
    return await this.loginWithBasic(email, password, userType);
  }

  // Logout
  logout() {
    this.removeToken();
    this.removeUser();
  }

  // Get authenticated user profile
  async getProfile() {
    const token = this.getToken();
    if (!token) {
      return { success: false, error: 'No authentication token' };
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      return { success: false, error: 'Failed to get profile' };
    }
  }

  // Register new user
  async register(userData) {
    try {
      const response = await fetch(`${this.baseURL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        this.setToken(data.data.token);
        this.setUser(data.data.user);
        return { success: true, user: data.data.user, token: data.data.token };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;
