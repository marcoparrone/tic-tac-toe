#!/bin/bash -x

# check if the script is being executed from the git repository
if [ "$0" != "./make.sh" ]; then
	echo "make.sh: script must be run only from the git repository: cd <dir>; ./make.sh" >&2
	exit 1
fi

cp src/tic-tac-toe.js tmp/
# compile JSFILE and service-worker.js
if [ "$1" ==  "--dev" ]; then
        npm run start
	cp src/manifest.json docs/
	sed -e '/@JSFILECONTENT@/r tmp/tic-tac-toe.js' < src/index.html \
	    |sed -e 's/@JSFILECONTENT@//g' > docs/index.html
else
    	terser --compress --mangle --toplevel --verbose -o tmp/tic-tac-toe.min.js -- tmp/tic-tac-toe.js
        npm run build
        sed -e '/@JSFILECONTENT@/r tmp/homepage.min.js' src/index.html | sed -e 's/@JSFILECONTENT@//g' \
	    |html-minifier --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes \
			   --remove-script-type-attributes --remove-tag-whitespace --use-short-doctype --minify-css true --minify-js true > docs/index.html
	node src/minify-json.js < src/manifest.json > docs/manifest.json
fi

# start the http server for testing
cd docs
http-server
