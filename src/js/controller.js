import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

//coming from parcel
if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();
    //0)Results view to mark selected searchResult
    resultsView.update(model.getSearchResultsPage());
    //0)Updating BookMarks view
    bookmarksView.update(model.state.bookmarks);

    // 1.Loading recipe
    await model.loadRecipe(id);
    // 2.Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};
const controlSearchResults = async function () {
  try {
    // resultsView.renderSpinner() ;
    //1)Get search query
    const query = searchView.qetQuery();
    if (!query) return;
    //2)Load search results
    await model.loadSearchResult(query);
    //3)render results
    console.log(model.state.search.results);
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage(1));

    //4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  console.log(goToPage);
  //1)render new result
  resultsView.render(model.getSearchResultsPage(goToPage));
  //2) Render new Pagination btns
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update The recipe Servings
  model.updateServings(newServings);
  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  // 1)) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //2) Update recipe view
  recipeView.update(model.state.recipe);
  //3)
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  //upload new recipe data
  try {
    //Show loading Spinner
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    //Render recipe
    recipeView.render(model.state.recipe);
    //Success message
    addRecipeView.renderMessage();
    //Render bookmark View
    bookmarksView.render(model.state.bookmarks);

    //Change id in URL
    window.history
      .pushState(null, '', `#${model.state.recipe.id}`)

      //Close form window
      .setTimeout(function () {
        addRecipeView.toggleWindow();
      }, 2500);
  } catch (err) {
    console.error;
    err;
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.render(model.state.bookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();
