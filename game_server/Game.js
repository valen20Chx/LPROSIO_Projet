var Room = require('./Room');

class Game {
    constructor(code, max_size) {
        this.code = code;
        this.max_size = max_size;
        this.room = new Room(this.code, this.max_size);
    }
};