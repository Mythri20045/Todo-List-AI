import { User } from '../types';

class AuthService {
  private readonly USERS_KEY = 'smart-todo-users';
  private readonly CURRENT_USER_KEY = 'smart-todo-current-user';

  // Demo users for testing
  private demoUsers = [
    { id: '1', email: 'demo@smarttodo.ai', password: 'demo123', name: 'Demo User' },
    { id: '2', email: 'admin@smarttodo.ai', password: 'admin123', name: 'Admin User' },
    { id: '3', email: 'user@example.com', password: 'password', name: 'John Doe' }
  ];

  constructor() {
    // Initialize demo users if not exists
    const users = localStorage.getItem(this.USERS_KEY);
    if (!users) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(this.demoUsers));
    }
  }

  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const users = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (user) {
      const userWithoutPassword = {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      return { success: true, user: userWithoutPassword };
    }

    return { success: false, error: 'Invalid email or password' };
  }

  async register(email: string, password: string, name: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const users = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    const existingUser = users.find((u: any) => u.email === email);

    if (existingUser) {
      return { success: false, error: 'User with this email already exists' };
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

    const userWithoutPassword = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      createdAt: newUser.createdAt
    };

    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    return { success: true, user: userWithoutPassword };
  }

  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem(this.CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}

export const authService = new AuthService();