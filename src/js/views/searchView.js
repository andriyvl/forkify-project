import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => { 
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
}

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link')); //add the all active or not elements to array
    resultsArr.forEach( el => el.classList.remove('results__link--active')); //remove the active class
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
}

export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length; //updates the accumulator value!!!!!!
        }, 0); 
        //converts sting into array - every word into array value
        return `${newTitle.join(' ')} ...`;
    } else { return title }
}

const renderRecipe = recipe => {
    const markup = `
                    <li>
                    <a class="results__link" href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="${recipe.title}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                    </li>`;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

//Page PREV NEXT butttons
const createButton = (page, type) => `
        <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>

`;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);

    let button;
    if ( page === 1 && pages > 1) {
        //only next page btn
        button = createButton(page, 'next');
    } else if ( page < pages) {
        //both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {
        //only back btn
        button = createButton(page, 'prev');
    }
    if (button) {
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
    }
};



export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    //render results of current page
    const start = (page - 1) * resPerPage; //starting position
    const end = page * resPerPage;
    recipes.slice(start, end).forEach(renderRecipe); // slices the recipes array and renders each of the results
    //render pagination buttons
    renderButtons(page, recipes.length, resPerPage);
};
