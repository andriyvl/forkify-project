import axios from 'axios';
import {key, proxy} from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            console.log(error);
            alert('something is wrong')
        }
    }

    calcTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings () {
        this.servings = 4;
    }

    parseIngredients () {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds', 'kilo', 'gramms'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(el => {
            // 1. uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]); //replace measure names
            })
            // 2. remove parantheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' '); //replacing parantheses with nothing using regex

            // 3. parse ingredients into count
            const arrIng = ingredient.split(' '); //split each word in array values
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2)); // if element is in array - returns true if not - false

            let objIng;
            if (unitIndex > -1) {
            //there is a unit
            //ex. 4 1/2 cups, arrCount is [4, 1/2]
            //ex. 4 cups, arrCount is [4]
            const arrCount = arrIng.slice(0, unitIndex);
            let count;
            if (arrCount.length === 1) {
                count = eval(arrIng[0].replace('-', '+'));
            } else {
                count = eval(arrIng.slice(0, unitIndex).join('+')); //eval
            }

            objIng = {
                count,
                unit: arrIng[unitIndex],
                ingredient: arrIng.slice(unitIndex + 1).join(' ')
            }
            
            } else if (parseInt(arrIng[0], 10)) {
                //if there is no unit but in the first position is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ') //start at position 1 and to the end.
                }
            } else if (unitIndex === -1 ) {
                //there is no unit and no number in the first position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }


            return objIng;
        });
        this.ingredients = newIngredients;
    }
    updateServings (type) {
        //Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
        //Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings); //updates the count of ingredients corresponding with the number of servings
        });

        this.servings = newServings;
    }
}