// Importing Model and View
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';

// Coming from parcel
if (module.hot) {
  module.hot.accept;
}

// ///////////////////////////////////////////////////////////////////////////////
// Async function named controlRecipes | Once called, it will fetch for the API in the background --Convert the response into JSON and save as a data
const controlRecipes = async function () {
  try {
    // Getting the hash ID.
    const id = window.location.hash.slice(1);
    // console.log(id);
    if (!id) return;
    recipeView.renderSpinner();
    // 0) Update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());

    // 1) Loading Recipe
    await model.loadRecipe(id);
    // 2) Rendering Recipe to "render(data)" recipeView.js
    recipeView.render(model.state.recipe);
    // Catch if there are any errors and display them if it does.
    // highlight the current recipe in bookmarks
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
  }
};

// ///////////////////////////////////////////////////////////////////////////////
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1) Call getQuery from searchView.js
    const query = searchView.getQuery();
    // If there arent any value inside the search field (query), just return
    if (!query) return;

    // 2) Call loadSearchResults from model.js
    await model.loadSearchResults(query);

    // 3) Render Results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4) Render Initial Pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

// ///////////////////////////////////////////////////////////////////////////////
const controlPagination = function (goToPage) {
  console.log(goToPage);
  // Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render NEW Pagination buttons
  paginationView.render(model.state.search);
};

// ///////////////////////////////////////////////////////////////////////////////
const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

// ///////////////////////////////////////////////////////////////////////////////
const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render Bookmark
  bookmarksView.render(model.state.bookmarks);
};
// ///////////////////////////////////////////////////////////////////////////////
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// ///////////////////////////////////////////////////////////////////////////////
// Refer to views function
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);

  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
