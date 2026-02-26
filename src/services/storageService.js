const KEY = "nutriflow_favorites";

export function getFavorites() {
  return JSON.parse(localStorage.getItem(KEY)) || [];
}

export function toggleFavorite(id) {
  let favs = getFavorites();

  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
  } else {
    favs.push(id);
  }

  localStorage.setItem(KEY, JSON.stringify(favs));
}