SHELL=/bin/sh
# if windows, make sure 'make -v' returns 3.82 or higher
#  No? Download latest make.exe here (4.1 as of May 2016):
#  http://www.equation.com/servlet/equation.cmd?fa=make

PWD := $(shell pwd)

RM := rm -f
RM_DIR := $(RM) -d

# Quite a lot of Babel plugins are needed to get ES6 + React compilation
NPM_BABELIFY := babelify babel-preset-es2015 babel-preset-react babel-plugin-transform-class-properties
NPM_PACKAGES := browserify $(NPM_BABELIFY) gl-matrix exorcist
NPM_INSTALL := npm install --save-dev $(NPM_PACKAGES)

BR := browserify
EXORCIST := node_modules/exorcist/bin/exorcist.js

BABELIFY := babelify --presets [ es2015 react ] --plugins [ transform-class-properties ]
BR_FLAGS := --detect-globals=false -d -t [ $(BABELIFY) ]

SRC_CSS_DIR:= src/css
SRC_JS_DIR:= src/js
WORK_DIR:= work

SRC_SCSS:= $(SRC_CSS_DIR)/style.scss
SRC_JS:= $(SRC_JS_DIR)/*.js
LIB_JS:= lib/react.15.1.0.js \
	lib/react-dom-15.1.0.js \
	lib/babel.browser.min.js

JS_TARGET:= $(WORK_DIR)/bundle.js
JS_MAP:= $(JS_TARGET).map
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

clean:
	$(RM_DIR) $(WORK_DIR)

.PHONY: clean all serve 

install:
	$(NPM_INSTALL)

prep: $(WORK_DIR) # make sure build directories are present
$(WORK_DIR):
	mkdir -p $@

bundleify_lib: $(JS_LIB_TARGET)
$(JS_LIB_TARGET): $(LIB_JS)
	$(RM) $@
	cat $(LIB_JS) >& $@

bundleify: $(JS_TARGET)
$(JS_TARGET): $(SRC_JS)
	$(RM) $@
	$(BR) $(SRC_JS) $(BR_FLAGS) | $(EXORCIST) $(JS_MAP) > $@ 

bundle_css: $(CSS_TARGET)
$(CSS_TARGET): $(SRC_SCSS)
	rm -f $@
	cat $(SRC_SCSS) >& $@
