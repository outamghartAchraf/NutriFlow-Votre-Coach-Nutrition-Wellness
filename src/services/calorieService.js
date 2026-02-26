export function getNutriBadge(calories) {
  if (calories < 400) {
    return { label: "Léger", color: "green" };
  } else if (calories <= 800) {
    return { label: "Modéré", color: "orange" };
  } else {
    return { label: "Riche", color: "red" };
  }
}
