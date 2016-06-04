SHELL=/bin/sh
# if windows, make sure 'make -v' returns 3.82 or higher
#  No? Download latest make.exe here (4.1 as of May 2016):
#  http://www.equation.com/servlet/equation.cmd?fa=make


BR:= browserify
BR_FLAGS:= --detect-globals=false -d -t [ babelify --presets [ es2015 react ] ]


SRC_CSS_DIR:= src/css
SRC_JS_DIR:= src/js
WORK_DIR:= work

SRC_SCSS:= $(SRC_CSS_DIR)/style.scss
SRC_JS:= $(SRC_JS_DIR)/*.js
LIB_JS:= lib/react.15.1.0.js \
	lib/react-dom-15.1.0.js \
	lib/babel.browser.min.js \
	lib/vec2.js

JS_TARGET:= $(WORK_DIR)/bundle.js
JS_TARGET_TEMP:= $(JS_TARGET).temp
JS_LIB_TARGET:= $(WORK_DIR)/bundle-lib.js

CSS_TARGET:= $(WORK_DIR)/bundle.css

# (c) 2016. All rights reserved.
# Makefile that installs and runs the project.

# Default; builds
all: prep bundleify bundleify_lib bundle_css

# Builds + runs server
serve: all
	python -m http.server 3000

.PHONY: clean all serve 

install:
	npm install --save-dev browserify babelify babel-preset-es2015 babel-preset-react gl-matrix

clean:
	rm -rf $(WORK_DIR)

prep: $(WORK_DIR)
$(WORK_DIR):
	mkdir -p $@

bundleify_lib: $(JS_LIB_TARGET)
$(JS_LIB_TARGET): $(LIB_JS)
	rm -f $@
	cat $(LIB_JS) >& $@

bundleify: $(JS_TARGET)
$(JS_TARGET): $(SRC_JS)
	rm -f $@
	$(BR) $(SRC_JS) -o $@ $(BR_FLAGS)

bundle_css: $(CSS_TARGET)
$(CSS_TARGET): $(SRC_SCSS)
	rm -f $@
	cat $(SRC_SCSS) >& $@
