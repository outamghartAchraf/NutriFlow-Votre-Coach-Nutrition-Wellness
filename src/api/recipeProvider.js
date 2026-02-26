export async function getAllRecipes() {
  const res = await fetch("https://dummyjson.com/recipes");
  if (!res.ok) throw new Error("Erreur API");
  const data = await res.json();
  return data.recipes;
}

export async function searchRecipes(query) {
  const res = await fetch(`https://dummyjson.com/recipes/search?q=${query}`);
  if (!res.ok) throw new Error("Erreur Recherche");
  const data = await res.json();
  return data.recipes;
}