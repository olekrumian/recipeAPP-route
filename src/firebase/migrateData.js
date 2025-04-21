import { recipes } from '../data/data.js';
import { recipeService } from './recipeService.js';

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
