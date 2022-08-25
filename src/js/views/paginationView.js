import View from './View';

import icons from 'url:../../imgs/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkupBtn() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const first = `
      <button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
          </svg>
      </button>
        `;
    const next = `
      <button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
      </button>
        `;
    if (curPage === 1 && numPages > 1) {
      return first;
    }

    //Last page
    if (curPage === numPages && numPages > 1) {
      return next;
    }

    //Other page
    if (curPage < numPages) {
      return [first, next];
    }
    //Page 1, and there are NO other pages
    if (curPage === 1) {
      return '';
    }
  }

  _generateMarkup() {
    return this._generateMarkupBtn();
  }
}
export default new PaginationView();
