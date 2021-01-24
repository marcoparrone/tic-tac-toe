// webapp.js - game graphics and input.

import {ai, human} from './tic-tac-toe';

function get_canvas() {
    return document.getElementById('canvas');
}

function get_context() {
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
function get_grid(canvas, howmany_rects, bottom, top) {
    let i;
    let rects = [];
    if (canvas.width > (bottom - top)) {
        for (i = 0; i < howmany_rects; i++) {
            rects.push({ x: canvas.width * i / howmany_rects, y: top, w: canvas.width / howmany_rects, h: (bottom - top) });
        }
    } else {
        for (i = 0; i < howmany_rects; i++) {
            rects.push({ x: 0, y: top + bottom * i / howmany_rects, w: canvas.width, h: (bottom - top) / howmany_rects });
        }
    }
    return rects;
}

function draw_circle(context, x, y, w, h) {
    var radius;
    if (w < h) {
        radius = w * 0.4;
    } else {
        radius = h * 0.4;
    }
    context.beginPath();
    context.arc(x + radius * 1.2, y + radius * 1.2, radius, 0, 2 * Math.PI);
    context.stroke();
}

function draw_x(context, x, y, w, h) {
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

    context.beginPath();

    context.moveTo(x, y);
    context.lineTo(x + s, y + s);

    context.moveTo(x, y + s);
    context.lineTo(x + s, y);

    context.stroke();
}

export default class WebApp {
    constructor(callerObject) {
        this.cnv = get_canvas();
        this.ctx = get_context();
        this.cnv_top = null; // canvas y position
        this.selected = -1; // selected surface id
        this.parent = callerObject;
        // surfaces inside the canvas
        this.surf = [
            {
                xa: 0, ya: 0, xb: 0, yb: 0, left: 0, right: 1, up: 0, down: 3, clickable: true,
                draw: () => { this.parent.draw_cell_content(0); },
                action: () => { this.parent.insert_in_board(0); }
            },
            {
                xa: 0, ya: 0, xb: 0, yb: 0, left: 0, right: 2, up: 1, down: 4, clickable: true,
                draw: () => { this.parent.draw_cell_content(1); },
                action: () => { this.parent.insert_in_board(1); }
            },
            {
                xa: 0, ya: 0, xb: 0, yb: 0, left: 1, right: 2, up: 2, down: 5, clickable: true,
                draw: () => { this.parent.draw_cell_content(2); },
                action: () => { this.parent.insert_in_board(2); }
            },

            {
                xa: 0, ya: 0, xb: 0, yb: 0, left: 3, right: 4, up: 0, down: 6, clickable: true,
                draw: () => { this.parent.draw_cell_content(3); },
                action: () => { this.parent.insert_in_board(3); }
            },
            {
                xa: 0, ya: 0, xb: 0, yb: 0, left: 3, right: 5, up: 1, down: 7, clickable: true,
                draw: () => { this.parent.draw_cell_content(4); },
                action: () => { this.parent.insert_in_board(4); }
            },
            {
                xa: 0, ya: 0, xb: 0, yb: 0, left: 4, right: 5, up: 2, down: 8, clickable: true,
                draw: () => { this.parent.draw_cell_content(5); },
                action: () => { this.parent.insert_in_board(5); }
            },

            {
                xa: 0, ya: 0, xb: 0, yb: 0, left: 6, right: 7, up: 3, down: 6, clickable: true,
                draw: () => { this.parent.draw_cell_content(6); },
                action: () => { this.parent.insert_in_board(6); }
            },
            {
                xa: 0, ya: 0, xb: 0, yb: 0, left: 6, right: 8, up: 4, down: 7, clickable: true,
                draw: () => { this.parent.draw_cell_content(7); },
                action: () => { this.parent.insert_in_board(7); }
            },
            {
                xa: 0, ya: 0, xb: 0, yb: 0, left: 7, right: 8, up: 5, down: 8, clickable: true,
                draw: () => { this.parent.draw_cell_content(8); },
                action: () => { this.parent.insert_in_board(8); }
            }
        ];
        this.resize_canvas = this.resize_canvas.bind(this);
        this.draw_cell_content_helper = this.draw_cell_content_helper.bind(this);
        this.draw_cells_content = this.draw_cells_content.bind(this);
        this.draw_board = this.draw_board.bind(this);
        this.draw = this.draw.bind(this);
        this.mouse_handler = this.mouse_handler.bind(this);
        this.keyboard_handler = this.keyboard_handler.bind(this);
        this.init = this.init.bind(this);
    }

    resize_canvas() {
        this.cnv_top = document.getElementById("topBar").getBoundingClientRect().bottom;
        this.cnv.width = window.innerWidth;
        this.cnv.height = window.innerHeight - this.cnv_top;
        this.cnv.style.top = this.cnv_top + 'px';
        this.cnv.style.height = (window.innerHeight - this.cnv_top) + 'px';
    }

    draw_cell_content_helper(board, cell_id) {
        let margin;
        this.cnv = get_canvas();
        this.ctx = get_context();
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
        if (board[cell_id] === ai) {
            this.ctx.fillStyle = "black";
            draw_circle(this.ctx, this.surf[cell_id].xa, this.surf[cell_id].ya, this.surf[cell_id].xb - this.surf[cell_id].xa, this.surf[cell_id].yb - this.surf[cell_id].ya);
        } else if (board[cell_id] === human) {
            this.ctx.fillStyle = "black";
            draw_x(this.ctx, this.surf[cell_id].xa, this.surf[cell_id].ya, this.surf[cell_id].xb - this.surf[cell_id].xa, this.surf[cell_id].yb - this.surf[cell_id].ya);
        }
    }

    draw_cells_content() {
        let i = 0;
        for (i = 0; i < 9; i++) {
            this.parent.draw_cell_content(i);
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

        this.ctx.fillStyle = "black";
        
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

        console.log(this.cnv);
    }

    draw() {
        let grid;
        grid = get_grid(this.cnv, 1, this.cnv.height, 0);
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

    init() {
        if (window) {
            this.cnv = get_canvas();
            this.ctx = get_context();

            window.addEventListener('resize', this.resize_canvas, false);
            window.addEventListener('resize', this.draw, false);
            this.resize_canvas();

            this.cnv.addEventListener('mousedown', this.mouse_handler);
            this.cnv.addEventListener('mouseenter', this.mouse_handler);
            this.cnv.addEventListener('mouseleave', this.mouse_handler);
            this.cnv.addEventListener('mousemove', this.mouse_handler);
            this.cnv.addEventListener('touchend', this.mouse_handler);

            window.addEventListener('keypress', this.keyboard_handler);
            window.addEventListener('keydown', this.keyboard_handler);

            window.addEventListener('resize', this.draw, false);

            this.draw();
        } else {
            alert ('cannot access window');
        }
    }

}