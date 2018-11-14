import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }
    
    addItem (count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient,
        }
        this.items.push(item);
        console.log(this.items);
        this.persistData();

        return item;
    }

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);
        // [2, 4, 8] splice(1, 2) -> returns [4, 8] original array will be [2] (second parameters is how many positins are taken)
        // [2, 4, 8] slice(1, 2) -> returns 4, original array will be [2, 4, 8] (second parameter is the end position)
        this.items.splice(index, 1);
        this.persistData();
    }
    clearList() {
        this.items = [];
        this.persistData();
    }
    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount; //find element(ES6 find) and update count to new Count
    }

    persistData() {
        localStorage.setItem('list', JSON.stringify(this.items));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('list'));
        if (storage) {
            //restore likes from the localStorage
            this.items = storage;
        }
    }

}