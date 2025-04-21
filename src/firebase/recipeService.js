import {
  collection,
  deleteDoc,
  disableNetwork,
  doc,
  enableNetwork,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { db } from './config.js';

const COLLECTION_NAME = 'recipes';
let cachedRecipes = null;

export const recipeService = {
  // Отримати всі рецепти
  async getAllRecipes() {
    try {
      // Повернути кешовані дані, якщо вони є
      if (cachedRecipes) {
        return cachedRecipes;
      }

      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      cachedRecipes = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: parseInt(doc.id, 10),
      }));
      return cachedRecipes;
    } catch (error) {
      console.error('Error fetching recipes:', error);
      // Спробувати перемкнутися в офлайн режим
      await disableNetwork(db);
      await enableNetwork(db);
      // Повторити запит
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      return querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: parseInt(doc.id, 10),
      }));
    }
  },

  // Очистити всі рецепти
  async clearAllRecipes() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      const deletePromises = querySnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);
      cachedRecipes = null;
    } catch (error) {
      console.error('Error clearing recipes:', error);
      throw error;
    }
  },

  // Додати новий рецепт
  async addRecipe(recipe) {
    try {
      const docRef = doc(db, COLLECTION_NAME, String(recipe.id));
      await setDoc(docRef, recipe);
      cachedRecipes = null; // Скидаємо кеш
      return recipe;
    } catch (error) {
      console.error('Error adding recipe:', error);
      throw error;
    }
  },

  // Оновити рецепт
  async updateRecipe(id, recipe) {
    try {
      const docRef = doc(db, COLLECTION_NAME, String(id));
      await setDoc(docRef, recipe);
      cachedRecipes = null; // Скидаємо кеш
      return {
        id,
        ...recipe,
      };
    } catch (error) {
      console.error('Error updating recipe:', error);
      throw error;
    }
  },

  // Видалити рецепт
  async deleteRecipe(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, String(id));
      await deleteDoc(docRef);
      cachedRecipes = null; // Скидаємо кеш
      return id;
    } catch (error) {
      console.error('Error deleting recipe:', error);
      throw error;
    }
  },
};
