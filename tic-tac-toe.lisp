;;; tic-tac-toe.lisp  ---  A tic tac toe game.

;; Copyright (C)  2000,2002,2017  Marco Parrone

;; Filename: tic-tac-toe.lisp
;; Version: it's stil super alpha
;; Updated: 12th of March 2017
;; Keywords: tic, tac, toe, game
;; Author: Marco Parrone <marco.parrone@gmail.com>
;; Maintainer: Marco Parrone <marco.parrone@gmail.com>
;; Description: A tic tac toe game.
;; Language: Common Lisp
;; Compatibility: Steel Bank Common Lisp 1.3.11.
;; Location: https://github.com/marcoparrone/tic-tac-toe

;; Permission is hereby granted, free of charge, to any person
;; obtaining a copy of this software and associated documentation
;; files (the "Software"), to deal in the Software without
;; restriction, including without limitation the rights to use, copy,
;; modify, merge, publish, distribute, sublicense, and/or sell copies
;; of the Software, and to permit persons to whom the Software is
;; furnished to do so, subject to the following conditions:

;; The above copyright notice and this permission notice shall be
;; included in all copies or substantial portions of the Software.

;; THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
;; EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
;; MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
;; NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
;; BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
;; ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
;; CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
;; SOFTWARE.

;;; Commentary:

;; A command-line tic-tac-toe implementation in Common Lisp.

;; I am writing this for fun and for learning Common Lisp.

;; It's still a Work is in progress, the game is not really playable yet.

;;; Code:

(defvar *debug-mode* 'nil)

(defun debugmsg (msg &rest the-rest)
  "Helper function for printing debug messages.
The argument `msg' is format control-string and `the-rest' are the parameters for the control-string. Just like in the `format' function."
  (if *debug-mode*
      (apply #'format
	     (cons t (cons (concatenate 'string "debug: " msg "~%")
			   the-rest)))))

(defun make-board ()
  "Return an empty board."
  (list 'empty 'empty 'empty
	'empty 'empty 'empty
	'empty 'empty 'empty))

(defun print-board (board)
  "Print a board."
  (format t
	  "~{ ~a | ~a | ~a ~%---+---+---~% ~a | ~a | ~a~%---+---+---~% ~a | ~a | ~a~%~}" 
	  (map 'list #'(lambda (cell)
			 (cond ((eql cell 'empty) " ")
			       ((eql cell 'X) "X")
			       ((eql cell 'O) "O")))
	       board)))

(defun mp-prompt-user ()
  "Prompt the user and return the input line."
  (format *query-io* "tic-tac-toe> ")
  (force-output *query-io*)
  (read-line *query-io*))

(defun print-help ()
  "Print the help screen."
  (format t "Commands:
h~10tShow this help.
1-9~10tInser the X in the respective entry
~12t(numpad-like mapping).
k~10tShow the key mapping.
p~10tShow the board.
l~10tShow the difficulty level.
L~10tChange the difficulty level.
a~10tLet the CPU do the best move it can for you.
r~10tReset.
q~10tQuit.
"))

(defun print-keymap ()
  "Print the keymap."
  (format t " 7 | 8 | 9 ~%---+---+---~% 4 | 5 | 6~%---+---+---~% 1 | 2 | 3~%"))

(defun print-level (level)
  "Print the difficulty level."
  (format t "Difficulty level: ~a.~%" level))

(defun change-level (level)
  "Prompt the user to choose a new difficulty level. Return the new level."
  (format *query-io* "Insert level (0-10): ")
  (force-output *query-io*)
  (let ((newlevel (parse-integer (read-line *query-io*) :junk-allowed t)))
    (if (and (integerp newlevel) (<= 0 newlevel) (>= 10 newlevel))
	newlevel
	(progn
	  (format t "tic-tac-toe: Invalid level selected.~%")
	  level))))

(defun printed-to-internal (cell)
  "Return the internal position in the `board' structure
of a cell as inserted by the user."
  (nth cell (list 0
	     6 7 8
	     3 4 5
	     0 1 2)))

(defun insert-in-board (printed-user-input board)
  "Inset the X in the cell chosen by the user.
`printed-user-input' must be an integer. `board' must be a board."
  (let ((internal-user-input (printed-to-internal printed-user-input)))
    (if (eql 'empty (nth internal-user-input board))
	(setf (nth internal-user-input board) 'X)
	(format t "tic-tac-toe: Invalid choice: cell is not empty.~%"))))

;; A list of 3-elements lists of internal cell identifiers,
;; identifying the winning combinations (rows, columns, diagonals).
;; 
(defvar 3sets-map
  (list
   ; rows
   (list 6 7 8)
   (list 3 4 5)
   (list 0 1 2)
   ; columns
   (list 6
	 3
	 0)
   (list   7
	   4
	   1)
   (list     8
	     5
	     2)
   ; diagonals
   (list 6
	   4
	     2)
   (list     8
           4
         0)))

(defun make-3sets (board)
  "Return a list of 3-elements lists (alias 3sets),
each containing 3 pairs of the identifiers and the values of the cells
which are part of the potentially winning combinations (rows, columns,
diagonals)."
  (map 'list
       #'(lambda (positions)
	   (map 'list
		#'(lambda (position) 
		    (cons position (nth position board)))
		positions))
       3sets-map))

(defun all-sym (sym 3set)
  "Return `true' if all the cells of the `3set' contain the value `sym'."
  (every #'(lambda (3set)
	     (eql sym (cdr 3set)))
	 3set))

(defun someone-won (board)
  "Return the symbol of the winner (X or O). Or NIL."
  (let ((3sets (make-3sets board)))
    (cond ((some #'(lambda (3set) (all-sym 'X 3set)) 3sets) 'X)
	  ((some #'(lambda (3set) (all-sym 'O 3set)) 3sets) 'O))))

(defun two-good-one-missing (sym 3sets)
  "Search in the `3sets' for a combination where two cells contain the
`sym' value (X or O), and the other cell contains the `empty' value,
and return the ID of the empty cell."
  (debugmsg "two-good-one-missing: i'm here")
  (if 3sets
      (let ((3set (car 3sets)))
	(let ((1st (nth 0 3set))
	      (2nd (nth 1 3set))
	      (3rd (nth 2 3set)))
	  (cond ((and (eql (cdr 1st) sym)
		      (eql (cdr 2nd) sym)
		      (eql (cdr 3rd) 'empty))
		 (car 3rd))
		((and (eql (cdr 1st) sym)
		      (eql (cdr 2nd) 'empty)
		      (eql (cdr 3rd) sym))
		 (car 2nd))
		((and (eql (cdr 1st) 'empty)
		      (eql (cdr 2nd) sym)
		      (eql (cdr 3rd) sym))
		 (car 1st))
		(t (two-good-one-missing sym (cdr 3sets))))))
      'nil))

;; Declaim mutually recursive functions.
(declaim (ftype function pick-best-from-nice pick-best-of-all-ever))

;; FIXME!: document.
(defun pick-best-of-all-ever (top-list 3sets board &optional nice-cells)
  (debugmsg "pick-best-of-all-ever: i'm here")
  (let ((nice nice-cells))
    (if 3sets
	(let ((3set (car 3sets)))
	  (let ((1st (nth 0 3set))
		(2nd (nth 1 3set))
		(3rd (nth 2 3set)))
	    (debugmsg "pick-best-of-all-ever: ~a ~a ~a" 1st 2nd 3rd)
	    (if (and (eql (cdr 1st) 'empty)
		     (eql (cdr 2nd) 'empty)
		     (eql (cdr 3rd) 'empty))
		(progn 
		  (debugmsg "pick-best-of-all-ever: top-list: ~a" top-list)
		  (if (find (car 1st) top-list :test #'equal)
		      (setq nice (cons (car 1st) nice)))
		  (if (find (car 2nd) top-list :test #'equal)
		      (setq nice (cons (car 2nd) nice)))
		  (if (find (car 3rd) top-list :test #'equal)
		      (setq nice (cons (car 3rd) nice)))))
	    (pick-best-of-all-ever top-list (cdr 3sets) board nice)))
	(progn
	  (debugmsg "pick-best-of-all-ever: finishing: ~a." nice)
	  (if nice
	      (pick-best-from-nice nice 3sets board 'nil 'stop)
	      top-list)))))

;; FIXME!: document.
(defun pick-best-from-nice (nice-cells 3sets board &optional summary stop)
  (let ((loc-summary (if summary
			summary
			(list (cons 0 0) (cons 1 0) (cons 2 0) (cons 3 0)
			      (cons 4 0) (cons 5 0) (cons 6 0) (cons 7 0)
			      (cons 8 0)))))
    (debugmsg "pick-best-from-nice: ~a ~a" nice-cells loc-summary)
    (if nice-cells
	(progn
	  (setf (cdr (nth (car nice-cells) loc-summary))
		(+ 1 (cdr (nth (car nice-cells) loc-summary))))
	  (pick-best-from-nice (cdr nice-cells) 3sets board loc-summary stop))
	(let ((from-best-to-worse
	       (sort loc-summary #'> :key #'cdr)))
	  (let ((top-rate (cdr (car from-best-to-worse)))
		(top-list 'nil))
	    (debugmsg "pick-best-from-nice: finishing: ~a"
		    from-best-to-worse)
	    (loop 
	       for picked in from-best-to-worse
	       do (if (eql top-rate (cdr picked))
		      (setq top-list (cons picked top-list))))
	    (debugmsg "pick-best-from-nice: finishing... really...: ~a ~a"
		    top-list stop)
	    (if stop
		(mapcar #'car top-list)
		(car (pick-best-of-all-ever (mapcar #'car top-list) (make-3sets board) board))))))))

(defun one-good-two-missing (sym 3sets board &optional nice-cells)
  "Search in the `3sets' for a combination where two one cell contains
the `sym' value (X or O), and the other cells contain the `empty'
value'. So, pick the best move among these combination and return
it. Return 'nil if it is not possible find such a move. "
  (debugmsg "one-good-two-missing: i'm here")
  (let ((nice nice-cells))
    (if 3sets
	(let ((3set (car 3sets)))
	  (let ((1st (nth 0 3set))
		(2nd (nth 1 3set))
		(3rd (nth 2 3set)))
	    (debugmsg "one-good-two-missing: ~a ~a ~a" 1st 2nd 3rd)
	    (cond ((and (eql (cdr 1st) sym)
			(eql (cdr 2nd) 'empty)
			(eql (cdr 3rd) 'empty))
		   (setq nice (cons (car 2nd) (cons (car 3rd) nice))))
		  ((and (eql (cdr 1st) 'empty)
			(eql (cdr 2nd) sym)
			(eql (cdr 3rd) 'empty))
		   (setq nice (cons (car 1st) (cons (car 3rd) nice))))
		  ((and (eql (cdr 1st) 'empty)
			(eql (cdr 2nd) 'empty)
			(eql (cdr 3rd) sym))
		   (setq nice (cons (car 1st) (cons (car 2nd) nice)))))
	    (one-good-two-missing sym (cdr 3sets) board nice)))
	(progn
	  (debugmsg "one-good-two-missing: finishing.")
	  (if nice
	      (pick-best-from-nice nice 3sets board)
	      'nil)))))

(defun get-random-move (board)
  "Return a random valid move, or NIL if there are no empty cells."
  (debugmsg "get-random-move: going random")
  (let ((empty-cells 'nil)
	(how-many-empty-cells 0))
    (loop
       for i from 0 to 8
       do (if (eql (nth i board) 'empty)
	      (progn
		(setq empty-cells (cons i empty-cells))
		(setq how-many-empty-cells (+ 1 how-many-empty-cells)))))
    (debugmsg "get-random-move: ~a ~a" how-many-empty-cells empty-cells)
    (if (> how-many-empty-cells 0)
	(nth (random how-many-empty-cells) empty-cells)
	'nil)))
  
;; FIXME!: the function is nice until now, but it will always lose to
;; a player doing the moves: 1-9-7-4. I need to add a function to use
;; this type of strategies and not to let the adversary to use them
;; successfully.
;;
(defun get-best-move (i-am board)
  "Return the best move possible. `i-am' contains the symbol of the
player needing the move, `board' is the board."
  (let ((i-am-not (if (eql i-am 'X) 'O 'X))
	(3sets (make-3sets board)))
    (or (two-good-one-missing i-am 3sets)
	(two-good-one-missing i-am-not 3sets)
	(one-good-two-missing i-am 3sets board)
	(one-good-two-missing i-am-not 3sets board)
	(get-random-move board))))

(defun get-move-at-level (i-am board level)
  "Return a random move or the best move possible depending on the
difficulty level and on luck. `i-am' contains the symbol of the
player needing the move, `board' is the board."
  (if (< (random 11) level)
   (get-best-move i-am board)
   (get-random-move board)))

(defun insert-in-board-cpu (sym board level)
  "Insert an automatically-calculated move for `sym' symbol (X or O)
in the `board', according to difficulty `level'."
  (let ((move (get-move-at-level sym board level)))
    (debugmsg "insert-in-board-cpu: ~a" move)
    (if move
	(setf (nth move board) sym))))

(defun board-is-full (board)
  "Return true if the board is full."
  (every  #'(lambda (cell) (not (eql cell 'empty))) board))

(defun end-game-if-needed (board)
  "If the game was won by a player, or if it was drawn, print a
message describing the event and return `true'."
  (let ((winner (someone-won board)))
    (cond (winner
	   (format t "tic-tac-toe: We have a winner: ~a~%" winner)
	   winner)
	  ((board-is-full board)
	   (format t "tic-tac-toe: game drawn.~%")
	   t)
	  (t 'nil))))

;; Difficulty level: from 0 to 10.
(defvar *level* 10)

;; The game board.
(defvar *board* (make-board))

;; If true, the game loop is going to stop.
(defvar *quit* 'nil)

;; If true, the game is over. This means that someone won or the game is drawn.
(defvar *the-game-is-over* 'nil)

(defun mp-eval-user-input (user-input)
  "Call the needed call-back code according to `user-input', which is
a string."
  (let ((printed-user-input (parse-integer user-input :junk-allowed t)))
    (cond ((and (integerp printed-user-input) (< 0 printed-user-input) (> 10 printed-user-input)) 
	   (if *the-game-is-over*
	       (format t "tic-tac-toe: Invalid choice: the game is over.~%")
	       (progn
		 (insert-in-board printed-user-input *board*)
		 (if (end-game-if-needed *board*)
		     (set '*the-game-is-over* t)
		     (insert-in-board-cpu 'O *board* *level*))
		 (print-board *board*)
		 (if (end-game-if-needed *board*)
		     (set '*the-game-is-over* t)))))
	  ((equal user-input "a") 
	   (if *the-game-is-over*
	       (format t "tic-tac-toe: Invalid choice: the game is over.~%")
	       (progn
		 (insert-in-board-cpu 'X *board* *level*)
		 (if (end-game-if-needed *board*)
		     (set '*the-game-is-over* t)
		     (insert-in-board-cpu 'O *board* *level*))
		 (print-board *board*)
		 (if (end-game-if-needed *board*)
		     (set '*the-game-is-over* t)))))
	  ((equal user-input "h") (print-help))
	  ((equal user-input "k") (print-keymap))
	  ((equal user-input "l") (print-level *level*))
	  ((equal user-input "L") (set '*level* (change-level *level*)))
	  ((equal user-input "r")
	   (set '*board* (make-board))
	   (set '*the-game-is-over* 'nil)
	   (print-board *board*))
	  ((equal user-input "q") (set '*quit* t))
	  ((equal user-input "p") (print-board *board*))
	  ((equal user-input "") 'nil)
	  (t (format t "tic-tac-toe: Invalid choice.~%")))))

(defun tic-tac-toe ()
  "A command-line tic-tac-toe game."
  (print-board *board*)
  (loop while (not *quit*) do
       (mp-eval-user-input (mp-prompt-user)))
  (set '*quit* 'nil))

;;;; tic-tac-toe.lisp ends here.
