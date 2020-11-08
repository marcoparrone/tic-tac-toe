/*
 * webapp.js
 *
 * Copyright (c) 2020 Marco Parrone.
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

function webapp_init() {
    window.addEventListener('resize', webapp_resize_canvas, false);
    window.addEventListener('resize', webapp_draw, false);
    webapp_resize_canvas();
}

function webapp_resize_canvas() {
    cnv = document.getElementById('canvas');
    cnv.width = window.innerWidth;
    cnv.height = window.innerHeight;
}

function webapp_draw() {
    var cnv = document.getElementById('canvas');
    var ctx = cnv.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, cnv.width, cnv.height);
}

function webapp_get_canvas() {
    return document.getElementById('canvas');
}

function webapp_get_context() {
    cnv = document.getElementById('canvas');
    return cnv.getContext('2d');
}

/*
 * This function splits the canvas area in a grid of equal
 * howmany_rects rectangles.
 *
 * It returns an array of howmmany_rects elements, each containing an
 * array of 4 integer elements: the x and y coordinates, the height
 * and the width.
 */
function webapp_get_grid(howmany_rects, bottombar_y) {
    var cnv = document.getElementById('canvas');
    var i;
    var rects = [];
    if (cnv.width > bottombar_y) {
        for (i = 0; i < howmany_rects; i++) {
            rects.push({ x: cnv.width * i / howmany_rects, y: 0, w: cnv.width / howmany_rects, h: bottombar_y });
        }
    } else {
        for (i = 0; i < howmany_rects; i++) {
            rects.push({ x: 0, y: bottombar_y * i / howmany_rects, w: cnv.width, h: bottombar_y / howmany_rects });
        }
    }
    return rects;
}

function webapp_get_grid_with_topbar(howmany_rects, bottombar_y, topbar_y) {
    var cnv = document.getElementById('canvas');
    var i;
    var rects = [];
    if (cnv.width > (bottombar_y - topbar_y)) {
        for (i = 0; i < howmany_rects; i++) {
            rects.push({ x: cnv.width * i / howmany_rects, y: topbar_y, w: cnv.width / howmany_rects, h: (bottombar_y - topbar_y) });
        }
    } else {
        for (i = 0; i < howmany_rects; i++) {
            rects.push({ x: 0, y: topbar_y + bottombar_y * i / howmany_rects, w: cnv.width, h: (bottombar_y - topbar_y) / howmany_rects });
        }
    }
    return rects;
}

function webapp_draw_string(str, font, fg, bg, x, yandh) {
    var cnv = document.getElementById('canvas');
    var ctx = cnv.getContext('2d');
    var font_height;
    var y;
    ctx.font = font;
    ctx.fillStyle = bg;
    font_height = ctx.measureText('M').width;
    y = yandh - font_height * 1.7;
    ctx.fillRect(0, y, cnv.width, cnv.height - y);
    ctx.fillStyle = fg;
    ctx.fillText(str, x, cnv.height - font_height / 2);
    return y;
}

function webapp_merge_maybe_multiline_strings_array(srcarg) {
    var cnv = document.getElementById('canvas');
    var ctx = cnv.getContext('2d');
    var src = srcarg;
    var dst = [];
    var dontexit = true;
    while (dontexit) {
        if (src.length > 1
            && (ctx.measureText(src[0]).width
                + ctx.measureText(src[1]).width) < cnv.width) {
            dst.push(src[0] + src[1]);
            src.shift();
            src.shift();
            dst = dst.concat(src);
            src = dst;
            dst = [];
            continue;
        } else if (src.length > 0) {
            dst.push(src[0]);
            src.shift();
        } else {
            dontexit = false;
        }
    }
    return dst;
}

function webapp_get_y_for_maybe_multiline_strings_array(strarray, font, fg, bg, x, yandh) {
    var cnv = document.getElementById('canvas');
    var ctx = cnv.getContext('2d');
    var font_height;
    var y;
    var newstrarray;
    var i;

    ctx.font = font;
    font_height = ctx.measureText('M').width * 1.3;

    newstrarray = webapp_merge_maybe_multiline_strings_array(strarray);

    if (yandh === 0) {
        y = 0;
    } else {
        y = yandh - font_height * 1.2 * newstrarray.length;
    }

    if (yandh == 0) {
        return font_height * 1.2 * newstrarray.length;
    } else {
        return y;
    }
}


function webapp_draw_maybe_multiline_strings_array(strarray, font, fg, bg, x, yandh) {
    var cnv = document.getElementById('canvas');
    var ctx = cnv.getContext('2d');
    var font_height;
    var y;
    var newstrarray;
    var i;

    ctx.font = font;
    font_height = ctx.measureText('M').width * 1.3;

    newstrarray = webapp_merge_maybe_multiline_strings_array(strarray);

    ctx.fillStyle = bg;
    if (yandh === 0) {
        y = 0;
        ctx.fillRect(0, 0, cnv.width, y + font_height * 1.2 * newstrarray.length);
    } else {
        y = yandh - font_height * 1.2 * newstrarray.length;
        ctx.fillRect(0, y, cnv.width, cnv.height - y);
    }

    ctx.fillStyle = fg;
    for (i = 0; i < newstrarray.length; i++) {
        ctx.fillText(newstrarray[i], 0, y + font_height * (i + 1));
    }
    if (yandh == 0) {
        return font_height * 1.2 * newstrarray.length;
    } else {
        return y;
    }
}

function webapp_update_topbar_buttons_positions(buttons, first, last, font_height) {
    var cnv = document.getElementById('canvas');
    var ctx = cnv.getContext('2d');
    var i;
    var celllength;
    var totlength = cnv.width;
    var rowx = 0;
    var rowy = 0;

    for (i = first; i <= last; i++) {
        celllength = ctx.measureText(buttons[i].label).width;
        if (celllength + rowx > totlength) {
            rowlength = 0;
            rowx = 0;
            rowy = rowy + font_height;
        }
        buttons[i].xa = rowx;
        buttons[i].ya = rowy;
        buttons[i].xb = rowx + celllength;
        buttons[i].yb = rowy + font_height;
        rowx = rowx + celllength;

        if (i === last && buttons[i].alignright === true) {
            buttons[i].xa = cnv.width - (buttons[i].xb - buttons[i].xa);
            buttons[i].xb = cnv.width;
        }
    }
    return rowy + font_height * 1.2;
}

function webapp_draw_topbar(buttons, first, last, font, fg, selfg, bg, selected) {
    var cnv = document.getElementById('canvas');
    var ctx = cnv.getContext('2d');
    var font_height;
    var yb;
    var i;

    ctx.font = font;
    font_height = ctx.measureText('M').width * 1.2;

    yb = webapp_update_topbar_buttons_positions(buttons, first, last, font_height);

    ctx.fillStyle = bg;

    ctx.fillRect(0, 0, cnv.width, yb);

    for (i = first; i <= last; i++) {
        if (selected === i) {
            ctx.fillStyle = selfg;
        } else {
            ctx.fillStyle = fg;
        }
        ctx.fillText(buttons[i].label, buttons[i].xa, buttons[i].yb);
        console.log()
    }
}

/*
 * tic-tac-toe.js
 *
 * Copyright (c) 2020 Marco Parrone.
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

var board;
var level;
var surf;
var selected;

var cnv;
var ctx;

const empty = 0;
const ai = 1;
const human = 2;

const playing = 0;
const endwin = 1;
const endlose = 2;
const enddraw = 3;

// Return a random empty cell.
function get_random() {
    var rndnum = Math.floor(Math.random() * 8.0 + 1.0);
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
}

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
function is_unobstructed_by(a, b, c, val) {
    if (a !== val && b !== val && c !== val) {
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
    if (score_line(board[0], board[1], board[2], val) == 1) { return 1; } // row1
    if (score_line(board[3], board[4], board[5], val) == 1) { return 1; } // row2
    if (score_line(board[6], board[7], board[8], val) == 1) { return 1; } // row3
    if (score_line(board[0], board[3], board[6], val) == 1) { return 1; } // col1
    if (score_line(board[1], board[4], board[7], val) == 1) { return 1; } // col2
    if (score_line(board[2], board[5], board[8], val) == 1) { return 1; } // col3
    if (score_line(board[0], board[4], board[8], val) == 1) { return 1; } // diag1
    if (score_line(board[6], board[4], board[2], val) == 1) { return 1; } // diag2
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

// Check if the game is over.
function check_end() {
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
function get_first_satisfying(val, score_line) {
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
    var max = 0; // maximum value for how_many_have_at_least_two.
    var max_id = 100; // id of the results cell containing the max value;

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

function get_best() {
    // If the player has two cells in line, return the third.
    {
	let cell = get_first_satisfying(ai, has_at_least_three);
	if (cell < 9) { return cell; }
    }
    {
	let cell = get_first_satisfying(human, has_at_least_three);
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

function get_at_level() {
    if (level > Math.floor(Math.random() * 8.0 + 1.0)) {
	return get_best(board);
    } else {
	return get_random(board);
    }
}

function insert_in_board(position) {
    var cell;
    if (board[position] !== empty) {
	surf[14].label = " Cell is not empty!";
	webapp_draw_topbar(surf, 9, 15, "20pt Arial", 'white', 'yellow', 'black', selected);
    } else {
	if (check_end() === playing) {
	    board[position] = human;
	    surf[position].draw();
	    if (check_end() === playing) {
		cell = get_at_level();
		if (board[cell] === empty) {
		    board[cell] = ai;
		    surf[cell].draw();
		}
	    }
	}
	switch (check_end()) {
	case endwin:
	    surf[14].label = " You Won!";
	    webapp_draw_topbar(surf, 9, 15, "20pt Arial", 'white', 'yellow', 'black', selected);
	    break;
	case endlose:
	    surf[14].label = " You Lost!";
	    webapp_draw_topbar(surf, 9, 15, "20pt Arial", 'white', 'yellow', 'black', selected);
	    break;
	case enddraw:
	    surf[14].label = " Game Drawn!";
	    webapp_draw_topbar(surf, 9, 15, "20pt Arial", 'white', 'yellow', 'black', selected);
	    break;
	default:
	    if (surf[14].label == " Cell is not empty!") {
		surf[14].label = "";
		draw();
	    }
	    break;
	}
    }
}

function draw_circle(x, y, w, h) {
    var radius;
    if (w < h) {
	radius = w * 0.4;
    } else {
	radius = h * 0.4;
    }
    ctx.beginPath();
    ctx.arc(x + radius * 1.2, y + radius * 1.2, radius, 0, 2 * Math.PI);
    ctx.stroke();
}

function draw_x(x, y, w, h) {
    var s; /* the shortest between w and h */
    if (w < h) {
	s = w;
    } else {
	s = h;
    }

    /* center and leave some margin */
    s = s * 0.8;
    y = y + (h - s) / 2;
    x = x + (w - s) / 2;

    ctx.beginPath();

    ctx.moveTo(x, y);
    ctx.lineTo(x + s, y + s);

    ctx.moveTo(x, y + s);
    ctx.lineTo(x + s, y);

    ctx.stroke();
}

function draw_cell_content(cell_id) {
    var margin;

    margin = Math.ceil(ctx.lineWidth / 2)

    if (selected === cell_id) {
	ctx.fillStyle = "yellow";
	margin = margin + 1;
    } else {
	ctx.fillStyle = "white";
    }
    ctx.fillRect(surf[cell_id].xa + margin, surf[cell_id].ya + margin, surf[cell_id].xb - surf[cell_id].xa - margin * 2, surf[cell_id].yb - surf[cell_id].ya - margin * 2);

    if (board[cell_id] === ai) {
	ctx.fillStyle = "black";
	draw_circle(surf[cell_id].xa, surf[cell_id].ya, surf[cell_id].xb - surf[cell_id].xa, surf[cell_id].yb - surf[cell_id].ya);
    } else if (board[cell_id] === human) {
	ctx.fillStyle = "black";
	draw_x(surf[cell_id].xa, surf[cell_id].ya, surf[cell_id].xb - surf[cell_id].xa, surf[cell_id].yb - surf[cell_id].ya);
    }
}

function draw_cells_content() {
    for (i = 0; i < 9; i++) {
	draw_cell_content(i);
    }
}

function draw_board(x, y, w, h) {
    var s; /* the shortest between w and h */

    ctx.fillStyle = "white";
    ctx.fillRect(x, y, w, h);

    if (w < h) {
	s = w;
    } else {
	s = h;
    }

    /* center and leave some margin */
    s = s * 2 / 3;
    y = (h - s) / 2;
    x = (w - s) / 2;

    /* calculate the line width */
    if (s > 100) {
	ctx.lineWidth = s * 0.02;
    } else {
	ctx.lineWidth = 1;
    }

    /* update surfaces */
    surf[0].xa = surf[3].xa = surf[6].xa = x;
    surf[1].xa = surf[4].xa = surf[7].xa = surf[0].xb = surf[3].xb = surf[6].xb = x + s / 3;
    surf[2].xa = surf[5].xa = surf[8].xa = surf[1].xb = surf[4].xb = surf[7].xb = x + s * 2 / 3;
    surf[2].xb = surf[5].xb = surf[8].xb = x + s * 3 / 3;

    surf[0].ya = surf[1].ya = surf[2].ya = y;
    surf[3].ya = surf[4].ya = surf[5].ya = surf[0].yb = surf[1].yb = surf[2].yb = y + s / 3;
    surf[6].ya = surf[7].ya = surf[8].ya = surf[3].yb = surf[4].yb = surf[5].yb = y + s * 2 / 3;
    surf[6].yb = surf[7].yb = surf[8].yb = y + s * 3 / 3;

    /* draw */
    ctx.beginPath();

    /* lower-left to upper-left */
    ctx.moveTo(x + s / 3, y + s);
    ctx.lineTo(x + s / 3, y);

    /* lower-right to upper-right */
    ctx.moveTo(x + s * 2 / 3, y + s);
    ctx.lineTo(x + s * 2 / 3, y);

    /* upper-right to upper-left */
    ctx.moveTo(x + s, y + s / 3);
    ctx.lineTo(x, y + s / 3);

    /* lower-right to lower-left */
    ctx.moveTo(x + s, y + s * 2 / 3);
    ctx.lineTo(x, y + s * 2 / 3);

    ctx.stroke();
}

function draw() {
    var grid;
    var homepage_bottom_y = 0;
    var homepage_top_y = 0;

    homepage_top_y = webapp_get_y_for_maybe_multiline_strings_array([surf[9].label, surf[10].label, surf[11].label, surf[12].label, surf[13].label],
								    "20pt Arial", 'white', 'black', 0, 0);

    homepage_bottom_y = webapp_get_y_for_maybe_multiline_strings_array(["Copyright © ", "2020 ", "Marco Parrone ", "<marco@marcoparrone.com>. ", "No Warranty."],
								       "10pt Arial", 'white', 'black', 0, cnv.height);

    grid = webapp_get_grid_with_topbar(1, homepage_bottom_y, homepage_top_y);

    draw_board(grid[0].x, grid[0].y, grid[0].w, grid[0].h);

    draw_cells_content();

    webapp_draw_topbar(surf, 9, 15, "20pt Arial", 'white', 'yellow', 'black', selected);

    webapp_draw_maybe_multiline_strings_array(["Copyright © ", "2020 ", "Marco Parrone ", "<marco@marcoparrone.com>. ", "No Warranty."],
					      "10pt Arial", 'white', 'black', 0, cnv.height);
}

function mouse_handler(evt) {
    switch (evt.type) {
    case 'mousedown':
    case 'touchend':
    case 'click':
    case 'dblclick':
	for (let i = 0; i < surf.length; i++) {
	    if (evt.clientX >= surf[i].xa && evt.clientX <= surf[i].xb
		&& evt.clientY >= surf[i].ya && evt.clientY <= surf[i].yb) {
		if (surf[i].clickable === true) {
		    surf[i].action();
		}
		break;
	    }
	}
	break;
    default:
	for (let i = 0; i < surf.length; i++) {
	    if (evt.clientX >= surf[i].xa && evt.clientX <= surf[i].xb
		&& evt.clientY >= surf[i].ya && evt.clientY <= surf[i].yb) {
		if (surf[i].clickable === true && selected !== i) {
		    let old_selected = selected;
		    selected = i;
		    if (old_selected >= 0) {
			surf[old_selected].draw();
		    }
		    surf[selected].draw();
		    break;
		}
	    }
	}
	break;
    }
}

function keyboard_handler(evt) {
    var old_selected = selected;
    switch (evt.type) {
    case 'keypress':
    case 'keydown':
	if (selected < 0) {
	    selected = 0;
	    surf[selected].draw();
	} else {
	    switch (evt.key) {
	    case 'ArrowRight':
		selected = surf[selected].right;
		surf[old_selected].draw();
		surf[selected].draw();
		break;
	    case 'ArrowLeft':
		selected = surf[selected].left;
		surf[old_selected].draw();
		surf[selected].draw();
		break;
	    case 'ArrowUp':
		selected = surf[selected].up;
		surf[old_selected].draw();
		surf[selected].draw();
		break;
	    case 'ArrowDown':
		selected = surf[selected].down;
		surf[old_selected].draw();
		surf[selected].draw();
		break;
	    case 'Enter':
		surf[selected].action();
		break;
	    default:
		break;
	    }
	}
	break;
    default:
	break;
    }
}

function app_init() {
    cnv = webapp_get_canvas();
    ctx = webapp_get_context();

    board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    level = 9;
    selected = -1;

    surf = [
	{
	    xa: 0, ya: 0, xb: 0, yb: 0, left: 0, right: 1, up: 11, down: 3, clickable: true,
	    draw: () => { draw_cell_content(0); },
	    action: () => { insert_in_board(0); }
	},
	{
	    xa: 0, ya: 0, xb: 0, yb: 0, left: 0, right: 2, up: 13, down: 4, clickable: true,
	    draw: () => { draw_cell_content(1); },
	    action: () => { insert_in_board(1); }
	},
	{
	    xa: 0, ya: 0, xb: 0, yb: 0, left: 1, right: 2, up: 15, down: 5, clickable: true,
	    draw: () => { draw_cell_content(2); },
	    action: () => { insert_in_board(2); }
	},

	{
	    xa: 0, ya: 0, xb: 0, yb: 0, left: 3, right: 4, up: 0, down: 6, clickable: true,
	    draw: () => { draw_cell_content(3); },
	    action: () => { insert_in_board(3); }
	},
	{
	    xa: 0, ya: 0, xb: 0, yb: 0, left: 3, right: 5, up: 1, down: 7, clickable: true,
	    draw: () => { draw_cell_content(4); },
	    action: () => { insert_in_board(4); }
	},
	{
	    xa: 0, ya: 0, xb: 0, yb: 0, left: 4, right: 5, up: 2, down: 8, clickable: true,
	    draw: () => { draw_cell_content(5); },
	    action: () => { insert_in_board(5); }
	},

	{
	    xa: 0, ya: 0, xb: 0, yb: 0, left: 6, right: 7, up: 3, down: 6, clickable: true,
	    draw: () => { draw_cell_content(6); },
	    action: () => { insert_in_board(6); }
	},
	{
	    xa: 0, ya: 0, xb: 0, yb: 0, left: 6, right: 8, up: 4, down: 7, clickable: true,
	    draw: () => { draw_cell_content(7); },
	    action: () => { insert_in_board(7); }
	},
	{
	    xa: 0, ya: 0, xb: 0, yb: 0, left: 7, right: 8, up: 5, down: 8, clickable: true,
	    draw: () => { draw_cell_content(8); },
	    action: () => { insert_in_board(8); }
	},

	{ xa: 0, ya: 0, xb: 0, yb: 0, clickable: false, label: "Difficulty " },
	{ xa: 0, ya: 0, xb: 0, yb: 0, clickable: false, label: "Level: " },

	{
	    xa: 0, ya: 0, xb: 0, yb: 0, left: 11, right: 13, up: 11, down: 0, clickable: true, label: "  -  ",
	    draw: () => { webapp_draw_topbar(surf, 9, 15, "20pt Arial", 'white', 'yellow', 'black', selected); },
	    action: () => { if (level > 1) { level = level - 1; surf[12].label = level.toString(); webapp_draw_topbar(surf, 9, 15, "20pt Arial", 'white', 'yellow', 'black', selected); } }
	},

	{ xa: 0, ya: 0, xb: 0, yb: 0, clickable: false, label: "9" },

	{
	    xa: 0, ya: 0, xb: 0, yb: 0, left: 11, right: 15, up: 13, down: 1, clickable: true, label: "  +  ",
	    draw: () => { webapp_draw_topbar(surf, 9, 15, "20pt Arial", 'white', 'yellow', 'black', selected); },
	    action: () => { if (level < 9) { level = level + 1; surf[12].label = level.toString(); webapp_draw_topbar(surf, 9, 15, "20pt Arial", 'white', 'yellow', 'black', selected); } }
	},

	{ xa: 0, ya: 0, xb: 0, yb: 0, clickable: false, label: "" },

	{
	    xa: 0, ya: 0, xb: 0, yb: 0, left: 13, right: 15, up: 15, down: 2, clickable: true, label: "Restart ", alignright: true,
	    draw: () => { webapp_draw_topbar(surf, 9, 15, "20pt Arial", 'white', 'yellow', 'black', selected); },
	    action: () => { 
		board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
		if (surf[14].label != "") {
		    surf[14].label = "";
		}
		draw();
	    }
	}
    ];

    webapp_init();

    cnv = webapp_get_canvas();

    cnv.addEventListener('mousedown', mouse_handler);
    cnv.addEventListener('mouseenter', mouse_handler);
    cnv.addEventListener('mouseleave', mouse_handler);
    cnv.addEventListener('mousemove', mouse_handler);
    cnv.addEventListener('touchend', mouse_handler);

    window.addEventListener('keypress', keyboard_handler);
    window.addEventListener('keydown', keyboard_handler);

    window.addEventListener('resize', draw, false);
    webapp_draw();
    draw();
}

app_init();
