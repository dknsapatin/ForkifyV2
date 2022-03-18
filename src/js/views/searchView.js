class SearchView {
  _parentEl = document.querySelector('.search');

  getQuery() {
    //   Get the value of the search field
    const query = this._parentEl.querySelector('.search__field').value;
    // Clears the input field for the next search input value
    this._clearInput();
    return query;
  }

  _clearInput() {
    return (this._parentEl.querySelector('.search__field').value = '');
  }

  // ///////////////////////////////////////////////////////////////////////////////
  //Publisher subscriber pattern (Assigning controlRecipes as handler)
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
