;;; tic-tac-toe.lisp  ---  A tic tac toe game.

;; Copyright (C)  2000,2002,2017  Marco Parrone

;; Filename: tic-tac-toe.lisp
;; Version: it's stil super alpha
;; Updated: 4th of March 2017
;; Keywords: tic, tac, toe, game
;; Author: Marco Parrone <marco.parrone@gmail.com>
;; Maintainer: Marco Parrone <marco.parrone@gmail.com>
;; Description: A tic tac toe game.
;; Language: Common Lisp
;; Compatibility: ANSI Common Lisp. Tested on SBCL 1.3.11.
;; Location: 

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

(defun make-board ()
  (list 'empty 'empty 'empty
	'empty 'empty 'empty
	'empty 'empty 'empty))

(defun print-board (board)
  (format t
	  "~{ ~a | ~a | ~a ~%---+---+---~% ~a | ~a | ~a~%---+---+---~% ~a | ~a | ~a~%~}" 
	  (map 'list #'(lambda (cell)
			 (cond ((eql cell 'empty) " ")
			       ((eql cell 'X) "X")
			       ((eql cell 'O) "O")))
	       board)))

(defun mp-prompt-user ()
  (format *query-io* "tic-tac-toe> ")
  (force-output *query-io*)
  (read-line *query-io*))

(defun print-help ()
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
  (format t " 7 | 8 | 9 ~%---+---+---~% 4 | 5 | 6~%---+---+---~% 1 | 2 | 3~%"))

(defun print-level (level)
  (format t "Difficulty level: ~a.~%" level))

(defun change-level (level)
  (format *query-io* "Insert level (0-10): ")
  (force-output *query-io*)
  (let ((newlevel (parse-integer (read-line *query-io*) :junk-allowed t)))
    (if (and (integerp newlevel) (<= 0 newlevel) (>= 10 newlevel))
	newlevel
	(progn
	  (format t "tic-tac-toe: Invalid level selected.~%")
	  level))))

(defun printed-to-internal (cell)
  (nth cell (list 0
	     6 7 8
	     3 4 5
	     0 1 2)))

(defun insert-in-board (int-user-input board)
  (let ((internal-user-input (printed-to-internal int-user-input)))
    (if (eql 'empty (nth internal-user-input board))
	(setf (nth internal-user-input board) 'X)
	(format t "tic-tac-toe: Invalid choice: cell is not empty.~%"))))

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
  (map 'list
       #'(lambda (positions)
	   (map 'list
		#'(lambda (position) 
		    (cons position (nth position board)))
		positions))
       3sets-map))

(defun all-sym (sym 3set)
  (every #'(lambda (3set)
	     (eql sym (cdr 3set)))
	 3set))

(defun someone-won (board)
  (let ((3sets (make-3sets board)))
    (cond ((some #'(lambda (3set) (all-sym 'X 3set)) 3sets) 'X)
	  ((some #'(lambda (3set) (all-sym 'O 3set)) 3sets) 'O))))

(defun two-good-one-missing (sym 3sets)
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
      (list)))

(defun pick-best-from-nice (nice-cells 3sets board &optional summary stop))

(defun pick-best-of-all-ever (top-list 3sets board &optional nice-cells)
  (let ((nice nice-cells))
    (if 3sets
	(let ((3set (car 3sets)))
	  (let ((1st (nth 0 3set))
		(2nd (nth 1 3set))
		(3rd (nth 2 3set)))
	    (format t "debug: pick-best-of-all-ever: ~a ~a ~a~%" 1st 2nd 3rd)
	    (if (and (eql (cdr 1st) 'empty)
		     (eql (cdr 2nd) 'empty)
		     (eql (cdr 3rd) 'empty))
		(progn 
		  (format t "debug: pick-best-of-all-ever: top-list: ~a~%" top-list)		  (if (find (car 1st) top-list :test #'equal)
			   (setq nice (cons (car 1st) nice)))
		       (if (find (car 2nd) top-list :test #'equal)
			   (setq nice (cons (car 2nd) nice)))
		       (if (find (car 3rd) top-list :test #'equal)
			   (setq nice (cons (car 3rd) nice)))))
	    (pick-best-of-all-ever top-list (cdr 3sets) board nice)))
	(progn
	  (format t "debug: pick-best-of-all-ever: finishing: ~a.~%" nice)
	  (if nice
	      (pick-best-from-nice nice 3sets board (list) 'stop)
	      top-list)))))

(defun pick-best-from-nice (nice-cells 3sets board &optional summary stop)
  (let ((loc-summary (if summary
			summary
			(list (cons 0 0) (cons 1 0) (cons 2 0) (cons 3 0)
			      (cons 4 0) (cons 5 0) (cons 6 0) (cons 7 0)
			      (cons 8 0)))))
    (format t "debug: pick-best-from-nice: ~a ~a~%" nice-cells loc-summary)
    (if nice-cells
	(progn
	  (setf (cdr (nth (car nice-cells) loc-summary))
		(+ 1 (cdr (nth (car nice-cells) loc-summary))))
	  (pick-best-from-nice (cdr nice-cells) 3sets board loc-summary stop))
	(let ((from-best-to-worse
	       (sort loc-summary #'> :key #'cdr)))
	  (let ((top-rate (cdr (car from-best-to-worse)))
		(top-list (list)))
	    (format t "debug: pick-best-from-nice: finishing: ~a~%"
		    from-best-to-worse)
	    (loop 
	       for picked in from-best-to-worse
	       do (if (eql top-rate (cdr picked))
		      (setq top-list (cons picked top-list))))
	    (format t "debug: pick-best-from-nice: finishing... really...: ~a ~a~%"
		    top-list stop)
	    (if stop
		(mapcar #'car top-list)
		(car (pick-best-of-all-ever (mapcar #'car top-list) (make-3sets board) board))))))))

(defun one-good-two-missing (sym 3sets board &optional nice-cells)
  (let ((nice nice-cells))
    (if 3sets
	(let ((3set (car 3sets)))
	  (let ((1st (nth 0 3set))
		(2nd (nth 1 3set))
		(3rd (nth 2 3set)))
	    (format t "debug: one-good-two-missing: ~a ~a ~a~%" 1st 2nd 3rd)
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
	  (format t "debug: one-good-two-missing: finishing.~%")
	  (if nice
	      (pick-best-from-nice nice 3sets board)
	      (list))))))

;; FIXME!: it's not very random...
(defun get-random-move (board)
  (format t "debug: get-random-move: going random~%")
  (let ((move
	 (loop
	    for i from 0 to 8
	    do (if (eql (nth i board) 'empty)
		   (return i)))))
    (if move move (list))))

;; FIXME!: the function is nice until now, but it will always lose to
;; a player doing the moves: 1-9-7-4. I need to add a function to use
;; this type of strategies and not to let the adversary to use them
;; successfully.
;;
(defun get-best-move (i-am board)
  (let ((i-am-not (if (eql i-am 'X) 'O 'X))
	(3sets (make-3sets board)))
    (or (two-good-one-missing i-am 3sets)
	(two-good-one-missing i-am-not 3sets)
	(one-good-two-missing i-am 3sets board)
	(one-good-two-missing i-am-not 3sets board)
	(get-random-move board))))

;; FIXME!: to implement
(defun get-move-at-level (i-am board)
  (list))

;; FIXME!: use get-move-at-level instead of get-best-move
(defun insert-in-board-cpu (sym board)
  (let ((move (get-best-move sym board)))
    (format t "debug: insert-in-board-cpu: ~a~%" move)
    (if move
	(setf (nth move board) sym))))

(defun board-is-full (board)
  (every  #'(lambda (cell) (not (eql cell 'empty))) board))

(defun end-game-if-needed (board)
  (let ((winner (someone-won board)))
    (cond (winner
	   (format t "tic-tac-toe: We have a winner: ~a~%" winner)
	   winner)
	  ((board-is-full board)
	   (format t "tic-tac-toe: game drawn.~%")
	   t)
	  (t (list)))))

(defvar *level* 5)
(defvar *board* (make-board))
(defvar *quit* (list))
(defvar *the-game-is-over* (list))

(defun mp-eval-user-input (user-input)
  (let ((int-user-input (parse-integer user-input :junk-allowed t)))
    (cond ((and (integerp int-user-input) (< 0 int-user-input) (> 10 int-user-input)) 
	   (if *the-game-is-over*
	       (format t "tic-tac-toe: Invalid choice: the game is over.~%")
	       (progn
		 (insert-in-board int-user-input *board*)
		 (if (end-game-if-needed *board*)
		     (set '*the-game-is-over* t)
		     (insert-in-board-cpu 'O *board*))
		 (print-board *board*)
		 (if (end-game-if-needed *board*)
		     (set '*the-game-is-over* t)))))
	  ((equal user-input "a") 
	   (if *the-game-is-over*
	       (format t "tic-tac-toe: Invalid choice: the game is over.~%")
	       (progn
		 (insert-in-board-cpu 'X *board*)
		 (if (end-game-if-needed *board*)
		     (set '*the-game-is-over* t)
		     (insert-in-board-cpu 'O *board*))
		 (print-board *board*)
		 (if (end-game-if-needed *board*)
		     (set '*the-game-is-over* t)))))
	  ((equal user-input "h") (print-help))
	  ((equal user-input "k") (print-keymap))
	  ((equal user-input "l") (print-level *level*))
	  ((equal user-input "L") (set '*level* (change-level *level*)))
	  ((equal user-input "r")
	   (set '*board* (make-board))
	   (set '*the-game-is-over* (list))
	   (print-board *board*))
	  ((equal user-input "q") (set '*quit* t))
	  ((equal user-input "p") (print-board *board*))
	  ((equal user-input "") (list))
	  (t (format t "tic-tac-toe: Invalid choice.~%")))))

(defun tic-tac-toe ()
  (print-board *board*)
  (loop while (not *quit*) do
       (mp-eval-user-input (mp-prompt-user)))
  (set '*quit* (list)))

;;;; tic-tac-toe.lisp ends here.
