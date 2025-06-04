import { getToken, saveToken } from './api.js';
import { updateNavbar } from '../utils/index.js';

// Simpan data user ke localStorage
const saveUser = (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
};

// Dapatkan data user dari localStorage
const getUser = () => {
  return JSON.parse(localStorage.getItem('user')) || null;
};

// Cek status login
const isLoggedIn = () => {
  return !!getToken();
};

// Proses logout
const logout = () => {
  saveToken(null);
  saveUser(null);
  updateNavbar(false);
  window.location.hash = '#/'; // Redirect ke halaman awal
};

// Proses setelah login berhasil
const handleLoginSuccess = (responseData) => {
  saveToken(responseData.loginResult.token);
  saveUser({
    name: responseData.loginResult.name,
  });
  updateNavbar(true, getUser());
};

export { 
  isLoggedIn, 
  getUser, 
  logout, 
  handleLoginSuccess 
};