import React from 'react';
import './App.css';
import '@material/react-top-app-bar/dist/top-app-bar.css';
import '@material/react-material-icon/dist/material-icon.css';
import {check_end, get_at_level} from './tris.js';

import TopAppBar, {
  TopAppBarFixedAdjust, 
  TopAppBarIcon,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
} from '@material/react-top-app-bar';
import MaterialIcon from '@material/react-material-icon';

class Board extends React.Component {
    constructor (props) {
        var strk = getComputedStyle(document.documentElement).getPropertyValue('--color-scheme-text-color');
	super(props);
        this.state = {
            board: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            level: 9,
            stroke: strk
        };
    }
    
    insert_in_board(position, board) {
        var strk = getComputedStyle(document.documentElement).getPropertyValue('--color-scheme-text-color');
        if (board[position] !== 0) {
            alert("Selected cell is not empty!");
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
        switch (checked_val) {
        case 0:
            break;
        case "WIN":
            alert("You won!");
            board[0] = 1;
            this.setState = ({
                board: board,
                level: this.state.level,
                stroke: strk
            });
            break;
        case "LOSE":
            alert("You lost!");
            board[0] = 1;
            this.setState = ({
                board: board,
                level: this.state.level,
                stroke: strk
            });
            break;
        case "DRAW":
            alert("Game drawn!");
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
        if (this.state.board[0] === 1) {
            alert("Game over!");
            return false;
        }
        if (this.insert_in_board(position,this.state.board)) {
            return false;
        }
        this.insert_in_board_cpu(this.state.board);
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

    resetgame()
    {
        this.newgame(this.state.board);
        this.forceUpdate();
        if (process.env.NODE_ENV === 'development') {
            console.log(this.state.board);
        }
    }

    render () {
        return (
            <div>
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
                        onClick={() => alert("FIXME!: to implement.")}
                      />
                    </TopAppBarIcon>
                    <TopAppBarIcon actionItem tabIndex={0}>
                      <MaterialIcon 
                        aria-label="about" 
                        hasRipple 
                        icon='help' 
                        onClick={() => alert("FIXME!: to implement.")}
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
