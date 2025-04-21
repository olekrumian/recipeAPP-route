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
import './AdminPanel.css';

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
      setRecipes([...recipes, recipeData]);
      showMessage('Рецепт успішно додано!');
      reset();
    } catch (error) {
      console.error('Error adding recipe:', error);
      showMessage('Помилка при додаванні рецепта', false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-content">
        <div className="admin-header">
          <h2 className="admin-title">Додати новий рецепт</h2>
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
              <option value="Обід">Обід</option>
              <option value="Десерт">Десерт</option>
              <option value="Печиво">Печиво</option>
              <option value="Хліб">Хліб</option>
              <option value="Вечеря">Вечеря</option>
              <option value="Додатки">Додатки</option>
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
              {...register('image', { required: "Зображення обов'язкове" })}
              className="form-input"
            />
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
                  placeholder="1г. 30хв."
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Складність:</label>
                <input
                  {...register('iconInfo.1.info', {
                    required: "Складність обов'язкова",
                  })}
                  placeholder="5/10"
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Кількість порцій:</label>
                <input
                  {...register('iconInfo.2.info', {
                    required: "Кількість порцій обов'язкова",
                  })}
                  placeholder="4 о."
                  className="form-input"
                />
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

          <button
            type="submit"
            disabled={loading}
            className="button button-success button-full"
          >
            {loading ? 'Збереження...' : 'Зберегти рецепт'}
          </button>
        </form>

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
                  <th>Дії</th>
                </tr>
              </thead>
              <tbody>
                {recipes.map((recipe) => (
                  <tr key={recipe.id}>
                    <td>{recipe.id}</td>
                    <td>{recipe.name}</td>
                    <td>
                      <div className="actions">
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
