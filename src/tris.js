/*
 * tris.java
 *
 * Copyright (c) 2000,2002,2010,2019 Marco Parrone.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

export function check_end(board) {
    if ((board[1] === board[2] && board[1] === board[3] && board[3] === 2)
        || (board[4] === board[5] && board[4] === board[6] && board[6] === 2)
        || (board[7] === board[8] && board[7] === board[9] && board[9] === 2)
        || (board[1] === board[4] && board[4] === board[7] && board[7] === 2)
        || (board[2] === board[5] && board[5] === board[8] && board[8] === 2)
        || (board[3] === board[6] && board[6] === board[9] && board[9] === 2)
        || (board[1] === board[5] && board[5] === board[9] && board[9] === 2)
        || (board[7] === board[5] && board[5] === board[3] && board[3] === 2)) {
        return "WIN";
    } else if ((board[1] === board[2] && board[1] === board[3] && board[3] === 1)
               || (board[4] === board[5] && board[4] === board[6] && board[6] === 1)
               || (board[7] === board[8] && board[7] === board[9] && board[9] === 1)
               || (board[1] === board[4] && board[4] === board[7] && board[7] === 1)
               || (board[2] === board[5] && board[5] === board[8] && board[8] === 1)
               || (board[3] === board[6] && board[6] === board[9] && board[9] === 1)
               || (board[1] === board[5] && board[5] === board[9] && board[9] === 1)
               || (board[7] === board[5] && board[5] === board[3] && board[3] === 1)) {
        return "LOSE";
    } else if (board[1] !== 0 && board[2] !== 0 && board[3] !== 0 && board[4] !== 0 && board[5] !== 0
               && board[6] !== 0 && board[7] !== 0 && board[8] !== 0 && board[9] !== 0) {
        return "DRAW";
    }
    return 0;
}

function get_random(board) {
    var i;
    var j;
    var r = Math.floor (Math.random() * 8.0 + 1.0);
    for (j = 1; j < 9;) {
        for (i = 1; i < 10; i++) {
            if (board[i] === 0) {
                if (j === r) {
                    return i;
                } else {
                    j++;
                }
            }
        }
        if (j === 1) {
            return 0;
        }
    }
    return 0;
}

function get_best(board) {
    if (board[3] === board[1] && board[1] === 1 && board[2] === 0) {
        return 2;
    } else if (board[9] === board[1] && board[1] === 1 && board[5] === 0) {
        return 5;
    } else if (board[7] === board[1] && board[1] === 1 && board[4] === 0) {
        return 4;
    } else if (board[2] === board[1] && board[1] === 1 && board[3] === 0) {
        return 3;
    } else if (board[5] === board[1] && board[1] === 1 && board[9] === 0) {
        return 9;
    } else if (board[4] === board[1] && board[1] === 1 && board[7] === 0) {
        return 7;
    } else if (board[8] === board[2] && board[2] === 1 && board[5] === 0) {
        return 5;
    } else if (board[3] === board[2] && board[2] === 1 && board[1] === 0) {
        return 1;
    } else if (board[7] === board[3] && board[3] === 1 && board[5] === 0) {
        return 5;
    } else if (board[5] === board[3] && board[3] === 1 && board[7] === 0) {
        return 7;
    } else if (board[9] === board[3] && board[3] === 1 && board[6] === 0) {
        return 6;
    } else if (board[6] === board[3] && board[3] === 1 && board[9] === 0) {
        return 9;
    } else if (board[7] === board[4] && board[4] === 1 && board[1] === 0) {
        return 1;
    } else if (board[5] === board[4] && board[4] === 1 && board[6] === 0) {
        return 6;
    } else if (board[6] === board[4] && board[4] === 1 && board[5] === 0) {
        return 5;
    } else if (board[2] === board[5] && board[5] === 1 && board[8] === 0) {
        return 8;
    } else if (board[6] === board[5] && board[5] === 1 && board[4] === 0) {
        return 4;
    } else if (board[7] === board[5] && board[5] === 1 && board[3] === 0) {
        return 3;
    } else if (board[8] === board[5] && board[5] === 1 && board[2] === 0) {
        return 2;
    } else if (board[9] === board[5] && board[5] === 1 && board[1] === 0) {
        return 1;
    } else if (board[9] === board[6] && board[6] === 1 && board[3] === 0) {
        return 3;
    } else if (board[8] === board[7] && board[7] === 1 && board[9] === 0) {
        return 9;
    } else if (board[9] === board[7] && board[7] === 1 && board[8] === 0) {
        return 8;
    } else if (board[9] === board[8] && board[8] === 1 && board[7] === 0) {
        return 7;
    } else if (board[3] === board[1] && board[1] === 2 && board[2] === 0) {
        return 2;
    } else if (board[9] === board[1] && board[1] === 2 && board[5] === 0) {
        return 5;
    } else if (board[7] === board[1] && board[1] === 2 && board[4] === 0) {
        return 4;
    } else if (board[2] === board[1] && board[1] === 2 && board[3] === 0) {
        return 3;
    } else if (board[5] === board[1] && board[1] === 2 && board[9] === 0) {
        return 9;
    } else if (board[4] === board[1] && board[1] === 2 && board[7] === 0) {
        return 7;
    } else if (board[8] === board[2] && board[2] === 2 && board[5] === 0) {
        return 5;
    } else if (board[3] === board[2] && board[2] === 2 && board[1] === 0) {
        return 1;
    } else if (board[7] === board[3] && board[3] === 2 && board[5] === 0) {
        return 5;
    } else if (board[5] === board[3] && board[3] === 2 && board[7] === 0) {
        return 7;
    } else if (board[9] === board[3] && board[3] === 2 && board[6] === 0) {
        return 6;
    } else if (board[6] === board[3] && board[3] === 2 && board[9] === 0) {
        return 9;
    } else if (board[7] === board[4] && board[4] === 2 && board[1] === 0) {
        return 1;
    } else if (board[5] === board[4] && board[4] === 2 && board[6] === 0) {
        return 6;
    } else if (board[6] === board[4] && board[4] === 2 && board[5] === 0) {
        return 5;
    } else if (board[2] === board[5] && board[5] === 2 && board[8] === 0) {
        return 8;
    } else if (board[6] === board[5] && board[5] === 2 && board[4] === 0) {
        return 4;
    } else if (board[7] === board[5] && board[5] === 2 && board[3] === 0) {
        return 3;
    } else if (board[8] === board[5] && board[5] === 2 && board[2] === 0) {
        return 2;
    } else if (board[9] === board[5] && board[5] === 2 && board[1] === 0) {
        return 1;
    } else if (board[9] === board[6] && board[6] === 2 && board[3] === 0) {
        return 3;
    } else if (board[8] === board[7] && board[7] === 2 && board[9] === 0) {
        return 9;
    } else if (board[9] === board[7] && board[7] === 2 && board[8] === 0) {
        return 8;
    } else if (board[9] === board[8] && board[8] === 2 && board[7] === 0) {
        return 7;
    } else if (board[1] === board[9] && board[9] === 2 && board[8] === 1 && board[5] === 0) {
        return 5;
    } else if (board[1] === 2 && board[2] === board[3] && board[3] === board[4]
               && board[4] === board[5] && board[5] === board[6] && board[6] === board[7]
               && board[7] === board[8] && board[8] === board[9] && board[9] === 0) {
        return 5;
    } else if (board[7] === 2 && board[0] === 1 && board[8] === 0) {
        return 8;
    } else if (board[7] === board[3] && board[3] === 2 && board[8] === 1 && board[5] === 0) {
        return 5;
    } else if (board[1] === board[6] && board[6] === 2 && board[5] === 0) {
        return 5;
    } else if (board[4] === board[2] && board[2] === 2 && board[1] === 1 && board[5] === 0) {
        return 5;
    } else if (board[8] === board[6] && board[6] === 2 && board[1] === 1 && board[4] === 0) {
        return 4;
    } else if (board[6] === board[2] && board[2] === 2 && board[1] === 1 && board[5] === 0) {
        return 5;
    } else if (board[8] === board[4] && board[4] === 2 && board[1] === 1 && board[5] === 0) {
        return 5;
    } else if (board[6] === 2 && board[9] === board[3] && board[3] === board[4]
               && board[4] === board[5] && board[5] === board[1] && board[1] === board[7]
               && board[7] === board[8] && board[8] === board[2] && board[2] === 0) {
        return 2;
    } else if (board[6] === board[1] && board[1] === 2 && board[5] === 1 && board[3] === 0) {
        return 3;
    } else if (board[6] === board[8] && board[8] === 2 && board[2] === 1 && board[9] === 0) {
        return 9;
    } else if (board[8] === 2 && board[2] === board[3] && board[3] === board[4]
               && board[4] === board[5] && board[5] === board[6] && board[6] === board[7]
               && board[7] === board[1] && board[1] === board[9] && board[9] === 0) {
        return 6;
    } else if (board[0] === 2 && board[3] === board[4] && board[4] === 2 && board[5] === 0) {
        return 5;
    } else if (board[0] === 2 && board[7] === board[6] && board[6] === 2 && board[8] === 1 && board[5] === 0) {
        return 5;
    } else {
        return get_random(board);
    }
}

export function get_at_level(board, level) {
    var r = Math.floor (Math.random() * 8.0 + 1.0);
    if (level > r) {
        return get_best(board);
    } else {
        return get_random(board);
    }
}
