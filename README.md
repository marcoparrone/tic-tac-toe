# tic-tac-toe

A tic tac toe game.

I am writing this for fun and for learning.

It's still a work in progress, the game is not really playable yet.

I am using Common Lisp for implementing the game logic, the textual
interactive user interface, and the backend of the web application.

I am using HTML+SVG+JavaScript for the web front-end.

This is the development environment I'm using:

     * [Steel Bank Common Lisp 1.3.11](http://www.sbcl.org)
     * [Quicklisp](http://www.quicklisp.org)
     * [Hunchentoot](http://weitz.de/hunchentoot)
     * [CentOS 7](http://centos.org)
     * [Emacs](http://www.gnu.org/software/emacs)
     * [SLIME](http://common-lisp.net/project/slime)

## To start the command line game

(tic-tac-toe)

## To start the web server:
(tic-tac-toe-web-init)

## To open the web applicaiton in a browser:

(sb-ext:run-program "/usr/bin/xdg-open" '("http://127.0.0.1:4242/tic-tac-toe") :wait nil)

## Copyright, non-warranty and license information

Copyright (C)  2000,2002,2017  Marco Parrone

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use, copy,
modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
