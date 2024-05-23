import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({ notificationsEnabled: false });

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    loadUser();
  }, []);

  const login = async (username) => {
    const user = { username };
    setUser(user);
    await AsyncStorage.setItem('user', JSON.stringify(user));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  const toggleNotifications = () => {
    setSettings(prevSettings => ({
      ...prevSettings,
      notificationsEnabled: !prevSettings.notificationsEnabled
    }));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, settings, toggleNotifications }}>
      {children}
    </AuthContext.Provider>
  );
};
