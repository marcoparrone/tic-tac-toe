import React from 'react';
import './App.css';
import {check_end, get_at_level} from './tris.js';

import '@material/react-top-app-bar/dist/top-app-bar.css';
import '@material/react-material-icon/dist/material-icon.css';

import TopAppBar, {
  TopAppBarFixedAdjust, 
  TopAppBarIcon,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
} from '@material/react-top-app-bar';
import MaterialIcon from '@material/react-material-icon';

import "@material/snackbar/dist/mdc.snackbar.css";
import {MDCSnackbar} from '@material/snackbar';

import "@material/dialog/dist/mdc.dialog.css";
import {MDCDialog} from '@material/dialog';

class Board extends React.Component {
    constructor (props) {
        var strk = getComputedStyle(document.documentElement).getPropertyValue('--color-scheme-text-color');
        super(props);
        this.state = {
            board: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            level: 9,
            stroke: strk
        };
        this.ticTacToeRef = React.createRef();
    }

    insert_in_board(position, board) {
        var strk = getComputedStyle(document.documentElement).getPropertyValue('--color-scheme-text-color');
        var snackbarNotEmpty = new MDCSnackbar(this.ticTacToeRef.current.querySelector('#notempty'));
        if (board[position] !== 0) {
            snackbarNotEmpty.open();
            return true;
        }
        board[position] = 2;
        this.setState = ({
            board: board,
            level: this.state.level,
            stroke: strk
        });
        return false;
    }
    
    insert_in_board_cpu(board) {
        var strk = getComputedStyle(document.documentElement).getPropertyValue('--color-scheme-text-color');
        var entry = get_at_level(board, this.state.level);
        if (entry !== 0) {
            board[entry] = 1;
            this.setState = ({
                board: board,
                level: this.state.level,
                stroke: strk
            });
        }
        return entry;
    }

    end_game_if_needed(board) {
        var strk = getComputedStyle(document.documentElement).getPropertyValue('--color-scheme-text-color');
        var checked_val = check_end(board);
        var snackbarWin = new MDCSnackbar(this.ticTacToeRef.current.querySelector('#win'));
        var snackbarLose = new MDCSnackbar(this.ticTacToeRef.current.querySelector('#lose'));
        var snackbarDraw = new MDCSnackbar(this.ticTacToeRef.current.querySelector('#draw'));
        switch (checked_val) {
        case 0:
            break;
        case "WIN":
            snackbarWin.open();
            board[0] = 1;
            this.setState = ({
                board: board,
                level: this.state.level,
                stroke: strk
            });
            break;
        case "LOSE":
            snackbarLose.open();
            board[0] = 1;
            this.setState = ({
                board: board,
                level: this.state.level,
                stroke: strk
            });
            break;
        case "DRAW":
            snackbarDraw.open();
            board[0] = 1;
            this.setState = ({
                board: board,
                level: this.state.level,
                stroke: strk
            });
            break;
        default:
            break;
        }
    }
    
    main_loop_helper(position) {
        var snackbarGO = new MDCSnackbar(this.ticTacToeRef.current.querySelector('#gameover'));
        if (this.state.board[0] === 1) {
            snackbarGO.open();
            return false;
        }
        if (this.insert_in_board(position,this.state.board)) {
            return false;
        }
        if (check_end(this.state.board) === 0) {
            this.insert_in_board_cpu(this.state.board);
        }
        this.forceUpdate();
        this.end_game_if_needed(this.state.board);
        if (process.env.NODE_ENV === 'development') {
            console.log(this.state.board);
        }
        return true;
    }

    newgame(board) {
        var strk = getComputedStyle(document.documentElement).getPropertyValue('--color-scheme-text-color');
        for (var i = 0; i < 11; i++) {
            board[i]=0;
        }
        this.setState = ({
            board: board,
            level: this.state.level,
            stroke: strk
        });
    }

    resetgame() {
        this.newgame(this.state.board);
        this.forceUpdate();
        if (process.env.NODE_ENV === 'development') {
            console.log(this.state.board);
        }
    }

    about() {
        const dialog = new MDCDialog(this.ticTacToeRef.current.querySelector('#about'));
        dialog.open();
    }

    settings() {
        const dialog = new MDCDialog(this.ticTacToeRef.current.querySelector('#settings'));
        dialog.open();
    }

    render () {
        return (
            <div ref={this.ticTacToeRef}>
              <TopAppBar>
                <TopAppBarRow>
                  <TopAppBarSection align='start'>
                    {/* <TopAppBarIcon navIcon tabIndex={0}> */}
                    {/*   <MaterialIcon hasRipple icon='menu' onClick={() => console.log('click')}/> */}
                    {/* </TopAppBarIcon> */}
                    <TopAppBarTitle>Tic Tac Toe</TopAppBarTitle>
                  </TopAppBarSection>
                  <TopAppBarSection align='end' role='toolbar'>
                    <TopAppBarIcon actionItem tabIndex={0}>
                      <MaterialIcon 
                        aria-label="restart game" 
                        hasRipple 
                        icon='autorenew' 
                        onClick={() => this.resetgame()}
                      />
                    </TopAppBarIcon>
                    <TopAppBarIcon actionItem tabIndex={0}>
                      <MaterialIcon 
                        aria-label="settings" 
                        hasRipple 
                        icon='settings' 
                        onClick={() => this.settings()}
                      />
                    </TopAppBarIcon>
                    <TopAppBarIcon actionItem tabIndex={0}>
                      <MaterialIcon 
                        aria-label="about" 
                        hasRipple 
                        icon='help' 
                        onClick={() => this.about()}
                      />
                    </TopAppBarIcon>
                  </TopAppBarSection>
                </TopAppBarRow>
              </TopAppBar>
              <TopAppBarFixedAdjust>
                <svg width="100" height="100">
                  <line x1="33%" y1="0"   x2="33%" y2="99%" strokeWidth="1" stroke={this.state.stroke} />
                  <line x1="66%" y1="0"   x2="66%" y2="99%" strokeWidth="1" stroke={this.state.stroke} />
                  <line x1="0"   y1="33%" x2="99%" y2="33%" strokeWidth="1" stroke={this.state.stroke} />
                  <line x1="0"   y1="66%" x2="99%" y2="66%" strokeWidth="1" stroke={this.state.stroke} />

                  <circle id="c0" cx="16.5%" cy="16.5%" r="15%" fill="none" stroke={this.state.stroke} strokeWidth="3" opacity={this.state.board[1] === 1 ? 1 : 0} />
                  <circle id="c1" cx="49.5%" cy="16.5%" r="15%" fill="none" stroke={this.state.stroke} strokeWidth="3" opacity={this.state.board[2] === 1 ? 1 : 0} />
                  <circle id="c2" cx="82.5%" cy="16.5%" r="15%" fill="none" stroke={this.state.stroke} strokeWidth="3" opacity={this.state.board[3] === 1 ? 1 : 0} />

                  <circle id="c3" cx="16.5%" cy="49.5%" r="15%" fill="none" stroke={this.state.stroke} strokeWidth="3" opacity={this.state.board[4] === 1 ? 1 : 0} />
                  <circle id="c4" cx="49.5%" cy="49.5%" r="15%" fill="none" stroke={this.state.stroke} strokeWidth="3" opacity={this.state.board[5] === 1 ? 1 : 0} />
                  <circle id="c5" cx="82.5%" cy="49.5%" r="15%" fill="none" stroke={this.state.stroke} strokeWidth="3" opacity={this.state.board[6] === 1 ? 1 : 0} />

                  <circle id="c6" cx="16.5%" cy="82.5%" r="15%" fill="none" stroke={this.state.stroke} strokeWidth="3" opacity={this.state.board[7] === 1 ? 1 : 0} />
                  <circle id="c7" cx="49.5%" cy="82.5%" r="15%" fill="none" stroke={this.state.stroke} strokeWidth="3" opacity={this.state.board[8] === 1 ? 1 : 0} />
                  <circle id="c8" cx="82.5%" cy="82.5%" r="15%" fill="none" stroke={this.state.stroke} strokeWidth="3" opacity={this.state.board[9] === 1 ? 1 : 0} />

                  <line id="x0a" x1="3%"  y1="3%"  x2="30%" y2="30%" strokeWidth="3" stroke={this.state.stroke} opacity={this.state.board[1] === 2 ? 1 : 0} />
                  <line id="x0b" x1="3%"  y1="30%" x2="30%" y2="3%"  strokeWidth="3" stroke={this.state.stroke} opacity={this.state.board[1] === 2 ? 1 : 0} />

                  <line id="x1a" x1="36%" y1="3%"  x2="63%" y2="30%" strokeWidth="3" stroke={this.state.stroke} opacity={this.state.board[2] === 2 ? 1 : 0} />
                  <line id="x1b" x1="36%" y1="30%" x2="63%" y2="3%"  strokeWidth="3" stroke={this.state.stroke} opacity={this.state.board[2] === 2 ? 1 : 0} />

                  <line id="x2a" x1="69%" y1="3%"  x2="96%" y2="30%" strokeWidth="3" stroke={this.state.stroke} opacity={this.state.board[3] === 2 ? 1 : 0} />
                  <line id="x2b" x1="69%" y1="30%" x2="96%" y2="3%"  strokeWidth="3" stroke={this.state.stroke} opacity={this.state.board[3] === 2 ? 1 : 0} />

                  <line id="x3a" x1="3%"  y1="36%" x2="30%" y2="63%" strokeWidth="3" stroke={this.state.stroke} opacity={this.state.board[4] === 2 ? 1 : 0} />
                  <line id="x3b" x1="3%"  y1="63%" x2="30%" y2="36%" strokeWidth="3" stroke={this.state.stroke} opacity={this.state.board[4] === 2 ? 1 : 0} />

                  <line id="x4a" x1="36%" y1="36%" x2="63%" y2="63%" strokeWidth="3" stroke={this.state.stroke} opacity={this.state.board[5] === 2 ? 1 : 0} />
                  <line id="x4b" x1="36%" y1="63%" x2="63%" y2="36%" strokeWidth="3" stroke={this.state.stroke} opacity={this.state.board[5] === 2 ? 1 : 0} />

                  <line id="x5a" x1="69%" y1="36%" x2="96%" y2="63%" strokeWidth="3" stroke={this.state.stroke} opacity={this.state.board[6] === 2 ? 1 : 0} />
                  <line id="x5b" x1="69%" y1="63%" x2="96%" y2="36%" strokeWidth="3" stroke={this.state.stroke} opacity={this.state.board[6] === 2 ? 1 : 0} />

                  <line id="x6a" x1="3%"  y1="69%" x2="30%" y2="96%" strokeWidth="3" stroke={this.state.stroke} opacity={this.state.board[7] === 2 ? 1 : 0} />
                  <line id="x6b" x1="3%"  y1="96%" x2="30%" y2="69%" strokeWidth="3" stroke={this.state.stroke} opacity={this.state.board[7] === 2 ? 1 : 0} />

                  <line id="x7a" x1="36%" y1="69%" x2="63%" y2="96%" strokeWidth="3" stroke={this.state.stroke} opacity={this.state.board[8] === 2 ? 1 : 0} />
                  <line id="x7b" x1="36%" y1="96%" x2="63%" y2="69%" strokeWidth="3" stroke={this.state.stroke} opacity={this.state.board[8] === 2 ? 1 : 0} />

                  <line id="x8a" x1="69%" y1="69%" x2="96%" y2="96%" strokeWidth="3" stroke={this.state.stroke} opacity={this.state.board[9] === 2 ? 1 : 0} />
                  <line id="x8b" x1="69%" y1="96%" x2="96%" y2="69%" strokeWidth="3" stroke={this.state.stroke} opacity={this.state.board[9] === 2 ? 1 : 0} />

                  <rect id="r0" onClick={event => this.main_loop_helper(1)} x="0%"  y="0%"  height="33%" width="33%" opacity="0" />
                  <rect id="r1" onClick={event => this.main_loop_helper(2)} x="33%" y="0%"  height="33%" width="33%" opacity="0" />
                  <rect id="r2" onClick={event => this.main_loop_helper(3)} x="66%" y="0%"  height="33%" width="33%" opacity="0" />

                  <rect id="r3" onClick={event => this.main_loop_helper(4)} x="0%"  y="33%" height="33%" width="33%" opacity="0" />
                  <rect id="r4" onClick={event => this.main_loop_helper(5)} x="33%" y="33%" height="33%" width="33%" opacity="0" />
                  <rect id="r5" onClick={event => this.main_loop_helper(6)} x="66%" y="33%" height="33%" width="33%" opacity="0" />

                  <rect id="r6" onClick={event => this.main_loop_helper(7)} x="0%"  y="66%" height="33%" width="33%" opacity="0" />
                  <rect id="r7" onClick={event => this.main_loop_helper(8)} x="33%" y="66%" height="33%" width="33%" opacity="0" />
                  <rect id="r8" onClick={event => this.main_loop_helper(9)} x="66%" y="66%" height="33%" width="33%" opacity="0" />
                </svg><br/>
                <div className="mdc-snackbar" id="win"><div className="mdc-snackbar__surface"><div className="mdc-snackbar__label" role="status" aria-live="polite">You won!</div></div></div>
                <div className="mdc-snackbar" id="lose"><div className="mdc-snackbar__surface"><div className="mdc-snackbar__label" role="status" aria-live="polite">You lost!</div></div></div>
                <div className="mdc-snackbar" id="draw"><div className="mdc-snackbar__surface"><div className="mdc-snackbar__label" role="status" aria-live="polite">Game drawn!</div></div></div>
                <div className="mdc-snackbar" id="gameover"><div className="mdc-snackbar__surface"><div className="mdc-snackbar__label" role="status" aria-live="polite">Game over!</div></div></div>
                <div className="mdc-snackbar" id="notempty"><div className="mdc-snackbar__surface"><div className="mdc-snackbar__label" role="status" aria-live="polite">Selected cell is not empty!</div> </div></div>
                <div className="mdc-dialog" role="alertdialog" aria-modal="true" aria-labelledby="my-dialog-title" aria-describedby="my-dialog-content" id="settings">
                  <div className="mdc-dialog__container">
                    <div className="mdc-dialog__surface">
                      <h2 className="mdc-dialog__title" id="my-dialog-title">Settings</h2>
                      <div className="mdc-dialog__content" id="my-dialog-content">
                        <p>Settings</p>
                      </div>
                      <footer className="mdc-dialog__actions">
                        <button type="button" className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes">
                          <span className="mdc-button__label">Close</span>
                        </button>
                      </footer>
                    </div>
                  </div>
                  <div className="mdc-dialog__scrim"></div>
                </div>
                <div className="mdc-dialog" role="alertdialog" aria-modal="true" aria-labelledby="my-dialog-title" aria-describedby="my-dialog-content" id="about">
                  <div className="mdc-dialog__container">
                    <div className="mdc-dialog__surface">
                      <h2 className="mdc-dialog__title" id="my-dialog-title">About</h2>
                      <div className="mdc-dialog__content" id="my-dialog-content">
                        <p>Copyright &copy; 2000,2002,2017,2019 Marco Parrone</p>
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
                      </div>
                      <footer className="mdc-dialog__actions">
                        <button type="button" className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes">
                          <span className="mdc-button__label">Close</span>
                        </button>
                      </footer>
                    </div>
                  </div>
                  <div className="mdc-dialog__scrim"></div>
                </div>
              </TopAppBarFixedAdjust>
            </div>
        );
    };
}

function App() {
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
