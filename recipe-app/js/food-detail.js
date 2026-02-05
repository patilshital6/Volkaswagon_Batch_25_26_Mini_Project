const id = new URLSearchParams(window.location.search).get("id");

fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
  .then(res => res.json())
  .then(data => showFood(data.meals[0]));

function showFood(meal) {

  let ingredients = "";

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== "") {
      ingredients += `<li>${measure} ${ingredient}</li>`;
    }
  }

  document.getElementById("foodDetail").innerHTML = `
  <div class="recipe-wrapper">

    <!-- Image -->
    <div class="recipe-hero">
      <img src="${meal.strMealThumb}" class="recipe-hero-img">
    </div>

    <!-- Title & Meta -->
    <div class="recipe-header">
      <h1>${meal.strMeal}</h1>
      <div class="recipe-meta">
        <span>${meal.strCategory}</span>
        <span>${meal.strArea}</span>
      </div>
    </div>

    <!-- Ingredients -->
    <div class="recipe-section">
      <h3>Ingredients</h3>
      <ol class="ingredient-list">
        ${ingredients}
      </ol>
    </div>

    <!-- Instructions -->
    <div class="recipe-section">
      <h3>Instructions</h3>
      <p class="recipe-instructions">${meal.strInstructions}</p>
    </div>

    <!-- Disclaimer -->
    <div class="recipe-disclaimer">
      🌶 Salt and spices should be added according to your taste to make the dish more enjoyable.
    </div>

    <!-- Video -->
    <div class="recipe-video">
      <a href="${meal.strYoutube}" target="_blank" class="btn btn-danger px-4">
        ▶ Watch Cooking Video
      </a>
    </div>

  </div>
`;
}