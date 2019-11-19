class Player {
    constructor(name) {
        this.name = name;
        this.score = 0;
    }

    get_name() {
        return this.name;
    }

    get_score() {
        return this.score;
    }

    set_score(score) {
        this.score = score;
    }

    set_name(name) {
        this.name = name;
    }

    add_score(score) {
        this.score += score;
    }

    sub_score(amount) {
        this.score -= amount;
        // Si score < 0 : score = 0
        if(this.score < 0) {
            this.score = 0;
        }
    }
};

module.exports = Player;