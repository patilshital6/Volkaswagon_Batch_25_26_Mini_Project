import { fetchCategories } from "./script.js";
import { renderCategories } from "./ui.js";
import { fetchFullCategories } from "./script.js";
import { renderFullCategories } from "./ui.js";
fetchCategories()
  .then(categories => {
    renderCategories(categories);
  })
  .catch(error => {
    console.log("Error loading categories", error);
  });
if (document.getElementById("categoryPageContainer")) {
  fetchFullCategories()
    .then(categories => renderFullCategories(categories))
    .catch(err => console.error("Error loading full categories", err));
}
const user = JSON.parse(localStorage.getItem("chefUser"));
const isLoggedIn = localStorage.getItem("chefLoggedIn");
const authArea = document.getElementById("authArea");

if (user && isLoggedIn && authArea) {
  const colors = ["#ff6f00", "#0d6efd", "#20c997", "#6f42c1", "#dc3545", "#198754"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
   authArea.innerHTML = `
    <div class="d-flex align-items-center gap-2 text-white">
      <div class="user-avatar" style="background:${randomColor}">
        ${user.name.charAt(0).toUpperCase()}
      </div>
      <span>${user.name}</span>
      <button class="btn btn-sm btn-outline-light" onclick="logout()">Logout</button>
    </div>
  `;
}

window.logout = function () {
  localStorage.removeItem("chefLoggedIn");
  window.location.reload();
};


const randomMealContainer = document.getElementById("randomMealContainer");

if (randomMealContainer) {
  fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then(res => res.json())
    .then(data => renderRandomMeal(data.meals[0]));
}

function renderRandomMeal(meal) {
  randomMealContainer.innerHTML = `
    <div class="col-md-8">
      <div class="card random-meal-card shadow-lg">
        <div class="row g-0">
          
          <div class="col-md-5">
            <img src="${meal.strMealThumb}" class="img-fluid random-meal-img">
          </div>

          <div class="col-md-7 p-4">
            <h3 class="fw-bold">${meal.strMeal}</h3>
            <p class="text-muted mb-2">${meal.strCategory} • ${meal.strArea}</p>
            <p>${meal.strInstructions.substring(0, 200)}...</p>

            <a href="food-detail.html?id=${meal.idMeal}" class="btn btn-warning fw-bold">
              View Recipe
            </a>
          </div>

        </div>
      </div>
    </div>
  `;
}

