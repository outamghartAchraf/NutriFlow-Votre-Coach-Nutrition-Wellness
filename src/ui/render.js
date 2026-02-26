import { getNutriBadge, calculateTotalCalories } from "../services/calorieService.js";
import { getFavorites, toggleFavorite } from "../services/storageService.js";
import { updateFavCount, allRecipes  } from "../main.js";

const container = document.getElementById("recipesContainer");
const count = document.getElementById("recipesCount");
const modal = document.getElementById("modal");
const totalCaloriesEl = document.getElementById("totalCalories");

let currentRecipes = [];

export function renderRecipes(recipes) {
  currentRecipes = recipes;
  container.innerHTML = "";
  count.textContent = `${recipes.length} recettes`;

  const favorites = getFavorites();

  recipes.forEach(recipe => {
    const badge = getNutriBadge(recipe.caloriesPerServing);
    const isFav = favorites.includes(recipe.id);

    const colorMap = {
      green: "badge-green",
      orange: "badge-orange",
      red: "badge-red"
    };

    const card = document.createElement("article");
    card.className = "recipe-card";

    card.innerHTML = `
      <div class="recipe-img-wrapper">
        <img src="${recipe.image}" class="recipe-img" alt="${recipe.name}"/>
        <span class="calorie-badge ${colorMap[badge.color]}">
          ${recipe.caloriesPerServing} kcal
        </span>
      </div>

      <div class="recipe-info">
        <div class="recipe-header">
          <h3 class="recipe-name">${recipe.name}</h3>
          <button class="heart-btn ${isFav ? "fav" : "unfav"}">
            <i class="fas fa-heart"></i>
          </button>
        </div>

        <div class="recipe-tags">
          <span class="tag">${recipe.cuisine}</span>
          <span class="tag">${recipe.difficulty}</span>
        </div>
      </div>
    `;

    card.querySelector(".heart-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(recipe.id);
      renderRecipes(currentRecipes);
       updateFavCount();

  if (window.__currentPage === "favorites") {
    const updatedFavs = getFavorites();
    const updatedRecipes = allRecipes.filter(r => updatedFavs.includes(r.id));
    renderRecipes(updatedRecipes);
  } else {
    renderRecipes(currentRecipes);
  }
      
       
    });

    card.addEventListener("click", () => openModal(recipe));

    container.appendChild(card);
  });

  updateTotalCalories();
}


function updateTotalCalories() {
  const favorites = getFavorites();
  const total = calculateTotalCalories(currentRecipes, favorites);
  totalCaloriesEl.textContent = `${total} kcal`;
}

function openModal(recipe) {
  modal.classList.remove("hidden");

  const { label, color } = getNutriBadge(recipe.caloriesPerServing);
  const favorites = getFavorites();
  const isFav = favorites.includes(recipe.id);

  const ratingStars = "★".repeat(Math.round(recipe.rating || 0));
  const prepTime = recipe.prepTimeMinutes && recipe.cookTimeMinutes
    ? `${recipe.prepTimeMinutes + recipe.cookTimeMinutes} min`
    : recipe.prepTimeMinutes ? `${recipe.prepTimeMinutes} min` : "—";
  const servings = recipe.servings ? `${recipe.servings} pers.` : "—";

  modal.innerHTML = `
    <div class="modal-content">

      <!-- Hero -->
      <div class="modal-hero">
        <img src="${recipe.image}" class="modal-hero-img" alt="${recipe.name}"/>
        <div class="modal-hero-overlay"></div>

        <button class="modal-close close">
          <i class="fas fa-times"></i>
        </button>

        <div class="modal-hero-body">
          <h2 class="modal-title">${recipe.name}</h2>
          <div class="modal-hero-tags">
            ${recipe.cuisine ? `<span class="modal-hero-tag">${recipe.cuisine}</span>` : ""}
            ${recipe.difficulty ? `<span class="modal-hero-tag">${recipe.difficulty}</span>` : ""}
          </div>
        </div>

        <button class="modal-fav-btn modal-fav-toggle ${isFav ? "fav" : ""}">
          <i class="fas fa-heart"></i>
        </button>
      </div>

      <!-- Body -->
      <div class="modal-body">

        <!-- Stats grid -->
        <div class="modal-stats">
          <div class="modal-stat">
            <i class="fas fa-clock modal-stat-icon"></i>
            <div class="modal-stat-info">
              <span class="modal-stat-label">Temps</span>
              <span class="modal-stat-value">${prepTime}</span>
            </div>
          </div>
          <div class="modal-stat">
            <i class="fas fa-users modal-stat-icon"></i>
            <div class="modal-stat-info">
              <span class="modal-stat-label">Portions</span>
              <span class="modal-stat-value">${servings}</span>
            </div>
          </div>
          <div class="modal-stat">
            <i class="fas fa-star modal-stat-icon gold"></i>
            <div class="modal-stat-info">
              <span class="modal-stat-label">Note</span>
              <span class="modal-stat-value"><span class="stars">★</span>${recipe.rating || "—"}</span>
            </div>
          </div>
          <div class="modal-stat">
            <i class="fas fa-fire modal-stat-icon orange"></i>
            <div class="modal-stat-info">
              <span class="modal-stat-label">Calories</span>
              <span class="modal-stat-value">${recipe.caloriesPerServing} kcal</span>
            </div>
          </div>
        </div>

        <!-- Nutri badge -->
        <div class="modal-nutri-badge">
          <span class="modal-nutri-pill badge-${color}">
            ${recipe.caloriesPerServing} kcal • ${label}
          </span>
        </div>

        <!-- Ingredients -->
        <h3 class="modal-section-title">Ingrédients</h3>
        <ul class="modal-ingredients">
          ${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}
        </ul>

        <!-- Instructions -->
        <h3 class="modal-section-title">Préparation</h3>
        <p class="modal-instructions">${Array.isArray(recipe.instructions) ? recipe.instructions.join(" ") : recipe.instructions}</p>

      </div>
    </div>
  `;

  modal.querySelector(".close").onclick = () => modal.classList.add("hidden");
  modal.onclick = (e) => { if (e.target === modal) modal.classList.add("hidden"); };

  modal.querySelector(".modal-fav-toggle").onclick = (e) => {
    e.stopPropagation();
    toggleFavorite(recipe.id);
    const btn = modal.querySelector(".modal-fav-toggle");
    btn.classList.toggle("fav");
    renderRecipes(currentRecipes);
  };
}

