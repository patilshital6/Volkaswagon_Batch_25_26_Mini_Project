// js/ui.js
export function renderCategories(categories) {
  const container = document.getElementById("categoryContainer");
  categories.forEach(cat => {
    if (cat.strCategory === "Beef" || cat.strCategory === "Pork") {
      return; 
    }
    const div = document.createElement("div");
    div.className = "col-6 col-md-4 col-lg-3";

    div.innerHTML = `
      <div class="category-card">
        ${cat.strCategory}
      </div>
    `;

    container.appendChild(div);
  });
}

// js/ui.js
export function renderFullCategories(categories) {
  const container = document.getElementById("categoryPageContainer");

  categories.forEach(cat => {
    const col = document.createElement("div");
    col.className = "col-6 col-md-4 col-lg-3";

    col.innerHTML = `
      <div class="card h-100 shadow-sm category-card">
        <img src="${cat.strCategoryThumb}" class="card-img-top">
        <div class="card-body">
          <h5 class="card-title">${cat.strCategory}</h5>
          <p class="card-text small">
            ${cat.strCategoryDescription.substring(0, 100)}...
          </p>
        </div>
      </div>
    `;

    container.appendChild(col);
  });
}

