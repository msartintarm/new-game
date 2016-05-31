SHELL=/bin/sh
# if windows, make sure 'make -v' returns 3.82 or higher
#  No? Download latest make.exe here (4.1 as of May 2016):
#  http://www.equation.com/servlet/equation.cmd?fa=make

SRC_JS:= src/TheCanvas.js \
	src/PolygonCanvas.js \
	src/index.js
LIB_JS:= lib/react.15.1.0.js \
	lib/react-dom-15.1.0.js \
	lib/babel.browser.min.js

WORK_DIR:= work

JS_TARGET:= $(WORK_DIR)/bundle.js
JS_LIB_TARGET:= $(WORK_DIR)/bundle-lib.js

# (c) 2016. All rights reserved.
# Makefile that installs and runs the project.

# Default; builds
all: bundleify_lib bundleify

# Builds + runs server
serve: all
	python -m http.server 3000

.PHONY: clean all server

clean:
	rm -rf $(WORK_DIR)

bundleify_lib: $(JS_LIB_TARGET)
$(JS_LIB_TARGET): $(LIB_JS)
	mkdir -p $(@D)
	rm -f $@
	cat $(LIB_JS) >& $@

bundleify: $(JS_TARGET)
$(JS_TARGET): $(SRC_JS)
	mkdir -p $(@D)
	rm -f $@
	cat $(SRC_JS) >& $@
