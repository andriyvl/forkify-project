export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, image) {
        const like = { id, title, author, image };
        this.likes.push(like);

        //LOCAL STORAGE
        this.persistData();

        return like;
    } 
    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        //LOCAL STORAGE
        this.persistData();
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        if (storage) {
            
            //restore likes from the localStorage
            this.likes = storage;
        }
    }
}