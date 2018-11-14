import axios from 'axios';
import {key, proxy} from '../config.js';

export default class Search {
    constructor(query) {
        this.query = query;
    }
    async getResults() {
        
        try {
            //const proxy;
            const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            //const res = await axios(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${this.query}`);
            this.result = res.data.recipes;
        } catch (error) {
            alert(error);
        };
    }
}