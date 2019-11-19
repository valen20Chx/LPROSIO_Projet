var Player = require('./Player');

class Room {
    constructor(code, max_size) {
        this.code = code;
        this.size = 0;
        this.max_size = max_size;
        this.player_list = Array(0);
    }

    add_player(player) {
        this.player_list.push(player);
    }

    get_player_list() {
        return this.player_list;
    }

    get_code() {
        return this.code;
    }

    set_code(code) {
        this.code = code;
    }
};

module.exports = Room;