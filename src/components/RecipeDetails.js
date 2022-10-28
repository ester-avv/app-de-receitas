import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AppContext from '../contextApi/AppContext';
import Footer from './Footer';

function RecipesDetails() {
  const { location: { pathname } } = useHistory();
  const {
    setSelectedRecipe,
    selectedRecipe,
    getRecipeIngredients,
    ingredients,
    getRecipeIngredientsMeasures,
    measures,
  } = useContext(AppContext);

  console.log(selectedRecipe);

  const way = pathname.replace('/meals/', '');
  const wayDrink = pathname.replace('/drinks/', '');

  const getyoutubeParam = 32;

  useEffect(() => {
    const fetchDetail = async () => {
      const detailsMealsEndPoint = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${way}`;
      const detailsDrinksEndPoint = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${wayDrink}`;
      let response;
      let key;
      console.log(pathname);
      if (pathname === `/meals/${way}`) {
        response = await fetch(detailsMealsEndPoint);
        key = 'meals';
      } else {
        response = await fetch(detailsDrinksEndPoint);
        key = 'drinks';
      }
      const data = await response.json();
      setSelectedRecipe(data[key]);
      getRecipeIngredients(data[key]);
      getRecipeIngredientsMeasures(data[key]);
    };
    fetchDetail();
  }, [
    pathname,
    setSelectedRecipe,
    way,
    wayDrink,
    getRecipeIngredients,
    getRecipeIngredientsMeasures,
  ]);

  return (
    <div>
      <div>
        <p>Recipes Details</p>
        {
          selectedRecipe.map((recipe) => (
            <div key={ recipe.idMeal ? recipe.idMeal : recipe.idDrink }>
              <h2 data-testid="recipe-title">
                { recipe.strMeal ? recipe.strMeal : recipe.strDrink }
              </h2>
              <img
                src={ recipe.strMealThumb ? recipe.strMealThumb : recipe.strDrinkThumb }
                alt="recipe"
                data-testid="recipe-photo"
                width="300px"
              />
              <p data-testid="recipe-category">
                {
                  recipe.strAlcoholic
                    ? `${recipe.strCategory} ${recipe.strAlcoholic}`
                    : recipe.strCategory
                }
              </p>
            </div>
          ))
        }

        <h3>Ingredients:</h3>
        {
          ingredients.map((ingredient, index) => (
            <p
              data-testid={ `${index}-ingredient-name-and-measure` }
              key={ `${index}-${ingredient}` }
            >
              {`${ingredient}: ${measures[index]}`}

            </p>
          ))
        }

        <h3>Intructions:</h3>
        {
          selectedRecipe.length > 0 && (
            <p data-testid="instructions">{selectedRecipe[0].strInstructions}</p>
          )
        }

        {
          (selectedRecipe.length > 0 && selectedRecipe[0].strYoutube) && (
            <iframe
              data-testid="video"
              width="560"
              height="315"
              src={ `https://www.youtube.com/embed/${selectedRecipe[0].strYoutube.slice(getyoutubeParam)}` }
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer;
                clipboard-write;
                encrypted-media;
                gyroscope;
                picture-in-picture"
              allowFullScreen
            />
          )
        }
        {/* {
          selectedRecipe.length > 0 && (
            <p data-testid="instructions">{selectedRecipe[0].strInstructions}</p>
          )
        } */}
      </div>
      <Footer />
    </div>
  );
}
export default RecipesDetails;
