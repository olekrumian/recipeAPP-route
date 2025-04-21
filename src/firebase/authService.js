import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { app } from './config';

const auth = getAuth(app);

export const authService = {
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      throw new Error('Невірний email або пароль');
    }
  },

  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error('Помилка при виході');
    }
  },

  getCurrentUser() {
    return auth.currentUser;
  },
};
