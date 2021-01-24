import React from 'react';
import './App.css';

import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Select from '@material-ui/core/Select';

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

import HtmlParse from 'html-react-parser';

import TicTacToe from './tic-tac-toe';

import WebApp from './webapp';

import I18n from './i18n';
const defaultText = require ('./en.json');

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
        this.webapp = {};
        this.tictactoe = {};
        this.i18n = {};
        this.snack_won = false;
        this.snack_lost = false;
        this.snack_drawn = false;
        this.snack_notempty = false;
        this.dialog_info = false;
        this.dialog_help = false;
        this.dialog_settings = false;

        this.state = {
            level: this.tictactoe.level,
            language: this.i18n.language,
            snack_won: this.snack_won,
            snack_lost: this.snack_lost,
            snack_drawn: this.snack_drawn,
            snack_notempty: this.snack_notempty,
            dialog_info: this.dialog_info,
            dialog_help: this.dialog_help,
            dialog_settings: this.dialog_settings,
            text_appname: defaultText['text_appname'],
            text_restart_label: defaultText['text_restart_label'],
            text_settings_label: defaultText['text_settings_label'],
            text_help_label: defaultText['text_help_label'],
            text_about_label: defaultText['text_about_label'],
            text_close_label: defaultText['text_close_label'],
            text_youwon: defaultText['text_youwon'],
            text_youlost: defaultText['text_youlost'],
            text_drawn: defaultText['text_drawn'],
            text_notempty: defaultText['text_notempty'],
            text_difficulty: defaultText['text_difficulty'],
            text_level: defaultText['text_level'],
            text_language: defaultText['text_language'],
            text_close_button: defaultText['text_close_button'],
            text_settings_title: defaultText['text_settings_title'],
            text_help_title: defaultText['text_help_title'],
            text_about_title: defaultText['text_about_title'],
            text_canvas: defaultText['text_canvas'],
            text_help_content: HtmlParse(defaultText['text_help_content']),
            text_about_content1: HtmlParse(defaultText['text_about_content1']),
            text_about_content2: HtmlParse(defaultText['text_about_content2']),
        };
        this.ticTacToeRef = React.createRef();

        this.close_snack_won = this.close_snack_won.bind(this);
        this.close_snack_lost = this.close_snack_lost.bind(this);
        this.close_snack_drawn = this.close_snack_drawn.bind(this);
        this.close_snack_notempty = this.close_snack_notempty.bind(this);
        this.close_dialog_info = this.close_dialog_info.bind(this);
        this.close_dialog_help = this.close_dialog_help.bind(this);
        this.close_dialog_settings = this.close_dialog_settings.bind(this);

        this.saveState = this.saveState.bind(this);

        this.insert_in_board = this.insert_in_board.bind(this);
        this.draw_cell_content = this.draw_cell_content.bind(this);

        this.resetgame = this.resetgame.bind(this);
        this.about = this.about.bind(this);
        this.help = this.help.bind(this);
        this.updateLevel = this.updateLevel.bind(this);
        this.updateLanguage = this.updateLanguage.bind(this);
        this.settings = this.settings.bind(this);
    }

    saveState () {
      if (this.i18n.text) {
        this.setState({
            level: this.tictactoe.level,
            language: this.i18n.language,
            snack_won: this.snack_won,
            snack_lost: this.snack_lost,
            snack_drawn: this.snack_drawn,
            snack_notempty: this.snack_notempty,
            dialog_info: this.dialog_info,
            dialog_help: this.dialog_help,
            dialog_settings: this.dialog_settings,
            text_appname: this.i18n.text['text_appname'],
            text_restart_label: this.i18n.text['text_restart_label'],
            text_settings_label: this.i18n.text['text_settings_label'],
            text_help_label: this.i18n.text['text_help_label'],
            text_about_label: this.i18n.text['text_about_label'],
            text_close_label: this.i18n.text['text_close_label'],
            text_youwon: this.i18n.text['text_youwon'],
            text_youlost: this.i18n.text['text_youlost'],
            text_drawn: this.i18n.text['text_drawn'],
            text_notempty: this.i18n.text['text_notempty'],
            text_difficulty: this.i18n.text['text_difficulty'],
            text_level: this.i18n.text['text_level'],
            text_language: this.i18n.text['text_language'],
            text_close_button: this.i18n.text['text_close_button'],
            text_settings_title: this.i18n.text['text_settings_title'],
            text_help_title: this.i18n.text['text_help_title'],
            text_about_title: this.i18n.text['text_about_title'],
            text_canvas: this.i18n.text['text_canvas'],
            text_help_content: HtmlParse(this.i18n.text['text_help_content']),
            text_about_content1: HtmlParse(this.i18n.text['text_about_content1']),
            text_about_content2: HtmlParse(this.i18n.text['text_about_content2']),
            text_about_content3: HtmlParse(this.i18n.text['text_about_content3'])
        });
      } else {
        this.setState({
          level: this.tictactoe.level,
          language: this.i18n.language,
          snack_won: this.snack_won,
          snack_lost: this.snack_lost,
          snack_drawn: this.snack_drawn,
          snack_notempty: this.snack_notempty,
          dialog_info: this.dialog_info,
          dialog_help: this.dialog_help,
          dialog_settings: this.dialog_settings,
          text_appname: defaultText['text_appname'],
          text_restart_label: defaultText['text_restart_label'],
          text_settings_label: defaultText['text_settings_label'],
          text_help_label: defaultText['text_help_label'],
          text_about_label: defaultText['text_about_label'],
          text_close_label: defaultText['text_close_label'],
          text_youwon: defaultText['text_youwon'],
          text_youlost: defaultText['text_youlost'],
          text_drawn: defaultText['text_drawn'],
          text_notempty: defaultText['text_notempty'],
          text_difficulty: defaultText['text_difficulty'],
          text_level: defaultText['text_level'],
          text_language: defaultText['text_language'],
          text_close_button: defaultText['text_close_button'],
          text_settings_title: defaultText['text_settings_title'],
          text_help_title: defaultText['text_help_title'],
          text_about_title: defaultText['text_about_title'],
          text_canvas: defaultText['text_canvas'],
          text_help_content: HtmlParse(defaultText['text_help_content']),
          text_about_content1: HtmlParse(defaultText['text_about_content1']),
          text_about_content2: HtmlParse(defaultText['text_about_content2']),
        });
      }
    }

    resetgame() {
        this.tictactoe.reset();
        this.tictactoe.save_board_to_localStorage();
        this.webapp.draw();
    }

    help() {
        this.dialog_help = true;
        this.saveState();
    }
    
    about() {
        this.dialog_info = true;
        this.saveState();
    }

    updateLevel (sliderobj,sliderval) {
        if (sliderval) {
            this.tictactoe.level = sliderval;
        }
        this.tictactoe.save_level_to_localStorage();
        this.saveState();
    }

    updateLanguage (event) {
        if (event.target.value) {
          this.i18n.change_language_translate_and_save_to_localStorage(event.target.value);
        }
    }

    settings() {
        this.dialog_settings = true;
        this.saveState();
    }

    insert_in_board(position) {
      const callback_notempty = () => { this.snack_notempty = true}
      const callback_drawcell = (position) => { this.webapp.surf[position].draw()};
      const callback_won = () => { this.snack_won = true};
      const callback_lost = () => { this.snack_lost = true};
      const callback_drawn = () =>  { this.snack_drawn = true};
      this.tictactoe.insert_in_board(position, callback_notempty, callback_drawcell, callback_won, callback_lost, callback_drawn);
      this.tictactoe.save_board_to_localStorage();
      this.saveState();
    }

    close_snack_won(myevent, myreason){
        if (myreason === 'clickaway') {
            return;
        }
        this.snack_won = false;
        this.saveState();
    }
    
    close_snack_lost(myevent, myreason){
        if (myreason === 'clickaway') {
            return;
        }
        this.snack_lost = false;
        this.saveState();
    }
    
    close_snack_drawn(myevent, myreason){
        if (myreason === 'clickaway') {
            return;
        }
        this.snack_drawn = false;
        this.saveState();
    }

    close_snack_notempty(myevent, myreason){
        if (myreason === 'clickaway') {
            return;
        }
        this.snack_notempty = false;
        this.saveState();
    }

    close_dialog_info(myevent, myreason){
        if (myreason === 'clickaway') {
            return;
        }
        this.dialog_info = false;
        this.saveState();
    }

    close_dialog_help(myevent, myreason){
        if (myreason === 'clickaway') {
            return;
        }
        this.dialog_help = false;
        this.saveState();
    }

    close_dialog_settings(myevent, myreason){
        if (myreason === 'clickaway') {
            return;
        }
        this.dialog_settings = false;
        this.saveState();
    }

    draw_cell_content(i) {
        this.webapp.draw_cell_content_helper(this.tictactoe.board, i);
    }

    componentDidMount() {
        this.i18n = new I18n(this.saveState);

        // Init the game logic.
        this.tictactoe = new TicTacToe();

        // Init canvas and input handler code.
        this.webapp = new WebApp(this);
        this.webapp.init();

        this.saveState();
    }

    render () {

        return (
            <div ref={this.ticTacToeRef} lang={this.state.language}>

              <div className={classes.root} id="topBar">
                <AppBar position="static" className={classes.root}>
                  <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                      {this.state.text_appname}
                    </Typography>
                    <IconButton color="inherit" aria-label={this.state.text_restart_label} onClick={this.resetgame}>
                      <AutorenewIcon />
                    </IconButton>
                    <IconButton color="inherit" aria-label={this.state.text_settings_label} onClick={this.settings}>
                      <SettingsIcon />
                    </IconButton>
                    <IconButton color="inherit" aria-label={this.state.text_help_label} onClick={this.help}>
                      <HelpIcon />
                    </IconButton>
                    <IconButton color="inherit" aria-label={this.state.text_about_label} onClick={this.about}>
                      <InfoIcon />
                    </IconButton>
                  </Toolbar>
                </AppBar>
              </div>
              
              <canvas className="webapp" id="canvas" tabIndex={0}>{this.state.text_canvas}</canvas>

              <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={this.state.snack_won}
                autoHideDuration={2000}
                onClose={this.close_snack_won}
                message={this.state.text_youwon}
                action={
                    <React.Fragment>
                      <IconButton size="small" aria-label={this.state.text_close_label} color="inherit" onClick={this.close_snack_won}>
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
                message={this.state.text_youlost}
                action={
                    <React.Fragment>
                      <IconButton size="small" aria-label={this.state.text_close_label} color="inherit" onClick={this.close_snack_lost}>
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
                message={this.state.text_drawn}
                action={
                    <React.Fragment>
                      <IconButton size="small" aria-label={this.state.text_close_label} color="inherit" onClick={this.close_snack_drawn}>
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
                message={this.state.text_notempty}
                action={
                    <React.Fragment>
                      <IconButton size="small" aria-label={this.state.text_close_label} color="inherit" onClick={this.close_snack_notempty}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </React.Fragment>
                }
              />

              <Dialog open={this.state.dialog_settings} onClose={this.close_dialog_settings} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{this.state.text_settings_title}</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    <p>{this.state.text_difficulty}{this.state.level}</p>
                  </DialogContentText>
                  <div className={classes.reverse}>
                    <Typography id="discrete-slider" gutterBottom>
                      {this.state.text_level}
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
                  <div className={classes.reverse}>
                  <ThemeProvider theme={theme}>
                  <p>{this.state.text_language}
                  <Select
                    native
                    lang="en"
                    value={this.state.language}
                    onChange={this.updateLanguage}
                    inputProps={{
                        name: 'language',
                        id: 'language-select',
                    }}
                    >
                    <option value="af">Afrikaans</option>
                    <option value="sq">Albanian</option>
                    <option value="am">Amharic</option>
                    <option value="ar">Arabic</option>
                    <option value="hy">Armenian</option>
                    <option value="az">Azerbaijani</option>
                    <option value="eu">Basque</option>
                    <option value="be">Belarusian</option>
                    <option value="bn">Bengali</option>
                    <option value="bs">Bosnian</option>
                    <option value="bg">Bulgarian</option>
                    <option value="ca">Catalan</option>
                    <option value="ceb">Cebuano</option>
                    <option value="ny">Chichewa</option>
                    <option value="zh-CN">Chinese (Simplified)</option>
                    <option value="zh-TW">Chinese (Traditional)</option>
                    <option value="zh">Chinese (Simplified)</option>
                    <option value="co">Corsican</option>
                    <option value="hr">Croatian</option>
                    <option value="cs">Czech</option>
                    <option value="da">Danish</option>
                    <option value="nl">Dutch</option>
                    <option value="en">English</option>
                    <option value="eo">Esperanto</option>
                    <option value="et">Estonian</option>
                    <option value="tl">Filipino</option>
                    <option value="fi">Finnish</option>
                    <option value="fr">French</option>
                    <option value="fy">Frisian</option>
                    <option value="gl">Galician</option>
                    <option value="ka">Georgian</option>
                    <option value="de">German</option>
                    <option value="el">Greek</option>
                    <option value="gu">Gujarati</option>
                    <option value="ht">Haitian Creole</option>
                    <option value="ha">Hausa</option>
                    <option value="haw">Hawaiian</option>
                    <option value="iw">Hebrew</option>
                    <option value="he">Hebrew</option>
                    <option value="hi">Hindi</option>
                    <option value="hmn">Hmong</option>
                    <option value="hu">Hungarian</option>
                    <option value="is">Icelandic</option>
                    <option value="ig">Igbo</option>
                    <option value="id">Indonesian</option>
                    <option value="ga">Irish</option>
                    <option value="it">Italian</option>
                    <option value="ja">Japanese</option>
                    <option value="jw">Javanese</option>
                    <option value="kn">Kannada</option>
                    <option value="kk">Kazakh</option>
                    <option value="km">Khmer</option>
                    <option value="rw">Kinyarwanda</option>
                    <option value="ko">Korean</option>
                    <option value="ku">Kurdish (Kurmanji)</option>
                    <option value="ky">Kyrgyz</option>
                    <option value="lo">Lao</option>
                    <option value="la">Latin</option>
                    <option value="lv">Latvian</option>
                    <option value="lt">Lithuanian</option>
                    <option value="lb">Luxembourgish</option>
                    <option value="mk">Macedonian</option>
                    <option value="mg">Malagasy</option>
                    <option value="ms">Malay</option>
                    <option value="ml">Malayalam</option>
                    <option value="mt">Maltese</option>
                    <option value="mi">Maori</option>
                    <option value="mr">Marathi</option>
                    <option value="mn">Mongolian</option>
                    <option value="my">Myanmar (Burmese)</option>
                    <option value="ne">Nepali</option>
                    <option value="no">Norwegian</option>
                    <option value="or">Odia (Oriya)</option>
                    <option value="ps">Pashto</option>
                    <option value="fa">Persian</option>
                    <option value="pl">Polish</option>
                    <option value="pt">Portuguese</option>
                    <option value="pa">Punjabi</option>
                    <option value="ro">Romanian</option>
                    <option value="ru">Russian</option>
                    <option value="sm">Samoan</option>
                    <option value="gd">Scots Gaelic</option>
                    <option value="sr">Serbian</option>
                    <option value="st">Sesotho</option>
                    <option value="sn">Shona</option>
                    <option value="sd">Sindhi</option>
                    <option value="si">Sinhala</option>
                    <option value="sk">Slovak</option>
                    <option value="sl">Slovenian</option>
                    <option value="so">Somali</option>
                    <option value="es">Spanish</option>
                    <option value="su">Sundanese</option>
                    <option value="sw">Swahili</option>
                    <option value="sv">Swedish</option>
                    <option value="tg">Tajik</option>
                    <option value="ta">Tamil</option>
                    <option value="tt">Tatar</option>
                    <option value="te">Telugu</option>
                    <option value="th">Thai</option>
                    <option value="tr">Turkish</option>
                    <option value="tk">Turkmen</option>
                    <option value="uk">Ukrainian</option>
                    <option value="ur">Urdu</option>
                    <option value="ug">Uyghur</option>
                    <option value="uz">Uzbek</option>
                    <option value="vi">Vietnamese</option>
                    <option value="cy">Welsh</option>
                    <option value="xh">Xhosa</option>
                    <option value="yi">Yiddish</option>
                    <option value="yo">Yoruba</option>
                    <option value="zu">Zulu</option>
                   </Select>
				</p>
                  </ThemeProvider>
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.close_dialog_settings} color="inherit">
                    {this.state.text_close_button}
                  </Button>
                </DialogActions>
              </Dialog>

              
              <Dialog open={this.state.dialog_help} onClose={this.close_dialog_help} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{this.state.text_help_title}</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                      {this.state.text_help_content}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.close_dialog_help} color="inherit">
                    {this.state.text_close_button}
                  </Button>
                </DialogActions>
              </Dialog>

              <Dialog open={this.state.dialog_info} onClose={this.close_dialog_info} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{this.state.text_about_title}</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    {this.state.text_about_content1}
                    {this.state.text_about_content2}
                    {this.state.text_about_content3}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.close_dialog_info} color="inherit">
                    {this.state.text_close_button}
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