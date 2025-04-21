import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { authService } from '../firebase/authService';
import { recipeService } from '../firebase/recipeService';

const AdminPanel = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      category: '',
      srcIngredient: [{ ingredient: '' }],
      description: [{ step: '' }],
      iconInfo: [
        { image: './icon/time.svg', info: '' },
        { image: './icon/difficulty.svg', info: '' },
        { image: './icon/person.svg', info: '' },
      ],
    },
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: 'srcIngredient',
  });

  const {
    fields: descriptionFields,
    append: appendDescription,
    remove: removeDescription,
  } = useFieldArray({
    control,
    name: 'description',
  });

  // Load recipes
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const allRecipes = await recipeService.getAllRecipes();
        setRecipes(allRecipes);
      } catch (error) {
        console.error('Error loading recipes:', error);
      }
    };
    loadRecipes();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      setMessage('Помилка при виході');
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      // Отримуємо дані рецепта перед видаленням
      const recipeToDelete = recipes.find((recipe) => recipe.id === recipeId);

      // Видаляємо зображення з Firebase Storage, якщо це посилання на Storage
      if (
        recipeToDelete &&
        recipeToDelete.image &&
        recipeToDelete.image.startsWith(
          'https://firebasestorage.googleapis.com'
        )
      ) {
        const storage = getStorage();
        const imageRef = ref(storage, recipeToDelete.image);
        try {
          await deleteObject(imageRef);
        } catch (storageError) {
          console.error('Error deleting image from storage:', storageError);
          // Продовжуємо видалення рецепта, навіть якщо видалення зображення не вдалося
        }
      }

      // Видаляємо рецепт з бази даних
      await recipeService.deleteRecipe(recipeId);
      setRecipes(recipes.filter((recipe) => recipe.id !== recipeId));

      // Видаляємо рецепт з обраних
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        const favorites = JSON.parse(storedFavorites);
        const updatedFavorites = favorites.filter(
          (fav) => String(fav.id) !== String(recipeId)
        );
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      }

      setMessage('Рецепт успішно видалено');
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting recipe:', error);
      setMessage('Помилка при видаленні рецепта');
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const storage = getStorage();

      let imageUrl = '';
      if (data.image[0]) {
        const fileName = `${Date.now()}-${data.image[0].name}`;
        const imageRef = ref(storage, `images/${fileName}`);
        await uploadBytes(imageRef, data.image[0]);
        imageUrl = await getDownloadURL(imageRef);
      }

      const maxId = Math.max(...recipes.map((recipe) => recipe.id), 0);
      const newId = maxId + 1;

      const recipeData = {
        id: newId,
        name: data.name,
        category: data.category,
        image: imageUrl,
        iconInfo: data.iconInfo,
        srcIngredient: data.srcIngredient,
        description: data.description,
      };

      await recipeService.addRecipe(recipeData);
      setRecipes([...recipes, recipeData]); // Оновлюємо локальний стан
      setMessage('Рецепт успішно додано!');
      reset();
    } catch (error) {
      console.error('Error adding recipe:', error);
      setMessage('Помилка при додаванні рецепта');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">
                Додати новий рецепт
              </h2>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Вийти
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="divide-y divide-gray-200"
            >
              <div className="py-8 space-y-6">
                {/* Назва рецепта */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Назва рецепта:
                  </label>
                  <input
                    {...register('name', { required: "Назва обов'язкова" })}
                    className="w-full px-6 py-4 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-[16px]"
                  />
                  {errors.name && (
                    <span className="text-sm text-red-500">
                      {errors.name.message}
                    </span>
                  )}
                </div>

                {/* Категорія */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Категорія:
                  </label>
                  <select
                    {...register('category', {
                      required: "Категорія обов'язкова",
                    })}
                    className="w-full px-6 py-4 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-[16px]"
                  >
                    <option value="">Виберіть категорію</option>
                    <option value="Обід">Обід</option>
                    <option value="Десерт">Десерт</option>
                    <option value="Печиво">Печиво</option>
                    <option value="Хліб">Хліб</option>
                    <option value="Вечеря">Вечеря</option>
                    <option value="Додатки">Додатки</option>
                  </select>
                  {errors.category && (
                    <span className="text-sm text-red-500">
                      {errors.category.message}
                    </span>
                  )}
                </div>

                {/* Зображення */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Зображення:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    {...register('image', {
                      required: "Зображення обов'язкове",
                    })}
                    className="w-full px-6 py-4 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-[16px]"
                  />
                  {errors.image && (
                    <span className="text-sm text-red-500">
                      {errors.image.message}
                    </span>
                  )}
                </div>

                {/* Інформація про рецепт */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-700">
                    Інформація про рецепт:
                  </label>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="text-xs text-gray-500">
                        Час приготування:
                      </label>
                      <input
                        {...register('iconInfo.0.info', {
                          required: "Час обов'язковий",
                        })}
                        placeholder="1г. 30хв."
                        className="w-full px-6 py-4 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-[16px]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">
                        Складність:
                      </label>
                      <input
                        {...register('iconInfo.1.info', {
                          required: "Складність обов'язкова",
                        })}
                        placeholder="5/10"
                        className="w-full px-6 py-4 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-[16px]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">
                        Кількість порцій:
                      </label>
                      <input
                        {...register('iconInfo.2.info', {
                          required: "Кількість порцій обов'язкова",
                        })}
                        placeholder="4 о."
                        className="w-full px-6 py-4 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-[16px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Інгредієнти */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-700">
                    Інгредієнти:
                  </label>
                  {ingredientFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <input
                        {...register(`srcIngredient.${index}.ingredient`, {
                          required: "Інгредієнт обов'язковий",
                        })}
                        placeholder="Інгредієнт"
                        className="flex-1 px-6 py-4 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-[16px]"
                      />
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="px-3 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                      >
                        Видалити
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => appendIngredient({ ingredient: '' })}
                    className="w-full px-3 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  >
                    Додати інгредієнт
                  </button>
                </div>

                {/* Кроки приготування */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-700">
                    Кроки приготування:
                  </label>
                  {descriptionFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <textarea
                        {...register(`description.${index}.step`, {
                          required: "Крок обов'язковий",
                        })}
                        placeholder="Опис кроку"
                        className="flex-1 px-6 py-4 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-[16px]"
                        rows="3"
                      />
                      <button
                        type="button"
                        onClick={() => removeDescription(index)}
                        className="px-3 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                      >
                        Видалити
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => appendDescription({ step: '' })}
                    className="w-full px-3 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  >
                    Додати крок
                  </button>
                </div>
              </div>

              {/* Кнопка збереження */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 disabled:bg-gray-400"
                >
                  {loading ? 'Збереження...' : 'Зберегти рецепт'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Таблиця рецептів */}
        <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Список рецептів
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Назва
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Категорія
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Дії
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recipes.map((recipe) => (
                    <tr key={recipe.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {recipe.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {recipe.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {recipe.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {deleteConfirm === recipe.id ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleDeleteRecipe(recipe.id)}
                              className="text-white hover:bg-green-600 bg-green-500 px-3 py-1 rounded"
                            >
                              Підтвердити
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="text-white hover:bg-red-600 bg-red-500 px-3 py-1 rounded"
                            >
                              Скасувати
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(recipe.id)}
                            className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition-colors"
                          >
                            Видалити
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Повідомлення про результат */}
        {message && (
          <div
            className={`mt-4 p-4 rounded-md ${
              message.includes('успішно')
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
