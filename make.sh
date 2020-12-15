#!/bin/bash -x

# check if the script is being executed from the git repository
if [ "$0" != "./make.sh" ]; then
	echo "make.sh: script must be run only from the git repository: cd <dir>; ./make.sh" >&2
	exit 1
fi

[ -e build ] || mkdir build
[ -e tmp ] || mkdir tmp

cp src/tic-tac-toe.js tmp/
# compile JSFILE and service-worker.js
if [ "$1" =  "--dev" ]; then
        npm run start
	cp src/manifest.json build/
	sed -e '/@JSFILECONTENT@/r tmp/tic-tac-toe.js' < src/index.html \
	    |sed -e 's/@JSFILECONTENT@//g' > build/index.html
else
    	terser --compress --mangle --toplevel --verbose -o tmp/tic-tac-toe.min.js -- tmp/tic-tac-toe.js
        npm run build
        sed -e '/@JSFILECONTENT@/r tmp/tic-tac-toe.min.js' src/index.html | sed -e 's/@JSFILECONTENT@//g' \
	    |html-minifier --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes \
			   --remove-script-type-attributes --remove-tag-whitespace --use-short-doctype --minify-css true --minify-js true > build/index.html
	node src/minify-json.js < src/manifest.json > build/manifest.json
fi

cp public/* build/

# start the http server for testing
cd build
http-server
