import { getAllRecipes, searchRecipes } from "./api/recipeProvider.js";
import { renderRecipes } from "./ui/render.js";
import { showLoader, hideLoader } from "./ui/loader.js";
import { getFavorites } from "./services/storageService.js";

const searchInput = document.getElementById("searchInput");
const pageTitle = document.getElementById("pageTitle");
const navHome = document.getElementById("navHome");
const navSearch = document.getElementById("navSearch");
const navFavorites = document.getElementById("navFavorites");

export let allRecipes = [];

async function init() {
  try {
    showLoader();
    allRecipes = await getAllRecipes();
    renderRecipes(allRecipes);
    updateFavCount()
  } catch (error) {
    console.error("Erreur lors de l'initialisation des recettes :", error);
    renderRecipes([]);  
  } finally {
    hideLoader();
  }
}
init();

/* SEARCH PAGE */
navSearch.addEventListener("click", () => {
  window.__currentPage = "search"; 
  setActiveNav(navSearch);
  pageTitle.textContent = "Rechercher";
  searchInput.classList.remove("hidden");
  document.querySelector(".search-wrapper").classList.remove("hidden");
});

searchInput.addEventListener("input", async (e) => {
  const query = e.target.value.trim();

  if (!query) {
    renderRecipes(allRecipes);
    return;
  }

  try {
    showLoader();

    const results = await searchRecipes(query);

    renderRecipes(results);
  } catch (error) {
    console.error("Error while searching recipes:", error);
     
  } finally {
    hideLoader();
  }
});

/* HOME */
navHome.addEventListener("click", () => {
  window.__currentPage = "home";
  setActiveNav(navHome);
  pageTitle.textContent = "Découvrir";
  searchInput.classList.add("hidden");
  renderRecipes(allRecipes);
  document.querySelector(".search-wrapper").classList.add("hidden");
});



/* FAVORITES */
navFavorites.addEventListener("click", () => {
window.__currentPage = "favorites";
  setActiveNav(navFavorites);
  pageTitle.textContent = "Favoris";
  searchInput.classList.add("hidden");
  document.querySelector(".search-wrapper").classList.add("hidden");

  const favorites = getFavorites();
  const favRecipes = allRecipes.filter(r => favorites.includes(r.id));
  renderRecipes(favRecipes);
});

function setActiveNav(activeBtn) {
  [navHome, navSearch, navFavorites].forEach(btn => btn.classList.remove("active"));
  activeBtn.classList.add("active");
}

export function updateFavCount() {
  const count = getFavorites().length;
  const badge = document.getElementById("favCount");
  badge.textContent = count;
  if (count > 0) {
    badge.classList.remove("hidden");
  } else {
    badge.classList.add("hidden");
  }
}