// tic-tac-toe.js - Tic Tac Toe implementation.

const empty = 0;
const ai = 1;
const human = 2;

const playing = 0;
const endwin = 1;
const endlose = 2;
const enddraw = 3;

// Return 1 if a, b and c contain val, else return 0.
function has_at_least_three(a, b, c, val) {
    if (a === val && b === val && c === val) {
        return 1;
    }
    return 0;
}

// Return 1 if two among a, b, c contain val, and the other is empty, else return 0.
function has_at_least_two(a, b, c, val) {
    if ((a === empty && b === val && c === val)
        || (b === empty && a === val && c === val)
        || (c === empty && a === val && b === val)) {
        return 1;
    }
    return 0;
}

// Return 1 if one among a, b, c contains val, and the others are empty, else return 0.
function has_at_least_one(a, b, c, val) {
    if ((a === val && (b === empty || b === val) && (c === empty || c === val))
        || (b === val && (a === empty || a === val) && (c === empty || c === val))
        || (c === val && (a === empty || a === val) && (b === empty || b === val))) {
        return 1;
    }
    return 0;
}

// Return 1 if no one among a, b and c contain val.
function is_unobstructed_by_other(a, b, c, val) {
    if ((a === val || a === empty)
        && (b === val || b === empty)
        && (c === val || c === empty)) {
        return 1;
    }
    return 0;
}

// Return 1 if at least one line meets the conditions implemented by the scoring function.
function at_least_one_meets(board, val, score_line) {
    if (score_line(board[0], board[1], board[2], val) === 1) { return 1; } // row1
    if (score_line(board[3], board[4], board[5], val) === 1) { return 1; } // row2
    if (score_line(board[6], board[7], board[8], val) === 1) { return 1; } // row3
    if (score_line(board[0], board[3], board[6], val) === 1) { return 1; } // col1
    if (score_line(board[1], board[4], board[7], val) === 1) { return 1; } // col2
    if (score_line(board[2], board[5], board[8], val) === 1) { return 1; } // col3
    if (score_line(board[0], board[4], board[8], val) === 1) { return 1; } // diag1
    if (score_line(board[6], board[4], board[2], val) === 1) { return 1; } // diag2
    return 0;
}

// Return the count of how many lines satisfy the conditions implemented by the scoring function. 
function how_many_in_board_satisfy(board, val, score_line) {
    return score_line(board[0], board[1], board[2], val) // row1
        + score_line(board[3], board[4], board[5], val) // row2
        + score_line(board[6], board[7], board[8], val) //row3
        + score_line(board[0], board[3], board[6], val) // col1
        + score_line(board[1], board[4], board[7], val) // col2
        + score_line(board[2], board[5], board[8], val) // col3
        + score_line(board[0], board[4], board[8], val) // diag1
        + score_line(board[6], board[4], board[2], val); // diag2
}

// Return a random empty cell.
function get_random(board) {
    let rndnum = Math.floor(Math.random() * 8.0 + 1.0);
    for (let foundempty = 1; foundempty < 9;) {
        for (let cell = 0; cell < 9; cell++) {
            if (board[cell] === empty) {
                if (foundempty === rndnum) {
                    return cell;
                } else {
                    foundempty++;
                }
            }
        }
    }
    return 0;
}

// Check if the game is over.
function check_end(board) {
    if (at_least_one_meets(board, human, has_at_least_three)) {
        return endwin;
    } else if (at_least_one_meets(board, ai, has_at_least_three)) {
        return endlose;
    } else if (board[0] !== empty && board[1] !== empty && board[2] !== empty && board[3] !== empty && board[4] !== empty
        && board[5] !== empty && board[6] !== empty && board[7] !== empty && board[8] !== empty) {
        return enddraw;
    }
    return playing;
}

// Return the first cell which will generate a line satisfying the conditions implemented by the scoring function.
function get_first_satisfying(board, val, score_line) {
    for (let i = 0, result, tmpboard = board.slice(); i < 9; i++, tmpboard = board.slice()) {
        if (tmpboard[i] === empty) {
            tmpboard[i] = val;
            result = at_least_one_meets(tmpboard, val, score_line);
            if (result === 1) {
                return i;
            }
        }
    }
    return 100; // Invalid value.
}

// Return the cell which will generate more lines satisfying the conditions implemented by the scoring function.
function get_most_satisfying(board, val, score_line) {
    let max = 0; // maximum value for how_many_have_at_least_two.
    let max_id = 100; // id of the results cell containing the max value;

    for (let i = 0, tmpboard = board.slice(), results = [0, 0, 0, 0, 0, 0, 0, 0, 0]; i < 9; i++, tmpboard = board.slice()) {
        if (tmpboard[i] === empty) {
            tmpboard[i] = val;
            results[i] = how_many_in_board_satisfy(tmpboard, val, score_line);
            if (results[i] > max) {
                max = results[i];
                max_id = i;
            }
        }
    }
    return { position: max_id, weight: max };
}

// Return the best move possible for the AI.
function get_best(board) {
    // If the player has two cells in line, return the third.
    {
        let cell = get_first_satisfying(board, ai, has_at_least_three);
        if (cell < 9) { return cell; }
    }
    {
        let cell = get_first_satisfying(board, human, has_at_least_three);
        if (cell < 9) { return cell; }
    }

    // Special cases.
    if (((board[6] === human || board[2] === human)
        && board[6] !== ai && board[2] !== ai
        && ((board[0] !== ai && board[1] !== ai && board[3] !== ai)
            || (board[5] !== ai && board[7] !== ai && board[8] !== ai)))
        || ((board[8] === human || board[0] === human)
            && board[8] !== ai && board[0] !== ai
            && ((board[1] !== ai && board[2] !== ai && board[5] !== ai)
                || (board[3] !== ai && board[6] !== ai && board[7] !== ai)))) {
        if (board[4] === empty) {
            return 4;
        } else if (board[1] === empty) {
            return 1;
        } else if (board[3] === empty) {
            return 3;
        } else if (board[5] === empty) {
            return 5;
        } else if (board[7] === empty) {
            return 7;
        }
    }

    // Return the cell which will generate more lines satisfying the condition implemented by the scoring function.
    for (let line_scoring_func of [has_at_least_two, has_at_least_one, is_unobstructed_by_other]) {
        let cell = get_most_satisfying(board, ai, line_scoring_func);
        let cell2 = get_most_satisfying(board, human, line_scoring_func);
        if (cell.position < 9 && cell2.position < 9 && cell2.weight > cell.weight) { return cell2.position; }
        if (cell.position < 9) { return cell.position; }
        if (cell2.position < 9) { return cell2.position; }
    }
    return get_random(board);
}

// Return either the best move or a random move for the AI, the probability of the type of move depends from the level.
function get_at_level(board, level) {
    if (level > Math.floor(Math.random() * 8.0 + 1.0)) {
        return get_best(board);
    } else {
        return get_random(board);
    }
}

// Return true if board is a board.
function board_p(board) {
    return Array.isArray(board) &&
        (board[0] === empty || board[0] === ai || board[0] === human) &&
        (board[1] === empty || board[1] === ai || board[1] === human) &&
        (board[2] === empty || board[2] === ai || board[2] === human) &&
        (board[3] === empty || board[3] === ai || board[3] === human) &&
        (board[4] === empty || board[4] === ai || board[4] === human) &&
        (board[5] === empty || board[5] === ai || board[5] === human) &&
        (board[6] === empty || board[6] === ai || board[6] === human) &&
        (board[7] === empty || board[7] === ai || board[7] === human) &&
        (board[8] === empty || board[8] === ai || board[8] === human);
}

export default class TicTacToe {
    constructor() {
        this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.level = 9;

        this.load_from_localStorage = this.load_from_localStorage.bind(this);
        this.board_to_localStorage = this.save_to_localStorage.bind(this);
        this.level_to_localStorage = this.save_to_localStorage.bind(this);
        this.save_to_localStorage = this.save_to_localStorage.bind(this);
        this.reset = this.reset.bind(this);
        this.insert_in_board = this.insert_in_board.bind(this);
    }

    load_from_localStorage(prefix) {
        let defined_prefix = (prefix !== undefined) ? prefix : "";
        let board = localStorage.getItem(defined_prefix + 'board');
        let level = localStorage.getItem(defined_prefix + 'level');

        if (board) {
            board = JSON.parse(board);
            if (board_p(board)) {
                this.board = board;
            }
        }
        if (!isNaN(level) && level !== '' && parseInt(level) <= 9 && parseInt(level) >= 1) {
            this.level = level;
        }
    }

    save_board_to_localStorage(prefix) {
        let defined_prefix = (prefix !== undefined) ? prefix : "";
        localStorage.setItem(defined_prefix + 'board', JSON.stringify(this.board));
    }

    save_level_to_localStorage(prefix) {
        let defined_prefix = (prefix !== undefined) ? prefix : "";
        localStorage.setItem(defined_prefix + 'level', this.level);
    }

    save_to_localStorage(prefix) {
        this.save_board_to_localStorage(prefix);
        this.save_level_to_localStorage(prefix);
    }

    reset() {
        for (let i = 0; i < 9; i++) {
            this.board[i] = 0;
        }
    }

    insert_in_board(position, callback_notempty, callback_drawcell, callback_won, callback_lost, callback_drawn) {
        let cell;

        if (this.board[position] !== empty) {
            if (check_end(this.board) === playing) {
                callback_notempty();
            }
        } else {
            if (check_end(this.board) === playing) {
                this.board[position] = human;
                callback_drawcell(position);
                if (check_end(this.board) === playing) {
                    cell = get_at_level(this.board, this.level);
                    if (this.board[cell] === empty) {
                        this.board[cell] = ai;
                        callback_drawcell(cell);
                    }
                }
            }
        }
        switch (check_end(this.board)) {
            case endwin:
                callback_won();
                break;
            case endlose:
                callback_lost();
                break;
            case enddraw:
                callback_drawn();
                break;
            default:
                break;
        }
    }

}

export { TicTacToe, ai, human};