const params = new URLSearchParams(window.location.search);
const query = params.get("q");

fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${query}`)
  .then(res => res.json())
  .then(data => {
    if (!data.meals) {
      showNoResults();
    } else {
      showFoods(data.meals);
    }
  });

function showFoods(meals) {
  const container = document.getElementById("foodContainer");
  container.innerHTML = ""; // clear previous

  meals.forEach(meal => {
    const col = document.createElement("div");
    col.className = "col-md-3";

    col.innerHTML = `
      <div class="card h-100 shadow food-card" onclick="openFood(${meal.idMeal})">
        <img src="${meal.strMealThumb}" class="card-img-top">
        <div class="card-body">
          <h6 class="fw-bold">${meal.strMeal}</h6>
        </div>
      </div>
    `;

    container.appendChild(col);
  });
}

function showNoResults() {
  document.getElementById("foodContainer").innerHTML = `
    <div class="col-12 text-center">
      <h1 class="fw-bold text-danger mt-5">😔 Dish not found</h1>
      <p class="text-muted">Try searching with another ingredient or name.</p>
<button 
        class="btn btn-warning mt-3"
        onclick="window.location.href='index.html'">
        Back to Home
      </button>
          </div>
  `;
}

function openFood(id) {
  window.location.href = `food-detail.html?id=${id}`;
}
