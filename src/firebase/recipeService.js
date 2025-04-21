import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { db } from './config.js';

const COLLECTION_NAME = 'recipes';

export const recipeService = {
  // Отримати всі рецепти
  async getAllRecipes() {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: parseInt(doc.id, 10),
        image: data.image, // Прибираємо модифікацію шляху
        iconInfo: data.iconInfo.map((icon) => ({
          ...icon,
          image: icon.image.startsWith('./')
            ? icon.image.replace('./', '/')
            : icon.image,
        })),
      };
    });
  },

  // Очистити всі рецепти
  async clearAllRecipes() {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  },

  // Додати новий рецепт
  async addRecipe(recipe) {
    const docRef = doc(db, COLLECTION_NAME, String(recipe.id));
    await setDoc(docRef, recipe);
    return recipe;
  },

  // Оновити рецепт
  async updateRecipe(id, recipe) {
    const docRef = doc(db, COLLECTION_NAME, String(id));
    await setDoc(docRef, recipe);
    return {
      id,
      ...recipe,
    };
  },

  // Видалити рецепт
  async deleteRecipe(id) {
    const docRef = doc(db, COLLECTION_NAME, String(id));
    await deleteDoc(docRef);
    return id;
  },
};
