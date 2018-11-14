import { elements } from './base';

export const renderItem = item => {
    const markup = `
    <li class="shopping__item" data-itemid="${item.id}">
                    <div class="shopping__count">
                        <input type="number" min="0" value="${item.count}" step="${item.count}" class="shopping__count-value">
                        <p>${item.unit}</p>
                    </div>
                    <p class="shopping__description">${item.ingredient}</p>
                    <button class="shopping__delete btn-tiny">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-cross"></use>
                        </svg>
                    </button>
                </li>
    `;
    elements.shopping.insertAdjacentHTML('beforeend', markup);
}

export const deleteItem = id => {
    const item = document.querySelector(`[data-itemid="${id}"]`);
    if (item) item.parentElement.removeChild(item);
}

export const clearList = () => {
    const item = elements.shopping;
    while (item.firstChild) {
        item.removeChild(item.firstChild);
    }
}


export const highlightShoppingAmount = (item) => {
    if (item.value <= 0) {
        item.classList.add("highlightred"); 
    } else if (item.value > 0) {
        item.classList.remove("highlightred"); 
    } 
}

//get input from shopping list
export const getInput = () => { 
    const input = [];
    input.push(elements.addNewListItem.childNodes[1].value);
    input.push(elements.addNewListItem.childNodes[3].value);
    input.push(elements.addNewListItem.childNodes[5].value);
    if (input[2] !== '') return input;
    
};