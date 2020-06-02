#!/bin/bash -x

# check if the script is being executed from the git repository
if [ "$0" != "./make.sh" ]; then
	echo "make.sh: script must be run only from the git repository: cd <dir>; ./make.sh" >&2
	exit 1
fi

JSFILE=$(echo "obase=15; $(date +%s)"|bc).js

# compile JSFILE and service-worker.js
if [ "$1" ==  "--dev" ]; then
	cp src/manifest.json src/service-worker.js docs/
	cp src/tic-tac-toe.js docs/${JSFILE}
	sed "s/@JSFILE@/${JSFILE}/g" < src/index.html > docs/index.html
else
	terser --compress --mangle --toplevel --verbose -o docs/${JSFILE} -- src/tic-tac-toe.js
	terser --compress --mangle --toplevel --verbose -o docs/service-worker.js -- src/service-worker.js
	html-minifier --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --remove-tag-whitespace --use-short-doctype --minify-css true --minify-js true src/index.html | sed "s/@JSFILE@/${JSFILE}/g" > docs/index.html
	node src/minify-json.js < src/manifest.json > docs/manifest.json
fi

# start the http server for testing
cd docs
http-server
