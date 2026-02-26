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
navSearch.onclick = () => {
     window.__currentPage = "search"; 
  setActiveNav(navSearch);
  pageTitle.textContent = "Rechercher";
  searchInput.classList.remove("hidden");
  document.querySelector(".search-wrapper").classList.remove("hidden");
};

searchInput.addEventListener("input", async (e) => {
  const query = e.target.value.trim();

  if (!query) {
    renderRecipes(allRecipes);
    return;
  }

  showLoader();
  const results = await searchRecipes(query);
  renderRecipes(results);
  hideLoader();
});
