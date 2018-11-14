import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

const clickandinput = ['input', 'click'];
// import  state  from 'fs';


/* Global state of the App
* Search object
* current Recipe object 
* shopping list object
* liked Recipes
*/

const state = {};

const controlSearch  = async () => {
    //1. get query from view

    const query = searchView.getInput();
    if (query) {
        //2. new search obj and add to state
        state.search = new Search(query);

        //3. prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        
        try {
        //4. search for recipes
        await state.search.getResults();

        //5. render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
        } catch (err) {
            console.log(err);
            alert('Something went wrong')
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault(); //so that the page does not reload when clicking on search
    controlSearch();
})


elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline') // using closest allows always selecting the main element
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

/* 
* RECIPE DETAILS CONTROLER 
*/

const controlRecipe  = async () => {
    //get id from url
    const id = window.location.hash.replace('#', ''); //replaces the HASH with nothing

    if (id) {
        // prepare ui for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        //highlight selected search item
        if (state.search) searchView.highlightSelected(id);
        
        //create new recipe objects
        state.recipe = new Recipe(id);
        if(!state.likes) state.likes = new Likes();


        try {
            //get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            //calc servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            //render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
                );

        } catch (err) {
            console.log(state.likes);
            console.log(err);
            alert('Error processing recipe');
        }
    }
}

/* window.addEventListener('hashchange', controlRecipe);
window.addEventListener('load', controlRecipe); */
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe)); 
//when user reloads the page with id in address - load event starts and calls controlRecipe



//handling RECIPE BUTTON CLICKS
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *'))    {
        //decrease servings button is clicked
        if (state.recipe.servings > 1) {
        state.recipe.updateServings('dec');
        recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *'))  {
        //decrease button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if ( e.target.matches('.recipe__btn--add, recipe__btn--add *') )   {
        //add ingredients to shopping list
        controlList();
    } else if ( e.target.matches('.recipe__love, .recipe__love *') )  {
        //like controler
        controlLike();
    }
});





/*** 
 * SHOPPING LIST CONTROLLER 
*/


const controlList = () => {
    //create new list if there is none yet
    if (!state.list) state.list = new List();
    state.list.readStorage();
    //add each ing to list
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    })

}

//handling delete and update list item events ADD: manual input and arrows work
clickandinput.forEach(event => elements.shopping.addEventListener(event, e => {
    const id = e.target.closest('.shopping__item').dataset.itemid; //locates the element id only

    //handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        //delete items from state
        state.list.deleteItem(id);
        //delete from ui
        listView.deleteItem(id);

        //handle count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        if (val < 0) {
            listView.highlightShoppingAmount(e.target);
        } else if (val >= 0) { 
            listView.highlightShoppingAmount(e.target);
            state.list.updateCount(id, val); 
        }
    } 
}))

elements.clearshoppingbtn.addEventListener('click', () => {
    if (!state.list) state.list = new List();
    state.list.clearList();
    console.log(state.list);
    listView.clearList();
})

//
elements.addNewListItemBtn.addEventListener('click', () => {
    if (!state.list) state.list = new List();
    const input = listView.getInput();
    const item = state.list.addItem(input[0], input[1], input[2]);
    listView.renderItem(item);
})

//on PAGE LOAD - restore shopping list
window.addEventListener('load', e =>  {
    if (!state.list) state.list = new List();
    state.list.readStorage();
    state.list.items.forEach(el => listView.renderItem(el))
})



/*** 
 * LIKE CONTROLLER 
*/


const controlLike = () => {
    if(!state.likes) state.likes = new Likes();
    
    const currentID = state.recipe.id;
    
    if (!state.likes.isLiked(currentID)) {
        //add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        )
        //toggle the like
            likesView.toggleLikeBtn(true);
        //add to the ui list
        likesView.renderLike(newLike);
    
    //user has liked the current recipe
    } else {
        //remove like to the state
        state.likes.deleteLike(currentID);
        //toggle the like
        likesView.toggleLikeBtn(false);
        //remove to the ui list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}


//Restore likes on page load

window.addEventListener('load', () => {
    if(!state.likes) state.likes = new Likes();
    //restore likes
    state.likes.readStorage();
    //toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    //render existing likes
    if (state.likes.likes) {
    state.likes.likes.forEach(like => likesView.renderLike(like));
}
})

clickandinput.forEach(event => elements.addNewListItem.addEventListener(event, e => { 
    if (e.target.matches('.listitem__number')) listView.highlightShoppingAmount(e.target) 
    }));