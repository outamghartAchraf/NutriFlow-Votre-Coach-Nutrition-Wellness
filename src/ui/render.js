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

