// js/api.js
const API_URL = "https://www.themealdb.com/api/json/v1/1/list.php?c=list";
// js/api.js
const FULL_API_URL = "https://www.themealdb.com/api/json/v1/1/categories.php";
export function fetchCategories() {
  return new Promise((resolve, reject) => {
    fetch(API_URL)
      .then(res => {
        if (!res.ok) {
          reject("API Error");
        }
        return res.json();
      })
      .then(data => resolve(data.meals))
      .catch(err => reject(err));
  });
}

export function fetchFullCategories() {
  return fetch(FULL_API_URL)
    .then(res => res.json())
    .then(data => data.categories);
}
