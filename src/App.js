import React from 'react';
import './App.css';

import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import HelpIcon from '@material-ui/icons/Help';
import InfoIcon from '@material-ui/icons/Info';
import SettingsIcon from '@material-ui/icons/Settings';
import AutorenewIcon from '@material-ui/icons/Autorenew';

import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';


const empty = 0;
const ai = 1;
const human = 2;

const playing = 0;
const endwin = 1;
const endlose = 2;
const enddraw = 3;

var classes;

const useStyles =  makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        color: 'white',
        background: 'black',
    },
    menuButton: {
        marginRight: theme.spacing(2),
        color: 'white',
        background: 'black',
    },
    title: {
        flexGrow: 1,
        color: 'white',
        background: 'black',
    },
    reverse: {
        color: 'black',
        background: 'white',
    },
}));

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#000000',
        },
        secondary: {
            main: '#000000',
        },
    },
});

function valuetext(value) {
  return `${value}`;
}

class Board extends React.Component {
    constructor (props) {
        super(props);
        this.cnv = null; // canvas
        this.ctx = null; // graphic context
        this.cnv_top = null; // canvas y position
        this.selected = -1; // selected surface id
        // surfaces inside the canvas
        this.surf = [
	    {
	        xa: 0, ya: 0, xb: 0, yb: 0, left: 0, right: 1, up: 0, down: 3, clickable: true,
	        draw: () => { this.draw_cell_content(0); },
	        action: () => { this.insert_in_board(0); }
	    },
	    {
	        xa: 0, ya: 0, xb: 0, yb: 0, left: 0, right: 2, up: 1, down: 4, clickable: true,
	        draw: () => { this.draw_cell_content(1); },
	        action: () => { this.insert_in_board(1); }
	    },
	    {
	        xa: 0, ya: 0, xb: 0, yb: 0, left: 1, right: 2, up: 2, down: 5, clickable: true,
	        draw: () => { this.draw_cell_content(2); },
	        action: () => { this.insert_in_board(2); }
	    },

	    {
	        xa: 0, ya: 0, xb: 0, yb: 0, left: 3, right: 4, up: 0, down: 6, clickable: true,
	        draw: () => { this.draw_cell_content(3); },
	        action: () => { this.insert_in_board(3); }
	    },
	    {
	        xa: 0, ya: 0, xb: 0, yb: 0, left: 3, right: 5, up: 1, down: 7, clickable: true,
	        draw: () => { this.draw_cell_content(4); },
	        action: () => { this.insert_in_board(4); }
	    },
	    {
	        xa: 0, ya: 0, xb: 0, yb: 0, left: 4, right: 5, up: 2, down: 8, clickable: true,
	        draw: () => { this.draw_cell_content(5); },
	        action: () => { this.insert_in_board(5); }
	    },

	    {
	        xa: 0, ya: 0, xb: 0, yb: 0, left: 6, right: 7, up: 3, down: 6, clickable: true,
	        draw: () => { this.draw_cell_content(6); },
	        action: () => { this.insert_in_board(6); }
	    },
	    {
	        xa: 0, ya: 0, xb: 0, yb: 0, left: 6, right: 8, up: 4, down: 7, clickable: true,
	        draw: () => { this.draw_cell_content(7); },
	        action: () => { this.insert_in_board(7); }
	    },
	    {
	        xa: 0, ya: 0, xb: 0, yb: 0, left: 7, right: 8, up: 5, down: 8, clickable: true,
	        draw: () => { this.draw_cell_content(8); },
	        action: () => { this.insert_in_board(8); }
	    }
        ];
        
        this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.level = 9;
        this.state = {
            board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            level: 9,
            snack_won: false,
            snack_lost: false,
            snack_drawn: false,
            snack_notempty: false,
            dialog_info: false,
            dialog_help: false,
            dialog_settings: false
        };
        this.ticTacToeRef = React.createRef();

        this.snack_won = false;
        this.snack_lost = false;
        this.snack_drawn = false;
        this.snack_notempty = false;
        this.dialog_info = false;
        this.dialog_help = false;
        this.dialog_settings = false;

        this.close_snack_won = this.close_snack_won.bind(this);
        this.close_snack_lost = this.close_snack_lost.bind(this);
        this.close_snack_drawn = this.close_snack_drawn.bind(this);
        this.close_snack_notempty = this.close_snack_notempty.bind(this);
        this.close_dialog_info = this.close_dialog_info.bind(this);
        this.close_dialog_help = this.close_dialog_help.bind(this);
        this.close_dialog_settings = this.close_dialog_settings.bind(this);

        this.loadBoard = this.loadBoard.bind(this);
        this.saveBoard = this.saveBoard.bind(this);

        this.webapp_resize_canvas = this.webapp_resize_canvas.bind(this);
        this.mouse_handler = this.mouse_handler.bind(this);
        this.keyboard_handler = this.keyboard_handler.bind(this);
        this.draw = this.draw.bind(this);
        
        this.insert_in_board = this.insert_in_board.bind(this);
        
        this.resetgame = this.resetgame.bind(this);
        this.about = this.about.bind(this);
        this.help = this.help.bind(this);
        this.updateLevel = this.updateLevel.bind(this);
        this.settings = this.settings.bind(this);
       
    }

    loadBoard () {
        let board = localStorage.getItem('board');
        let level = localStorage.getItem('level');

        if (board) {
            board = JSON.parse(board);
            if (Array.isArray(board) &&
                (board[0] === empty || board[0] === ai || board[0] === human) &&
                (board[1] === empty || board[1] === ai || board[1] === human) &&
                (board[2] === empty || board[2] === ai || board[2] === human) &&
                (board[3] === empty || board[3] === ai || board[3] === human) &&
                (board[4] === empty || board[4] === ai || board[4] === human) &&
                (board[5] === empty || board[5] === ai || board[5] === human) &&
                (board[6] === empty || board[6] === ai || board[6] === human) &&
                (board[7] === empty || board[7] === ai || board[7] === human) &&
                (board[8] === empty || board[8] === ai || board[8] === human)) {
                this.board = board;
            }
        }
        if (! isNaN(level) && level !== '' && parseInt(level) <= 9 && parseInt(level) >=1) {
            this.level = level;
        }
        this.setState({
            board: this.board,
            level: this.level,
            snack_won: this.snack_won,
            snack_lost: this.snack_lost,
            snack_drawn: this.snack_drawn,
            snack_notempty: this.snack_notempty,
            dialog_info: this.dialog_info,
            dialog_help: this.dialog_help,
            dialog_settings: this.dialog_settings
        });
    }

    saveBoard () {
        this.setState({
            board: this.board,
            level: this.level,
            snack_won: this.snack_won,
            snack_lost: this.snack_lost,
            snack_drawn: this.snack_drawn,
            snack_notempty: this.snack_notempty,
            dialog_info: this.dialog_info,
            dialog_help: this.dialog_help,
            dialog_settings: this.dialog_settings
        });
        localStorage.setItem('board', JSON.stringify(this.board));
        localStorage.setItem('level', this.level);
    }

    resetgame() {
        for (let i = 0; i < 9; i++) {
            this.board[i] = 0;
        }
        this.saveBoard();
        this.draw();
    }

    help() {
        this.dialog_help = true;
        this.saveBoard();
    }
    
    about() {
        this.dialog_info = true;
        this.saveBoard();
    }

    updateLevel (sliderobj,sliderval) {
        if (sliderval) {
            this.level = sliderval;
        }
        this.saveBoard();
    }

    settings() {
        this.dialog_settings = true;
        this.saveBoard();
    }

    webapp_resize_canvas() {
        this.cnv_top = document.getElementById("topBar").getBoundingClientRect().bottom;
        this.cnv.width = window.innerWidth;
        this.cnv.height = window.innerHeight - this.cnv_top;
        this.cnv.style.top=this.cnv_top+'px';
        this.cnv.style.height=(window.innerHeight-this.cnv_top)+'px';
    }

    webapp_get_canvas() {
        return document.getElementById('canvas');
    }

    webapp_get_context() {
        let cnv = document.getElementById('canvas');
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
    webapp_get_grid(howmany_rects, bottom, top) {
        let i;
        let rects = [];
        if (this.cnv.width > (bottom - top)) {
            for (i = 0; i < howmany_rects; i++) {
                rects.push({ x: this.cnv.width * i / howmany_rects, y: top, w: this.cnv.width / howmany_rects, h: (bottom - top) });
            }
        } else {
            for (i = 0; i < howmany_rects; i++) {
                rects.push({ x: 0, y: top + bottom * i / howmany_rects, w: this.cnv.width, h: (bottom - top) / howmany_rects });
            }
        }
        return rects;
    }

    // Return a random empty cell.
    get_random() {
        let rndnum = Math.floor(Math.random() * 8.0 + 1.0);
        for (let foundempty = 1; foundempty < 9;) {
	    for (let cell = 0; cell < 9; cell++) {
	        if (this.board[cell] === empty) {
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

    // Return 1 if a, b and c contain val, else return 0.
    has_at_least_three(a, b, c, val) {
        if (a === val && b === val && c === val) {
	    return 1;
        }
        return 0;
    }

    // Return 1 if two among a, b, c contain val, and the other is empty, else return 0.
    has_at_least_two(a, b, c, val) {
        if ((a === empty && b === val && c === val)
	    || (b === empty && a === val && c === val)
	    || (c === empty && a === val && b === val)) {
	    return 1;
        }
        return 0;
    }

    // Return 1 if one among a, b, c contains val, and the others are empty, else return 0.
    has_at_least_one(a, b, c, val) {
        if ((a === val && (b === empty || b === val) && (c === empty || c === val))
	    || (b === val && (a === empty || a === val) && (c === empty || c === val))
	    || (c === val && (a === empty || a === val) && (b === empty || b === val))) {
	    return 1;
        }
        return 0;
    }

    // Return 1 if no one among a, b and c contain val.
    is_unobstructed_by(a, b, c, val) {
        if (a !== val && b !== val && c !== val) {
	    return 1;
        }
        return 0;
    }

    // Return 1 if no one among a, b and c contain val.
    is_unobstructed_by_other(a, b, c, val) {
        if ((a === val || a === empty)
	    && (b === val || b === empty)
	    && (c === val || c === empty)) {
	    return 1;
        }
        return 0;
    }

    // Return 1 if at least one line meets the conditions implemented by the scoring function.
    at_least_one_meets(board, val, score_line) {
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
    how_many_in_board_satisfy(board, val, score_line) {
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
    check_end() {
        if (this.at_least_one_meets(this.board, human, this.has_at_least_three)) {
	    return endwin;
        } else if (this.at_least_one_meets(this.board, ai, this.has_at_least_three)) {
	    return endlose;
        } else if (this.board[0] !== empty && this.board[1] !== empty && this.board[2] !== empty && this.board[3] !== empty && this.board[4] !== empty
	           && this.board[5] !== empty && this.board[6] !== empty && this.board[7] !== empty && this.board[8] !== empty) {
	    return enddraw;
        }
        return playing;
    }

    // Return the first cell which will generate a line satisfying the conditions implemented by the scoring function.
    get_first_satisfying(val, score_line) {
        for (let i = 0, result, tmpboard = this.board.slice(); i < 9; i++, tmpboard = this.board.slice()) {
	    if (tmpboard[i] === empty) {
	        tmpboard[i] = val;
	        result = this.at_least_one_meets(tmpboard, val, score_line);
	        if (result === 1) {
		    return i;
	        }
	    }
        }
        return 100; // Invalid value.
    }

    // Return the cell which will generate more lines satisfying the conditions implemented by the scoring function.
    get_most_satisfying(board, val, score_line) {
        let max = 0; // maximum value for how_many_have_at_least_two.
        let max_id = 100; // id of the results cell containing the max value;

        for (let i = 0, tmpboard = board.slice(), results = [0, 0, 0, 0, 0, 0, 0, 0, 0]; i < 9; i++, tmpboard = board.slice()) {
	    if (tmpboard[i] === empty) {
	        tmpboard[i] = val;
	        results[i] = this.how_many_in_board_satisfy(tmpboard, val, score_line);
	        if (results[i] > max) {
		    max = results[i];
		    max_id = i;
	        }
	    }
        }
        return { position: max_id, weight: max };
    }

    get_best() {
        // If the player has two cells in line, return the third.
        {
	    let cell = this.get_first_satisfying(ai, this.has_at_least_three);
	    if (cell < 9) { return cell; }
        }
        {
	    let cell = this.get_first_satisfying(human, this.has_at_least_three);
	    if (cell < 9) { return cell; }
        }

        // Special cases.
        if (((this.board[6] === human || this.board[2] === human)
	     && this.board[6] !== ai && this.board[2] !== ai
	     && ((this.board[0] !== ai && this.board[1] !== ai && this.board[3] !== ai)
	         || (this.board[5] !== ai && this.board[7] !== ai && this.board[8] !== ai)))
	    || ((this.board[8] === human || this.board[0] === human)
	        && this.board[8] !== ai && this.board[0] !== ai
	        && ((this.board[1] !== ai && this.board[2] !== ai && this.board[5] !== ai)
		    || (this.board[3] !== ai && this.board[6] !== ai && this.board[7] !== ai)))) {
	    if (this.board[4] === empty) {
	        return 4;
	    } else if (this.board[1] === empty) {
	        return 1;
	    } else if (this.board[3] === empty) {
	        return 3;
	    } else if (this.board[5] === empty) {
	        return 5;
	    } else if (this.board[7] === empty) {
	        return 7;
	    }
        }

        // Return the cell which will generate more lines satisfying the condition implemented by the scoring function.
        for (let line_scoring_func of [this.has_at_least_two, this.has_at_least_one, this.is_unobstructed_by_other]) {
	    let cell = this.get_most_satisfying(this.board, ai, line_scoring_func);
	    let cell2 = this.get_most_satisfying(this.board, human, line_scoring_func);
	    if (cell.position < 9 && cell2.position < 9 && cell2.weight > cell.weight) { return cell2.position; }
	    if (cell.position < 9) { return cell.position; }
	    if (cell2.position < 9) { return cell2.position; }
        }
        return this.get_random(this.board);
    }

    get_at_level() {
        if (this.level > Math.floor(Math.random() * 8.0 + 1.0)) {
	    return this.get_best(this.board);
        } else {
	    return this.get_random(this.board);
        }
    }

    insert_in_board(position) {
        let cell;
        
        if (this.board[position] !== empty) {
	    if (this.check_end() === playing) {
                this.snack_notempty = true;
                this.saveBoard();
	    }
        } else {
	    if (this.check_end() === playing) {
	        this.board[position] = human;
	        this.surf[position].draw();
	        if (this.check_end() === playing) {
		    cell = this.get_at_level();
		    if (this.board[cell] === empty) {
		        this.board[cell] = ai;
		        this.surf[cell].draw();
		    }
	        }
	    }
        }
	switch (this.check_end()) {
	case endwin:
            this.snack_won = true;
            this.saveBoard();
	    break;
	case endlose:
            this.snack_lost = true;
            this.saveBoard();
	    break;
	case enddraw:
            this.snack_drawn = true;
            this.saveBoard();
	    break;
	default:
            this.saveBoard();
	    break;
        }
    }

    close_snack_won(myevent, myreason){
        if (myreason === 'clickaway') {
            return;
        }
        this.snack_won = false;
        this.saveBoard();
    }
    
    close_snack_lost(myevent, myreason){
        if (myreason === 'clickaway') {
            return;
        }
        this.snack_lost = false;
        this.saveBoard();
    }
    
    close_snack_drawn(myevent, myreason){
        if (myreason === 'clickaway') {
            return;
        }
        this.snack_drawn = false;
        this.saveBoard();
    }

    close_snack_notempty(myevent, myreason){
        if (myreason === 'clickaway') {
            return;
        }
        this.snack_notempty = false;
        this.saveBoard();
    }

    close_dialog_info(myevent, myreason){
        if (myreason === 'clickaway') {
            return;
        }
        this.dialog_info = false;
        this.saveBoard();
    }

    close_dialog_help(myevent, myreason){
        if (myreason === 'clickaway') {
            return;
        }
        this.dialog_help = false;
        this.saveBoard();
    }

    close_dialog_settings(myevent, myreason){
        if (myreason === 'clickaway') {
            return;
        }
        this.dialog_settings = false;
        this.saveBoard();
    }

    draw_circle(x, y, w, h) {
        var radius;
        if (w < h) {
	    radius = w * 0.4;
        } else {
	    radius = h * 0.4;
        }
        this.ctx.beginPath();
        this.ctx.arc(x + radius * 1.2, y + radius * 1.2, radius, 0, 2 * Math.PI);
        this.ctx.stroke();
    }

    draw_x(x, y, w, h) {
        let s; /* the shortest between w and h */
        if (w < h) {
	    s = w;
        } else {
	    s = h;
        }

        /* center and leave some margin */
        s = s * 0.8;
        y = y + (h - s) / 2;
        x = x + (w - s) / 2;

        this.ctx.beginPath();

        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + s, y + s);

        this.ctx.moveTo(x, y + s);
        this.ctx.lineTo(x + s, y);

        this.ctx.stroke();
    }

    draw_cell_content(cell_id) {
        let margin;

        margin = Math.ceil(this.ctx.lineWidth / 2);

        if (this.selected === cell_id) {
	    this.ctx.fillStyle = "yellow";
	    margin = margin + 1;
        } else {
	    this.ctx.fillStyle = "white";
        }
        this.ctx.fillRect(this.surf[cell_id].xa + margin, this.surf[cell_id].ya + margin,
                          this.surf[cell_id].xb - this.surf[cell_id].xa - margin * 2,
                          this.surf[cell_id].yb - this.surf[cell_id].ya - margin * 2);
        if (this.board[cell_id] === ai) {
	    this.ctx.fillStyle = "black";
	    this.draw_circle(this.surf[cell_id].xa, this.surf[cell_id].ya, this.surf[cell_id].xb - this.surf[cell_id].xa, this.surf[cell_id].yb - this.surf[cell_id].ya);
        } else if (this.board[cell_id] === human) {
	    this.ctx.fillStyle = "black";
	    this.draw_x(this.surf[cell_id].xa, this.surf[cell_id].ya, this.surf[cell_id].xb - this.surf[cell_id].xa, this.surf[cell_id].yb - this.surf[cell_id].ya);
        }
    }

    draw_cells_content() {
        let i = 0;
        for (i = 0; i < 9; i++) {
	    this.draw_cell_content(i);
        }
    }

    draw_board(x, y, w, h) {
        let s; /* the shortest between w and h */

        this.ctx.fillStyle = "white";
        this.ctx.fillRect(x, y, w, h);

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
	    this.ctx.lineWidth = s * 0.02;
        } else {
	    this.ctx.lineWidth = 1;
        }

        /* update surfaces */
        this.surf[0].xa = this.surf[3].xa = this.surf[6].xa = x;
        this.surf[1].xa = this.surf[4].xa = this.surf[7].xa = this.surf[0].xb = this.surf[3].xb = this.surf[6].xb = x + s / 3;
        this.surf[2].xa = this.surf[5].xa = this.surf[8].xa = this.surf[1].xb = this.surf[4].xb = this.surf[7].xb = x + s * 2 / 3;
        this.surf[2].xb = this.surf[5].xb = this.surf[8].xb = x + s * 3 / 3;

        this.surf[0].ya = this.surf[1].ya = this.surf[2].ya = y;
        this.surf[3].ya = this.surf[4].ya = this.surf[5].ya = this.surf[0].yb = this.surf[1].yb = this.surf[2].yb = y + s / 3;
        this.surf[6].ya = this.surf[7].ya = this.surf[8].ya = this.surf[3].yb = this.surf[4].yb = this.surf[5].yb = y + s * 2 / 3;
        this.surf[6].yb = this.surf[7].yb = this.surf[8].yb = y + s * 3 / 3;

        /* draw */
        this.ctx.beginPath();

        /* lower-left to upper-left */
        this.ctx.moveTo(x + s / 3, y + s);
        this.ctx.lineTo(x + s / 3, y);

        /* lower-right to upper-right */
        this.ctx.moveTo(x + s * 2 / 3, y + s);
        this.ctx.lineTo(x + s * 2 / 3, y);

        /* upper-right to upper-left */
        this.ctx.moveTo(x + s, y + s / 3);
        this.ctx.lineTo(x, y + s / 3);

        /* lower-right to lower-left */
        this.ctx.moveTo(x + s, y + s * 2 / 3);
        this.ctx.lineTo(x, y + s * 2 / 3);

        this.ctx.stroke();
    }

    draw() {
        let grid;
        grid = this.webapp_get_grid(1, this.cnv.height, 0);
        this.draw_board(grid[0].x, grid[0].y, grid[0].w, grid[0].h);
        this.draw_cells_content();
    }

    mouse_handler(evt) {
        switch (evt.type) {
        case 'mousedown':
        case 'touchend':
        case 'click':
        case 'dblclick':
	    for (let i = 0; i < this.surf.length; i++) {
	        if (evt.clientX >= this.surf[i].xa && evt.clientX <= this.surf[i].xb
		    && evt.clientY - this.cnv_top >= this.surf[i].ya && evt.clientY - this.cnv_top <= this.surf[i].yb) {
		    if (this.surf[i].clickable === true) {
		        this.surf[i].action();
		    }
		    break;
	        }
	    }
	    break;
        default:
	    for (let i = 0; i < this.surf.length; i++) {
	        if (evt.clientX >= this.surf[i].xa && evt.clientX <= this.surf[i].xb
		    && evt.clientY - this.cnv_top >= this.surf[i].ya && evt.clientY - this.cnv_top <= this.surf[i].yb) {
		    if (this.surf[i].clickable === true && this.selected !== i) {
		        let old_selected = this.selected;
		        this.selected = i;
		        if (old_selected >= 0) {
			    this.surf[old_selected].draw();
		        }
		        this.surf[this.selected].draw();
		        break;
		    }
	        }
	    }
	    break;
        }
    }

    keyboard_handler(evt) {
        let old_selected = this.selected;
        switch (evt.type) {
        case 'keypress':
        case 'keydown':
	    if (this.selected < 0) {
	        this.selected = 0;
	        this.surf[this.selected].draw();
	    } else {
	        switch (evt.key) {
	        case 'ArrowRight':
		    this.selected = this.surf[this.selected].right;
		    this.surf[old_selected].draw();
		    this.surf[this.selected].draw();
		    break;
	        case 'ArrowLeft':
		    this.selected = this.surf[this.selected].left;
		    this.surf[old_selected].draw();
		    this.surf[this.selected].draw();
		    break;
	        case 'ArrowUp':
		    this.selected = this.surf[this.selected].up;
		    this.surf[old_selected].draw();
		    this.surf[this.selected].draw();
		    break;
	        case 'ArrowDown':
		    this.selected = this.surf[this.selected].down;
		    this.surf[old_selected].draw();
		    this.surf[this.selected].draw();
		    break;
	        case 'Enter':
		    this.surf[this.selected].action();
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
    
    webapp_init() {

        this.cnv = this.webapp_get_canvas();
        this.ctx = this.webapp_get_context();
        
        window.addEventListener('resize', this.webapp_resize_canvas, false);
        window.addEventListener('resize', this.draw, false);
        this.webapp_resize_canvas();

        this.cnv.addEventListener('mousedown', this.mouse_handler);
        this.cnv.addEventListener('mouseenter', this.mouse_handler);
        this.cnv.addEventListener('mouseleave', this.mouse_handler);
        this.cnv.addEventListener('mousemove', this.mouse_handler);
        this.cnv.addEventListener('touchend', this.mouse_handler);

        window.addEventListener('keypress', this.keyboard_handler);
        window.addEventListener('keydown', this.keyboard_handler);

        window.addEventListener('resize', this.draw, false);

        this.draw();
    }

    componentDidMount() {
        this.loadBoard();
        this.webapp_init();
    }

    render () {

        return (
            <div ref={this.ticTacToeRef}>

              <div className={classes.root} id="topBar">
                <AppBar position="static" className={classes.root}>
                  <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                      Tic Tac Toe
                    </Typography>
                    <IconButton color="inherit" aria-label="restart game" onClick={this.resetgame}>
                      <AutorenewIcon />
                    </IconButton>
                    <IconButton color="inherit" aria-label="settings" onClick={this.settings}>
                      <SettingsIcon />
                    </IconButton>
                    <IconButton color="inherit" aria-label="help" onClick={this.help}>
                      <HelpIcon />
                    </IconButton>
                    <IconButton color="inherit" aria-label="about" onClick={this.about}>
                      <InfoIcon />
                    </IconButton>
                  </Toolbar>
                </AppBar>
              </div>
              
              <canvas className="webapp" id="canvas" tabIndex={0}>ERROR: Cannot create canvas.</canvas>

              <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={this.state.snack_won}
                autoHideDuration={2000}
                onClose={this.close_snack_won}
                message="You Won!"
                action={
                    <React.Fragment>
                      <IconButton size="small" aria-label="close" color="inherit" onClick={this.close_snack_won}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </React.Fragment>
                }
              />

              <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={this.state.snack_lost}
                autoHideDuration={2000}
                onClose={this.close_snack_lost}
                message="You Lost!"
                action={
                    <React.Fragment>
                      <IconButton size="small" aria-label="close" color="inherit" onClick={this.close_snack_lost}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </React.Fragment>
                }
              />
              
              <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={this.state.snack_drawn}
                autoHideDuration={2000}
                onClose={this.close_snack_drawn}
                message="Game Drawn!"
                action={
                    <React.Fragment>
                      <IconButton size="small" aria-label="close" color="inherit" onClick={this.close_snack_drawn}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </React.Fragment>
                }
              />

              <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={this.state.snack_notempty}
                autoHideDuration={2000}
                onClose={this.close_snack_notempty}
                message="Selected cell is not empty!"
                action={
                    <React.Fragment>
                      <IconButton size="small" aria-label="close" color="inherit" onClick={this.close_snack_notempty}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </React.Fragment>
                }
              />

              <Dialog open={this.state.dialog_settings} onClose={this.close_dialog_settings} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Settings</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    <p>Difficulty level: {this.state.level}</p>
                  </DialogContentText>
                  <div className={classes.reverse}>
                    <Typography id="discrete-slider" gutterBottom>
                      Level
                    </Typography>
                    <ThemeProvider theme={theme}>
                      <Slider
                        defaultValue={this.state.level}
                        getAriaValueText={valuetext}
                        aria-labelledby="discrete-slider"
                        valueLabelDisplay="auto"
                        step={1}
                        marks
                        min={1}
                        max={9}
                        onChangeCommitted={this.updateLevel}
                      />
                    </ThemeProvider>
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.close_dialog_settings} color="inherit">
                    Close
                  </Button>
                </DialogActions>
              </Dialog>

              
              <Dialog open={this.state.dialog_help} onClose={this.close_dialog_help} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Help</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    <p>This is a tic-tac-toe game.</p>
                    <p>The human player uses the X symbol, the AI player uses the O symbol. Who can put three symbols in line (horizontal, vertical or diagonal) wins.</p>
                    <p>To change the difficulty level, click on the settings icon.</p>
                    <p>To restart the game, click on the restart icon.</p>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.close_dialog_help} color="inherit">
                    Close
                  </Button>
                </DialogActions>
              </Dialog>

              <Dialog open={this.state.dialog_info} onClose={this.close_dialog_info} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">About</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    <p>Copyright &copy; 2000,2002,2017,2019,2020,2021 Marco Parrone.</p>
		    <p>Permission is hereby granted, free of charge, to any person obtaining a copy
		      of this software and associated documentation files (the "Software"), to deal
		      in the Software without restriction, including without limitation the rights
		      to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		      copies of the Software, and to permit persons to whom the Software is
		      furnished to do so, subject to the following conditions:</p>
		    <p>The above copyright notice and this permission notice shall be included in all
		      copies or substantial portions of the Software.</p>
                    <p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                      OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                      SOFTWARE.</p>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.close_dialog_info} color="inherit">
                    Close
                  </Button>
                </DialogActions>
              </Dialog>

            </div>
        );
    };
}

function App() {
    classes = useStyles();
    return (
        <div className="App">
          <Board/>
        </div>
    );
}

export default App;

// Local Variables:
// mode: rjsx
// End:
