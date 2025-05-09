import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../firebase/authService';
import { recipeService } from '../firebase/recipeService';
import './AdminPanel.css';

/**
 * Version: 2.0.0
 * AdminPanel component - додана можливість редагування рецептів та управління категоріями
 * Додане автоматичне форматування для часу, складності та кількості порцій
 */

const formatCookingTime = (time) => {
  // Перевіряємо чи це просто число (хвилини)
  const minutes = parseInt(time);
  if (!isNaN(minutes)) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}г. ${
        remainingMinutes > 0 ? remainingMinutes + 'хв.' : ''
      }`;
    }
    return `${minutes}хв.`;
  }
  return time; // Повертаємо як є, якщо вже відформатовано
};

const formatDifficulty = (difficulty) => {
  // Перевіряємо чи це просто число
  const level = parseInt(difficulty);
  if (!isNaN(level)) {
    return `${level}/10`;
  }
  return difficulty;
};

const formatServings = (servings) => {
  // Перевіряємо чи це просто число
  const count = parseInt(servings);
  if (!isNaN(count)) {
    return `${count} о.`;
  }
  return servings;
};

// Функція для форматування часу під час введення
const formatTimeInput = (value) => {
  if (!value) return '';

  // Якщо містить "г." або "хв.", вважаємо, що вже відформатовано
  if (value.includes('г.') || value.includes('хв.')) return value;

  // Перевіряємо, чи це просто число
  const minutes = parseInt(value);
  if (isNaN(minutes)) return value;

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes > 0) {
      return `${hours}г. ${remainingMinutes}хв.`;
    }
    return `${hours}г.`;
  }

  return `${minutes}хв.`;
};

// Функція для форматування складності під час введення
const formatDifficultyInput = (value) => {
  if (!value) return '';

  // Якщо містить "/10", вважаємо, що вже відформатовано
  if (value.includes('/10')) return value;

  // Перевіряємо, чи це просто число від 1 до 10
  const level = parseInt(value);
  if (isNaN(level)) return value;

  return `${level}/10`;
};

// Функція для форматування порцій під час введення
const formatServingsInput = (value) => {
  if (!value) return '';

  // Якщо містить "о.", вважаємо, що вже відформатовано
  if (value.includes('о.')) return value;

  // Перевіряємо, чи це просто число
  const servings = parseInt(value);
  if (isNaN(servings)) return value;

  return `${servings} о.`;
};

const AdminPanel = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [deleteCategoryConfirm, setDeleteCategoryConfirm] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues,
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

  // Отримуємо значення полів для відстеження змін
  const timeValue = watch('iconInfo.0.info');
  const difficultyValue = watch('iconInfo.1.info');
  const servingsValue = watch('iconInfo.2.info');

  // Ефекти для автоматичного форматування при зміні значень
  useEffect(() => {
    if (timeValue) {
      const formattedTime = formatTimeInput(timeValue);
      if (formattedTime !== timeValue) {
        setValue('iconInfo.0.info', formattedTime);
      }
    }
  }, [timeValue, setValue]);

  useEffect(() => {
    if (difficultyValue) {
      const formattedDifficulty = formatDifficultyInput(difficultyValue);
      if (formattedDifficulty !== difficultyValue) {
        setValue('iconInfo.1.info', formattedDifficulty);
      }
    }
  }, [difficultyValue, setValue]);

  useEffect(() => {
    if (servingsValue) {
      const formattedServings = formatServingsInput(servingsValue);
      if (formattedServings !== servingsValue) {
        setValue('iconInfo.2.info', formattedServings);
      }
    }
  }, [servingsValue, setValue]);

  // Обробники події blur для форматування після втрати фокусу
  const handleTimeBlur = () => {
    const currentValue = getValues('iconInfo.0.info');
    if (currentValue) {
      setValue('iconInfo.0.info', formatTimeInput(currentValue));
    }
  };

  const handleDifficultyBlur = () => {
    const currentValue = getValues('iconInfo.1.info');
    if (currentValue) {
      setValue('iconInfo.1.info', formatDifficultyInput(currentValue));
    }
  };

  const handleServingsBlur = () => {
    const currentValue = getValues('iconInfo.2.info');
    if (currentValue) {
      setValue('iconInfo.2.info', formatServingsInput(currentValue));
    }
  };

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
    replace: replaceIngredients,
  } = useFieldArray({
    control,
    name: 'srcIngredient',
  });

  const {
    fields: descriptionFields,
    append: appendDescription,
    remove: removeDescription,
    replace: replaceDescriptions,
  } = useFieldArray({
    control,
    name: 'description',
  });

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const allRecipes = await recipeService.getAllRecipes();
        setRecipes(allRecipes);

        // Витягаємо унікальні категорії з рецептів
        const uniqueCategories = [
          ...new Set(allRecipes.map((recipe) => recipe.category)),
        ].sort();
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error loading recipes:', error);
      }
    };
    loadRecipes();
  }, []);

  const showMessage = (text, isSuccess = true) => {
    setMessage(text);
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

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
      const recipeToDelete = recipes.find((recipe) => recipe.id === recipeId);

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
        }
      }

      await recipeService.deleteRecipe(recipeId);
      setRecipes(recipes.filter((recipe) => recipe.id !== recipeId));

      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        const favorites = JSON.parse(storedFavorites);
        const updatedFavorites = favorites.filter(
          (fav) => String(fav.id) !== String(recipeId)
        );
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      }

      showMessage('Рецепт успішно видалено');
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting recipe:', error);
      showMessage('Помилка при видаленні рецепта', false);
    }
  };

  const handleEditRecipe = (recipe) => {
    setEditingRecipe(recipe);

    // Заповнюємо форму даними рецепту
    setValue('name', recipe.name);
    setValue('category', recipe.category);

    // Заповнюємо iconInfo
    if (recipe.iconInfo && recipe.iconInfo.length >= 3) {
      setValue('iconInfo.0.info', recipe.iconInfo[0].info);
      setValue('iconInfo.1.info', recipe.iconInfo[1].info);
      setValue('iconInfo.2.info', recipe.iconInfo[2].info);
    }

    // Заповнюємо інгредієнти
    if (recipe.srcIngredient && recipe.srcIngredient.length > 0) {
      replaceIngredients(recipe.srcIngredient);
    }

    // Заповнюємо кроки приготування
    if (recipe.description && recipe.description.length > 0) {
      replaceDescriptions(recipe.description);
    }

    // Прокручуємо до форми
    document
      .querySelector('.form-container')
      .scrollIntoView({ behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingRecipe(null);
    reset();
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory].sort());
      setNewCategory('');
      showMessage('Категорію успішно додано!');
    } else if (categories.includes(newCategory)) {
      showMessage('Така категорія вже існує', false);
    } else {
      showMessage('Введіть назву категорії', false);
    }
  };

  const handleDeleteCategory = (category) => {
    // Перевіряємо, чи не використовується категорія якимось рецептом
    const isUsed = recipes.some((recipe) => recipe.category === category);

    if (isUsed) {
      showMessage(
        `Категорія "${category}" використовується в рецептах і не може бути видалена`,
        false
      );
      setDeleteCategoryConfirm(null);
      return;
    }

    setCategories(categories.filter((c) => c !== category));
    showMessage(`Категорію "${category}" видалено`);
    setDeleteCategoryConfirm(null);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const storage = getStorage();

      let imageUrl = '';
      if (data.image && data.image[0]) {
        const fileName = `${Date.now()}-${data.image[0].name}`;
        const imageRef = ref(storage, `images/${fileName}`);
        await uploadBytes(imageRef, data.image[0]);
        imageUrl = await getDownloadURL(imageRef);
      } else if (editingRecipe && editingRecipe.image) {
        // Якщо редагуємо рецепт і нове зображення не вибрано, використовуємо існуюче
        imageUrl = editingRecipe.image;
      }

      // Форматуємо дані перед збереженням
      const formattedIconInfo = [
        { ...data.iconInfo[0], info: formatCookingTime(data.iconInfo[0].info) },
        { ...data.iconInfo[1], info: formatDifficulty(data.iconInfo[1].info) },
        { ...data.iconInfo[2], info: formatServings(data.iconInfo[2].info) },
      ];

      const recipeData = {
        id: editingRecipe
          ? editingRecipe.id
          : Math.max(...recipes.map((recipe) => recipe.id), 0) + 1,
        name: data.name,
        category: data.category,
        image: imageUrl,
        iconInfo: formattedIconInfo,
        srcIngredient: data.srcIngredient,
        description: data.description,
      };

      if (editingRecipe) {
        // Оновлюємо існуючий рецепт
        await recipeService.updateRecipe(editingRecipe.id, recipeData);
        setRecipes(
          recipes.map((recipe) =>
            recipe.id === editingRecipe.id ? recipeData : recipe
          )
        );
        showMessage('Рецепт успішно оновлено!');
        setEditingRecipe(null);
      } else {
        // Додаємо новий рецепт
        await recipeService.addRecipe(recipeData);
        setRecipes([...recipes, recipeData]);
        showMessage('Рецепт успішно додано!');
      }

      reset();
    } catch (error) {
      console.error('Error saving recipe:', error);
      showMessage('Помилка при збереженні рецепта', false);
    } finally {
      setLoading(false);
    }
  };

  const formTitle = editingRecipe
    ? `Редагування рецепту: ${editingRecipe.name}`
    : 'Додати новий рецепт';
  const submitButtonText = editingRecipe ? 'Оновити рецепт' : 'Зберегти рецепт';

  return (
    <div className="admin-container">
      <div className="admin-content">
        <div className="admin-header">
          <h2 className="admin-title">{formTitle}</h2>
          <button onClick={handleLogout} className="logout-button">
            Вийти
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="form-container">
          <div className="form-group">
            <label className="form-label">Назва рецепта:</label>
            <input
              {...register('name', { required: "Назва обов'язкова" })}
              className="form-input"
            />
            {errors.name && (
              <span className="error-message">{errors.name.message}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Категорія:</label>
            <select
              {...register('category', { required: "Категорія обов'язкова" })}
              className="form-select"
            >
              <option value="">Виберіть категорію</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="error-message">{errors.category.message}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Зображення:</label>
            <input
              type="file"
              accept="image/*"
              {...register('image', {
                required: editingRecipe ? false : "Зображення обов'язкове",
              })}
              className="form-input"
            />
            {editingRecipe && (
              <p className="form-helper-text">
                Поточне зображення:{' '}
                {editingRecipe.image ? 'Завантажено' : 'Відсутнє'}.
                {editingRecipe.image && (
                  <em> Оберіть нове зображення лише якщо хочете замінити</em>
                )}
              </p>
            )}
            {errors.image && (
              <span className="error-message">{errors.image.message}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Інформація про рецепт:</label>
            <div className="recipe-info-grid">
              <div>
                <label className="form-label">Час приготування:</label>
                <input
                  {...register('iconInfo.0.info', {
                    required: "Час обов'язковий",
                  })}
                  type="text"
                  placeholder="1г. 30хв."
                  className="form-input"
                  onBlur={handleTimeBlur}
                />
                <p className="form-helper-text">
                  Введіть час у хвилинах, наприклад "90" буде форматовано як
                  "1г. 30хв."
                </p>
              </div>
              <div>
                <label className="form-label">Складність:</label>
                <input
                  {...register('iconInfo.1.info', {
                    required: "Складність обов'язкова",
                  })}
                  type="text"
                  placeholder="4/10"
                  className="form-input"
                  onBlur={handleDifficultyBlur}
                />
                <p className="form-helper-text">
                  Введіть число, наприклад "5" буде форматовано як "5/10"
                </p>
              </div>
              <div>
                <label className="form-label">Кількість порцій:</label>
                <input
                  {...register('iconInfo.2.info', {
                    required: "Кількість порцій обов'язкова",
                  })}
                  type="text"
                  placeholder="4 о."
                  className="form-input"
                  onBlur={handleServingsBlur}
                />
                <p className="form-helper-text">
                  Введіть число, наприклад "6" буде форматовано як "6 о."
                </p>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Інгредієнти:</label>
            <div className="ingredient-list">
              {ingredientFields.map((field, index) => (
                <div key={field.id} className="ingredient-item">
                  <input
                    {...register(`srcIngredient.${index}.ingredient`, {
                      required: "Інгредієнт обов'язковий",
                    })}
                    placeholder="Інгредієнт"
                    className="form-input"
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="button button-danger"
                  >
                    Видалити
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendIngredient({ ingredient: '' })}
                className="button button-primary button-full"
              >
                Додати інгредієнт
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Кроки приготування:</label>
            <div className="step-list">
              {descriptionFields.map((field, index) => (
                <div key={field.id} className="step-item">
                  <textarea
                    {...register(`description.${index}.step`, {
                      required: "Крок обов'язковий",
                    })}
                    placeholder="Опис кроку"
                    className="form-textarea"
                  />
                  <button
                    type="button"
                    onClick={() => removeDescription(index)}
                    className="button button-danger"
                  >
                    Видалити
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendDescription({ step: '' })}
                className="button button-primary button-full"
              >
                Додати крок
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={loading}
              className="button button-success button-full"
            >
              {loading ? 'Збереження...' : submitButtonText}
            </button>

            {editingRecipe && (
              <button
                type="button"
                onClick={cancelEdit}
                className="button button-secondary button-full"
                style={{ marginTop: '10px' }}
              >
                Скасувати редагування
              </button>
            )}
          </div>
        </form>

        {/* Секція управління категоріями */}
        <div className="category-manager">
          <h3 className="section-title">Управління категоріями</h3>

          <div className="category-add-form">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Назва нової категорії"
              className="form-input"
            />
            <button
              onClick={handleAddCategory}
              className="button button-primary"
            >
              Додати категорію
            </button>
          </div>

          <div className="category-list">
            <table className="table">
              <thead>
                <tr>
                  <th>Категорія</th>
                  <th style={{ textAlign: 'right' }}>Дії</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category}>
                    <td>{category}</td>
                    <td>
                      <div className="actions">
                        {deleteCategoryConfirm === category ? (
                          <>
                            <button
                              onClick={() => handleDeleteCategory(category)}
                              className="button button-success"
                            >
                              Підтвердити
                            </button>
                            <button
                              onClick={() => setDeleteCategoryConfirm(null)}
                              className="button button-danger"
                            >
                              Скасувати
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setDeleteCategoryConfirm(category)}
                            className="button button-danger"
                          >
                            Видалити
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-container">
          <div className="table-header">
            <h3 className="table-title">Список рецептів</h3>
          </div>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Назва</th>
                  <th>Категорія</th>
                  <th style={{ textAlign: 'right' }}>Дії</th>
                </tr>
              </thead>
              <tbody>
                {recipes
                  .sort((a, b) => b.id - a.id)
                  .map((recipe) => (
                    <tr key={recipe.id}>
                      <td>{recipe.id}</td>
                      <td>
                        <Link
                          to={`/recipe/${recipe.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#3b82f6',
                            textDecoration: 'none',
                            ':hover': {
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          {recipe.name}
                        </Link>
                      </td>
                      <td>{recipe.category}</td>
                      <td>
                        <div className="actions">
                          <button
                            onClick={() => handleEditRecipe(recipe)}
                            className="button button-primary"
                          >
                            Редагувати
                          </button>

                          {deleteConfirm === recipe.id ? (
                            <>
                              <button
                                onClick={() => handleDeleteRecipe(recipe.id)}
                                className="button button-success"
                              >
                                Підтвердити
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="button button-danger"
                              >
                                Скасувати
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(recipe.id)}
                              className="button button-danger"
                            >
                              Видалити
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {message && (
          <div
            className={`message ${
              message.includes('успішно') ? 'message-success' : 'message-error'
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
