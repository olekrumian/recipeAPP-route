import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { recipes } from '../data/data.js';
import { db } from './migrationConfig.js';

const COLLECTION_NAME = 'recipes';

const recipeService = {
  async clearAllRecipes() {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  },

  async addRecipe(recipe) {
    const docRef = doc(db, COLLECTION_NAME, String(recipe.id));
    await setDoc(docRef, recipe);
    return recipe;
  },
};

export const migrateDataToFirestore = async () => {
  try {
    // Спочатку очищаємо всі існуючі рецепти
    await recipeService.clearAllRecipes();
    console.log('Існуючі рецепти видалено');

    // Додаємо нові рецепти
    for (const recipe of recipes) {
      await recipeService.addRecipe(recipe);
    }
    console.log('Міграцію даних завершено успішно');
  } catch (error) {
    console.error('Помилка під час міграції даних:', error);
  }
};
