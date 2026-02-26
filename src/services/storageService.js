const KEY = "nutriflow_favorites";

export function getFavorites() {
  return JSON.parse(localStorage.getItem(KEY)) || [];
}

