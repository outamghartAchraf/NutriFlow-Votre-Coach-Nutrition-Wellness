export function getNutriBadge(calories) {
  if (calories < 400) {
    return { label: "Léger", color: "green" };
  } else if (calories <= 800) {
    return { label: "Modéré", color: "orange" };
  } else {
    return { label: "Riche", color: "red" };
  }
}

export function calculateTotalCalories(recipes, favorites) {
  return recipes
    .filter(recipe => favorites.includes(recipe.id))
    .reduce((total, recipe) => total + (recipe.caloriesPerServing || 0), 0);
}