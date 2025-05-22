import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../data/mockData';

export type UserRole = 'admin' | 'veterinarian' | 'assistant' | 'client';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  password: string;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateUser: (user: User) => void;
  users: User[];
  updateUserRole: (userId: number, role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);

  // Load user data from localStorage if available
  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    const storedCurrentUser = localStorage.getItem('currentUser');
    
    if (storedUsers) setUsers(JSON.parse(storedUsers));
    
    if (storedCurrentUser) {
      const user = JSON.parse(storedCurrentUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
      setRole(user.role);
    }
  }, []);

  // Save user data to localStorage when changed
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [users, currentUser]);

  const login = (email: string, password: string) => {
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      setRole(user.role);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setRole(null);
  };

  const updateUser = (user: User) => {
    setUsers(users.map(u => u.id === user.id ? user : u));
    
    if (currentUser && currentUser.id === user.id) {
      setCurrentUser(user);
      setRole(user.role);
    }
  };

  const updateUserRole = (userId: number, newRole: UserRole) => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, role: newRole } 
        : u
    ));

    // Update current user if their role is changed
    if (currentUser && currentUser.id === userId) {
      setCurrentUser({ ...currentUser, role: newRole });
      setRole(newRole);
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated,
      role,
      login,
      logout,
      updateUser,
      users,
      updateUserRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};