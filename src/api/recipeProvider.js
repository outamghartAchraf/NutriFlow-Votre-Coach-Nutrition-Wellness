export async function getAllRecipes() {
  const res = await fetch("https://dummyjson.com/recipes");
  if (!res.ok) throw new Error("Erreur API");
  const data = await res.json();
  return data.recipes;
}


